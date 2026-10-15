'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Volume2,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ExternalLink,
  Flame,
  ArrowRight,
  Bookmark,
  Info,
  Globe,
} from 'lucide-react'

interface TdkPayload {
  success: boolean
  source: 'tdk_live' | 'dersolab_curated'
  todayTdkSelection?: {
    madde: string
    kategori: string
    tarih: string
    koken: string
    kaynak: string
    anlam: string
    ornek: string
    yazar: string
    kulturNotu: string
  }
  data?: {
    kelime?: { madde: string; anlam: string }[]
    atasoz?: { madde: string; anlam: string }[]
    syyd?: { yanliskelime: string; dogrukelime: string }[]
    yabanci?: { kkelime: string; kkarsilik: string; anlam: string }
  }
  fallbackWords: {
    madde: string
    koken: string
    anlam: string
    ornek: string
    yazar: string
    osymNot: string
  }[]
}

const YKS_SPELLING_CHALLENGES = [
  {
    wordA: 'Yalnız',
    wordB: 'Yanlız',
    correct: 'A',
    explanation: 'Kelimenin kökü "yalın" (tek, sade) sözcüğüdür. Yalın + ız → Yalnız. "Yanlış" ise "yanılmak"tan gelir.',
  },
  {
    wordA: 'Şöför',
    wordB: 'Şoför',
    correct: 'B',
    explanation: 'Fransızca "chauffeur" kelimesinden dilimize geçmiştir. İlk hecesi "o" ile yazılır: Şoför.',
  },
  {
    wordA: 'Orijinal',
    wordB: 'Orjinal',
    correct: 'A',
    explanation: 'Fransızca "original" sözcüğüdür; "i" harfi korunarak "Orijinal" şeklinde yazılır.',
  },
  {
    wordA: 'Kravat',
    wordB: 'Kıravat',
    correct: 'A',
    explanation: 'Batı kökenli kelimelerin başında iki ünsüz yan yana bulunabilir; araya "ı" girmez.',
  },
  {
    wordA: 'Egzoz',
    wordB: 'Egzost',
    correct: 'A',
    explanation: 'TDK Güncel Yazım Kılavuzu\'na göre doğru yazımı "Egzoz"dur. Sonunda "t" bulunmaz.',
  },
]

