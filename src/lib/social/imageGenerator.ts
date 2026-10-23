import type { GenerateImageRequest, GenerateImageResponse, ImageStylePreset } from '@/types/social'
import fs from 'fs'
import path from 'path'

/**
 * DersoLab Resmi Marka & Maskot Görsel Arşivi
 * Not: Yalnızca DersoLab'ın sevimli resmi piksel tilkisi ve resmi logoları kullanılır.
 */
export const DERSOLAB_BRAND_ASSETS = {
  mascotFox: '/fox-mascot.png', // Tam boy sevimli DersoLab piksel maskotu
  mascotPixelFox: '/fox-mascot-520.png', // Yüksek çözünürlüklü şeffaf piksel sanat tilki
  mascotIconFox: '/fox-mascot-icon.png', // Kare şeffaf piksel tilki ikonu
  mascotHeadFox: '/fox-head.png', // Navbar tilki başlığı ikonu
  logoModern: '/dersolab-modern-logo.png', // Modern logo banner
  logoLab: '/dersolab-lab-logo.png', // Siber lab logosu
} as const

// Sunucu tarafında base64 piksel tilki önbelleği
let cachedFoxBase64: string | null = null
function getFoxMascotBase64(): string {
  if (cachedFoxBase64 !== null) return cachedFoxBase64
  try {
    const filePath = path.join(process.cwd(), 'public', 'fox-mascot-520.png')
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath)
      cachedFoxBase64 = `data:image/png;base64,${buffer.toString('base64')}`
      return cachedFoxBase64
    }
  } catch {
    // fallback
  }
  cachedFoxBase64 = ''
  return cachedFoxBase64
}

/**
 * DersoLab Orijinal Vektör Piksel Tilkisi (public/tasarim/tilki.svg'den derlenmiştir)
 * Harici dosya bağımlılığı olmadan her ortamda %100 net ve keskin piksel sanatı üretir.
 */
function renderDersoLabPixelFoxVector(x: number, y: number, scale = 12): string {
  return `<g transform="translate(${x}, ${y}) scale(${scale})" shape-rendering="crispEdges">
    <rect x="3" y="0" width="2" height="1" fill="#1F1F1F"/>
    <rect x="13" y="0" width="2" height="1" fill="#1F1F1F"/>
    <rect x="2" y="1" width="1" height="1" fill="#1F1F1F"/>
    <rect x="3" y="1" width="2" height="1" fill="#E56B0D"/>
    <rect x="5" y="1" width="1" height="1" fill="#1F1F1F"/>
    <rect x="12" y="1" width="1" height="1" fill="#1F1F1F"/>
    <rect x="13" y="2" width="2" height="1" fill="#E56B0D"/>
    <rect x="15" y="1" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="2" width="1" height="1" fill="#1F1F1F"/>
    <rect x="3" y="2" width="1" height="1" fill="#E56B0D"/>
    <rect x="4" y="2" width="1" height="1" fill="#EDECEC"/>
    <rect x="5" y="2" width="1" height="1" fill="#E56B0D"/>
    <rect x="6" y="2" width="1" height="1" fill="#1F1F1F"/>
    <rect x="11" y="2" width="1" height="1" fill="#1F1F1F"/>
    <rect x="12" y="2" width="1" height="1" fill="#E56B0D"/>
    <rect x="13" y="2" width="1" height="1" fill="#EDECEC"/>
    <rect x="14" y="2" width="1" height="1" fill="#E56B0D"/>
    <rect x="15" y="2" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="3" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="3" width="5" height="1" fill="#E56B0D"/>
    <rect x="7" y="3" width="1" height="1" fill="#1F1F1F"/>
    <rect x="10" y="3" width="1" height="1" fill="#1F1F1F"/>
    <rect x="11" y="3" width="5" height="1" fill="#E56B0D"/>
    <rect x="16" y="3" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="4" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="4" width="6" height="1" fill="#E56B0D"/>
    <rect x="8" y="4" width="2" height="1" fill="#1F1F1F"/>
    <rect x="10" y="4" width="6" height="1" fill="#E56B0D"/>
    <rect x="16" y="4" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="5" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="5" width="14" height="1" fill="#E56B0D"/>
    <rect x="16" y="5" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="6" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="6" width="14" height="1" fill="#E56B0D"/>
    <rect x="16" y="6" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="7" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="7" width="2" height="1" fill="#E56B0D"/>
    <rect x="4" y="7" width="1" height="1" fill="#EDECEC"/>
    <rect x="5" y="7" width="1" height="1" fill="#1F1F1F"/>
    <rect x="6" y="7" width="6" height="1" fill="#E56B0D"/>
    <rect x="12" y="7" width="1" height="1" fill="#EDECEC"/>
    <rect x="13" y="7" width="1" height="1" fill="#1F1F1F"/>
    <rect x="14" y="7" width="2" height="1" fill="#E56B0D"/>
    <rect x="16" y="7" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="8" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="8" width="2" height="1" fill="#E56B0D"/>
    <rect x="4" y="8" width="2" height="1" fill="#1F1F1F"/>
    <rect x="6" y="8" width="6" height="1" fill="#E56B0D"/>
    <rect x="12" y="8" width="2" height="1" fill="#1F1F1F"/>
    <rect x="14" y="8" width="2" height="1" fill="#E56B0D"/>
    <rect x="16" y="8" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="9" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="9" width="14" height="1" fill="#E56B0D"/>
    <rect x="16" y="9" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="10" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="10" width="1" height="1" fill="#C7591B"/>
    <rect x="3" y="10" width="12" height="1" fill="#E56B0D"/>
    <rect x="15" y="10" width="1" height="1" fill="#C7591B"/>
    <rect x="16" y="10" width="1" height="1" fill="#1F1F1F"/>
    <rect x="1" y="11" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="11" width="5" height="1" fill="#EDECEC"/>
    <rect x="7" y="11" width="4" height="1" fill="#E56B0D"/>
    <rect x="11" y="11" width="5" height="1" fill="#EDECEC"/>
    <rect x="16" y="11" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="12" width="1" height="1" fill="#1F1F1F"/>
    <rect x="3" y="12" width="5" height="1" fill="#EDECEC"/>
    <rect x="8" y="12" width="2" height="1" fill="#1F1F1F"/>
    <rect x="10" y="12" width="5" height="1" fill="#EDECEC"/>
    <rect x="15" y="12" width="1" height="1" fill="#1F1F1F"/>
    <rect x="2" y="13" width="1" height="1" fill="#1F1F1F"/>
    <rect x="3" y="13" width="12" height="1" fill="#EDECEC"/>
    <rect x="15" y="13" width="1" height="1" fill="#1F1F1F"/>
    <rect x="3" y="14" width="1" height="1" fill="#1F1F1F"/>
    <rect x="4" y="14" width="10" height="1" fill="#EDECEC"/>
    <rect x="14" y="14" width="1" height="1" fill="#1F1F1F"/>
    <rect x="5" y="15" width="8" height="1" fill="#1F1F1F"/>
  </g>`
}

