export type ChemGradeKey = 'gosteriler' | '9' | '10' | '11' | '12'

export type ChemItemCategory = 'kaplar' | 'isitma' | 'olcum' | 'aktarim' | 'ayirma' | 'maddeler'

export type VisualPreset =
  | 'beaker_heat'
  | 'titration'
  | 'flame'
  | 'electro'
  | 'rainbow'
  | 'gas'
  | 'funnel'
  | 'show_dramatic'
  | 'nanoscale'

export interface ChemLabItem {
  id: string
  name: string
  category: ChemItemCategory
  formula?: string
  colorHex: string
  hint: string
}

export interface ChemExperimentStep {
  id: string
  instruction: string
  actionLabel: string
  materialIds: string[]
  amountOptions?: number[]
  deltaTemp?: number
  deltaPh?: number
  setPh?: number
  deltaVol?: number
  deltaGasMl?: number
  setVoltage?: number
  liquidColorAfter?: string
  precipitateColor?: string
  flameColor?: string
  foamLevel?: number // 0..100
  burnerOn?: boolean
  sfx?: 'pour' | 'ignite' | 'reaction' | 'explosion' | 'clink'
  logType: 'NEDEN' | 'BASARILI' | 'BILGI'
  logTitle: string
  logExplanation: string
}

export interface ChemExperiment {
  id: string
  number: number
  title: string
  subtitle: string
  grade: ChemGradeKey
  lgsCompatible?: boolean
  maarifUnit: string
  visualPreset: VisualPreset
  difficulty: 'Kolay' | 'Orta' | 'İleri'
  durationText: string
  materials: string[]
  initialTemp: number
  initialPh: number
  initialVol: number
  initialLiquidColor?: string
  steps: ChemExperimentStep[]
  chartConfig: {
    title: string
    xAxisLabel: string
    yAxisLabel: string
    unit: string
    color: string
    points: { x: number; y: number }[]
  }
  particleInfo: {
    reactionEquation: string
    ions: { formula: string; color: string; role: string }[]
    microExplanation: string
  }
  summaryFormula: string
  whyItHappens: string
  safetyRules: string[]
  faqs: { q: string; a: string }[]
  relatedTopicLabel: string
  relatedModuleTab: 'periodic' | 'titration' | 'gas_laws' | 'equilibrium' | 'calculator' | 'game'
  inquiryQuestion: {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }
}

export interface QuickExpDef {
  id: string
  number: number
  title: string
  subtitle: string
  grade: ChemGradeKey
  lgsCompatible?: boolean
  maarifUnit: string
  visualPreset: VisualPreset
  difficulty?: 'Kolay' | 'Orta' | 'İleri'
  durationText?: string
  materials: string[]
  initialTemp?: number
  initialPh?: number
  initialVol?: number
  initialLiquidColor?: string
  steps: {
    instruction: string
    actionLabel: string
    materialIds: string[]
    amountOptions?: number[]
    deltaTemp?: number
    setPh?: number
    deltaVol?: number
    deltaGasMl?: number
    setVoltage?: number
    liquidColorAfter?: string
    precipitateColor?: string
    flameColor?: string
    foamLevel?: number
    burnerOn?: boolean
    sfx?: 'pour' | 'ignite' | 'reaction' | 'explosion' | 'clink'
    logType?: 'NEDEN' | 'BASARILI' | 'BILGI'
    logTitle: string
    logExplanation: string
  }[]
  chartTitle: string
  chartYLabel: string
  chartUnit: string
  chartColor?: string
  chartPoints: [number, number][]
  equation: string
  ions: { formula: string; color: string; role: string }[]
  microExplanation: string
  summaryFormula: string
  whyItHappens: string
  safetyRules: string[]
  faqs: [string, string][]
  relatedTopicLabel: string
  relatedModuleTab?: 'periodic' | 'titration' | 'gas_laws' | 'equilibrium' | 'calculator' | 'game'
  inquiryQuestion: {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }
}

