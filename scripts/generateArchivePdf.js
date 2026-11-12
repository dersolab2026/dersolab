const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const booksData = require('../src/data/social/booksPool.json')
const moviesData = require('../src/data/social/moviesPool.json')
const figuresData = require('../src/data/social/figuresPool.json')

const FONT_REGULAR = 'C:/Windows/Fonts/arial.ttf'
const FONT_BOLD = 'C:/Windows/Fonts/arialbd.ttf'
const FONT_ITALIC = fs.existsSync('C:/Windows/Fonts/ariali.ttf')
  ? 'C:/Windows/Fonts/ariali.ttf'
  : FONT_REGULAR

const OUT_DIR = path.join(__dirname, '../public/downloads')
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}
const OUT_FILE = path.join(OUT_DIR, 'DersoLab_Arsiv_Katalogu_2026.pdf')

console.log('Generating DersoLab Archive PDF Catalog...')
console.log(`- Books: ${booksData.ortaokul.length + booksData.lise.length} (${booksData.ortaokul.length} Ortaokul, ${booksData.lise.length} Lise)`)
console.log(`- Movies: ${moviesData.movies.length}`)
console.log(`- Figures: ${figuresData.figures.length}`)

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 40, right: 40 },
  autoFirstPage: false,
  bufferPages: true,
})

const writeStream = fs.createWriteStream(OUT_FILE)
doc.pipe(writeStream)

doc.registerFont('Regular', FONT_REGULAR)
doc.registerFont('Bold', FONT_BOLD)
doc.registerFont('Italic', FONT_ITALIC)

const colors = {
  primary: '#0F172A', // Slate 900
  secondary: '#1E293B', // Slate 800
  brandBlue: '#2563EB', // Blue 600
  brandPurple: '#7C3AED', // Purple 600
  brandEmerald: '#059669', // Emerald 600
  brandAmber: '#D97706', // Amber 600
  brandRose: '#E11D48', // Rose 600
  textDark: '#0F172A',
  textMuted: '#475569',
  textLight: '#94A3B8',
  bgLight: '#F8FAFC',
  border: '#E2E8F0',
  white: '#FFFFFF',
}

function checkAddPage(doc, neededHeight = 80) {
  if (doc.y + neededHeight > 790) {
    doc.addPage()
    return true
  }
  return false
}

// ==========================================
// 1. COVER PAGE
// ==========================================
doc.addPage()

// Top dark hero banner
doc.rect(40, 40, 515, 170).fill(colors.primary)

doc.font('Bold').fontSize(11).fillColor('#60A5FA').text('DERSOLAB AKADEMİ & REHBERLİK ARŞİVİ', 60, 60)
doc.font('Bold').fontSize(24).fillColor(colors.white).text('KÜLTÜR, SANAT VE DÜŞÜNCE', 60, 78)
doc.font('Bold').fontSize(24).fillColor('#FBBF24').text('RESMİ ARŞİV KATALOĞU', 60, 106)

doc.font('Regular').fontSize(10).fillColor('#94A3B8').text(
  'LGS & YKS Hazırlık Sürecinde Zihinsel Dayanıklılık, Analitik Düşünme ve Entelektüel Derinlik Rehberi',
  60,
  140,
  { width: 475 }
)
doc.font('Regular').fontSize(9).fillColor('#CBD5E1').text(
  'Tarih: Kasım 2026  •  Versiyon: 2.0  •  Web: www.dersolab.com  •  E-posta: bildirim@dersolab.com',
  60,
  165
)

doc.y = 230

// 3 STATS CARDS
const cardW = 162
const cardH = 75
const gap = 14

// Card 1: Kitap
doc.rect(40, 230, cardW, cardH).fillAndStroke(colors.bgLight, colors.border)
doc.rect(40, 230, 4, cardH).fill(colors.brandEmerald)
doc.font('Bold').fontSize(20).fillColor(colors.brandEmerald).text('1.931', 54, 242)
doc.font('Bold').fontSize(10).fillColor(colors.textDark).text('Kitap Kulübü Eseri', 54, 268)
doc.font('Regular').fontSize(8).fillColor(colors.textMuted).text('932 Ortaokul + 999 Lise Edebi Eseri', 54, 282)

// Card 2: Film
doc.rect(40 + cardW + gap, 230, cardW, cardH).fillAndStroke(colors.bgLight, colors.border)
doc.rect(40 + cardW + gap, 230, 4, cardH).fill(colors.brandBlue)
doc.font('Bold').fontSize(20).fillColor(colors.brandBlue).text('100', 40 + cardW + gap + 14, 242)
doc.font('Bold').fontSize(10).fillColor(colors.textDark).text('Sinema Başyapıtı', 40 + cardW + gap + 14, 268)
doc.font('Regular').fontSize(8).fillColor(colors.textMuted).text('35 Ortaokul + 65 Lise Kült Filmi', 40 + cardW + gap + 14, 282)