/**
 * 1A. Bilimsel Şema: Turlama & Zaman Akış Diyagramı (Blueprint Stili)
 */
function getScientificBlueprintTurlamaSvg(width: number, height: number, headline = 'TURLAMA TAKTİĞİ'): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="bpBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#03254c"/>
      <stop offset="60%" stop-color="#02152d"/>
      <stop offset="100%" stop-color="#010c1c"/>
    </radialGradient>
    <filter id="bpGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bpBg)"/>

  <!-- Blueprint Teknik Izgara -->
  <g stroke="rgba(56, 189, 248, 0.15)" stroke-width="1.2">
    ${Array.from({ length: 9 }).map((_, i) => `<line x1="0" y1="${i * (height / 8)}" x2="${width}" y2="${i * (height / 8)}"/>`).join('')}
    ${Array.from({ length: 7 }).map((_, i) => `<line x1="${i * (width / 6)}" y1="0" x2="${i * (width / 6)}" y2="${height}"/>`).join('')}
  </g>

  <!-- Üst Başlık -->
  <rect x="${cx - 240}" y="${cy - 300}" width="480" height="42" rx="10" fill="rgba(14, 165, 233, 0.18)" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="${cx}" y="${cy - 273}" font-family="monospace, sans-serif" font-weight="900" font-size="14" fill="#38bdf8" text-anchor="middle" letter-spacing="1">
    📐 BİLİMSEL ŞEMA • TURLAMA KARAR AĞACI
  </text>

  <!-- Karar Ağacı / Diyagram Kutusı: Giriş -->
  <rect x="${cx - 150}" y="${cy - 210}" width="300" height="58" rx="12" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="2.5" filter="url(#bpGlow)"/>
  <text x="${cx}" y="${cy - 175}" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#ffffff" text-anchor="middle">
    SORUYLA İLK KARŞILAŞMA (0-30 sn)
  </text>

  <!-- Oklar -->
  <line x1="${cx}" y1="${cy - 152}" x2="${cx - 180}" y2="${cy - 80}" stroke="#22c55e" stroke-width="3" stroke-dasharray="6 4" filter="url(#bpGlow)"/>
  <line x1="${cx}" y1="${cy - 152}" x2="${cx + 180}" y2="${cy - 80}" stroke="#f97316" stroke-width="3" stroke-dasharray="6 4" filter="url(#bpGlow)"/>

  <!-- Sol Kol: EVET (Hemen Çöz) -->
  <rect x="${cx - 320}" y="${cy - 80}" width="260" height="110" rx="16" fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" stroke-width="2.5" filter="url(#bpGlow)"/>
  <text x="${cx - 190}" y="${cy - 48}" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#4ade80" text-anchor="middle">
    ✅ ÇÖZÜM YOLU AÇIK
  </text>
  <text x="${cx - 190}" y="${cy - 24}" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#dcfce7" text-anchor="middle">
    30-60 saniyede bitir.
  </text>
  <text x="${cx - 190}" y="${cy}" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#22c55e" text-anchor="middle">
    🎯 +1 NET CEPTE!
  </text>

  <!-- Sağ Kol: HAYIR (Takılma, Geç) -->
  <rect x="${cx + 60}" y="${cy - 80}" width="260" height="110" rx="16" fill="rgba(249, 115, 22, 0.15)" stroke="#f97316" stroke-width="2.5" filter="url(#bpGlow)"/>
  <text x="${cx + 190}" y="${cy - 48}" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#fb923c" text-anchor="middle">
    ⚠️ 60 SN GEÇTİ, ÇIKMADI
  </text>
  <text x="${cx + 190}" y="${cy - 24}" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#ffedd5" text-anchor="middle">
    İnatlaşma! Yanına [•] koy.
  </text>
  <text x="${cx + 190}" y="${cy}" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#f97316" text-anchor="middle">
    🔄 2. TURDA AVLA!
  </text>

  <!-- Netice Metriği -->
  <rect x="${cx - 180}" y="${cy + 80}" width="360" height="60" rx="16" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="2" filter="url(#bpGlow)"/>
  <text x="${cx}" y="${cy + 116}" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#38bdf8" text-anchor="middle">
    ⚡ KAZANÇ: +15 NET &amp; +20 DK SÜRE
  </text>

  <!-- Alt Rozet -->
  <rect x="${cx - 190}" y="${height - (is916 ? 120 : 80)}" width="380" height="46" rx="23" fill="rgba(14, 165, 233, 0.15)" stroke="#38bdf8" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 91 : 51)}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#bae6fd" text-anchor="middle" letter-spacing="1">
    DERSOLAB • ${headline.toUpperCase().slice(0, 36)}
  </text>
