import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'İmza eksik' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook imza doğrulama hatası:', err)
    return NextResponse.json({ error: 'Geçersiz imza' }, { status: 400 })
  }

  const admin = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const purchaseId = session.metadata?.purchase_id

    if (!purchaseId) {
      console.error('Webhook: purchase_id metadata eksik', session.id)
      return NextResponse.json({ received: true })
    }

    const { error } = await admin
      .from('package_purchases')
      .update({
        status: 'completed',
        payment_reference: (session.payment_intent as string) ?? session.id,
      })
      .eq('id', purchaseId)
      .eq('status', 'pending')

    if (error) {
      console.error('package_purchases güncelleme hatası:', error)
      return NextResponse.json({ error: 'DB güncellenemedi' }, { status: 500 })
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const purchaseId = session.metadata?.purchase_id

    if (purchaseId) {
      await admin
        .from('package_purchases')
        .update({ status: 'failed' })
        .eq('id', purchaseId)
        .eq('status', 'pending')
    }
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    const paymentIntentId = charge.payment_intent as string

    const { error } = await admin
      .from('package_purchases')
      .update({ status: 'refunded' })
      .eq('payment_reference', paymentIntentId)
      .eq('status', 'completed')

    if (error) console.error('Refund güncelleme hatası:', error)
  }

  return NextResponse.json({ received: true })
}