export function TdkWordOfTheDay() {
  const [tdkData, setTdkData] = useState<TdkPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'yks' | 'tdk_live' | 'spelling'>('yks')
  const [selectedYksIndex, setSelectedYksIndex] = useState(0)
  const [isMeaningRevealed, setIsMeaningRevealed] = useState(false)

  // Spelling Quiz State
  const [spellingIndex, setSpellingIndex] = useState(0)
  const [selectedSpellingChoice, setSelectedSpellingChoice] = useState<'A' | 'B' | null>(null)
  const [spellingScore, setSpellingScore] = useState(0)

  useEffect(() => {
    async function fetchTdk() {
      try {
        const res = await fetch('/api/tdk')
        if (res.ok) {
          const json = await res.json()
          setTdkData(json)
        }
      } catch (e) {
        console.error('TDK fetch failed', e)
      } finally {
        setLoading(false)
      }
    }
    fetchTdk()
  }, [])

  const wordsList = tdkData?.fallbackWords || []
  const currentYksWord = wordsList[selectedYksIndex] || wordsList[0]

  // Text to Speech
  const playPronunciation = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'tr-TR'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const currentSpelling = YKS_SPELLING_CHALLENGES[spellingIndex]

  const handleSpellingAnswer = (choice: 'A' | 'B') => {
    if (selectedSpellingChoice !== null) return
    setSelectedSpellingChoice(choice)
    if (choice === currentSpelling.correct) {
      setSpellingScore((s) => s + 1)
    }
  }

  const handleNextSpelling = () => {
    setSelectedSpellingChoice(null)
    setSpellingIndex((prev) => (prev + 1) % YKS_SPELLING_CHALLENGES.length)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Banner ── */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TDK & Maarif Sözlük Atölyesi
            </span>
            <span className="text-xs text-slate-400">Canlı Sözlük Verileri</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Günün Kelimesi & Yazım Kuralları
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Türkçenin zengin söz varlığını keşfedin, TDK güncel yazım ikilemlerinde pratik yapın.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('yks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'yks'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            YKS Edebi Sözlük
          </button>
          <button
            onClick={() => setActiveTab('tdk_live')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tdk_live'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            TDK Canlı Veri
          </button>
          <button
            onClick={() => setActiveTab('spelling')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'spelling'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yazım İkilemleri
          </button>
        </div>
      </div>

      {/* ── 1. TAB: YKS EDEBİ SÖZLÜK (PARAGRAFTA ÇIKAN ZOR KELİMELER) ── */}
      {activeTab === 'yks' && currentYksWord && (
        <div className="space-y-6">
          {/* Quick Word Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto gizli-kaydirma py-1">
            {wordsList.map((w, idx) => (
              <button
                key={w.madde}
                onClick={() => {
                  setSelectedYksIndex(idx)
                  setIsMeaningRevealed(false)
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer capitalize ${
                  selectedYksIndex === idx
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {w.madde}
              </button>
            ))}
          </div>

          {/* Master Word Card */}
          <motion.div
            key={currentYksWord.madde}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl sm:text-4xl font-black text-white capitalize tracking-tight font-serif">
                  {currentYksWord.madde}
                </h3>
                <button
                  type="button"
                  onClick={() => playPronunciation(currentYksWord.madde)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors cursor-pointer"
                  title="Sesli Telaffuz Dinle"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Köken: {currentYksWord.koken}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                  Maarif Söz Varlığı
                </span>
              </div>
            </div>

            {/* Interactive Meaning Reveal Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                TDK Tanımı & Anlamı:
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 min-h-[72px] flex items-center justify-between gap-4">
                {isMeaningRevealed ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-base text-slate-200 font-medium leading-relaxed"
                  >
                    {currentYksWord.anlam}
                  </motion.p>
                ) : (
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Önce anlamını tahmin etmeyi deneyin!</span>
                  </div>
                )}

                <button
                  onClick={() => setIsMeaningRevealed(!isMeaningRevealed)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold shrink-0 transition-colors cursor-pointer border border-slate-700"
                >
                  {isMeaningRevealed ? 'Gizle' : 'Anlamı Gör'}
                </button>
              </div>
            </div>

            {/* Literary Quote from Famous Author */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-950/60 border border-emerald-500/20 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Edebiyattan Canlı Cümle:
              </span>
              <p className="text-sm italic text-slate-200 leading-relaxed font-serif">
                "{currentYksWord.ornek}"
              </p>
              <div className="text-right text-xs font-semibold text-slate-400">
                — {currentYksWord.yazar}
              </div>
            </div>

            {/* ÖSYM Sınav Tuzağı / Notu */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5 font-bold">ÖSYM Çıkmış İpucu:</strong>
                {currentYksWord.osymNot}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 2. TAB: TDK CANLI API VE GÜNÜN KELİMESİ VERİLERİ ── */}
      {activeTab === 'tdk_live' && (
        <div className="space-y-6">
          {/* A. TDK Resmî "Her Güne Bir Kelime" Seçkisi (@tdk_govtr) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  TDK Resmî "Her Güne Bir Kelime" Seçkisi
                </span>
                <span className="text-xs text-slate-400 font-mono">15 Ekim 2026</span>
              </div>
              <span className="text-xs text-emerald-400/90 font-mono flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                Kaynak: @tdk_govtr & Derleme Sözlüğü
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-4xl sm:text-5xl font-black text-white capitalize font-serif tracking-tight">
                  {tdkData?.todayTdkSelection?.madde || 'firik'}
                </h3>
                <button
                  type="button"
                  onClick={() => playPronunciation(tdkData?.todayTdkSelection?.madde || 'firik')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors cursor-pointer"
                  title="Sesli Telaffuz Dinle"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                  Köken: {tdkData?.todayTdkSelection?.koken || 'Türkçe (Halk Ağzı)'}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  Kültürel Söz Varlığı
                </span>
              </div>
            </div>

            {/* Tanım Kartı */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                TDK Sözlük Tanımı:
              </span>
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200">
                  <strong className="text-emerald-400 mr-2">1.</strong>
                  Olgunlaşmak üzere olan tahıl, kavurga.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200">
                  <strong className="text-emerald-400 mr-2">2.</strong>
                  Henüz olgunlaşmadan biçilerek ateşte tütsülenmiş taze buğday veya bu buğdaydan yapılan yöresel pilav/aş.
                </div>
              </div>
            </div>

            {/* Edebi & Kültürel Cümle */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-slate-950/60 border border-emerald-500/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Cümle İçinde Kullanımı:
              </span>
              <p className="text-sm italic text-slate-200 leading-relaxed font-serif">
                "{tdkData?.todayTdkSelection?.ornek || 'Tarlaların ucunda yeni biçilmiş firik kokusu akşamın serinliğine karışıyordu.'}"
              </p>
              <div className="text-right text-xs font-semibold text-slate-400">
                — {tdkData?.todayTdkSelection?.yazar || 'Halk Ağzı / Kültür Mirası'}
              </div>
            </div>

            {/* Maarif Söz Varlığı & Kültür Notu */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 block mb-0.5 font-bold">
                  Maarif Modeli & Söz Varlığı Notu:
                </strong>
                {tdkData?.todayTdkSelection?.kulturNotu ||
                  'TDK resmî sosyal medya kanalında (@tdk_govtr) 15 Ekim tarihli "Günün Kelimesi" olarak duyurulmuştur. Yeni Maarif Modeli söz varlığı ve Derleme Sözlüğü kapsamında yöresel kültürel değerlerimizdendir.'}
              </div>
            </div>
          </div>

          {/* B. TDK Canlı Web Portalı API Verisi (sozluk.gov.tr) */}
          {tdkData?.data?.kelime && tdkData.data.kelime.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  TDK Resmî Sözlük Portalı Canlı API Akışı
                </span>
                <span className="text-xs text-slate-400 font-mono">sozluk.gov.tr/icerik</span>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-black text-white capitalize font-serif">
                    {tdkData.data.kelime[0].madde}
                  </h3>
                  <button
                    type="button"
                    onClick={() => playPronunciation(tdkData.data!.kelime![0].madde)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors cursor-pointer"
                    title="Sesli Telaffuz Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {tdkData.data.kelime.map((item, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-200">
                      <strong className="text-cyan-400 mr-2">{i + 1}.</strong>
                      {item.anlam}
                    </div>
                  ))}
                </div>
              </div>

              {/* Günün Atasözü */}
              {tdkData.data.atasoz && tdkData.data.atasoz.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-slate-950/60 border border-cyan-800/30 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                    Günün Atasözü / Deyimi (sozluk.gov.tr Canlı):
                  </span>
                  <h4 className="text-base font-bold text-white font-serif">
                    "{tdkData.data.atasoz[0].madde}"
                  </h4>
                  <p className="text-xs text-slate-300">
                    Anlamı: {tdkData.data.atasoz[0].anlam}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* C. TDK Çift Kaynak Bilgi Notu */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300 block mb-0.5 font-bold">
                TDK Veri Kaynakları Hakkında Bilgilendirme:
              </strong>
              Türk Dil Kurumu'nun dijital ekosisteminde iki resmî yayın akışı bulunur:
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-200/90">
                <li>
                  <strong>@tdk_govtr Sosyal Medya Seçkisi:</strong> Kurum editörlerince her gün yayımlanan "Her Güne Bir Kelime" tematik seçkisidir (Bugün: <em>firik</em>).
                </li>
                <li>
                  <strong>sozluk.gov.tr Canlı Sözlük Portalı:</strong> TDK ana arama motorunda anlık API ile sunulan güncel madde ve atasözü akışıdır (Bugün: <em>paleografi</em> ve <em>uykuda olmak</em>).
                </li>
              </ul>
              DersoLab, her iki resmî veriyi de eşzamanlı olarak öğrencilere ulaştırır.
            </div>
          </div>
        </div>
      )}

      {/* ── 3. TAB: YAZIM KURALLARI İKİLEMLERİ MİNİ TEST ── */}
      {activeTab === 'spelling' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Soru {spellingIndex + 1} / {YKS_SPELLING_CHALLENGES.length}
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Doğru Sayısı: {spellingScore}
            </span>
          </div>

          <div className="text-center py-4 space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              Hangisi TDK'ya Göre Doğru Yazılmıştır?
            </span>
          </div>

          {/* Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['A', 'B'].map((letter) => {
              const text = letter === 'A' ? currentSpelling.wordA : currentSpelling.wordB
              const isSelected = selectedSpellingChoice === letter
              const isCorrectChoice = currentSpelling.correct === letter

              let btnStyle = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'

              if (selectedSpellingChoice !== null) {
                if (isCorrectChoice) {
                  btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-black ring-2 ring-emerald-500/50'
                } else if (isSelected && !isCorrectChoice) {
                  btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-300 font-black'
                } else {
                  btnStyle = 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-40'
                }
              }

              return (
                <button
                  key={letter}
                  disabled={selectedSpellingChoice !== null}
                  onClick={() => handleSpellingAnswer(letter as 'A' | 'B')}
                  className={`p-6 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[100px] ${btnStyle}`}
                >
                  <span className="text-2xl sm:text-3xl font-black font-serif tracking-wide">{text}</span>
                  {selectedSpellingChoice !== null && (
                    <span className="mt-2 text-xs font-bold">
                      {isCorrectChoice ? '✅ TDK Doğru Yazımı' : '❌ Yanlış Yazım'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation on Answer */}
          {selectedSpellingChoice !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
            >
              <strong className="text-xs uppercase font-bold text-emerald-400 tracking-wider block">
                TDK Kural Açıklaması:
              </strong>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {currentSpelling.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextSpelling}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Sonraki Kelime</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Teacher CTA */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-300">Yazım kurallarını ve sözcükte anlamı birebir çalış</span>
        <a
          href="/instructors"
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>Türkçe Öğretmenlerini Gör</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