</svg>`
}

/**
 * 1B. Cyber Lab: Turlama ve Sınav Telemetrisi (Neon Kokpit Stili)
 */
function getCyberLabTurlamaSvg(width: number, height: number, headline = 'TURLAMA TAKTİĞİ'): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="cyberTurlama" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#2e1065"/>
      <stop offset="45%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <filter id="cTimerGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#cyberTurlama)"/>

  <!-- Holografik Dairesel Zaman Halkası -->
  <circle cx="${cx}" cy="${cy}" r="170" fill="none" stroke="#f97316" stroke-width="2.5" stroke-dasharray="14 8" opacity="0.7" filter="url(#cTimerGlow)"/>
  <circle cx="${cx}" cy="${cy}" r="140" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="3" filter="url(#cTimerGlow)"/>
  
  <!-- İbre -->
  <line x1="${cx}" y1="${cy}" x2="${cx + 80}" y2="${cy - 75}" stroke="#ffffff" stroke-width="5" stroke-linecap="round" filter="url(#cTimerGlow)"/>
  <circle cx="${cx}" cy="${cy}" r="12" fill="#f97316" stroke="#ffffff" stroke-width="3"/>

  <!-- Dijital Sayaç -->
  <text x="${cx}" y="${cy - 35}" font-family="system-ui, monospace" font-weight="900" font-size="36" fill="#ffffff" text-anchor="middle" filter="url(#cTimerGlow)">
    01:00
  </text>
  <text x="${cx}" y="${cy + 40}" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#38bdf8" text-anchor="middle" letter-spacing="2">
    1 SORUYA MAX 1 DAKİKA
  </text>
  <text x="${cx}" y="${cy + 68}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#22c55e" text-anchor="middle">
    🎯 +15 NET ARTIŞI
  </text>

  <!-- Tur 1 Kartı -->
  <g transform="translate(${cx - 320}, ${cy - 230})">
    <rect width="210" height="74" rx="16" fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" stroke-width="2" filter="url(#cTimerGlow)"/>
    <text x="16" y="30" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#4ade80">⚡ 1. TUR: HIZLI AV</text>
    <text x="16" y="52" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#dcfce7">Çözebildiğin soruları al, geç!</text>
  </g>

  <!-- Tur 2 Kartı -->
  <g transform="translate(${cx + 110}, ${cy - 230})">
    <rect width="210" height="74" rx="16" fill="rgba(249, 115, 22, 0.15)" stroke="#f97316" stroke-width="2" filter="url(#cTimerGlow)"/>
    <text x="16" y="30" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#fb923c">🎯 2. TUR: DERİN ÇÖZÜM</text>
    <text x="16" y="52" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#ffedd5">İşaretli sorulara geri dön!</text>
  </g>

  <!-- Alt Rozet -->
  <rect x="${cx - 190}" y="${height - (is916 ? 120 : 80)}" width="380" height="46" rx="23" fill="rgba(249, 115, 22, 0.15)" stroke="#f97316" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 91 : 51)}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#fed7aa" text-anchor="middle" letter-spacing="1">
    DERSOLAB • ${headline.toUpperCase().slice(0, 36)}
  </text>
</svg>`
}

