import type { GenerateImageRequest, GenerateImageResponse, ImageStylePreset } from '@/types/social'

/**
 * DersoLab AI Visual & Image Generator Engine
 * 
 * Generates custom, high-impact SVG illustrations and visual compositions
 * for Instagram Carousels, Stories, Reels, and X (Twitter) Threads.
 */

const STYLE_PROMPTS: Record<ImageStylePreset, string> = {
  cyber_lab:
    'DersoLab futuristic cyber-laboratory style. Dark #080c14 background with glowing neon orange (#f97316), cyan (#06b6d4) and emerald (#10b981) highlights, glowing particles, holographic grid, 3D depth, sleek modern UI aesthetics.',
  scientific_diagram:
    'Precise technical scientific and mathematical blueprint diagram. Clean coordinate axes, labeled curves, vectors, geometric angles, optical rays or molecular bonds, glowing neon accents on dark blueprint background.',
  minimal_vector:
    'Modern flat editorial vector illustration. Bold geometric shapes, clean negative space, vibrant harmonious colors, minimalist high-impact graphic design.',
  realistic_study:
    'Cinematic modern study atmosphere. Aesthetic desk setup, open notebook with diagrams, stopwatch, warm ambient lighting with subtle orange neon desk lamp, hyper-focused exam preparation vibe.',
  mascot_fox:
    'Friendly, smart orange DersoLab mascot fox with science goggles in a high-tech modern educational laboratory, holding a glowing hologram tablet or pointing at a formula.',
}

