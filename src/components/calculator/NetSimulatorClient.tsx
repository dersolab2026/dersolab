'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calculator,
  Target,
  TrendingUp,
  FlaskConical,
  GraduationCap,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { getRecommendedLabForSubjectOrText } from '@/lib/exams/curriculum'

type ExamMode = 'yks_say' | 'yks_ea' | 'lgs'

interface TargetPreset {
  id: string
  mode: ExamMode
  label: string
  badge: string
  targetTytNet?: number
  targetAytNet?: number
  targetLgsNet?: number
  targetScore: number
}

const TARGET_PRESETS: TargetPreset[] = [
  {
    id: 'itu_odtu_cs',
    mode: 'yks_say',
    label: 'İTÜ / ODTÜ / Boğaziçi Mühendislik',
    badge: 'İlk 2.500 Sıralama',
    targetTytNet: 103,
    targetAytNet: 72,
    targetScore: 525,
  },
  {
    id: 'tip_fak',
    mode: 'yks_say',
    label: 'Devlet Tıp Fakülteleri',
    badge: 'İlk 15.000 Sıralama',
    targetTytNet: 94,
    targetAytNet: 65,
    targetScore: 492,
  },
  {
    id: 'muh_50k',
    mode: 'yks_say',
    label: 'Köklü Mühendislik & Mimarlık',
    badge: 'İlk 50.000 Sıralama',
    targetTytNet: 80,
    targetAytNet: 52,
    targetScore: 445,
  },
  {
    id: 'boun_ea',
    mode: 'yks_ea',
    label: 'Boğaziçi / GSÜ İktisat & İşletme',
    badge: 'İlk 1.500 Sıralama',
    targetTytNet: 96,
    targetAytNet: 68,
    targetScore: 505,
  },
  {
    id: 'hukuk_25k',
    mode: 'yks_ea',
    label: 'Devlet Hukuk Fakülteleri',
    badge: 'İlk 25.000 Sıralama',
    targetTytNet: 82,
    targetAytNet: 54,
    targetScore: 442,
  },
  {
    id: 'pdr_psikoloji',
    mode: 'yks_ea',
    label: 'Psikoloji & PDR Bölümleri',
    badge: 'İlk 60.000 Sıralama',
    targetTytNet: 72,
    targetAytNet: 44,
    targetScore: 405,
  },
  {
    id: 'lgs_zirve',
    mode: 'lgs',
    label: 'Galatasaray / İstanbul Erkek / Kabataş',
    badge: '%0.1 - %0.3 Yüzdelik Dilim',
    targetLgsNet: 87,
    targetScore: 492,
  },
  {
    id: 'lgs_fen',
    mode: 'lgs',
    label: 'Proje Fen Liseleri',
    badge: '%1\'lik Yüzdelik Dilim',
    targetLgsNet: 81,
    targetScore: 472,
  },
  {
    id: 'lgs_anadolu',
    mode: 'lgs',
    label: 'Nitelikli Anadolu Liseleri',
    badge: '%5\'lik Yüzdelik Dilim',
    targetLgsNet: 72,
    targetScore: 442,
  },
]