/**
 * 1C. Vektör Sanatı: Minimalist Düz Grafik Stili
 */
function getMinimalVectorTurlamaSvg(width: number, height: number, headline = 'TURLAMA TAKTİĞİ'): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="minVecBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#minVecBg)"/>

  <!-- Başlık Şeridi -->
  <rect x="${cx - 200}" y="${cy - 250}" width="400" height="44" rx="22" fill="#1e293b"/>
  <text x="${cx}" y="${cy - 222}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#38bdf8" text-anchor="middle" letter-spacing="1">
    🎨 VEKTÖR SANATI • 3 ADIMDA NET KATLA
  </text>

  <!-- 3 Adım Kartları (Minimal Düz Renk Blokları) -->
  <!-- Adım 1 -->
  <g transform="translate(${cx - 190}, ${cy - 160})">
    <rect width="380" height="74" rx="18" fill="#166534" stroke="#22c55e" stroke-width="2"/>
    <text x="30" y="32" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#4ade80">ADIM 1 • HIZLI AVLA</text>
    <text x="30" y="54" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#ffffff">İlk 30 saniyede çözülebilen soruları bitir.</text>
  </g>

  <!-- Adım 2 -->
  <g transform="translate(${cx - 190}, ${cy - 65})">
    <rect width="380" height="74" rx="18" fill="#9a3412" stroke="#f97316" stroke-width="2"/>
    <text x="30" y="32" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#fb923c">ADIM 2 • İŞARETLE VE GEÇ</text>
    <text x="30" y="54" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#ffffff">Bir soruyla inatlaşma, 60 saniyede geç.</text>
  </g>

  <!-- Adım 3 -->
  <g transform="translate(${cx - 190}, ${cy + 30})">
    <rect width="380" height="74" rx="18" fill="#581c87" stroke="#a855f7" stroke-width="2"/>
    <text x="30" y="32" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#c084fc">ADIM 3 • 2. TURDA CEBE KOY</text>
    <text x="30" y="54" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#ffffff">Artan vakitte işaretlediğin soruları avla.</text>
  </g>

  <!-- Net Skoru -->
  <rect x="${cx - 140}" y="${cy + 130}" width="280" height="42" rx="21" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" stroke-width="1.8"/>
  <text x="${cx}" y="${cy + 157}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#fb923c" text-anchor="middle">
    🔥 ORTALAMA +15 İLA +20 NET!
  </text>

  <!-- Alt Rozet -->
  <rect x="${cx - 190}" y="${height - (is916 ? 120 : 80)}" width="380" height="46" rx="23" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="${cx}" y="${height - (is916 ? 91 : 51)}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">
    DERSOLAB • ${headline.toUpperCase().slice(0, 36)}
  </text>
