import { NextResponse } from 'next/server'

export const revalidate = 3600 // Cache for 1 hour

const FALLBACK_WORDS = [
  {
    madde: 'girift',
    koken: 'Farsça',
    anlam: 'Birbirinin içine girmiş, birbirine geçmiş, karmaşık, çapraşık.',
    ornek: 'Bazen en girift meseleler, en yalın bakışlarla çözülür.',
    yazar: 'Ahmet Hamdi Tanpınar',
    osymNot: 'TYT Türkçe paragraflarında "karmaşık / iç içe geçmiş" düşünceleri nitelemek için sıkça kullanılır.',
  },
  {
    madde: 'mütereddit',
    koken: 'Arapça',
    anlam: 'Tereddüt eden, kararsız, ikircikli davranan.',
    ornek: 'Peyami Safa’nın "Bir Tereddüdün Romanı" adlı eserinde kahramanlar sürekli bir ruh hali içindedir.',
    yazar: 'Peyami Safa',
    osymNot: 'Paragrafta karakter tahlillerinde "karar veremeyen, iki arada bir derede kalan" anlamında çıkar.',
  },
  {
    madde: 'ketum',
    koken: 'Arapça',
    anlam: 'Ağzı sıkı, sır saklamasını bilen, her şeyi herkese anlatmayan.',
    ornek: 'O, fırtınalı iç dünyasını kimseye açmayacak kadar ketum bir insandı.',
    yazar: 'Reşat Nuri Güntekin',
    osymNot: 'Altı çizili söz öbeklerinde ve paragraf sorularında sık sorulan bir mizaç özelliğidir.',
  },
  {
    madde: 'müstesna',
    koken: 'Arapça',
    anlam: 'Bir kuralın, bir genellemenin dışında kalan; kural dışı, benzerlerinden üstün.',
    ornek: 'O, dönemin yazarları arasında müstesna bir yere sahipti.',
    yazar: 'Halit Ziya Uşaklıgil',
    osymNot: '"İstisna" kelimesiyle aynı kökten gelir. Paragrafta "ayrıcalıklı, benzersiz" anlamında kullanılır.',
  },
  {
    madde: 'muğlak',
    koken: 'Arapça',
    anlam: 'Anlaşılması güç olan, açık ve net olmayan, kapalı, belirsiz.',
    ornek: 'Yazarın üslubu öylesine muğlaktı ki cümlenin nereye varacağını kestirmek zordu.',
    yazar: 'Nurullah Ataç',
    osymNot: '"Açıklık" anlatım ilkesinin zıddıdır. Anlatım özellikleri sorularında sıkça şıklarda yer alır.',
  },
  {
    madde: 'tahayyül',
    koken: 'Arapça',
    anlam: 'Hayalde canlandırma, göz önüne getirme, imgeleme.',
    ornek: 'Geleceği tahayyül edemeyen bir toplum, bugünü de hakkıyla inşa edemez.',
    yazar: 'Cemil Meriç',
    osymNot: 'Paragrafta "tasavvur etmek, imgelemek, zihinde canlandırmak" ile eşanlamlı kullanılır.',
  },
]

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const res = await fetch('https://sozluk.gov.tr/icerik', {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DersoLab/1.0)',
      },
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({
        success: true,
        source: 'tdk_live',
        data,
        fallbackWords: FALLBACK_WORDS,
      })
    }
  } catch (error) {
    // Graceful fallback to offline/cached words
  }

  // Return curated fallback if TDK is slow or unreachable
  return NextResponse.json({
    success: true,
    source: 'dersolab_curated',
    fallbackWords: FALLBACK_WORDS,
    data: {
      kelime: [{ madde: FALLBACK_WORDS[0].madde, anlam: FALLBACK_WORDS[0].anlam }],
      atasoz: [
        {
          madde: 'Damlaya damlaya göl olur.',
          anlam: 'Küçük şeyler birike birike büyük varlıklar meydana getirir.',
        },
      ],
      syyd: [
        { yanliskelime: 'yanlız', dogrukelime: 'yalnız' },
        { yanliskelime: 'şöför', dogrukelime: 'şoför' },
      ],
    },
  })
}