// Card 3: Deha
doc.rect(40 + (cardW + gap) * 2, 230, cardW, cardH).fillAndStroke(colors.bgLight, colors.border)
doc.rect(40 + (cardW + gap) * 2, 230, 4, cardH).fill(colors.brandPurple)
doc.font('Bold').fontSize(20).fillColor(colors.brandPurple).text('100', 40 + (cardW + gap) * 2 + 14, 242)
doc.font('Bold').fontSize(10).fillColor(colors.textDark).text('Bilim İnsanı & Düşünür', 40 + (cardW + gap) * 2 + 14, 268)
doc.font('Regular').fontSize(8).fillColor(colors.textMuted).text('7 Disiplinde İlham Veren Dehalar', 40 + (cardW + gap) * 2 + 14, 282)

doc.y = 330

// Pedagogical Overview
doc.font('Bold').fontSize(13).fillColor(colors.primary).text('Katalog Hakkında ve Pedagojik Vizyon', 40, 330)
doc.rect(40, 348, 515, 1).fill(colors.border)

doc.font('Regular').fontSize(9.5).fillColor(colors.textDark).text(
  'DersoLab Arşiv Kataloğu; öğrencilerin sınav hazırlığını sadece mekanik bir soru çözme rutini olmaktan çıkarıp onları entelektüel, kültürel ve psikolojik yönden besleyen bütüncül bir rehberlik ekosistemidir.\n\n' +
  '• Haftanın Filmi Arşivi: Öğrencilerin empati yeteneğini, etik muhakemesini ve problem çözme vizyonunu güçlendiren, yaş gruplarına göre pedagojik olarak süzülmüş 100 başyapıtı içerir.\n' +
  '• Haftanın Motivasyonu Arşivi: Bilim, matematik, felsefe, edebiyat ve keşif tarihinde iz bırakan 100 dahi ismin hayat prensiplerini, çalışma disiplinini ve sınav psikolojisine yönelik altın tavsiyelerini sunar.\n' +
  '• Haftanın Kitabı Arşivi: MEB ve uluslararası edebiyat müfredatlarıyla uyumlu, anlama-yorumlama ve okuma hızını zirveye taşıyan 1.931 eseri öğrencilere adım adım rehberlik ederek sunar.',
  40,
  360,
  { width: 515, lineGap: 3 }
)

doc.y = 505

// Table of contents box
doc.rect(40, 505, 515, 260).fillAndStroke(colors.bgLight, colors.border)
doc.font('Bold').fontSize(12).fillColor(colors.brandBlue).text('İÇİNDEKİLER VE BÖLÜM PLANI', 60, 520)

const sections = [
  { no: 'BÖLÜM 1', title: 'DersoLab Sinema Kulübü Arşivi (100 Film)', desc: '35 Ortaokul / Aile Seçkisi + 65 Lise / Gençlik Başyapıtı (Yönetmen, IMDb, Pedagojik Değerlendirme, Replikler)' },
  { no: 'BÖLÜM 2', title: 'DersoLab Bilim Dehaları & Düşünürler Arşivi (100 İsim)', desc: 'Türk-İslam Öncüleri, Stoacılık & Felsefe, Klasik Bilim & Fizik, Modern Teknoloji, Edebiyat, Kâşifler' },
  { no: 'BÖLÜM 3', title: 'DersoLab Kitap Kulübü Arşivi (1.931 Eser)', desc: '932 Ortaokul / LGS + 999 Lise / YKS Edebi Eseri (Yazar, Eser Adı, Tür ve Tema Sınıflandırması)' },
]

let tocY = 548
for (const s of sections) {
  doc.font('Bold').fontSize(10).fillColor(colors.brandPurple).text(s.no, 60, tocY)
  doc.font('Bold').fontSize(10).fillColor(colors.textDark).text(s.title, 130, tocY)
  doc.font('Regular').fontSize(8.5).fillColor(colors.textMuted).text(s.desc, 130, tocY + 14, { width: 405 })
  tocY += 45
}

doc.font('Italic').fontSize(8.5).fillColor(colors.textMuted).text(
  'Not: Bu katalogda yer alan tüm içerikler MEB müfredatı ve yaş grubu hassasiyetleri gözetilerek kürate edilmiştir. Kara listeye alınan eser ve isimler havuzdan tamamen elenmiştir.',
  60,
  735,
  { width: 475 }
)

// ==========================================
// 2. SECTION 1: MOVIES (100 FILMS)
// ==========================================
doc.addPage()