</svg>`
}

/**
 * 1D. Çalışma Masası / Odası: Gerçekçi Masa & Kronometre Stili
 */
function getRealisticStudyTurlamaSvg(width: number, height: number, headline = 'TURLAMA TAKTİĞİ'): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="deskLampGlow" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#451a03" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#1c1917" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </radialGradient>
    <filter id="deskGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#deskLampGlow)"/>

  <!-- Sıcak Masa Lambası Işık Konisi -->
  <polygon points="${cx - 60},0 ${cx + 60},0 ${cx + 320},${height - 100} ${cx - 320},${height - 100}" fill="rgba(251, 146, 60, 0.07)"/>

  <!-- Çalışma Masası Kitapçığı & Notu -->
  <rect x="${cx - 210}" y="${cy - 180}" width="420" height="260" rx="14" fill="#1c1917" stroke="#44403c" stroke-width="2.5" filter="url(#deskGlow)"/>
  
  <!-- Kitapçık Sayfa Çizgileri -->
  <line x1="${cx}" y1="${cy - 170}" x2="${cx}" y2="${cy + 70}" stroke="#44403c" stroke-width="2" stroke-dasharray="4 4"/>
  
  <!-- Sol Sayfa: Soru & Süre -->
  <text x="${cx - 190}" y="${cy - 135}" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#ea580c">📌 DENEME KİTAPÇIĞI</text>
  <text x="${cx - 190}" y="${cy - 105}" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#d6d3d1">Soru 1: Çözüldü (40 sn) ✅</text>
  <text x="${cx - 190}" y="${cy - 80}" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#d6d3d1">Soru 2: Çözüldü (50 sn) ✅</text>
  <text x="${cx - 190}" y="${cy - 55}" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#f97316">Soru 3: [•] 2. TURA (GEÇİLDİ!)</text>
  <text x="${cx - 190}" y="${cy - 30}" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#d6d3d1">Soru 4: Çözüldü (35 sn) ✅</text>

  <!-- Sağ Sayfa: Masa Kronometresi -->
  <circle cx="${cx + 105}" cy="${cy - 50}" r="65" fill="#0c0a09" stroke="#f97316" stroke-width="3" filter="url(#deskGlow)"/>
  <text x="${cx + 105}" y="${cy - 48}" font-family="system-ui, monospace" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">01:15</text>
  <text x="${cx + 105}" y="${cy - 25}" font-family="system-ui, sans-serif" font-weight="bold" font-size="10" fill="#f97316" text-anchor="middle">KRONOMETRE</text>

  <!-- Masa Not Kağıdı -->
  <rect x="${cx - 180}" y="${cy + 100}" width="360" height="50" rx="10" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  <text x="${cx}" y="${cy + 132}" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#854d0e" text-anchor="middle">
    💡 "Bir soruya inatlaşma, süreni ve netini ikiye katla!"
  </text>

  <!-- Alt Rozet -->
  <rect x="${cx - 190}" y="${height - (is916 ? 120 : 80)}" width="380" height="46" rx="23" fill="#292524" stroke="#ea580c" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 91 : 51)}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#fdba74" text-anchor="middle">
    DERSOLAB • ${headline.toUpperCase().slice(0, 36)}
  </text>
</svg>`
}

/**
 * 2. DersoLab Resmi Sevimli Maskot Stüdyosu (Zeki Tilki)
 */
function getOfficialMascotStudioSvg(
  width: number,
  height: number,
  headline = 'DERSOLAB AKILLI ASİSTAN'
): string {
  const cx = width / 2
  const cy = height / 2 - 30
  const is916 = height > width

  const base64Png = getFoxMascotBase64()

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="mascotHalo" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.3"/>
      <stop offset="40%" stop-color="#431407" stop-opacity="0.4"/>
      <stop offset="85%" stop-color="#07090e" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <filter id="mascotGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#mascotHalo)"/>

  <!-- Holografik Portallar -->
  <circle cx="${cx}" cy="${cy}" r="210" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="16 10" opacity="0.6" filter="url(#mascotGlow)"/>
  <circle cx="${cx}" cy="${cy}" r="175" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="8 8" opacity="0.8" filter="url(#mascotGlow)"/>
  <circle cx="${cx}" cy="${cy}" r="145" fill="rgba(249, 115, 22, 0.08)"/>

  <!-- Parçacıklar & İpuçları -->
  <circle cx="${cx - 160}" cy="${cy - 120}" r="5" fill="#38bdf8" filter="url(#mascotGlow)"/>
  <circle cx="${cx + 170}" cy="${cy - 80}" r="6" fill="#f97316" filter="url(#mascotGlow)"/>
  <circle cx="${cx - 140}" cy="${cy + 130}" r="4" fill="#22c55e" filter="url(#mascotGlow)"/>
  <circle cx="${cx + 150}" cy="${cy + 120}" r="5" fill="#fbbf24" filter="url(#mascotGlow)"/>

  <!-- Resmi DersoLab Piksel Tilkisi (Tam Boy veya Vektör) -->
  ${
    base64Png
      ? `<image href="${base64Png}" x="${cx - 150}" y="${cy - 160}" width="300" height="300" preserveAspectRatio="xMidYMid meet" filter="url(#mascotGlow)"/>`
      : renderDersoLabPixelFoxVector(cx - 108, cy - 100, 12)
  }

  <!-- Üst Rozet -->
  <rect x="${cx - 150}" y="${cy - 240}" width="300" height="42" rx="21" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" stroke-width="1.8" filter="url(#mascotGlow)"/>
  <text x="${cx}" y="${cy - 213}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#fb923c" text-anchor="middle" letter-spacing="1">
    🦊 ZEKİ TİLKİ • RESMİ MASKOT
  </text>

  <!-- Alt Başlık Kartı -->
  <rect x="${cx - 200}" y="${height - (is916 ? 130 : 90)}" width="400" height="50" rx="25" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 99 : 59)}" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#ffffff" text-anchor="middle">
    DERSOLAB • ${headline.toUpperCase().slice(0, 36)}
  </text>
