import { NextRequest, NextResponse } from 'next/server'
import { verifyShopierWebhookSignature } from '@/lib/shopier/client'
import { createAdminClient } from '@/lib/supabase/admin'

interface ShopierOrderPayload {
  id: string
  paymentStatus?: string
  note?: string
  shippingInfo?: { email?: string; firstName?: string; lastName?: string }
  lineItems?: { productId: string }[]
  totals?: { total?: string }
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
  // aynı sipariş için webhook tekrar gelirse unique(shopier_order_id) ihlali beklenir, yok say
  if (error && error.code !== '23505') console.error('shopier_unmatched_payments insert hatası:', error)
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const signature = request.headers.get('shopier-signature')
  if (!verifyShopierWebhookSignature(payload, signature)) {
    console.error('Shopier webhook: geçersiz imza')
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  const event = request.headers.get('shopier-event')
  if (event !== 'order.created') {
    return NextResponse.json({ ok: true, ignored: event })
  }

  const order = payload as ShopierOrderPayload
  if (order.paymentStatus && order.paymentStatus !== 'paid') {
    return NextResponse.json({ ok: true, ignored: 'not paid' })
  }

  const admin = createAdminClient()

  const { data: existingPurchase } = await admin
    .from('package_purchases')
    .select('id')
    .eq('payment_provider', 'shopier')
    .eq('payment_reference', order.id)
    .maybeSingle()
  if (existingPurchase) return NextResponse.json({ ok: true, duplicate: true })

  const { data: existingUnmatched } = await admin
    .from('shopier_unmatched_payments')
    .select('id')
    .eq('shopier_order_id', order.id)
    .maybeSingle()
  if (existingUnmatched) return NextResponse.json({ ok: true, duplicate: true })

  const productId = order.lineItems?.[0]?.productId
  const { data: pkg } = productId
    ? await admin.from('packages').select('id, credit_amount, price').eq('shopier_product_id', productId).maybeSingle()
    : { data: null }

  if (!pkg) {
    await queueUnmatched(admin, order, null, 'urun_eslesmedi')
    return NextResponse.json({ ok: true, queued: true })
  }

  const buyerEmail = order.shippingInfo?.email?.trim().toLowerCase()
  const { data: buyer } = buyerEmail
    ? await admin.from('users').select('id, role').ilike('email', buyerEmail).maybeSingle()
    : { data: null }

  if (!buyer) {
    await queueUnmatched(admin, order, pkg.id, 'kullanici_bulunamadi')
    return NextResponse.json({ ok: true, queued: true })
  }

  // Krediyi kimin hesabina yazacagiz? Ogrenci kendi aliyorsa kendisine.
  // Veli aliyorsa bagli oldugu ogrenciye — ama yalnizca TEK ogrencisi
  // varsa. Birden fazla cocugu olan veli icin hangisine yazilacagi
  // belirsiz oldugundan tahmin etmek yerine admin'e kuyruga birakiyoruz.
  let creditStudentId: string | null = null

  if (buyer.role === 'student') {
    creditStudentId = buyer.id
  } else if (buyer.role === 'parent') {
    const { data: links } = await admin
      .from('guardian_links').select('student_id').eq('guardian_id', buyer.id)

    if (!links || links.length === 0) {
      await queueUnmatched(admin, order, pkg.id, 'veliye_bagli_ogrenci_yok')
      return NextResponse.json({ ok: true, queued: true })
    }
    if (links.length > 1) {
      await queueUnmatched(admin, order, pkg.id, 'veli_coklu_ogrenci')
      return NextResponse.json({ ok: true, queued: true })
    }
    creditStudentId = links[0].student_id
  }

  if (!creditStudentId) {
    await queueUnmatched(admin, order, pkg.id, 'gecersiz_rol')
    return NextResponse.json({ ok: true, queued: true })
  }

  const { error: insertError } = await admin.from('package_purchases').insert({
    package_id: pkg.id,
    student_id: creditStudentId,
    purchased_by: buyer.id,
    credits_granted: pkg.credit_amount,
    amount_paid: pkg.price,
    payment_provider: 'shopier',
    payment_reference: order.id,
    status: 'completed',
  })

  if (insertError && insertError.code !== '23505') {
    console.error('Shopier webhook: package_purchases insert hatası:', insertError)
    await queueUnmatched(admin, order, pkg.id, 'kayit_hatasi')
  }

  return NextResponse.json({ ok: true })
}