export function NetSimulatorClient() {
  const [mode, setMode] = useState<ExamMode>('yks_say')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tip_fak')
  const [obp, setObp] = useState<number>(90)

  // TYT Netleri
  const [tytTurkce, setTytTurkce] = useState(28)
  const [tytSosyal, setTytSosyal] = useState(14)
  const [tytMat, setTytMat] = useState(24)
  const [tytFen, setTytFen] = useState(12)

  // AYT Sayısal Netleri
  const [aytMat, setAytMat] = useState(24)
  const [aytFizik, setAytFizik] = useState(8)
  const [aytKimya, setAytKimya] = useState(8)
  const [aytBiyoloji, setAytBiyoloji] = useState(8)

  // AYT EA Netleri
  const [aytEdebiyat, setAytEdebiyat] = useState(18)
  const [aytTarih1, setAytTarih1] = useState(7)
  const [aytCog1, setAytCog1] = useState(4)

  // LGS Netleri
  const [lgsTurkce, setLgsTurkce] = useState(16)
  const [lgsMat, setLgsMat] = useState(13)
  const [lgsFen, setLgsFen] = useState(15)
  const [lgsInk, setLgsInk] = useState(8)
  const [lgsDin, setLgsDin] = useState(9)
  const [lgsIng, setLgsIng] = useState(8)

  const modePresets = useMemo(
    () => TARGET_PRESETS.filter((p) => p.mode === mode),
    [mode],
  )

  const activePreset = useMemo(
    () => modePresets.find((p) => p.id === selectedPresetId) ?? modePresets[0],
    [modePresets, selectedPresetId],
  )

  const handleModeSwitch = (newMode: ExamMode) => {
    setMode(newMode)
    const first = TARGET_PRESETS.find((p) => p.mode === newMode)
    if (first) setSelectedPresetId(first.id)
  }

  // Hesaplamalar
  const totalTytNet = tytTurkce + tytSosyal + tytMat + tytFen
  const totalAytSayNet = aytMat + aytFizik + aytKimya + aytBiyoloji
  const totalAytEaNet = aytMat + aytEdebiyat + aytTarih1 + aytCog1
  const totalLgsNet = lgsTurkce + lgsMat + lgsFen + lgsInk + lgsDin + lgsIng

  const calculatedScore = useMemo(() => {
    if (mode === 'yks_say') {
      const ham = 100 + totalTytNet * 1.32 + totalAytSayNet * 3.0
      return Math.min(560, Math.round((ham + obp * 0.6) * 10) / 10)
    }
    if (mode === 'yks_ea') {
      const ham = 100 + totalTytNet * 1.32 + totalAytEaNet * 3.0
      return Math.min(560, Math.round((ham + obp * 0.6) * 10) / 10)
    }
    // LGS Puan (100 - 500 arası katsayılı yaklaşım)
    const agırlıklı =
      lgsTurkce * 4 +
      lgsMat * 4 +
      lgsFen * 4 +
      lgsInk * 1 +
      lgsDin * 1 +
      lgsIng * 1
    // Maksimum ağırlıklı net = 20*4 + 20*4 + 20*4 + 30*1 = 270
    return Math.min(500, Math.round((194 + (agırlıklı / 270) * 306) * 10) / 10)
  }, [
    mode,
    totalTytNet,
    totalAytSayNet,
    totalAytEaNet,
    obp,
    lgsTurkce,
    lgsMat,
    lgsFen,
    lgsInk,
    lgsDin,
    lgsIng,
  ])

  // En çok net kazanılabilecek (açığı en büyük) dersi bul
  const priorityRecommendation = useMemo(() => {
    if (mode === 'yks_say') {
      const gaps = [
        { name: 'AYT Matematik', gap: 40 - aytMat },
        { name: 'TYT Matematik', gap: 40 - tytMat },
        { name: 'AYT Fizik', gap: (14 - aytFizik) * 2 },
        { name: 'AYT Kimya', gap: (13 - aytKimya) * 1.8 },
        { name: 'AYT Biyoloji', gap: (13 - aytBiyoloji) * 1.8 },
      ].sort((a, b) => b.gap - a.gap)
      return {
        subject: gaps[0].name,
        lab: getRecommendedLabForSubjectOrText(gaps[0].name),
      }
    }
    if (mode === 'yks_ea') {
      const gaps = [
        { name: 'AYT Matematik', gap: 40 - aytMat },
        { name: 'TYT Matematik', gap: 40 - tytMat },
        { name: 'TYT Türkçe', gap: 40 - tytTurkce },
        { name: 'AYT Türk Dili ve Edebiyatı', gap: (24 - aytEdebiyat) * 1.5 },
      ].sort((a, b) => b.gap - a.gap)
      return {
        subject: gaps[0].name,
        lab: getRecommendedLabForSubjectOrText(gaps[0].name),
      }
    }
    const gaps = [
      { name: 'LGS Matematik', gap: (20 - lgsMat) * 4 },
      { name: 'LGS Fen Bilimleri', gap: (20 - lgsFen) * 4 },
      { name: 'LGS Türkçe', gap: (20 - lgsTurkce) * 4 },
    ].sort((a, b) => b.gap - a.gap)
    return {
      subject: gaps[0].name,
      lab: getRecommendedLabForSubjectOrText(gaps[0].name),
    }
  }, [
    mode,
    aytMat,
    tytMat,
    aytFizik,
    aytKimya,
    aytBiyoloji,
    tytTurkce,
    aytEdebiyat,
    lgsMat,
    lgsFen,
    lgsTurkce,
  ])

  const scoreDiff = Math.round((calculatedScore - activePreset.targetScore) * 10) / 10
  const reachedTarget = scoreDiff >= 0

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Üst Navigasyon */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>DersoLab Ana Sayfa</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/lab"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/25 transition-all"
            >
              🔬 L.A.B. Deneyleri
            </Link>
            <Link
              href="/demo-ders"
              className="px-4 py-1.5 rounded-xl bg-[#DD7B3A] hover:bg-[#DD7B3A]/90 text-white text-xs font-black transition-all"
            >
              🎁 Ücretsiz Tanışma Dersi
            </Link>
          </div>
        </div>

        {/* Hero Başlık */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#0E131F] to-indigo-950/30 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>YKS 2027 & LGS Hedef Simülatörü</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Hedefindeki Okul İçin{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
              Kaç Net Gerekiyor?
            </span>
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Mevcut deneme netlerini kaydırarak hedeflediğin üniversite veya liseye ne kadar uzaklıkta olduğunu hesapla; en hızlı puan getirecek ders için L.A.B. simülasyonunu ve kişisel koçluk rotasını keşfet.
          </p>

          {/* Sınav Türü Seçici */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleModeSwitch('yks_say')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                mode === 'yks_say'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              🚀 YKS Sayısal (MF)
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('yks_ea')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                mode === 'yks_ea'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              ⚖️ YKS Eşit Ağırlık (TM)
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('lgs')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                mode === 'lgs'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              🎯 8. Sınıf LGS
            </button>
          </div>
        </div>

        {/* Hedef Okul / Bölüm Seçimi */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>1. Hedeflediğin Okul veya Sıralama Bandını Seç:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {modePresets.map((preset) => {
              const active = preset.id === activePreset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    active
                      ? 'border-emerald-500 bg-emerald-950/25 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-emerald-300 mb-1.5">
                    {preset.badge}
                  </span>
                  <p className="text-sm font-black text-white">{preset.label}</p>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">
                    Hedef Puan: ~{preset.targetScore} Puan
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Ana Simülatör Grid (Sol: Sliderlar, Sağ: Canlı Sonuç & Reçete) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol: Net Sliderları */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0E131F] p-6 space-y-6">
            <h2 className="text-base font-black text-white flex items-center justify-between">
              <span>2. Şu Anki Deneme Netlerini Gir</span>
              {mode !== 'lgs' && (
                <span className="text-xs font-bold text-slate-400">
                  TYT: {totalTytNet} Net · AYT: {mode === 'yks_say' ? totalAytSayNet : totalAytEaNet} Net
                </span>
              )}
            </h2>

            {mode !== 'lgs' ? (
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    TYT Oturumu (120 Soru)
                  </p>
                  <NetSlider label="TYT Türkçe" max={40} value={tytTurkce} onChange={setTytTurkce} />
                  <NetSlider label="TYT Matematik" max={40} value={tytMat} onChange={setTytMat} />
                  <NetSlider label="TYT Fen Bilimleri" max={20} value={tytFen} onChange={setTytFen} />
                  <NetSlider label="TYT Sosyal Bilimler" max={20} value={tytSosyal} onChange={setTytSosyal} />
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-amber-400">
                    {mode === 'yks_say' ? 'AYT Sayısal Oturumu (80 Soru)' : 'AYT Eşit Ağırlık Oturumu (80 Soru)'}
                  </p>
                  <NetSlider label="AYT Matematik" max={40} value={aytMat} onChange={setAytMat} />
                  {mode === 'yks_say' ? (
                    <>
                      <NetSlider label="AYT Fizik" max={14} value={aytFizik} onChange={setAytFizik} />
                      <NetSlider label="AYT Kimya" max={13} value={aytKimya} onChange={setAytKimya} />
                      <NetSlider label="AYT Biyoloji" max={13} value={aytBiyoloji} onChange={setAytBiyoloji} />
                    </>
                  ) : (
                    <>
                      <NetSlider label="AYT Edebiyat" max={24} value={aytEdebiyat} onChange={setAytEdebiyat} />
                      <NetSlider label="AYT Tarih-1" max={10} value={aytTarih1} onChange={setAytTarih1} />
                      <NetSlider label="AYT Coğrafya-1" max={6} value={aytCog1} onChange={setAytCog1} />
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <NetSlider
                    label="Ortaöğretim Başarı Puanı (Diploma Notu)"
                    max={100}
                    min={50}
                    value={obp}
                    onChange={setObp}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  LGS Sözel & Sayısal Oturum (90 Soru)
                </p>
                <NetSlider label="LGS Matematik (Katsayı 4)" max={20} value={lgsMat} onChange={setLgsMat} />
                <NetSlider label="LGS Fen Bilimleri (Katsayı 4)" max={20} value={lgsFen} onChange={setLgsFen} />
                <NetSlider label="LGS Türkçe (Katsayı 4)" max={20} value={lgsTurkce} onChange={setLgsTurkce} />
                <NetSlider label="LGS T.C. İnkılap Tarihi" max={10} value={lgsInk} onChange={setLgsInk} />
                <NetSlider label="LGS Din Kültürü" max={10} value={lgsDin} onChange={setLgsDin} />
                <NetSlider label="LGS Yabancı Dil (İngilizce)" max={10} value={lgsIng} onChange={setLgsIng} />
              </div>
            )}
          </div>

          {/* Sağ: Canlı Sonuç, Hedef Farkı ve L.A.B. Reçetesi */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#0E131F] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tahmini Yerleştirme Puanın
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs font-bold text-slate-300">
                  {activePreset.badge}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-5xl font-black text-white tabular-nums">
                    {calculatedScore.toFixed(1)}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Hedef ({activePreset.label}): {activePreset.targetScore} Puan
                  </p>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                    reachedTarget
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {reachedTarget ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hedefin Üzerindesin! (+{scoreDiff.toFixed(1)})</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Hedefe {Math.abs(scoreDiff).toFixed(1)} Puan Kaldı</span>
                    </>
                  )}
                </div>
              </div>

              {/* Net Hedef Karşılaştırma Çubukları */}
              {mode !== 'lgs' ? (
                <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">TYT Toplam Net</span>
                      <span className="text-white">
                        {totalTytNet} / Hedef {activePreset.targetTytNet} Net
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all"
                        style={{
                          width: `${Math.min(100, (totalTytNet / (activePreset.targetTytNet || 100)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">AYT Toplam Net</span>
                      <span className="text-white">
                        {mode === 'yks_say' ? totalAytSayNet : totalAytEaNet} / Hedef{' '}
                        {activePreset.targetAytNet} Net
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            ((mode === 'yks_say' ? totalAytSayNet : totalAytEaNet) /
                              (activePreset.targetAytNet || 70)) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-slate-300">LGS Toplam Net</span>
                      <span className="text-white">
                        {totalLgsNet} / Hedef {activePreset.targetLgsNet} Net
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all"
                        style={{
                          width: `${Math.min(100, (totalLgsNet / (activePreset.targetLgsNet || 85)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Kişiselleştirilmiş L.A.B. & Koçluk Reçetesi */}
            <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-[#0E131F] to-slate-950 p-6 space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>DersoLab Akıllı Yükseliş Reçetesi</span>
              </div>

              <p className="text-sm font-bold text-white leading-relaxed">
                En yüksek puan sıçramasını{' '}
                <span className="text-amber-400 underline underline-offset-4">
                  {priorityRecommendation.subject}
                </span>{' '}
                netlerini artırarak yakalayabilirsin!
              </p>

              <p className="text-xs text-slate-300 leading-relaxed">
                {priorityRecommendation.lab.moduleTitle}: {priorityRecommendation.lab.description}
              </p>

              <div className="space-y-2.5 pt-2">
                <Link
                  href={priorityRecommendation.lab.href}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>{priorityRecommendation.lab.branchName} Simülasyonunu Ücretsiz Aç →</span>
                </Link>

                <Link
                  href="/demo-ders"
                  className="w-full py-3 px-4 rounded-xl bg-[#DD7B3A] hover:bg-[#DD7B3A]/90 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(221,123,58,0.3)]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>20 Dk Ücretsiz Tanışma Dersi ile Planla</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NetSlider({
  label,
  value,
  max,
  min = 0,
  onChange,
}: {
  label: string
  value: number
  max: number
  min?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-mono">
          {value} <span className="text-slate-500">/ {max}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-emerald-500 cursor-pointer h-2 rounded-lg bg-white/10"
      />
    </div>
  )
}