</svg>`
}

/**
 * 3. TYT / AYT Fizik & Optik & Dalgalar
 */
function getOpticsAndPhysicsSvg(width: number, height: number): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="physBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <filter id="physGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#physBg)"/>
  <!-- Prizma Üçgeni -->
  <polygon points="${cx},${cy - 140} ${cx - 160},${cy + 130} ${cx + 160},${cy + 130}" 
           fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="3" filter="url(#physGlow)"/>
  <!-- Gelen Beyaz Işık Işını -->
  <line x1="${cx - 350}" y1="${cy + 180}" x2="${cx - 50}" y2="${cy - 20}" stroke="#ffffff" stroke-width="5" filter="url(#physGlow)"/>
  <!-- Kırılan Renk Tayfı -->
  <line x1="${cx - 50}" y1="${cy - 20}" x2="${cx + 350}" y2="${cy - 100}" stroke="#ef4444" stroke-width="4" filter="url(#physGlow)"/>
  <line x1="${cx - 50}" y1="${cy - 20}" x2="${cx + 350}" y2="${cy - 50}" stroke="#f97316" stroke-width="4" filter="url(#physGlow)"/>
  <line x1="${cx - 50}" y1="${cy - 20}" x2="${cx + 350}" y2="${cy}" stroke="#eab308" stroke-width="4" filter="url(#physGlow)"/>
  <line x1="${cx - 50}" y1="${cy - 20}" x2="${cx + 350}" y2="${cy + 50}" stroke="#10b981" stroke-width="4" filter="url(#physGlow)"/>
  <line x1="${cx - 50}" y1="${cy - 20}" x2="${cx + 350}" y2="${cy + 100}" stroke="#06b6d4" stroke-width="4" filter="url(#physGlow)"/>

  <rect x="${cx - 150}" y="${height - (is916 ? 120 : 80)}" width="300" height="42" rx="21" fill="rgba(14, 165, 233, 0.2)" stroke="#38bdf8" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 93 : 53)}" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#38bdf8" text-anchor="middle">
    TYT FİZİK • OPTİK &amp; KIRILMA
  </text>
</svg>`
}

/**
 * 4. Matematik & Türev & Geometri
 */
function getMathAndCalculusSvg(width: number, height: number): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="mBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
    <filter id="mGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#mBg)"/>
  <line x1="80" y1="${cy + 60}" x2="${width - 80}" y2="${cy + 60}" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <line x1="${cx - 60}" y1="80" x2="${cx - 60}" y2="${height - 80}" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <path d="M 120 ${cy + 180} Q ${cx - 100} ${cy - 220} ${cx + 80} ${cy + 60} T ${width - 120} ${cy - 160}" 
        fill="none" stroke="url(#mGrad)" stroke-width="6" stroke-linecap="round" filter="url(#mGlow)"/>
  <line x1="${cx - 180}" y1="${cy + 160}" x2="${cx + 180}" y2="${cy - 80}" stroke="#22c55e" stroke-width="3" stroke-dasharray="8,6" filter="url(#mGlow)"/>
  <circle cx="${cx}" cy="${cy + 40}" r="9" fill="#f97316" stroke="#ffffff" stroke-width="3" filter="url(#mGlow)"/>

  <rect x="${cx - 150}" y="${height - (is916 ? 120 : 80)}" width="300" height="42" rx="21" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 93 : 53)}" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#f97316" text-anchor="middle">
    AYT MATEMATİK • f'(x) TEĞET EĞİMİ
  </text>
