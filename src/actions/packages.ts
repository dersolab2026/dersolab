'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { initializeCheckoutForm } from '@/lib/iyzico/client'

interface CreateCheckoutSessionParams {
  packageId: string
  studentId: string
}

type ActionResult =
  | { success: true; checkoutUrl: string }
  | { success: false; error: string; missingBillingInfo?: boolean }

function splitName(fullName: string): { name: string; surname: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { name: parts[0], surname: parts[0] }
  return { name: parts.slice(0, -1).join(' '), surname: parts[parts.length - 1] }
}

export async function createCheckoutSession({
  packageId,
  studentId,
}: CreateCheckoutSessionParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Bu işlem için giriş yapmalısın' }
  }

  const { data: buyer } = await supabase
    .from('users')
    .select('name, email, phone, identity_number, address, city, created_at')
    .eq('id', user.id)
    .single()

  if (!buyer?.identity_number || !buyer.phone || !buyer.address || !buyer.city) {
    return { success: false, error: 'Ödeme için önce fatura bilgilerini tamamlamalısın', missingBillingInfo: true }
  }

  const { data: pkg, error: pkgError } = await supabase
    .from('packages')
    .select('id, title, credit_amount, price, is_active')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg || !pkg.is_active) {
    return { success: false, error: 'Paket bulunamadı veya artık satışta değil' }
  }

  const { data: purchase, error: purchaseError } = await supabase
    .from('package_purchases')
    .insert({
      package_id: pkg.id,
      student_id: studentId,
      purchased_by: user.id,
      credits_granted: pkg.credit_amount,
      amount_paid: pkg.price,
      payment_provider: 'iyzico',
      status: 'pending',
    })
    .select('id')
    .single()

  if (purchaseError || !purchase) {
    return { success: false, error: purchaseError?.message ?? 'Satın alma kaydı oluşturulamadı' }
  }
  const purchaseId = purchase.id

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const { name, surname } = splitName(buyer.name)
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '85.34.78.112'
  const price = pkg.price.toFixed(2)
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const registrationDate = buyer.created_at
    ? new Date(buyer.created_at).toISOString().slice(0, 19).replace('T', ' ')
    : now

  const request = {
    locale: 'tr',
    conversationId: purchaseId,
    price,
    paidPrice: price,
    currency: 'TRY',
    basketId: purchaseId,
    paymentGroup: 'PRODUCT',
    callbackUrl: `${appUrl}/api/iyzico/callback`,
    enabledInstallments: [1],
    buyer: {
      id: user.id,
      name,
      surname,
      gsmNumber: buyer.phone,
      email: buyer.email,
      identityNumber: buyer.identity_number,
      lastLoginDate: now,
      registrationDate,
      registrationAddress: buyer.address,
      ip,
      city: buyer.city,
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: buyer.name,
      city: buyer.city,
      country: 'Turkey',
      address: buyer.address,
    },
    billingAddress: {
      contactName: buyer.name,
      city: buyer.city,
      country: 'Turkey',
      address: buyer.address,
    },
    basketItems: [
      {
        id: pkg.id,
        name: pkg.title,
        category1: 'Eğitim',
        itemType: 'VIRTUAL',
        price,
      },
    ],
  }

  try {
    const result = await initializeCheckoutForm(request)

    if (result.status !== 'success' || !result.paymentPageUrl) {
      console.error('iyzico checkout form hatası:', result)
      await supabase.from('package_purchases').update({ status: 'failed' }).eq('id', purchaseId)
      return { success: false, error: 'Ödeme sayfası oluşturulamadı, tekrar dener misin?' }
    }

    await supabase.from('package_purchases').update({ payment_reference: result.token }).eq('id', purchaseId)
    return { success: true, checkoutUrl: result.paymentPageUrl }
  } catch (err) {
    console.error('iyzico checkout form hatası:', err)
    await supabase.from('package_purchases').update({ status: 'failed' }).eq('id', purchaseId)
    return { success: false, error: 'Ödeme sistemi şu anda kullanılamıyor, daha sonra tekrar dener misin?' }
  }
}