export function defineExperiment(d: QuickExpDef): ChemExperiment {
  return {
    id: d.id,
    number: d.number,
    title: d.title,
    subtitle: d.subtitle,
    grade: d.grade,
    lgsCompatible: d.lgsCompatible,
    maarifUnit: d.maarifUnit,
    visualPreset: d.visualPreset,
    difficulty: d.difficulty || 'Orta',
    durationText: d.durationText || '2-4 dk',
    materials: d.materials,
    initialTemp: d.initialTemp ?? 22,
    initialPh: d.initialPh ?? 7.0,
    initialVol: d.initialVol ?? 0,
    initialLiquidColor: d.initialLiquidColor,
    steps: d.steps.map((s, idx) => ({
      id: `${d.id}-s${idx + 1}`,
      instruction: s.instruction,
      actionLabel: s.actionLabel,
      materialIds: s.materialIds,
      amountOptions: s.amountOptions,
      deltaTemp: s.deltaTemp,
      setPh: s.setPh,
      deltaVol: s.deltaVol,
      deltaGasMl: s.deltaGasMl,
      setVoltage: s.setVoltage,
      liquidColorAfter: s.liquidColorAfter,
      precipitateColor: s.precipitateColor,
      flameColor: s.flameColor,
      foamLevel: s.foamLevel,
      burnerOn: s.burnerOn,
      sfx: s.sfx,
      logType: s.logType || (idx === d.steps.length - 1 ? 'BASARILI' : idx % 2 === 1 ? 'NEDEN' : 'BILGI'),
      logTitle: s.logTitle,
      logExplanation: s.logExplanation,
    })),
    chartConfig: {
      title: d.chartTitle,
      xAxisLabel: 'Adım / Zaman',
      yAxisLabel: d.chartYLabel,
      unit: d.chartUnit,
      color: d.chartColor || '#22d3ee',
      points: d.chartPoints.map(([x, y]) => ({ x, y })),
    },
    particleInfo: {
      reactionEquation: d.equation,
      ions: d.ions,
      microExplanation: d.microExplanation,
    },
    summaryFormula: d.summaryFormula,
    whyItHappens: d.whyItHappens,
    safetyRules: d.safetyRules,
    faqs: d.faqs.map(([q, a]) => ({ q, a })),
    relatedTopicLabel: d.relatedTopicLabel,
    relatedModuleTab: d.relatedModuleTab || 'periodic',
    inquiryQuestion: d.inquiryQuestion,
  }
}

export const CHEM_CATEGORY_LABELS: Record<'bu_deney' | 'tumu' | ChemItemCategory, string> = {
  bu_deney: 'Bu deney',
  tumu: 'Tümü (84)',
  kaplar: 'Kaplar (8)',
  isitma: 'Isıtma (4)',
  olcum: 'Ölçüm (17)',
  aktarim: 'Aktarım (6)',
  ayirma: 'Ayırma (3)',
  maddeler: 'Maddeler (46)',
}