</svg>`
}

/**
 * 5. Kimya & Organik Kimya
 */
function getChemistrySvg(width: number, height: number): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="chBg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#01120e"/>
    </radialGradient>
    <filter id="chGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#chBg)"/>
  <polygon points="${cx},${cy - 130} ${cx + 86},${cy - 80} ${cx + 86},${cy + 20} ${cx},${cy + 70} ${cx - 86},${cy + 20} ${cx - 86},${cy - 80}" 
           fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="4" filter="url(#chGlow)"/>
  <circle cx="${cx}" cy="${cy - 30}" r="50" fill="none" stroke="#34d399" stroke-width="3" stroke-dasharray="10 8" filter="url(#chGlow)"/>
  <circle cx="${cx}" cy="${cy - 130}" r="14" fill="#06b6d4" filter="url(#chGlow)"/>
  <circle cx="${cx + 86}" cy="${cy - 80}" r="14" fill="#10b981" filter="url(#chGlow)"/>
  <circle cx="${cx + 86}" cy="${cy + 20}" r="14" fill="#06b6d4" filter="url(#chGlow)"/>
  <circle cx="${cx}" cy="${cy + 70}" r="14" fill="#10b981" filter="url(#chGlow)"/>
  <circle cx="${cx - 86}" cy="${cy + 20}" r="14" fill="#06b6d4" filter="url(#chGlow)"/>
  <circle cx="${cx - 86}" cy="${cy - 80}" r="14" fill="#10b981" filter="url(#chGlow)"/>
  <line x1="${cx}" y1="${cy - 130}" x2="${cx}" y2="${cy - 190}" stroke="#38bdf8" stroke-width="4" filter="url(#chGlow)"/>
  <circle cx="${cx}" cy="${cy - 190}" r="16" fill="#f97316" filter="url(#chGlow)"/>
  <text x="${cx}" y="${cy - 184}" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">OH</text>

  <rect x="${cx - 150}" y="${height - (is916 ? 120 : 80)}" width="300" height="42" rx="21" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 93 : 53)}" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#34d399" text-anchor="middle">
    AYT KİMYA • ORGANİK ŞEMA &amp; BAĞLAR
  </text>
</svg>`
}

/**
 * 6. Genel Cyber Lab & Sınav Telemetrisi (Yedek & Cyber Lab Stili)
 */
