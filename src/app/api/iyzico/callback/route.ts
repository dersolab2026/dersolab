import { NextRequest, NextResponse } from 'next/server'
import { retrieveCheckoutForm } from '@/lib/iyzico/client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const formData = await request.formData()
  const token = formData.get('token') as string | null

  // iyzico buraya POST ile geldigi icin, tarayicinin hedef sayfaya da
  // POST ile gitmeye calismamasi (Next.js'in server action protokolune
  // takilmasi) icin 303 See Other kullaniyoruz; bu, metodu GET'e cevirir.
  if (!token) {
    return NextResponse.redirect(`${appUrl}/dashboard/student/packages?canceled=1`, { status: 303 })
  }

  let result
  try {
    result = await retrieveCheckoutForm({ locale: 'tr', token })
  } catch (err) {
    console.error('iyzico checkoutForm retrieve hatası:', err)
    return NextResponse.redirect(`${appUrl}/dashboard/student/packages?canceled=1`, { status: 303 })
  }

  const purchaseId = result?.conversationId

  if (!result || !purchaseId) {
    console.error('iyzico checkoutForm retrieve: conversationId eksik', result)
    return NextResponse.redirect(`${appUrl}/dashboard/student/packages?canceled=1`, { status: 303 })
  }

  const admin = createAdminClient()

  if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
    const { error } = await admin
      .from('package_purchases')
      .update({ status: 'completed', payment_reference: result.paymentId ?? token })
      .eq('id', purchaseId)
      .eq('status', 'pending')

    if (error) console.error('package_purchases güncelleme hatası:', error)

    return NextResponse.redirect(`${appUrl}/dashboard/student/packages?success=1`, { status: 303 })
  }

  console.error('iyzico ödeme başarısız:', result)
  await admin
    .from('package_purchases')
    .update({ status: 'failed' })
    .eq('id', purchaseId)
    .eq('status', 'pending')

  return NextResponse.redirect(`${appUrl}/dashboard/student/packages?canceled=1`, { status: 303 })
}
