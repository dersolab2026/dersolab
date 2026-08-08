import { NextRequest, NextResponse } from 'next/server'
import Iyzipay from 'iyzipay'
import { createIyzicoClient, type CheckoutFormRetrieveResult } from '@/lib/iyzico/client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const formData = await request.formData()
  const token = formData.get('token') as string | null

  if (!token) {
    return NextResponse.redirect(`${appUrl}/dashboard/student/packages?canceled=1`)
  }

  const iyzipay = createIyzicoClient()

  const result = await new Promise<CheckoutFormRetrieveResult | null>((resolve) => {
    iyzipay.checkoutForm.retrieve({ locale: Iyzipay.LOCALE.TR, token }, (err: unknown, res: CheckoutFormRetrieveResult) => {
      if (err) {
        console.error('iyzico checkoutForm.retrieve hatası:', err)
        resolve(null)
        return
      }
      resolve(res)
    })
  })

  const purchaseId = result?.conversationId

  if (!result || !purchaseId) {
    return NextResponse.redirect(`${appUrl}/dashboard/student/packages?canceled=1`)
  }

  const admin = createAdminClient()

  if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
    const { error } = await admin
      .from('package_purchases')
      .update({ status: 'completed', payment_reference: result.paymentId ?? token })
      .eq('id', purchaseId)
      .eq('status', 'pending')

    if (error) console.error('package_purchases güncelleme hatası:', error)

    return NextResponse.redirect(`${appUrl}/dashboard/student/packages?success=1`)
  }

  await admin
    .from('package_purchases')
    .update({ status: 'failed' })
    .eq('id', purchaseId)
    .eq('status', 'pending')

  return NextResponse.redirect(`${appUrl}/dashboard/student/packages?canceled=1`)
}
