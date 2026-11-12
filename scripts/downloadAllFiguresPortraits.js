const fs = require('fs')
const path = require('path')

const figuresDataPath = path.join(__dirname, '../src/data/social/figuresPool.json')
const figuresJson = JSON.parse(fs.readFileSync(figuresDataPath, 'utf8'))
const figures = figuresJson.figures
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

function getSearchQuery(figure) {
  let q = figure.name.replace(/\(.*?\)/g, '').trim()

  // Özel aramalar için optimizasyon
  const specialMap = {
    'Platon (Eflatun)': 'Plato',
    'Arşimet (Archimedes)': 'Archimedes',
    'Öklid (Euclid)': 'Euclid',
    'Pisagor (Pythagoras)': 'Pythagoras',
    'Ferdinand Magellan (Macellan)': 'Ferdinand Magellan',
    'Gutenberg Matbaasının Çırağı: Peter Schöffer': 'Peter Schöffer',
    'Yunus Emre': 'Yunus Emre',
    'Mevlana Celaleddin Rumi': 'Rumi',
    'Hacı Bektaş-ı Veli': 'Haji Bektash Veli',
    'El-Cezeri': 'Al-Jazari',
    'El-Biruni': 'Al-Biruni',
    'Farabi': 'Al-Farabi',
    'İbn Heysem': 'Alhazen',
    'Ömer Hayyam': 'Omar Khayyam',
    'İbn Haldun': 'Ibn Khaldun',
    'Uluğ Bey': 'Ulugh Beg',
    'Gazi Yaşargil': 'Mahmut Gazi Yaşargil',
    'Wright Kardeşler': 'Wright brothers',
    'Vecihi Hürkuş': 'Vecihi Hürkuş',
    'Nuri Demirağ': 'Nuri Demirağ',
  }

  if (specialMap[figure.name]) {
    return specialMap[figure.name]
  }
  return q
}

const headers = {
  'User-Agent': 'DersoLabEduBot/1.0 (https://www.dersolab.com; info@dersolab.com)',
}

async function fetchThumbnailUrl(query) {
  // 1. Türkçe Wikipedia
  try {
    const trUrl =
      'https://tr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
      encodeURIComponent(query) +
      '&gsrlimit=1&prop=pageimages&pithumbsize=800&format=json'
    const res = await fetch(trUrl, { headers }).then((r) => r.json())
    if (res.query && res.query.pages) {
      const page = Object.values(res.query.pages)[0]
      if (page.thumbnail && page.thumbnail.source) return page.thumbnail.source
    }
  } catch (e) {}

  // 2. İngilizce Wikipedia
  try {
    const enUrl =
      'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
      encodeURIComponent(query) +
      '&gsrlimit=1&prop=pageimages&pithumbsize=800&format=json'
    const res = await fetch(enUrl, { headers }).then((r) => r.json())
    if (res.query && res.query.pages) {
      const page = Object.values(res.query.pages)[0]
      if (page.thumbnail && page.thumbnail.source) return page.thumbnail.source
    }
  } catch (e) {}

  return null
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log(`Starting portrait download for ${figures.length} figures...`)
  let downloadedCount = 0
  let existingCount = 0
  let notFoundCount = 0

  for (let i = 0; i < figures.length; i++) {
    const f = figures[i]
    const slug = getSlug(f.name)
    const targetFile = path.join(spotlightDir, `${slug}.jpg`)

    // Her figürün imageUrl özelliğini garantiye al
    f.imageUrl = `/spotlight/${slug}.jpg`

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      existingCount++
      console.log(`[${i + 1}/${figures.length}] ✓ Mevcut: ${f.name} (${slug}.jpg)`)
      continue
    }

    const query = getSearchQuery(f)
    try {
      const thumbUrl = await fetchThumbnailUrl(query)
      if (thumbUrl) {
        const imgRes = await fetch(thumbUrl, { headers })
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer())
          fs.writeFileSync(targetFile, buf)
          downloadedCount++
          console.log(
            `[${i + 1}/${figures.length}] ⬇ İndirildi: ${f.name} -> ${slug}.jpg (${(buf.length / 1024).toFixed(1)} KB)`
          )
        } else {
          notFoundCount++
          console.log(`[${i + 1}/${figures.length}] ✗ İndirilemedi (${imgRes.status}): ${f.name}`)
        }
      } else {
        notFoundCount++
        console.log(`[${i + 1}/${figures.length}] ✗ Görsel bulunamadı: ${f.name} (Arama: "${query}")`)
      }
    } catch (err) {
      notFoundCount++
      console.log(`[${i + 1}/${figures.length}] ✗ Hata: ${f.name} - ${err.message}`)
    }

    // Wikipedia'ya saygılı 150ms bekleme
    await sleep(150)
  }

  // figuresPool.json dosyasını güncelle
  fs.writeFileSync(figuresDataPath, JSON.stringify(figuresJson, null, 2), 'utf8')

  console.log('\n--- ÖZET ---')
  console.log(`Toplam Figür: ${figures.length}`)
  console.log(`Zaten Mevcut: ${existingCount}`)
  console.log(`Yeni İndirilen: ${downloadedCount}`)
  console.log(`Görsel Bulunamayan: ${notFoundCount}`)
  console.log(`Şu an diskte var olan toplam figür portresi: ${existingCount + downloadedCount} / ${figures.length}`)
}

main()
