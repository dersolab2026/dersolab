const fs = require('fs')
const path = require('path')

const moviesDataPath = path.join(__dirname, '../src/data/social/moviesPool.json')
const moviesJson = JSON.parse(fs.readFileSync(moviesDataPath, 'utf8'))
const movies = moviesJson.movies
const spotlightDir = path.join(__dirname, '../public/spotlight')

if (!fs.existsSync(spotlightDir)) {
  fs.mkdirSync(spotlightDir, { recursive: true })
}

function getSlug(name) {
  return name
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

const headers = {
  'User-Agent': 'DersoLabEduBot/1.0 (https://www.dersolab.com; info@dersolab.com)',
}

async function fetchSummary(lang, title) {
  try {
    const url =
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/` +
      encodeURIComponent(title.replace(/ /g, '_'))
    const res = await fetch(url, { headers })
    if (res.ok) {
      const data = await res.json()
      if (data.thumbnail?.source) return data.thumbnail.source
    }
  } catch (e) {}
  return null
}

async function searchWiki(lang, q) {
  try {
    const url =
      `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=` +
      encodeURIComponent(q) +
      '&limit=2&format=json'
    const r = await fetch(url, { headers }).then((res) => res.json())
    if (r[1] && r[1].length > 0) return r[1]
  } catch (e) {}
  return []
}

async function getPosterForMovie(m) {
  const orig = m.originalTitle.replace(/\s*\(\d{4}\)$/, '').trim()
  const trTitle = m.title.trim()

  // 1. Doğrudan sayfa başlıkları
  const directQueries = [
    { lang: 'en', q: orig },
    { lang: 'en', q: `${orig} (film)` },
    { lang: 'en', q: `${orig} (${m.year} film)` },
    { lang: 'tr', q: trTitle },
    { lang: 'tr', q: `${trTitle} (film)` },
    { lang: 'tr', q: `${trTitle} (film, ${m.year})` },
    { lang: 'tr', q: orig },
    { lang: 'tr', q: `${orig} (film)` },
  ]

  for (const cand of directQueries) {
    const src = await fetchSummary(cand.lang, cand.q)
    if (src) return { source: `${cand.lang}:${cand.q}`, url: src }
  }

  // 2. Arama yaparak bulma
  const searchQueries = [
    { lang: 'en', q: `${orig} ${m.year} film` },
    { lang: 'en', q: `${orig} film` },
    { lang: 'tr', q: `${trTitle} ${m.year} film` },
    { lang: 'tr', q: `${trTitle} film` },
  ]

  for (const cand of searchQueries) {
    const pageTitles = await searchWiki(cand.lang, cand.q)
    for (const pt of pageTitles) {
      const src = await fetchSummary(cand.lang, pt)
      if (src) return { source: `${cand.lang}:${pt}`, url: src }
    }
  }

  return null
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log(`Starting movie poster download for ${movies.length} movies...`)
  let existingCount = 0
  let downloadedCount = 0
  let notFoundCount = 0

  for (let i = 0; i < movies.length; i++) {
    const m = movies[i]
    const slug = getSlug(m.title)
    const targetFile = path.join(spotlightDir, `${slug}.jpg`)

    m.imageUrl = `/spotlight/${slug}.jpg`

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      existingCount++
      console.log(`[${i + 1}/${movies.length}] ✓ Mevcut: ${m.title} (${slug}.jpg)`)
      continue
    }

    try {
      const poster = await getPosterForMovie(m)
      if (poster && poster.url) {
        const imgRes = await fetch(poster.url, { headers })
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer())
          fs.writeFileSync(targetFile, buf)
          downloadedCount++
          console.log(
            `[${i + 1}/${movies.length}] ⬇ İndirildi: ${m.title} -> ${slug}.jpg (${(buf.length / 1024).toFixed(1)} KB)`
          )
        } else {
          notFoundCount++
          console.log(`[${i + 1}/${movies.length}] ✗ Görsel indirilemedi (${imgRes.status}): ${m.title}`)
        }
      } else {
        notFoundCount++
        console.log(`[${i + 1}/${movies.length}] ✗ Afiş bulunamadı: ${m.title} (${m.originalTitle})`)
      }
    } catch (err) {
      notFoundCount++
      console.log(`[${i + 1}/${movies.length}] ✗ Hata: ${m.title} - ${err.message}`)
    }

    await sleep(150)
  }

  // moviesPool.json dosyasını güncelle
  fs.writeFileSync(moviesDataPath, JSON.stringify(moviesJson, null, 2), 'utf8')

  console.log('\n--- SİNEMA ARŞİVİ AFİŞ ÖZETİ ---')
  console.log(`Toplam Film: ${movies.length}`)
  console.log(`Önceden Mevcut: ${existingCount}`)
  console.log(`Yeni İndirilen: ${downloadedCount}`)
  console.log(`Bulunamayan: ${notFoundCount}`)
  console.log(`Diskte Hazır Olan Film Afişi: ${existingCount + downloadedCount} / ${movies.length}`)
}

main()