// Section Header
function renderSectionHeader(title, subtitle, badgeText, badgeColor) {
  doc.rect(40, 40, 515, 60).fill(colors.primary)
  doc.font('Bold').fontSize(9).fillColor(badgeColor).text(badgeText.toUpperCase(), 55, 52)
  doc.font('Bold').fontSize(16).fillColor(colors.white).text(title, 55, 66)
  doc.font('Regular').fontSize(8.5).fillColor('#94A3B8').text(subtitle, 55, 87)
  doc.y = 115
}

renderSectionHeader(
  'DersoLab Sinema Kulübü: 100 Başyapıt',
  'Öğrencilerin ufuklarını genişleten, etik değerler ve bilimsel merak aşılayan seçkin sinema arşivi',
  'BÖLÜM 1: SİNEMA ARŞİVİ',
  '#60A5FA'
)

// List movies cleanly
const movies = moviesData.movies
for (let i = 0; i < movies.length; i++) {
  const m = movies[i]
  checkAddPage(doc, 75)

  const cardTop = doc.y
  const isOrtaokul = m.level === 'ortaokul'
  const accentColor = isOrtaokul ? colors.brandEmerald : colors.brandBlue

  // Card background
  doc.rect(40, cardTop, 515, 68).fillAndStroke('#FAFAFA', colors.border)
  doc.rect(40, cardTop, 4, 68).fill(accentColor)

  // Number & Title
  doc.font('Bold').fontSize(10.5).fillColor(colors.primary).text(
    `#${i + 1}. ${m.title}`,
    52,
    cardTop + 7,
    { continued: true }
  )
  doc.font('Regular').fontSize(9).fillColor(colors.textMuted).text(
    `  (${m.originalTitle.replace(/\s*\(\d{4}\)$/, '')}, ${m.year})`
  )

  // Details row
  doc.font('Bold').fontSize(8).fillColor(colors.brandAmber).text(`IMDb ${m.imdb}`, 52, cardTop + 22, { continued: true })
  doc.font('Regular').fontSize(8).fillColor(colors.textMuted).text(` • Yönetmen: ${m.director} • Tür: ${m.genre} • Seviye: ${isOrtaokul ? 'Ortaokul' : 'Lise'}`)

  // Explanation
  doc.font('Regular').fontSize(7.8).fillColor(colors.textDark).text(
    m.whyWatch,
    52,
    cardTop + 35,
    { width: 495, lineGap: 1.5, height: 18, ellipsis: true }
  )

  // Quote
  doc.font('Italic').fontSize(7.5).fillColor(colors.brandPurple).text(
    m.quote,
    52,
    cardTop + 53,
    { width: 495, height: 12, ellipsis: true }
  )

  doc.y = cardTop + 73
}

// ==========================================
// 3. SECTION 2: FIGURES (100 FIGURES)
// ==========================================
doc.addPage()

renderSectionHeader(
  'DersoLab İlham Veren Dehalar & Düşünürler: 100 İsim',
  'Bilim, felsefe, sanat ve teknolojide dünyayı değiştiren isimlerin çalışma disiplini ve rehberlik öğütleri',
  'BÖLÜM 2: DÜŞÜNÜRLER VE BİLİM İNSANLARI',
  '#C084FC'
)

const figures = figuresData.figures
for (let i = 0; i < figures.length; i++) {
  const f = figures[i]
  checkAddPage(doc, 75)

  const cardTop = doc.y

  // Card background
  doc.rect(40, cardTop, 515, 68).fillAndStroke('#FAFAFA', colors.border)
  doc.rect(40, cardTop, 4, 68).fill(colors.brandPurple)

  // Number, Name & Title
  doc.font('Bold').fontSize(10.5).fillColor(colors.primary).text(
    `#${i + 1}. ${f.name}`,
    52,
    cardTop + 7,
    { continued: true }
  )
  doc.font('Regular').fontSize(8.5).fillColor(colors.brandPurple).text(
    `  •  ${f.title} (${f.category})`
  )

  // Quote
  doc.font('Italic').fontSize(8).fillColor(colors.brandBlue).text(
    f.quote,
    52,
    cardTop + 22,
    { width: 495, height: 12, ellipsis: true }
  )

  // Explanation (Rehberlik mesajı)
  doc.font('Regular').fontSize(7.8).fillColor(colors.textDark).text(
    f.explanation,
    52,
    cardTop + 36,
    { width: 495, lineGap: 1.5, height: 18, ellipsis: true }
  )

  // Badges
  const badgeStr = f.badges ? f.badges.map(b => `[${b.text}]`).join('  ') : ''
  doc.font('Bold').fontSize(7).fillColor(colors.textMuted).text(
    `Odak Alanları: ${badgeStr}`,
    52,
    cardTop + 54,
    { width: 495, height: 10, ellipsis: true }
  )

  doc.y = cardTop + 73
}

