import { createClient } from '@/lib/supabase/server'

export interface YokAtlasProgramRow {
  id: string
  universiteAdi: string
  universiteTuru: string | null
  ilAdi: string | null
  fakulteAdi: string | null
  birimAdi: string
  ogrenimTuruAdi: string | null
  ogrenimDiliAdi: string | null
  puanTuru: string | null
  kontenjan: number | null
  ucret: number | null
  minPuan: number | null
  basariSirasi: number | null
}

export interface SearchYokAtlasParams {
  puanTuru: string
  basariSirasi: number
  ilAdi?: string
  universiteTuru?: 'DEVLET' | 'VAKIF'
  aramaMetni?: string
  sadeceGirebilecekleri?: boolean
}

export async function searchYokAtlasPrograms(params: SearchYokAtlasParams): Promise<YokAtlasProgramRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('yok_atlas_programs')
    .select('id, universite_adi, universite_turu, il_adi, fakulte_adi, birim_adi, ogrenim_turu_adi, ogrenim_dili_adi, puan_turu, kontenjan, ucret, min_puan, basari_sirasi')
    .eq('puan_turu', params.puanTuru)
    .not('basari_sirasi', 'is', null)

  if (params.ilAdi) query = query.eq('il_adi', params.ilAdi)
  if (params.universiteTuru) query = query.eq('universite_turu', params.universiteTuru)
  if (params.aramaMetni) query = query.or(`birim_adi.ilike.%${params.aramaMetni}%,universite_adi.ilike.%${params.aramaMetni}%`)

  if (params.sadeceGirebilecekleri) {
    // Girebileceği TÜM programlar arasından sıralamasına en yakın (en "boşa gitmeyen") olanları göster;
    // üst sınır koymuyoruz çünkü zaten sıralamaya en yakın 100 sonucu alıyoruz.
    query = query.gte('basari_sirasi', params.basariSirasi)
  } else {
    const margin = Math.max(params.basariSirasi * 0.3, 5000)
    query = query
      .gte('basari_sirasi', params.basariSirasi - margin)
      .lte('basari_sirasi', params.basariSirasi + margin)
  }

  query = query.order('basari_sirasi', { ascending: true }).limit(100)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((r) => ({
    id: r.id,
    universiteAdi: r.universite_adi,
    universiteTuru: r.universite_turu,
    ilAdi: r.il_adi,
    fakulteAdi: r.fakulte_adi,
    birimAdi: r.birim_adi,
    ogrenimTuruAdi: r.ogrenim_turu_adi,
    ogrenimDiliAdi: r.ogrenim_dili_adi,
    puanTuru: r.puan_turu,
    kontenjan: r.kontenjan,
    ucret: r.ucret,
    minPuan: r.min_puan,
    basariSirasi: r.basari_sirasi,
  }))
}

export async function getYokAtlasIlListesi(): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_yok_atlas_il_listesi')
  if (error) throw error
  const rows = (data ?? []) as { il_adi: string }[]
  return rows.map((r) => r.il_adi).sort((a, b) => a.localeCompare(b, 'tr'))
}
