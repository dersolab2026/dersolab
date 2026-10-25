// Popüler klasik eserler için doğrulanmış yüksek çözünürlüklü gerçek kapak haritası
export const CURATED_COVER_MAP: Record<string, string> = {
  'kucuk prens': 'https://covers.openlibrary.org/b/id/12219639-L.jpg',
  'küçük prens': 'https://covers.openlibrary.org/b/id/12219639-L.jpg',
  'beyaz zambaklar ulkesinde': 'https://covers.openlibrary.org/b/id/10848805-L.jpg',
  'beyaz zambaklar ülkesinde': 'https://covers.openlibrary.org/b/id/10848805-L.jpg',
  'momo': 'https://covers.openlibrary.org/b/id/8574580-L.jpg',
  'simyaci': 'https://covers.openlibrary.org/b/id/7414780-L.jpg',
  'simyacı': 'https://covers.openlibrary.org/b/id/7414780-L.jpg',
  'seker portakali': 'https://covers.openlibrary.org/b/id/10413035-L.jpg',
  'şeker portakalı': 'https://covers.openlibrary.org/b/id/10413035-L.jpg',
  'satranc': 'https://covers.openlibrary.org/b/id/5548285-L.jpg',
  'satranç': 'https://covers.openlibrary.org/b/id/5548285-L.jpg',
  'sol ayagim': 'https://covers.openlibrary.org/b/id/10314710-L.jpg',
  'sol ayağım': 'https://covers.openlibrary.org/b/id/10314710-L.jpg',
  'donusum': 'https://covers.openlibrary.org/b/id/12820198-L.jpg',
  'dönüşüm': 'https://covers.openlibrary.org/b/id/12820198-L.jpg',
  'marti': 'https://covers.openlibrary.org/b/id/6522230-L.jpg',
  'martı': 'https://covers.openlibrary.org/b/id/6522230-L.jpg',
  'marti jonathan livingston': 'https://covers.openlibrary.org/b/id/6522230-L.jpg',
  'martı jonathan livingston': 'https://covers.openlibrary.org/b/id/6522230-L.jpg',
  'fahrenheit 451': 'https://covers.openlibrary.org/b/id/12993656-L.jpg',
  'pal sokagi cocuklari': 'https://covers.openlibrary.org/b/id/7819755-L.jpg',
  'pal sokağı çocukları': 'https://covers.openlibrary.org/b/id/7819755-L.jpg',
  'fareler ve insanlar': 'https://covers.openlibrary.org/b/id/14319003-L.jpg',
  'beyaz dis': 'https://covers.openlibrary.org/b/id/8236920-L.jpg',
  'beyaz diş': 'https://covers.openlibrary.org/b/id/8236920-L.jpg',
  'kurk mantolu madonna': 'https://covers.openlibrary.org/b/id/12762238-L.jpg',
  'kürk mantolu madonna': 'https://covers.openlibrary.org/b/id/12762238-L.jpg',
  'ucan sinif': 'https://covers.openlibrary.org/b/id/72344-L.jpg',
  'uçan sınıf': 'https://covers.openlibrary.org/b/id/72344-L.jpg',
  'insan ne ile yasar': 'https://covers.openlibrary.org/b/id/11725468-L.jpg',
  'insan ne ile yaşar': 'https://covers.openlibrary.org/b/id/11725468-L.jpg',
  'insan ne ile yaşar?': 'https://covers.openlibrary.org/b/id/11725468-L.jpg',
  'seksen gunde devrialem': 'https://covers.openlibrary.org/b/id/6976035-L.jpg',
  'seksen günde devriâlem': 'https://covers.openlibrary.org/b/id/6976035-L.jpg',
  'hayvan ciftligi': 'https://covers.openlibrary.org/b/id/11261770-L.jpg',
  'hayvan çiftliği': 'https://covers.openlibrary.org/b/id/11261770-L.jpg',
  'beyaz gemi': 'https://covers.openlibrary.org/b/id/6770435-L.jpg',
  'dokuzuncu hariciye kogusu': 'https://covers.openlibrary.org/b/id/10848805-L.jpg',
  'dokuzuncu hariciye koğuşu': 'https://covers.openlibrary.org/b/id/10848805-L.jpg',
  '1984': 'https://covers.openlibrary.org/b/id/12539702-L.jpg',
  'george orwell 1984': 'https://covers.openlibrary.org/b/id/12539702-L.jpg',
  'suc ve ceza': 'https://covers.openlibrary.org/b/id/12089454-L.jpg',
  'suç ve ceza': 'https://covers.openlibrary.org/b/id/12089454-L.jpg',
}

/**
 * Verilen kitap başlığı ve yazarı için doğrulanmış kapak haritasından veya
 * Open Library API üzerinden gerçek yayıncı kapak görseli URL'si döner.
 */
export async function fetchRealBookCover(title: string, author?: string): Promise<string | null> {
  if (!title) return null
  const normTitle = title.toLocaleLowerCase('tr-TR').replace(/['"]/g, '').trim()

  // 1. Önce doğrulanmış hızlı önbellek haritasına bak
  if (CURATED_COVER_MAP[normTitle]) {
    return CURATED_COVER_MAP[normTitle]
  }

  for (const [key, url] of Object.entries(CURATED_COVER_MAP)) {
    if (normTitle.includes(key) || key.includes(normTitle)) {
      return url
    }
  }

  // 2. Open Library Covers API üzerinden ara
  try {
    const query = author ? `${title} ${author}` : title
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=3`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DersoLab/1.0',
      },
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (res.ok) {
      const data = await res.json()
      const firstWithCover = (data.docs || []).find((d: any) => d.cover_i)
      if (firstWithCover && firstWithCover.cover_i) {
        return `https://covers.openlibrary.org/b/id/${firstWithCover.cover_i}-L.jpg`
      }
    }
  } catch {
    // Zaman aşımı veya ağ hatasında sessizce geç
  }

  return null
}