// Procedural fallback SVG templates for instant, offline visual generation
function getProceduralSvg(
  prompt: string,
  style: ImageStylePreset,
  width: number,
  height: number,
  subject?: string
): string {
  const centerX = width / 2
  const centerY = height / 2

  const pLower = (prompt + ' ' + (subject || '')).toLowerCase()

  // 1. TYT / AYT Fizik & Optik
  if (pLower.includes('optik') || pLower.includes('fizik') || pLower.includes('ışık') || pLower.includes('kırılma')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGlow)"/>
  <!-- Holografik Grid Çizgileri -->
  <g stroke="rgba(56, 189, 248, 0.08)" stroke-width="1.5">
    <line x1="0" y1="${centerY - 150}" x2="${width}" y2="${centerY - 150}"/>
    <line x1="0" y1="${centerY}" x2="${width}" y2="${centerY}"/>
    <line x1="0" y1="${centerY + 150}" x2="${width}" y2="${centerY + 150}"/>
    <line x1="${centerX - 150}" y1="0" x2="${centerX - 150}" y2="${height}"/>
    <line x1="${centerX}" y1="0" x2="${centerX}" y2="${height}"/>
    <line x1="${centerX + 150}" y1="0" x2="${centerX + 150}" y2="${height}"/>
  </g>
  <!-- Prizma Üçgeni -->
  <polygon points="${centerX},${centerY - 140} ${centerX - 160},${centerY + 130} ${centerX + 160},${centerY + 130}" 
           fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="3" filter="url(#neonGlow)"/>
  <!-- Gelen Işık Işını -->
  <line x1="${centerX - 350}" y1="${centerY + 180}" x2="${centerX - 50}" y2="${centerY - 20}" 
        stroke="#ffffff" stroke-width="5" filter="url(#neonGlow)"/>
  <!-- Kırılan Renk Tayfı -->
  <line x1="${centerX - 50}" y1="${centerY - 20}" x2="${centerX + 350}" y2="${centerY - 100}" stroke="#ef4444" stroke-width="4" filter="url(#neonGlow)"/>
  <line x1="${centerX - 50}" y1="${centerY - 20}" x2="${centerX + 350}" y2="${centerY - 50}" stroke="#f97316" stroke-width="4" filter="url(#neonGlow)"/>
  <line x1="${centerX - 50}" y1="${centerY - 20}" x2="${centerX + 350}" y2="${centerY}" stroke="#eab308" stroke-width="4" filter="url(#neonGlow)"/>
  <line x1="${centerX - 50}" y1="${centerY - 20}" x2="${centerX + 350}" y2="${centerY + 50}" stroke="#10b981" stroke-width="4" filter="url(#neonGlow)"/>
  <line x1="${centerX - 50}" y1="${centerY - 20}" x2="${centerX + 350}" y2="${centerY + 100}" stroke="#06b6d4" stroke-width="4" filter="url(#neonGlow)"/>
  <!-- Rozet -->
  <rect x="${centerX - 120}" y="${height - 90}" width="240" height="42" rx="21" fill="rgba(14, 165, 233, 0.2)" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="${centerX}" y="${height - 63}" font-family="system-ui, sans-serif" font-weight="bold" font-size="15" fill="#38bdf8" text-anchor="middle">
    TYT FİZİK • OPTİK &amp; KIRILMA
  </text>
</svg>`
  }

  // 2. Matematik / Türev / Geometri
  if (pLower.includes('matematik') || pLower.includes('türev') || pLower.includes('geometri') || pLower.includes('fonksiyon')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="mathBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#mathBg)"/>
  <!-- Koordinat Ekseni -->
  <line x1="80" y1="${centerY + 60}" x2="${width - 80}" y2="${centerY + 60}" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <line x1="${centerX - 60}" y1="80" x2="${centerX - 60}" y2="${height - 80}" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <!-- Fonksiyon Eğrisi f(x) -->
  <path d="M 120 ${centerY + 180} Q ${centerX - 100} ${centerY - 220} ${centerX + 80} ${centerY + 60} T ${width - 120} ${centerY - 160}" 
        fill="none" stroke="url(#curveGrad)" stroke-width="6" stroke-linecap="round" filter="url(#glow)"/>
  <!-- Teğet Doğrusu (Türev) -->
  <line x1="${centerX - 180}" y1="${centerY + 160}" x2="${centerX + 180}" y2="${centerY - 80}" 
        stroke="#22c55e" stroke-width="3" stroke-dasharray="8,6" filter="url(#glow)"/>
  <!-- Değme Noktası -->
  <circle cx="${centerX}" cy="${centerY + 40}" r="9" fill="#f97316" stroke="#ffffff" stroke-width="3" filter="url(#glow)"/>
  <!-- Formül Etiketi -->
  <rect x="${centerX - 140}" y="${height - 90}" width="280" height="42" rx="21" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" stroke-width="1.5"/>
  <text x="${centerX}" y="${height - 63}" font-family="system-ui, sans-serif" font-weight="bold" font-size="15" fill="#f97316" text-anchor="middle">
    AYT MATEMATİK • f'(x) TEĞET EĞİMİ
  </text>
</svg>`
  }

  // 3. Türkçe / Bionic Reader / Paragraf Hızı
  if (pLower.includes('türkçe') || pLower.includes('paragraf') || pLower.includes('okuma') || pLower.includes('kitap') || pLower.includes('bionic')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="readBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#180e29"/>
      <stop offset="100%" stop-color="#0a0512"/>
    </radialGradient>
    <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <filter id="purpGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#readBg)"/>
  <!-- Hızlı Okuma Göz / Fokus Sembolü -->
  <circle cx="${centerX}" cy="${centerY - 40}" r="110" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" stroke-width="3" filter="url(#purpGlow)"/>
  <circle cx="${centerX}" cy="${centerY - 40}" r="65" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" stroke-width="2.5"/>
  <circle cx="${centerX}" cy="${centerY - 40}" r="26" fill="#ffffff" filter="url(#purpGlow)"/>
  <!-- Hız Çizgileri -->
  <line x1="${centerX - 180}" y1="${centerY - 40}" x2="${centerX - 130}" y2="${centerY - 40}" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/>
  <line x1="${centerX + 130}" y1="${centerY - 40}" x2="${centerX + 180}" y2="${centerY - 40}" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/>
  <line x1="${centerX - 160}" y1="${centerY - 80}" x2="${centerX - 120}" y2="${centerY - 70}" stroke="rgba(168,85,247,0.6)" stroke-width="3" stroke-linecap="round"/>
  <line x1="${centerX + 120}" y1="${centerY - 70}" x2="${centerX + 160}" y2="${centerY - 80}" stroke="rgba(168,85,247,0.6)" stroke-width="3" stroke-linecap="round"/>
  <!-- Biyonik Metin Çizgileri -->
  <g fill="rgba(255,255,255,0.7)" font-family="monospace" font-size="18" text-anchor="middle">
    <text x="${centerX}" y="${centerY + 110}">PARAGRAF • HIZ • ODAKLANMA</text>
    <text x="${centerX}" y="${centerY + 140}" fill="#f97316" font-size="14">+12 DAKİKA TASARRUF</text>
  </g>
  <!-- Rozet -->
  <rect x="${centerX - 140}" y="${height - 90}" width="280" height="42" rx="21" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" stroke-width="1.5"/>
  <text x="${centerX}" y="${height - 63}" font-family="system-ui, sans-serif" font-weight="bold" font-size="15" fill="#c084fc" text-anchor="middle">
    DERSOLAB • BIONIC READER
  </text>
</svg>`
  }

  // 4. Varsayılan / Maskot Zeki Tilki & DersoLab Laboratuvarı
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="defBg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="foxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#defBg)"/>
  <!-- Laboratuvar Işımaları -->
  <circle cx="${centerX}" cy="${centerY - 30}" r="140" fill="rgba(249, 115, 22, 0.12)" filter="url(#orangeGlow)"/>
  <!-- Stilize Tilki Kafası Geometrisi -->
  <polygon points="${centerX},${centerY - 120} ${centerX - 110},${centerY - 10} ${centerX},${centerY + 60} ${centerX + 110},${centerY - 10}" 
           fill="url(#foxGrad)" filter="url(#orangeGlow)"/>
  <!-- Sol Kulak -->
  <polygon points="${centerX - 110},${centerY - 10} ${centerX - 90},${centerY - 140} ${centerX - 30},${centerY - 60}" fill="#ea580c"/>
  <polygon points="${centerX - 95},${centerY - 25} ${centerX - 85},${centerY - 115} ${centerX - 45},${centerY - 60}" fill="#fed7aa"/>
  <!-- Sağ Kulak -->
  <polygon points="${centerX + 110},${centerY - 10} ${centerX + 90},${centerY - 140} ${centerX + 30},${centerY - 60}" fill="#ea580c"/>
  <polygon points="${centerX + 95},${centerY - 25} ${centerX + 85},${centerY - 115} ${centerX + 45},${centerY - 60}" fill="#fed7aa"/>
  <!-- Beyaz Yanaklar -->
  <polygon points="${centerX},${centerY + 60} ${centerX - 65},${centerY + 10} ${centerX},${centerY - 10}" fill="#ffffff"/>
  <polygon points="${centerX},${centerY + 60} ${centerX + 65},${centerY + 10} ${centerX},${centerY - 10}" fill="#ffffff"/>
  <!-- Burun -->
  <polygon points="${centerX - 15},${centerY + 45} ${centerX + 15},${centerY + 45} ${centerX},${centerY + 62}" fill="#0f172a"/>
  <!-- Gözler / Zeki Bakış -->
  <polygon points="${centerX - 45},${centerY - 15} ${centerX - 20},${centerY - 22} ${centerX - 28},${centerY - 8}" fill="#0f172a"/>
  <polygon points="${centerX + 45},${centerY - 15} ${centerX + 20},${centerY - 22} ${centerX + 28},${centerY - 8}" fill="#0f172a"/>
  <!-- Alt Rozet -->
  <rect x="${centerX - 140}" y="${height - 90}" width="280" height="42" rx="21" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" stroke-width="1.5"/>
  <text x="${centerX}" y="${height - 63}" font-family="system-ui, sans-serif" font-weight="bold" font-size="15" fill="#fb923c" text-anchor="middle">
    DERSOLAB • AI LAB ASİSTANI
  </text>
</svg>`
}

/**
 * Main AI Image Generation function
 */
export async function generateSocialImage(
  req: GenerateImageRequest
): Promise<GenerateImageResponse> {
  const { prompt, stylePreset = 'cyber_lab', aspectRatio = '1:1', subject } = req
  const apiKey = process.env.GEMINI_API_KEY

  let width = 1080
  let height = 1080
  if (aspectRatio === '9:16') {
    width = 1080
    height = 1920
  } else if (aspectRatio === '16:9') {
    width = 1200
    height = 675
  }

  // 1. Try Gemini 3.8 Flash to generate custom, intricate SVG
  if (apiKey) {
    try {
      const styleInstruction = STYLE_PROMPTS[stylePreset] || STYLE_PROMPTS.cyber_lab
      const systemInstruction = `You are DersoLab's world-class vector graphic artist and UI illustration generator.
Generate a breathtaking, standalone, modern SVG illustration for an educational social media post.
User Prompt / Topic: "${prompt}"
Related Subject: "${subject || 'YKS / LGS Sınav Hazırlığı'}"
Visual Style: ${styleInstruction}

Requirements:
- Output ONLY valid, standalone <svg ...> ... </svg> code.
- ViewBox must be "0 0 ${width} ${height}", width="${width}", height="${height}".
- Use beautiful gradients (<linearGradient>, <radialGradient>), neon glows (<filter id="glow"> with <feGaussianBlur>), and clean vector geometries.
- Include visual concepts matching the topic (e.g. geometric angles, optical prisms, wave formulas, neural paths, DNA spirals, or student desk elements).
- Do not include markdown code block ticks, no \`\`\`xml or \`\`\`svg, and no preamble text. Output must begin directly with <svg.`

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemInstruction }] }],
        }),
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        const data = await response.json()
        let svgCode = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

        // Strip any markdown code fences if present
        if (svgCode.startsWith('```')) {
          svgCode = svgCode.replace(/^```(svg|xml)?\n?/, '').replace(/\n?```$/, '').trim()
        }

        if (svgCode.includes('<svg') && svgCode.includes('</svg>')) {
          const startIdx = svgCode.indexOf('<svg')
          const endIdx = svgCode.lastIndexOf('</svg>') + 6
          const cleanSvg = svgCode.slice(startIdx, endIdx)

          const base64Svg = Buffer.from(cleanSvg, 'utf-8').toString('base64')
          const dataUrl = `data:image/svg+xml;base64,${base64Svg}`

          return {
            success: true,
            imageUrl: dataUrl,
            prompt,
            stylePreset,
            aspectRatio,
          }
        }
      }
    } catch (err) {
      console.warn('Gemini SVG generation error, falling back to procedural engine:', err)
    }
  }

  // 2. High-Fidelity Procedural Vector Engine fallback
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