// ==========================================
// 4. SECTION 3: BOOKS (1,931 BOOKS)
// ==========================================
doc.addPage()

renderSectionHeader(
  'DersoLab Kitap Kulübü: 1.931 Eserlik Büyük Kütüphane',
  'LGS ve YKS müfredatıyla uyumlu, okuma kültürü ve muhakeme gücünü geliştiren kapsamlı edebiyat koleksiyonu',
  'BÖLÜM 3: KİTAP KULÜBÜ ARŞİVİ',
  '#34D399'
)

// Part A: Ortaokul (932 Books)
doc.font('Bold').fontSize(13).fillColor(colors.brandEmerald).text(`Kısım 3.A: Ortaokul & LGS Kitaplığı (${booksData.ortaokul.length} Eser)`, 40, doc.y)
doc.rect(40, doc.y + 4, 515, 1).fill(colors.border)
doc.y += 12

doc.font('Regular').fontSize(8.5).fillColor(colors.textMuted).text(
  'Aşağıdaki listede ortaokul seviyesine uygun dünya klasikleri, Türk gençlik edebiyatı, bilim kurgu, macera ve tarih temalı eserler alfabetik düzende yer almaktadır.',
  40,
  doc.y,
  { width: 515 }
)
doc.y += 18

// 3-column dense table for Ortaokul
function renderBookColumns(booksList) {
  const colW = 168
  const colGap = 5
  let curCol = 0
  let colStartY = doc.y

  for (let i = 0; i < booksList.length; i++) {
    const b = booksList[i]

    if (doc.y > 785) {
      if (curCol < 2) {
        curCol++
        doc.y = colStartY
      } else {
        doc.addPage()
        curCol = 0
        colStartY = 45
        doc.y = colStartY
      }
    }

    const x = 40 + curCol * (colW + colGap)
    const y = doc.y

    doc.font('Bold').fontSize(7.5).fillColor(colors.textDark).text(
      `${i + 1}. ${b.title}`,
      x,
      y,
      { width: colW, height: 10, ellipsis: true }
    )
    doc.font('Regular').fontSize(6.8).fillColor(colors.textMuted).text(
      b.author || 'Anonim / Klasik',
      x + 8,
      y + 9,
      { width: colW - 8, height: 9, ellipsis: true }
    )

    doc.y = y + 20
  }
}

renderBookColumns(booksData.ortaokul)

// Part B: Lise (999 Books)
doc.addPage()
doc.font('Bold').fontSize(13).fillColor(colors.brandBlue).text(`Kısım 3.B: Lise & YKS Kitaplığı (${booksData.lise.length} Eser)`, 40, 45)
doc.rect(40, 62, 515, 1).fill(colors.border)
doc.y = 72

doc.font('Regular').fontSize(8.5).fillColor(colors.textMuted).text(
  'Aşağıdaki listede lise seviyesine uygun Türk edebiyatı dönemsel klasikleri, Batı ve Doğu klasikleri, felsefi romanlar ve denemeler yer almaktadır.',
  40,
  doc.y,
  { width: 515 }
)
doc.y += 18

renderBookColumns(booksData.lise)

// ==========================================
// 5. FOOTER & PAGE NUMBERING ON ALL PAGES
// ==========================================
const totalPages = doc.bufferedPageRange().count
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i)

  // Header on pages > 0
  if (i > 0) {
    doc.font('Regular').fontSize(7.5).fillColor(colors.textLight).text(
      'DersoLab 2026 • Resmi İçerik Arşivi Kataloğu',
      40,
      25
    )
    doc.font('Regular').fontSize(7.5).fillColor(colors.textLight).text(
      'www.dersolab.com',
      490,
      25,
      { align: 'right' }
    )
    doc.rect(40, 34, 515, 0.5).fill(colors.border)
  }

  // Footer on all pages
  doc.rect(40, 800, 515, 0.5).fill(colors.border)
  doc.font('Regular').fontSize(7.5).fillColor(colors.textLight).text(
    'DersoLab Eğitim Teknolojileri A.Ş.  •  Tüm hakları saklıdır  •  Gizli ve Özel',
    40,
    808
  )
  doc.font('Bold').fontSize(7.5).fillColor(colors.brandBlue).text(
    `Sayfa ${i + 1} / ${totalPages}`,
    470,
    808,
    { align: 'right', width: 85 }
  )
}

doc.end()

writeStream.on('finish', () => {
  const stats = fs.statSync(OUT_FILE)
  console.log(`\nPDF Generation Complete!`)
  console.log(`- File: ${OUT_FILE}`)
  console.log(`- Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (${stats.size} bytes)`)
  console.log(`- Pages: ${totalPages}`)
})
