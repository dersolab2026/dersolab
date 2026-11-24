import { NextRequest, NextResponse } from 'next/server'
import { verifyShopierWebhookSignature } from '@/lib/shopier/client'
import { createAdminClient } from '@/lib/supabase/admin'

interface ShopierOrderPayload {
  id: string
  currency?: string
  paymentStatus?: string
  note?: string
  shippingInfo?: { email?: string; firstName?: string; lastName?: string }
  lineItems?: { productId: string; quantity?: number }[]
  totals?: { total?: string; currency?: string }
}

async function queueUnmatched(
  admin: ReturnType<typeof createAdminClient>,
  order: ShopierOrderPayload,
  packageId: string | null,
  reason: string
) {
  const { error } = await admin.from('shopier_unmatched_payments').insert({
    shopier_order_id: order.id,
    shopier_product_id: order.lineItems?.[0]?.productId ?? null,
    package_id: packageId,
    buyer_email: order.shippingInfo?.email ?? null,
    buyer_name: [order.shippingInfo?.firstName, order.shippingInfo?.lastName].filter(Boolean).join(' ') || null,
    amount: order.totals?.total ?? null,
    note: order.note ?? null,
    reason,
  })
  if (error && error.code !== '23505') console.error('shopier_unmatched_payments insert hatası:', error)
}

export async function POST(request: NextRequest) {
  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const signature = request.headers.get('shopier-signature')
  if (!verifyShopierWebhookSignature(rawBody, signature)) {
    console.error('Shopier webhook: geçersiz imza')
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const event = request.headers.get('shopier-event')
  if (event !== 'order.created') {
    return NextResponse.json({ ok: true, ignored: event })
  }

  const order = payload as ShopierOrderPayload
  const orderId = typeof order?.id === 'string' ? order.id.trim() : ''
  if (!orderId) {
    return NextResponse.json({ error: 'missing order id' }, { status: 400 })
  }
  order.id = orderId

  // Fail-closed: yalnızca açıkça 'paid' olan siparişlere kredi tanımla
  if (order.paymentStatus !== 'paid') {
    return NextResponse.json({ ok: true, ignored: 'not paid' })
  }

  const admin = createAdminClient()

  const { data: existingPurchase } = await admin
    .from('package_purchases')
    .select('id')
    .eq('payment_provider', 'shopier')
    .eq('payment_reference', orderId)
    .maybeSingle()
  if (existingPurchase) return NextResponse.json({ ok: true, duplicate: true })

  const { data: existingUnmatched } = await admin
    .from('shopier_unmatched_payments')
    .select('id')
    .eq('shopier_order_id', orderId)
    .maybeSingle()
  if (existingUnmatched) return NextResponse.json({ ok: true, duplicate: true })

  const firstItem = order.lineItems?.[0]
  const productId = firstItem?.productId
  const { data: pkg } = productId
    ? await admin.from('packages').select('id, credit_amount, price').eq('shopier_product_id', productId).maybeSingle()
    : { data: null }

  if (!pkg) {
    await queueUnmatched(admin, order, null, 'urun_eslesmedi')
    return NextResponse.json({ ok: true, queued: true })
  }

  // Para birimi, miktar ve tutar doğrulaması
  const currency = (order.currency || order.totals?.currency || 'TRY').toUpperCase()
  const paidTotal = Number(order.totals?.total)
  const expectedPrice = Number(pkg.price)
  const itemQty = firstItem?.quantity ?? 1

  if (
    currency !== 'TRY' ||
    (order.lineItems && order.lineItems.length !== 1) ||
    itemQty !== 1 ||
    !Number.isFinite(paidTotal) ||
    Math.abs(paidTotal - expectedPrice) > 0.01
  ) {
    await queueUnmatched(admin, order, pkg.id, 'tutar_veya_adet_uyusmazligi')
    return NextResponse.json({ ok: true, queued: true })
  }

  const buyerEmail = order.shippingInfo?.email?.trim().toLowerCase()
  const { data: buyer } = buyerEmail
    ? await admin.from('users').select('id, role').ilike('email', buyerEmail).is('deleted_at', null).maybeSingle()
    : { data: null }

  if (!buyer) {
    await queueUnmatched(admin, order, pkg.id, 'kullanici_bulunamadi')
    return NextResponse.json({ ok: true, queued: true })
  }

  if (buyer.role === 'parent') {
    const { data: bekleyen } = await admin
      .from('package_purchases')
      .select('id')
      .eq('purchased_by', buyer.id)
      .eq('package_id', pkg.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!bekleyen) {
      await queueUnmatched(admin, order, pkg.id, 'veli_secim_yok')
      return NextResponse.json({ ok: true, queued: true })
    }

    const { data: updatedRow, error: updateError } = await admin
      .from('package_purchases')
      .update({
        status: 'completed',
        payment_reference: orderId,
        credits_granted: pkg.credit_amount,
        amount_paid: pkg.price,
      })
      .eq('id', bekleyen.id)
      .eq('status', 'pending')
      .select('id')
      .maybeSingle()

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true })
      }
      console.error('Shopier webhook: veli alimi tamamlanamadi:', updateError)
      await queueUnmatched(admin, order, pkg.id, 'kayit_hatasi')
    } else if (!updatedRow) {
      return NextResponse.json({ ok: true, duplicate: true })
    }

    return NextResponse.json({ ok: true, guardianPurchase: true })
  }

  if (buyer.role !== 'student') {
    await queueUnmatched(admin, order, pkg.id, 'gecersiz_rol')
    return NextResponse.json({ ok: true, queued: true })
  }

  const { error: insertError } = await admin.from('package_purchases').insert({
    package_id: pkg.id,
    student_id: buyer.id,
    purchased_by: buyer.id,
    credits_granted: pkg.credit_amount,
    amount_paid: pkg.price,
    payment_provider: 'shopier',
    payment_reference: orderId,
    status: 'completed',
  })

  if (insertError && insertError.code !== '23505') {
    console.error('Shopier webhook: package_purchases insert hatası:', insertError)
    await queueUnmatched(admin, order, pkg.id, 'kayit_hatasi')
  }

  return NextResponse.json({ ok: true })
}
