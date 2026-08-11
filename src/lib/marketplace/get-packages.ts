import { createClient } from '@/lib/supabase/server'

export type PackageType = 'lesson' | 'question'

export interface PackageItem {
  id: string
  title: string
  description: string | null
  creditAmount: number
  price: number
  shopierProductUrl: string | null
  packageType: PackageType
}

export interface AdminPackageItem extends PackageItem {
  isActive: boolean
  shopierProductId: string | null
}

export async function getActivePackages(): Promise<PackageItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('id, title, description, credit_amount, price, shopier_product_url, package_type')
    .eq('is_active', true)
    .order('credit_amount', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id, title: row.title, description: row.description,
    creditAmount: row.credit_amount, price: row.price, shopierProductUrl: row.shopier_product_url,
    packageType: row.package_type,
  }))
}

export async function getAllPackagesForAdmin(): Promise<AdminPackageItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('id, title, description, credit_amount, price, is_active, shopier_product_id, shopier_product_url, package_type')
    .order('credit_amount', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id, title: row.title, description: row.description,
    creditAmount: row.credit_amount, price: row.price, isActive: row.is_active,
    shopierProductId: row.shopier_product_id, shopierProductUrl: row.shopier_product_url,
    packageType: row.package_type,
  }))
}
