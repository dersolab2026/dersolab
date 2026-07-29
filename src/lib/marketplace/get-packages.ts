import { createClient } from '@/lib/supabase/server'

export interface PackageItem {
  id: string
  title: string
  description: string | null
  creditAmount: number
  price: number
}

export interface AdminPackageItem extends PackageItem {
  isActive: boolean
}

export async function getActivePackages(): Promise<PackageItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('id, title, description, credit_amount, price')
    .eq('is_active', true)
    .order('credit_amount', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id, title: row.title, description: row.description,
    creditAmount: row.credit_amount, price: row.price,
  }))
}

export async function getAllPackagesForAdmin(): Promise<AdminPackageItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('id, title, description, credit_amount, price, is_active')
    .order('credit_amount', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id, title: row.title, description: row.description,
    creditAmount: row.credit_amount, price: row.price, isActive: row.is_active,
  }))
}
