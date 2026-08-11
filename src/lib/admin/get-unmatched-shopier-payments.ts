import { createClient } from '@/lib/supabase/server'

export interface UnmatchedShopierPayment {
  id: string
  shopierOrderId: string
  packageTitle: string | null
  buyerEmail: string | null
  buyerName: string | null
  amount: number | null
  note: string | null
  reason: string
  createdAt: string
}

const REASON_LABELS: Record<string, string> = {
  urun_eslesmedi: 'Ürün eşleşmedi',
  kullanici_bulunamadi: 'Bu e-postayla kayıtlı hesap yok',
  veli_coklu_cocuk: 'Veli — birden fazla öğrenci var',
  veli_cocuksuz: 'Veli — hiç öğrenci yok',
  gecersiz_rol: 'Hesap öğrenci/veli değil',
  kayit_hatasi: 'Kayıt hatası',
}

export function unmatchedReasonLabel(reason: string): string {
  return REASON_LABELS[reason] ?? reason
}

export async function getUnmatchedShopierPayments(): Promise<UnmatchedShopierPayment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shopier_unmatched_payments')
    .select('id, shopier_order_id, buyer_email, buyer_name, amount, note, reason, created_at, packages(title)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id,
    shopierOrderId: row.shopier_order_id,
    packageTitle: row.packages?.title ?? null,
    buyerEmail: row.buyer_email,
    buyerName: row.buyer_name,
    amount: row.amount,
    note: row.note,
    reason: row.reason,
    createdAt: row.created_at,
  }))
}

export interface StudentOption {
  id: string
  name: string
  email: string
}

export async function getStudentOptions(): Promise<StudentOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('role', 'student')
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}
