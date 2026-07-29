'use server'

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CreateCheckoutSessionParams {
  packageId: string
  studentId: string
}

type ActionResult = { success: true; checkoutUrl: string } | { success: false; error: string }

export async function createCheckoutSession({
  packageId,
  studentId,
}: CreateCheckoutSessionParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Bu işlem için giriş yapmalısın' }
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
      payment_provider: 'stripe',
      status: 'pending',
    })
    .select('id')
    .single()

  if (purchaseError || !purchase) {
    return { success: false, error: purchaseError?.message ?? 'Satın alma kaydı oluşturulamadı' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: { name: pkg.title },
            unit_amount: Math.round(pkg.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { purchase_id: purchase.id },
      success_url: `${appUrl}/dashboard/student/packages?success=1`,
      cancel_url: `${appUrl}/dashboard/student/packages?canceled=1`,
    })

    if (!session.url) throw new Error('Stripe checkout URL üretmedi')

    await supabase
      .from('package_purchases')
      .update({ payment_reference: session.id })
      .eq('id', purchase.id)

    return { success: true, checkoutUrl: session.url }
  } catch (err) {
    console.error('Stripe checkout session hatası:', err)
    await supabase.from('package_purchases').update({ status: 'failed' }).eq('id', purchase.id)
    return { success: false, error: 'Ödeme sayfası oluşturulamadı, tekrar dener misin?' }
  }
}