// Full 84-item chemical & glassware inventory across 6 categories
export const CHEM_LAB_ITEMS: ChemLabItem[] = [
  // Kaplar (8)
  { id: 'beher', name: 'Beher (250 mL)', category: 'kaplar', colorHex: '#38bdf8', hint: 'Çözelti hazırlama, ısıtma ve karıştırma kabı' },
  { id: 'erlen', name: 'Erlenmayer (250 mL)', category: 'kaplar', colorHex: '#38bdf8', hint: 'Konik boynu sayesinde sıçramadan çalkalama ve titrasyon' },
  { id: 'balon_joje', name: 'Balon Joje', category: 'kaplar', colorHex: '#0ea5e9', hint: 'Kesin molarite ve hacimde çözelti hazırlama kabı' },
  { id: 'kapsul', name: 'Porselen Kapsül', category: 'kaplar', colorHex: '#e2e8f0', hint: 'Yüksek sıcaklıkta buharlaştırma ve kristallendirme' },
  { id: 'damitma_balonu', name: 'Damıtma Balonu', category: 'kaplar', colorHex: '#7dd3fc', hint: 'Yan çıkış borulu kaynatma ve damıtma kabı' },
  { id: 'kalorimetre', name: 'Kalorimetre Kabı', category: 'kaplar', colorHex: '#fb923c', hint: 'Isı yalıtımlı entalpi (ΔH) ölçüm kabı' },
  { id: 'hofmann', name: 'Hofmann Voltametresi', category: 'kaplar', colorHex: '#a78bfa', hint: 'Suyun elektrolizinde H₂ ve O₂ hacmini ölçer' },
  { id: 'deney_tupu', name: 'Deney Tüpü', category: 'kaplar', colorHex: '#94a3b8', hint: 'Küçük ölçekli kalitatif gözlem tüpleri' },
  // Isıtma (4)
  { id: 'bek', name: 'Bunsen Beki', category: 'isitma', colorHex: '#f97316', hint: 'Ayarlanabilir mavi alevli gaz ısıtıcısı' },
  { id: 'sacayagi', name: 'Sacayağı & Amyant Tel', category: 'isitma', colorHex: '#64748b', hint: 'Isıtılacak kabı bek üzerinde sabit taşır' },
  { id: 'kibrit', name: 'Kibrit / Çakmak', category: 'isitma', colorHex: '#facc15', hint: 'Gaz vanası açıldıktan sonra beki ateşler' },
  { id: 'isitici', name: 'Elektrikli Isıtıcı', category: 'isitma', colorHex: '#ef4444', hint: 'Alevsiz kontrollü ısıtma ve yanıcı solvent güvenliği' },
  // Ölçüm (17)
  { id: 'termometre', name: 'Dijital Termometre', category: 'olcum', colorHex: '#f43f5e', hint: 'Anlık sıcaklık (°C / K) ölçer' },
  { id: 'ph_metre', name: 'pH Metre Probu', category: 'olcum', colorHex: '#10b981', hint: '0-14 arası kesin pH ölçümü yapar' },
  { id: 'terazi', name: 'Hassas Terazi', category: 'olcum', colorHex: '#cbd5e1', hint: '0,01 g duyarlılıkla kütle ölçümü' },
  { id: 'gaz_siringasi', name: 'Gaz Şırıngası', category: 'olcum', colorHex: '#38bdf8', hint: 'Açığa çıkan H₂/O₂/CO₂ gaz hacmini ölçer' },
  { id: 'zn_levha', name: 'Zn Elektrot / Levha', category: 'olcum', colorHex: '#94a3b8', hint: 'Çinko levha ve yükseltgenme yarı hücresi' },
  { id: 'cu_levha', name: 'Cu Elektrot / Levha', category: 'olcum', colorHex: '#d97706', hint: 'Bakır levha ve indirgenme yarı hücresi' },
  { id: 'voltmetre', name: 'Dijital Voltmetre', category: 'olcum', colorHex: '#eab308', hint: 'Pil potansiyelini (E°pil) ve mV akımı okur' },
  { id: 'kapali_siringa', name: 'Kapalı Gaz Şırıngası', category: 'olcum', colorHex: '#60a5fa', hint: 'Boyle Yasası P·V sıkıştırma tüpü' },
  { id: 'hava_siringasi', name: 'Pistonlu Hava Şırıngası', category: 'olcum', colorHex: '#7dd3fc', hint: 'Termal genleşme ve vakum kaynama tüpü' },
  { id: 'guc_kaynagi', name: 'DC Güç Kaynağı', category: 'olcum', colorHex: '#8b5cf6', hint: 'Elektroliz ve kaplama için doğru akım üretir' },
  { id: 'viskozimetre', name: 'Viskozimetre Tüpü', category: 'olcum', colorHex: '#2dd4bf', hint: 'Bilye düşüş süresiyle akışkanlık direnci ölçer' },
  { id: 'stalagmometre', name: 'Stalagmometre', category: 'olcum', colorHex: '#38bdf8', hint: 'Damla sayısıyla yüzey gerilimi ölçer' },
  { id: 'sacilma_duzenegi', name: 'Alfa Saçılma Düzeneği', category: 'olcum', colorHex: '#fbbf24', hint: 'Altın yaprak + ZnS detektör ekranı' },
  { id: 'ph_kagidi', name: 'Üniversal pH Kâğıdı', category: 'olcum', colorHex: '#a3e635', hint: 'Asit/baz renk skalası şeridi' },
  { id: 'siringa', name: 'Enjektör Şırınga', category: 'olcum', colorHex: '#93c5fd', hint: 'Hassas sıvı ve gaz hacmi aktarım aracı' },
  { id: 'balon', name: 'Esnek Gaz Balonu', category: 'olcum', colorHex: '#fb7185', hint: 'Tepkimeden çıkan gazı şişerek toplar' },
  { id: 'difuzyon_tupu', name: 'Graham Difüzyon Tüpü', category: 'olcum', colorHex: '#cbd5e1', hint: 'NH₃ ve HCl gazlarının karşılaşma mesafesini ölçer' },
  // Aktarım (6)
  { id: 'buret', name: '50 mL Büret', category: 'aktarim', colorHex: '#38bdf8', hint: 'Titrasyonda 0,05 mL hassasiyetle damlatma' },
  { id: 'statif', name: 'Statif & Kıskaç', category: 'aktarim', colorHex: '#64748b', hint: 'Büret ve huni sabitleme standı' },
  { id: 'baget', name: 'Cam Baget', category: 'aktarim', colorHex: '#e2e8f0', hint: 'Çözünmeyi ve ısıl homojenliği hızlandırır' },
  { id: 'spatul', name: 'Metal Spatül', category: 'aktarim', colorHex: '#94a3b8', hint: 'Katı toz ve kristal reaktif aktarımı' },
  { id: 'tel', name: 'Nikrom Alev Teli', category: 'aktarim', colorHex: '#cbd5e1', hint: 'Alev testinde tuz örneğini aleve taşır' },
  { id: 'tuz_koprusu', name: 'Tuz Köprüsü (KCl)', category: 'aktarim', colorHex: '#a7f3d0', hint: 'Yarı hücrelerde iyon denkliğini sağlar' },
  // Ayırma (3)
  { id: 'huni', name: 'Huni & Süzgeç Kâğıdı', category: 'ayirma', colorHex: '#f8fafc', hint: 'Katı-sıvı heterojen karışımları süzer' },
  { id: 'sogutucu', name: 'Geri Soğutucu (Liebig)', category: 'ayirma', colorHex: '#38bdf8', hint: 'Damıtma buharını soğuk suyla yoğuşturur' },
  { id: 'ayirma_hunisi', name: 'Ayırma Hunisi', category: 'ayirma', colorHex: '#fde047', hint: 'Birbiriyle karışmayan sıvıları yoğunlukla ayırır' },
  // Maddeler (46)
  { id: 'saf_su', name: 'Saf Su', formula: 'H₂O', category: 'maddeler', colorHex: '#38bdf8', hint: 'Nötr polar çözücü (pH 7,0)' },
  { id: 'kum', name: 'Kuvars Kumu', formula: 'SiO₂', category: 'maddeler', colorHex: '#d97706', hint: 'Suda çözünmeyen katı bileşen' },
  { id: 'tuz', name: 'Sofra Tuzu', formula: 'NaCl', category: 'maddeler', colorHex: '#f8fafc', hint: 'İyonik katı elektrolit' },
  { id: 'hcl', name: 'Hidroklorik Asit', formula: 'HCl', category: 'maddeler', colorHex: '#fb7185', hint: 'Kuvvetli tek değerli asit' },
  { id: 'naoh', name: 'Sodyum Hidroksit', formula: 'NaOH', category: 'maddeler', colorHex: '#c084fc', hint: 'Kuvvetli baz çözeltisi' },
  { id: 'fenolftalein', name: 'Fenolftalein', category: 'maddeler', colorHex: '#ec4899', hint: 'Bazik ortamda (pH > 8,2) pembeleşen indikatör' },
  { id: 'metil_oranj', name: 'Metil Oranj', category: 'maddeler', colorHex: '#f97316', hint: 'pH 3,1 altında kırmızı, 4,4 üstünde sarı' },
  { id: 'bromtimol', name: 'Bromtimol Mavisi', category: 'maddeler', colorHex: '#22c55e', hint: 'Asitte sarı, nötrde yeşil, bazda mavi' },
  { id: 'zeytinyagi', name: 'Zeytinyağı', category: 'maddeler', colorHex: '#eab308', hint: 'Sudan hafif (0,91 g/cm³) apolar sıvı' },
  { id: 'hcl_1m', name: 'HCl 1 M', formula: 'HCl', category: 'maddeler', colorHex: '#f43f5e', hint: '1 Molar kuvvetli asit standardı' },
  { id: 'naoh_1m', name: 'NaOH 1 M', formula: 'NaOH', category: 'maddeler', colorHex: '#a855f7', hint: '1 Molar kuvvetli baz standardı' },
  { id: 'mg_serit', name: 'Magnezyum Şerit / Toz', formula: 'Mg', category: 'maddeler', colorHex: '#cbd5e1', hint: 'Aktif toprak alkali metal' },
  { id: 'licl', name: 'Lityum Klorür', formula: 'LiCl', category: 'maddeler', colorHex: '#f43f5e', hint: 'Alevde koyu karmin kırmızı ışık yayar' },
  { id: 'kcl', name: 'Potasyum Klorür', formula: 'KCl', category: 'maddeler', colorHex: '#c084fc', hint: 'Alevde leylak-mor renk verir' },
  { id: 'cacl2', name: 'Kalsiyum Klorür', formula: 'CaCl₂', category: 'maddeler', colorHex: '#fb923c', hint: 'Alevde tuğla kırmızısı renk verir' },
  { id: 'cucl2', name: 'Bakır(II) Klorür', formula: 'CuCl₂', category: 'maddeler', colorHex: '#10b981', hint: 'Alevde parlak mavi-yeşil renk verir' },
  { id: 'srcl2', name: 'Stronsiyum Klorür', formula: 'SrCl₂', category: 'maddeler', colorHex: '#ef4444', hint: 'Alevde yoğun yakut kırmızısı verir' },
  { id: 'bilinmeyen', name: 'Bilinmeyen Numune (X)', category: 'maddeler', colorHex: '#94a3b8', hint: 'Nitel analiz veya titrasyonla tayin edilir' },
  { id: 'znso4', name: 'Çinko Sülfat', formula: 'ZnSO₄', category: 'maddeler', colorHex: '#cbd5e1', hint: 'Zn²⁺ elektrolit çözeltisi' },
  { id: 'cuso4', name: 'Bakır(II) Sülfat', formula: 'CuSO₄', category: 'maddeler', colorHex: '#0ea5e9', hint: 'Mavi Cu²⁺ çözeltisi' },
  { id: 'fe3', name: 'Demir(III) İyonu', formula: 'Fe³⁺', category: 'maddeler', colorHex: '#f59e0b', hint: 'Soluk sarı FeCl₃ kaynağı' },
  { id: 'scn', name: 'Tiyosiyanat', formula: 'SCN⁻', category: 'maddeler', colorHex: '#cbd5e1', hint: 'Fe³⁺ ile kan kırmızı kompleks kurar' },
  { id: 'nh4no3', name: 'Amonyum Nitrat', formula: 'NH₄NO₃', category: 'maddeler', colorHex: '#60a5fa', hint: 'Suda endotermik (soğutarak) çözünür' },
  { id: 'naoh_kati', name: 'NaOH Katısı', formula: 'NaOH(k)', category: 'maddeler', colorHex: '#f8fafc', hint: 'Suda ekzotermik çözünür' },
  { id: 'na2so4', name: 'Sodyum Sülfat', formula: 'Na₂SO₄', category: 'maddeler', colorHex: '#e2e8f0', hint: 'Elektrolizde iletkenlik artırıcı nötr tuz' },
  { id: 'etanol', name: 'Etanol', formula: 'C₂H₅OH', category: 'maddeler', colorHex: '#7dd3fc', hint: '78 °C kaynama noktalı polar alkol' },
  { id: 'gliserin', name: 'Gliserin', formula: 'C₃H₈O₃', category: 'maddeler', colorHex: '#a5f3fc', hint: 'Güçlü hidrojen bağları nedeniyle çok viskoz' },
  { id: 'hekzan', name: 'Hekzan', formula: 'C₆H₁₄', category: 'maddeler', colorHex: '#fef08a', hint: 'Apolar hidrokarbon çözücü' },
  { id: 'deterjan', name: 'Sıvı Deterjan', category: 'maddeler', colorHex: '#34d399', hint: 'Yüzey aktif madde; köpük ve yüzey gerilimi azaltıcı' },
  { id: 'iyot', name: 'İyot Kristali', formula: 'I₂', category: 'maddeler', colorHex: '#7e22ce', hint: 'Apolar I₂ molekülleri hekzanda mor çözünür' },
  { id: 'sirke', name: 'Sirke (Asetik Asit)', formula: 'CH₃COOH', category: 'maddeler', colorHex: '#fde68a', hint: 'Zayıf organik asit (%5)' },
  { id: 'gazli_icecek', name: 'Gazlı İçecek', category: 'maddeler', colorHex: '#f59e0b', hint: 'Çözünmüş CO₂ içeren asidik içecek (pH ~3)' },
  { id: 'limon_tuzu', name: 'Limon Tuzu (Sitrik Asit)', formula: 'C₆H₈O₇', category: 'maddeler', colorHex: '#fef08a', hint: 'Doğal gıda asidi' },
  { id: 'karbonat', name: 'Yemek Sodası', formula: 'NaHCO₃', category: 'maddeler', colorHex: '#f8fafc', hint: 'Asitlerle anında CO₂ gazı çıkarır' },
  { id: 'aseton', name: 'Aseton', formula: 'C₃H₆O', category: 'maddeler', colorHex: '#bae6fd', hint: 'Yüksek buhar basınçlı uçucu organik sıvı' },
  { id: 'h2o2', name: 'Hidrojen Peroksit %30', formula: 'H₂O₂', category: 'maddeler', colorHex: '#e0f2fe', hint: 'Katalizörle hızlı H₂O + O₂ ayrışır' },
  { id: 'ki', name: 'Potasyum İyodür', formula: 'KI', category: 'maddeler', colorHex: '#f1f5f9', hint: 'H₂O₂ katalizörü ve sarı PbI₂ kaynağı' },
  { id: 'pbno3', name: 'Kurşun(II) Nitrat', formula: 'Pb(NO₃)₂', category: 'maddeler', colorHex: '#e2e8f0', hint: 'I⁻ ile altın sarısı PbI₂ çökeleği oluşturur' },
  { id: 'agno3', name: 'Gümüş Nitrat', formula: 'AgNO₃', category: 'maddeler', colorHex: '#cbd5e1', hint: 'Cl⁻ belirteci ve Ag nanoparçacık öncüsü' },
  { id: 'nacl_suda', name: 'NaCl Çözeltisi', formula: 'NaCl(aq)', category: 'maddeler', colorHex: '#93c5fd', hint: 'Serbest iyonlarıyla elektriği iyi iletir' },
  { id: 'al_folyo', name: 'Alüminyum / Toz Al', formula: 'Al', category: 'maddeler', colorHex: '#cbd5e1', hint: 'Amfoter ve güçlü indirgen metal' },
  { id: 'derisik_hcl', name: 'Derişik HCl (%37)', formula: 'HCl(d)', category: 'maddeler', colorHex: '#ef4444', hint: 'Duman çıkaran yoğun asit buharı kaynağı' },
  { id: 'derisik_nh3', name: 'Derişik Amonyak', formula: 'NH₃(aq)', category: 'maddeler', colorHex: '#60a5fa', hint: 'Hafif NH₃ gazı difüzyon kaynağı (17 g/mol)' },
  { id: 'kno3', name: 'Potasyum Nitrat', formula: 'KNO₃', category: 'maddeler', colorHex: '#f8fafc', hint: 'Sıcaklıkla çözünürlüğü keskin artan tuz' },
  { id: 'seker', name: 'Sakkaroz (Şeker)', formula: 'C₁₂H₂₂O₁₁', category: 'maddeler', colorHex: '#ffffff', hint: 'Moleküler katı; çözeltisi elektriği iletmez' },
  { id: 'buz', name: 'Kırılmış Buz', formula: 'H₂O(k)', category: 'maddeler', colorHex: '#bae6fd', hint: 'Soğutma banyosu ve kriyoskopi ortamı' },
]
