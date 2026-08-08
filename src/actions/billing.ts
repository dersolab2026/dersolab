'use server'

import { createClient } from '@/lib/supabase/server'

export interface BillingInfo {
  identityNumber: string | null
  phone: string | null
  address: string | null
  city: string | null
}

export async function getBillingInfo(): Promise<BillingInfo | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('identity_number, phone, address, city')
    .eq('id', user.id)
    .single()

  if (!data) return null
  return {
    identityNumber: data.identity_number,
    phone: data.phone,
    address: data.address,
    city: data.city,
  }
}

type ActionResult = { success: true } | { success: false; error: string }

interface SaveBillingInfoParams {
  identityNumber: string
  phone: string
  address: string
  city: string
}

export async function saveBillingInfo(info: SaveBillingInfoParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (!/^\d{11}$/.test(info.identityNumber)) {
    return { success: false, error: 'TC kimlik numarası 11 haneli olmalı' }
  }
  if (!info.phone.trim() || !info.address.trim() || !info.city.trim()) {
    return { success: false, error: 'Tüm alanları doldurmalısın' }
  }

  const { error } = await supabase
    .from('users')
    .update({
      identity_number: info.identityNumber,
      phone: info.phone,
      address: info.address,
      city: info.city,
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