function getCyberLabTelemetrySvg(
  width: number,
  height: number,
  headline = 'DERSOLAB SİBER LABORATUVARI'
): string {
  const cx = width / 2
  const cy = height / 2 - 20
  const is916 = height > width

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="cyberBg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#082f49"/>
      <stop offset="60%" stop-color="#0c1322"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <filter id="cLabGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#cyberBg)"/>
  
  <!-- Hologram Radar Halkaları -->
  <circle cx="${cx}" cy="${cy}" r="180" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4"/>
  <circle cx="${cx}" cy="${cy}" r="130" fill="rgba(14, 165, 233, 0.05)" stroke="#38bdf8" stroke-width="2.5" filter="url(#cLabGlow)"/>
  <circle cx="${cx}" cy="${cy}" r="75" fill="none" stroke="#f97316" stroke-width="3" filter="url(#cLabGlow)"/>

  <!-- Radar Tarama Çizgisi -->
  <line x1="${cx}" y1="${cy}" x2="${cx + 120}" y2="${cy - 50}" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" filter="url(#cLabGlow)"/>
  <circle cx="${cx + 120}" cy="${cy - 50}" r="6" fill="#ffffff" filter="url(#cLabGlow)"/>

  <!-- Telemetri Verileri -->
  <text x="${cx}" y="${cy - 5}" font-family="system-ui, monospace" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" filter="url(#cLabGlow)">
    %98.4
  </text>
  <text x="${cx}" y="${cy + 25}" font-family="system-ui, monospace" font-weight="bold" font-size="12" fill="#38bdf8" text-anchor="middle">
    ODAK &amp; VERİM SKORU
  </text>

  <rect x="${cx - 160}" y="${height - (is916 ? 120 : 80)}" width="320" height="42" rx="21" fill="rgba(14, 165, 233, 0.2)" stroke="#38bdf8" stroke-width="1.8"/>
  <text x="${cx}" y="${height - (is916 ? 93 : 53)}" font-family="system-ui, sans-serif" font-weight="bold" font-size="13" fill="#bae6fd" text-anchor="middle">
    DERSOLAB • ${headline.toUpperCase().slice(0, 32)}
  </text>
</svg>`
}

/**
 * Ana Prosedürel Görsel Üretim Motoru
 * Her stil ve her konu için özel, farklı ve sıfır hata ile çalışan SVG üretir.
 */
function getProceduralSvg(
  prompt: string,
  style: ImageStylePreset,
  width: number,
  height: number,
  subject?: string
): string {
  const pLower = (prompt + ' ' + (subject || '')).toLowerCase()

  // 1. Zeki Tilki Maskot Stili veya Maskot İsteği
  if (
    style === 'mascot_fox' ||
    /(?:maskot|tilki|fox|zeki|karakter|derso)/i.test(pLower)
  ) {
    return getOfficialMascotStudioSvg(width, height, prompt || subject || 'Zeki Tilki')
  }

  // 2. Turlama Taktiği, Deneme Çözümü, Zaman Yönetimi, Sınav Stratejisi
  if (
    /(?:turlama|takılma|deneme|zaman|süre|soru|net|strateji|sınav|hız|hedef)/i.test(pLower)
  ) {
    if (style === 'scientific_diagram') {
      return getScientificBlueprintTurlamaSvg(width, height, prompt || subject || 'Turlama Taktiği')
    }
    if (style === 'minimal_vector') {
      return getMinimalVectorTurlamaSvg(width, height, prompt || subject || 'Turlama Taktiği')
    }
    if (style === 'realistic_study') {
      return getRealisticStudyTurlamaSvg(width, height, prompt || subject || 'Turlama Taktiği')
    }
    return getCyberLabTurlamaSvg(width, height, prompt || subject || 'Turlama Taktiği')
  }

  // 3. Fizik / Optik
  if (/(?:optik|fizik|ışık|kırılma|mercek|dalga|kuvvet)/i.test(pLower)) {
    return getOpticsAndPhysicsSvg(width, height)
  }

  // 4. Matematik / Türev / Fonksiyon
  if (/(?:matematik|türev|integral|fonksiyon|geometri|parabol|trigonometri)/i.test(pLower)) {
    return getMathAndCalculusSvg(width, height)
  }

  // 5. Kimya
  if (/(?:kimya|organik|molekül|bağ|asit|baz|periyodik)/i.test(pLower)) {
    return getChemistrySvg(width, height)
  }

  // 6. Seçilen Stile Göre Özelleştirilmiş Çıktı
  if (style === 'scientific_diagram') {
    return getScientificBlueprintTurlamaSvg(width, height, prompt || subject || 'Bilimsel Şema')
  }
  if (style === 'minimal_vector') {
    return getMinimalVectorTurlamaSvg(width, height, prompt || subject || 'Vektör Sanatı')
  }
  if (style === 'realistic_study') {
    return getRealisticStudyTurlamaSvg(width, height, prompt || subject || 'Çalışma Masası')
  }

  return getCyberLabTelemetrySvg(width, height, prompt || subject || 'DersoLab Studio')
}

/**
 * Main AI Image Generation function
 */
export async function generateSocialImage(
  req: GenerateImageRequest
): Promise<GenerateImageResponse> {
  const { prompt, stylePreset = 'cyber_lab', aspectRatio = '1:1', subject } = req

  let width = 1080
  let height = 1080
  if (aspectRatio === '9:16') {
    width = 1080
    height = 1920
  } else if (aspectRatio === '16:9') {
    width = 1200
    height = 675
  }

  // 1. Zeki Tilki stili seçildiyse doğrudan DersoLab resmi piksel maskot stüdyosunu oluştur
  if (stylePreset === 'mascot_fox') {
    const mascotSvg = getOfficialMascotStudioSvg(width, height, prompt || subject || 'Zeki Tilki')
    const base64 = Buffer.from(mascotSvg, 'utf-8').toString('base64')
    return {
      success: true,
      imageUrl: `data:image/svg+xml;base64,${base64}`,
      prompt,
      stylePreset,
      aspectRatio,
    }
  }

  // 2. Yüksek Çözünürlüklü Vektör Motoru ile Konuya ve Stile Özel Görsel Üret
  const proceduralSvg = getProceduralSvg(prompt, stylePreset, width, height, subject)
  const base64 = Buffer.from(proceduralSvg, 'utf-8').toString('base64')
  const dataUrl = `data:image/svg+xml;base64,${base64}`

  return {
    success: true,
    imageUrl: dataUrl,
    prompt,
    stylePreset,
    aspectRatio,
  }
}
