import { createAdminClient } from '@/lib/supabase/admin'

const YOK_ATLAS_SEARCH_URL = 'https://yokatlas.yok.gov.tr/api/tercih-kilavuz/search'

interface YokAtlasRecord {
  kilavuzKodu: number
  yil: number
  universiteId: number
  universiteAdi: string
  universiteTuru: string | null
  ilAdi: string | null
  ilceAdi: string | null
  fymkAdi: string | null
  birimAdi: string
  birimGrupAdi: string | null
  birimTuruAdi: string | null
  ogrenimTuruAdi: string | null
  ogrenimDiliAdi: string | null
  ogrenimSuresi: number | null
  puanTuru: string | null
  kontenjan: number | null
  ucret: number | null
  minPuan: number | null
  basariSirasi: number | null
  minPuan1: string | number | null
  basariSirasi1: number | null
  minPuan2: string | number | null
  basariSirasi2: number | null
  minPuan3: string | number | null
  basariSirasi3: number | null
}

interface YokAtlasSearchResponse {
  content: YokAtlasRecord[]
  totalElements: number
}

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const n = typeof value === 'string' ? parseFloat(value) : value
  return Number.isFinite(n) ? n : null
}

export interface SyncResult {
  fetched: number
  upserted: number
}

export async function syncYokAtlasPrograms(): Promise<SyncResult> {
  const response = await fetch(YOK_ATLAS_SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    throw new Error(`YÖK Atlas isteği başarısız: ${response.status}`)
  }

  const data = (await response.json()) as YokAtlasSearchResponse
  const admin = createAdminClient()

  const rows = data.content
    .filter((r) => r.birimTuruAdi === 'LISANS')
    .map((r) => ({
      kilavuz_kodu: r.kilavuzKodu,
      yil: r.yil,
      universite_id: r.universiteId,
      universite_adi: r.universiteAdi,
      universite_turu: r.universiteTuru,
      il_adi: r.ilAdi,
      ilce_adi: r.ilceAdi,
      fakulte_adi: r.fymkAdi,
      birim_adi: r.birimAdi,
      birim_grup_adi: r.birimGrupAdi,
      birim_turu_adi: r.birimTuruAdi,
      ogrenim_turu_adi: r.ogrenimTuruAdi,
      ogrenim_dili_adi: r.ogrenimDiliAdi,
      ogrenim_suresi: r.ogrenimSuresi,
      puan_turu: r.puanTuru,
      kontenjan: r.kontenjan,
      ucret: toNumber(r.ucret),
      min_puan: toNumber(r.minPuan),
      basari_sirasi: r.basariSirasi,
      min_puan_1: toNumber(r.minPuan1),
      basari_sirasi_1: r.basariSirasi1,
      min_puan_2: toNumber(r.minPuan2),
      basari_sirasi_2: r.basariSirasi2,
      min_puan_3: toNumber(r.minPuan3),
      basari_sirasi_3: r.basariSirasi3,
      synced_at: new Date().toISOString(),
    }))

  const chunkSize = 1000
  let upserted = 0
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const { error } = await admin.from('yok_atlas_programs').upsert(chunk, { onConflict: 'kilavuz_kodu' })
    if (error) throw new Error(error.message)
    upserted += chunk.length
  }

  return { fetched: data.content.length, upserted }
}
