'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Share2,
  Copy,
  Check,
} from 'lucide-react'

interface ParagraphItem {
  id: string
  category: string
  title: string
  text: string
  question: string
  options: { text: string; isCorrect: boolean }[]
  explanation: string
}

const PARAGRAPHS: ParagraphItem[] = [
  {
    id: 'sanat',
    category: 'Düşünce & Sanat',
    title: 'Sanatın İşlevi ve Birey Üzerindeki Etkisi',
    text: 'Sanatçı, dünyayı olduğu gibi kopyalayan bir fotoğrafçı değil; görünenin ardındaki görünmeyeni sezdirme ustasıdır. Bir tablonun veya bir romanın bizi sarsmasının nedeni, onda daha önce fark etmediğimiz bir hakikati apaçık bulmamızdır. Sanat yapıtı karşısında duyulan heyecan, salt estetik bir hazdan ibaret olmayıp insanın kendi varoluşuna ayna tutmasıdır. Bu yüzden büyük yapıtlar, çağlar geçse de eskimez; aksine her yeni kuşakla birlikte yeniden üretilip zenginleşir.',
    question: 'Bu parçada sanat yapıtlarıyla ilgili olarak asıl anlatılmak istenen aşağıdakilerden hangisidir?',
    options: [
      { text: 'A) Gerçeği bire bir yansıtarak belgesel niteliği taşıdığı', isCorrect: false },
      { text: 'B) İnsana kendi iç dünyasını ve fark etmediği hakikatleri sezdirerek ölümsüzleştiği', isCorrect: true },
      { text: 'C) Yalnızca döneminin kültürel değerlerini yansıttığı sürece kalıcı olduğu', isCorrect: false },
      { text: 'D) Estetik hazzın düşünsel derinlikten her zaman daha üstün olduğu', isCorrect: false },
    ],
    explanation: 'Parçada sanatçının görünenin ardındakini sezdirdiği ve insanın kendi varoluşuna ayna tutarak her yeni kuşakta yeniden üretildiği vurgulanmıştır. Dolayısıyla doğru yanıt B seçeneğidir.',
  },
  {
    id: 'teknoloji',
    category: 'Bilim & Teknoloji',
    title: 'Dijital Çağda Derin Düşünme ve Dikkat',
    text: 'Dijital çağda bilgiye ulaşmak saniyeler sürerken, o bilgiyi sindirip özümsemek giderek daha zahmetli bir eyleme dönüşüyor. Sürekli bildirimlerin ve kısa videoların bombardımanı altında kalan zihin, derinleşme yetisini yitirerek yatay bir yüzeyselliğe teslim oluyor. Oysa gerçek düşünme; durmayı, beklemeyi, çelişkilerle yüzleşmeyi ve boşlukları kendi zihinsel emeğimizle doldurmayı gerektirir.',
    question: 'Bu parçanın yazarı aşağıdakilerin hangisinden yakınmaktadır?',
    options: [
      { text: 'A) Dijital araçların eğitimde gereğinden fazla kullanılmasından', isCorrect: false },
      { text: 'B) Bilgiye hızlı ulaşımın insan zihnini yüzeyselleştirip derin düşünmeyi engellemesinden', isCorrect: true },
      { text: 'C) İnternetteki bilgilerin güvenilirlik denetiminden geçmemesinden', isCorrect: false },
      { text: 'D) Yeni kuşağın teknolojiye olan ilgisizliğinden', isCorrect: false },
    ],
    explanation: 'Yazar, bilgiye hızlı ulaşımın bilgiyi özümsemeyi zorlaştırdığını ve zihnin derinleşme yetisini yok ederek yüzeyselliğe yol açtığını belirterek B seçeneğindeki durumdan yakınmaktadır.',
  },
  {
    id: 'edebiyat',
    category: 'Edebî Betimleme',
    title: 'Bozkırın Sessizliği ve Zaman Algısı',
    text: 'Göz alabildiğine uzanan sarı bozkır, insanın içindeki gereksiz gürültüleri tek tek ayıklar. Ufuk çizgisinin sonsuzluğu karşısında insan, kendi telaşının ne denli küçük olduğunu anlar. Rüzgârın hafif uğultusu ve kuru otların hışırtısı dışında hiçbir sesin bulunmadığı bu geniş coğrafyada, zaman saatlerin tıkırtısıyla değil; güneşin gölgeleri uzatıp kısaltmasıyla ölçülür.',
    question: 'Bu parçanın anlatımında aşağıdakilerden hangisi ağır basmaktadır?',
    options: [
      { text: 'A) İkilemeler ve sayısal verilerden yararlanma', isCorrect: false },
      { text: 'B) Duyular arası aktarım ve tartışmacı anlatım', isCorrect: false },
      { text: 'C) İşitme ve görme duyularına seslenen betimleyici ögeler', isCorrect: true },
      { text: 'D) Karşılaştırma ve tanık gösterme yoluyla düşünceyi geliştirme', isCorrect: false },
    ],
    explanation: 'Parçada sarı bozkır, ufuk çizgisi, gölgelerin uzaması (görme) ile rüzgârın uğultusu ve kuru otların hışırtısı (işitme) betimleyici bir dille verilmiştir. Doğru yanıt C seçeneğidir.',
  },
  {
    id: 'felsefe',
    category: 'Felsefe & İnsan',
    title: 'Özgürlük, Seçimler ve Sorumluluk',
    text: 'Özgürlük, insanın canının istediği her şeyi pervasızca yapabilmesi değil; yaptığı seçimlerin doğuracağı sonuçları bütünüyle üstlenebilme olgunluğudur. Seçim yapmaktan kaçınmak dahi aslında örtük bir seçimdir. İnsan ancak kararlarının arkasında durabildiği ve eylemlerinin sorumluluğunu başkalarına yüklemediği ölçüde özgür bir birey kimliği kazanır.',
    question: 'Bu parçaya göre gerçek özgürlüğün temel koşulu aşağıdakilerden hangisidir?',
    options: [
      { text: 'A) Toplumsal kuralların tamamını reddedebilmek', isCorrect: false },
      { text: 'B) Kararlarının ve tercihlerinin sorumluluğunu üstlenebilmek', isCorrect: true },
      { text: 'C) Hiçbir seçim yapmak zorunda kalmayacağı bir yaşam kurmak', isCorrect: false },
      { text: 'D) Her koşulda kendi kişisel çıkarlarını savunabilmek', isCorrect: false },
    ],
    explanation: 'Parçada özgürlüğün "seçimlerin doğuracağı sonuçları üstlenebilme olgunluğu" olduğu ve sorumluluk aldıkça özgürlük kazanılacağı açıkça ifade edilmiştir. Doğru yanıt B seçeneğidir.',
  },
]

// Bionic Reading formatter: Bolds first 40-45% of each word
function formatBionicWord(word: string): React.ReactNode {
  if (word.length <= 1) return <span key={word}>{word}</span>
  const mid = Math.ceil(word.length * 0.45)
  const boldPart = word.slice(0, mid)
  const restPart = word.slice(mid)
  return (
    <span key={word} className="inline-block mr-1.5">
      <strong className="font-black text-slate-950 tracking-tight">{boldPart}</strong>
      <span className="text-slate-700 font-medium">{restPart}</span>
    </span>
  )
}

export function BionicSpeedReader() {
  const [selectedParaIndex, setSelectedParaIndex] = useState(0)
  // Ordered per Selva's feedback: normal -> bionic -> rsvp
  const [mode, setMode] = useState<'normal' | 'bionic' | 'rsvp'>('normal')
  const [wpm, setWpm] = useState(300) // Words per minute for RSVP
  const [isReading, setIsReading] = useState(false)
  const [rsvpWordIndex, setRsvpWordIndex] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [finishedReading, setFinishedReading] = useState(false)
  const [showTextAnyway, setShowTextAnyway] = useState(false) // Toggle to peek text if needed
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const currentPara = PARAGRAPHS[selectedParaIndex]
  const words = currentPara.text.split(/\s+/)

  // Calculated WPM
  const actualWpm =
    elapsedSeconds > 0 ? Math.round((words.length / elapsedSeconds) * 60) : 0

  const shareText = `🦊 DersoLab Paragraf Antrenöründe ${actualWpm} Kelime/Dk hızla ${elapsedSeconds} saniyede testi tamamladım! ⚡ Sen de hızını test et: https://dersolab.com/lab/turkce @dersolabegitim`

  const handleCopyShareText = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Reading Timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isReading && !finishedReading) {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isReading, finishedReading])

  // RSVP Word Flasher
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (mode === 'rsvp' && isReading && !finishedReading) {
      const delay = (60 / wpm) * 1000
      interval = setInterval(() => {
        setRsvpWordIndex((prev) => {
          if (prev + 1 >= words.length) {
            setIsReading(false)
            setFinishedReading(true)
            return prev
          }
          return prev + 1
        })
      }, delay)
    }
    return () => clearInterval(interval)
  }, [mode, isReading, finishedReading, wpm, words.length])

  const handleStart = () => {
    setIsReading(true)
    setFinishedReading(false)
    setShowTextAnyway(false)
    setElapsedSeconds(0)
    setRsvpWordIndex(0)
    setSelectedAnswer(null)
  }

  const handleFinishManual = () => {
    setIsReading(false)
    setFinishedReading(true)
    setShowTextAnyway(false)
  }

  const handleReset = () => {
    setIsReading(false)
    setFinishedReading(false)
    setShowTextAnyway(false)
    setElapsedSeconds(0)
    setRsvpWordIndex(0)
    setSelectedAnswer(null)
  }

  const handleModeChange = (newMode: 'normal' | 'bionic' | 'rsvp') => {
    setMode(newMode)
    handleReset()
  }

  const handleParagraphChange = (index: number) => {
    setSelectedParaIndex(index)
    handleReset()
  }


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* ── Banner: Net, Sade, Büyük Başlık ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Paragraf Hız Antrenörü
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Odaklanarak oku, süreni ölç ve ardından gelen kavrama sorusunu metne bakmadan yanıtla.
          </p>
        </div>

        {/* Live WPM & Timer Gauge */}
        <div className="flex items-center gap-6 bg-slate-950/90 p-4 px-6 rounded-2xl border border-slate-800 self-stretch md:self-auto justify-between md:justify-start shadow-inner">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Okuma Süresi</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{elapsedSeconds} sn</div>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Hız (Kelime / Dk)</span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {finishedReading ? actualWpm : isReading ? 'Ölçülüyor...' : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Paragraf Seçici Tabs & Okuma Modları ── */}
      <div className="space-y-4">
        {/* Metin Seçici Sekmeler */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm font-bold text-slate-300">Örnek Paragraflar:</span>
          <div className="flex items-center gap-2 overflow-x-auto gizli-kaydirma w-full sm:w-auto">
            {PARAGRAPHS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => handleParagraphChange(idx)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedParaIndex === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {p.category}
              </button>
            ))}
          </div>
        </div>

        {/* Okuma Modu Seçici (Normal -> Biyonik -> Kelime Akışı) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-300 mr-2">Okuma Modu:</span>
            {[
              { id: 'normal' as const, label: 'Normal Metin' },
              { id: 'bionic' as const, label: 'Biyonik Okuma' },
              { id: 'rsvp' as const, label: 'Kelime Akışı (RSVP)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === m.id
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'rsvp' && (
            <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
              <span className="font-semibold">Akış Hızı:</span>
              <input
                type="range"
                min="150"
                max="500"
                step="25"
                value={wpm}
                onChange={(e) => setWpm(parseInt(e.target.value))}
                className="w-28 accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono font-bold text-cyan-300 w-20">{wpm} WPM</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Reading Area: Kutucuk İçinde Açık Renk Tek Renk Zemin ── */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#F8FAFC] text-slate-900 border-2 border-slate-200/90 shadow-2xl space-y-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
        
        {/* Metin Başlığı ve Kelime Sayısı */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              {currentPara.category}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {currentPara.title}
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 font-mono bg-slate-200/80 px-3 py-1 rounded-full">
            {words.length} Kelime
          </span>
        </div>

        {/* Display Text by State: Soru çıktığında metin gizlenmeli kuralı */}
        {finishedReading && !showTextAnyway ? (
          /* Metin Gizlendi / Hafıza Kavrama Modu */
          <div className="my-auto py-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-inner">
              <EyeOff className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-xl font-black text-slate-900">
                Metin Tamamlandı ve Hafıza Testi İçin Gizlendi
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Okuduğunuzu aklınızda tutarak aşağıdaki kavrama sorusunu yanıtlayın.
              </p>
            </div>
            <button
              onClick={() => setShowTextAnyway(true)}
              className="text-xs font-bold text-cyan-700 hover:text-cyan-800 hover:underline flex items-center gap-1.5 pt-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Metni Tekrar Göster</span>
            </button>
          </div>
        ) : mode === 'rsvp' ? (
          /* RSVP Single Word Flasher */
          <div className="my-auto py-12 flex flex-col items-center justify-center">
            {isReading ? (
              <motion.div
                key={rsvpWordIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl sm:text-6xl font-black text-slate-950 tracking-wide font-mono"
              >
                {words[rsvpWordIndex]}
              </motion.div>
            ) : finishedReading ? (
              <div className="text-center text-emerald-700 font-bold text-lg">
                Metin Tamamlandı! Aşağıdaki Kavrama Sorusunu Cevaplayın 👇
              </div>
            ) : (
              <div className="text-slate-600 text-base sm:text-lg font-medium text-center">
                Kelime akışını başlatmak için aşağıdaki <strong className="text-slate-900">"Okumayı Başlat"</strong> butonuna tıklayın.
              </div>
            )}
          </div>
        ) : (
          /* Normal or Bionic Paragraph */
          <div className="text-lg sm:text-2xl leading-relaxed text-slate-800 tracking-normal font-sans py-2">
            {mode === 'bionic'
              ? words.map((w, idx) => (
                  <span key={idx}>{formatBionicWord(w)}</span>
                ))
              : currentPara.text}
          </div>
        )}

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-slate-200 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isReading && !finishedReading ? (
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Okumayı Başlat (Süre Ölç)</span>
              </button>
            ) : isReading ? (
              <button
                onClick={handleFinishManual}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Okumayı Bitirdim (Soruyu Aç)</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yeniden Başlat</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              title="Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {finishedReading && (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Okuma Tamamlandı: {elapsedSeconds} sn • {actualWpm} Kelime / Dk
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Kavrama Sorusu & Çözüm Bölümü: Daha Büyük ve Detaylı ── */}
      {finishedReading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl space-y-6 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-wider">
                Paragraf Kavrama ve Anlama Sorusu
              </span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Metne Bakmadan Cevaplayın
            </span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentPara.question}
          </h4>

          <div className="space-y-3">
            {currentPara.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx
              let buttonStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'

              if (selectedAnswer !== null) {
                if (opt.isCorrect) {
                  buttonStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                } else if (isSelected && !opt.isCorrect) {
                  buttonStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                } else {
                  buttonStyle = 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-50'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${buttonStyle}`}
                >
                  <span className="leading-snug">{opt.text}</span>
                  {selectedAnswer !== null && (
                    <span className="shrink-0 ml-4">
                      {opt.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Açıklama ve Sonuç Kartı: Büyük, Detaylı ve Vakit Kazandırıcı */}
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                {currentPara.options[selectedAnswer]?.isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-lg font-black">Harika! Doğru Cevap</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400">
                    <XCircle className="w-6 h-6" />
                    <span className="text-lg font-black">Tekrar İnceleyelim</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                  Detaylı Çözüm Açıklaması:
                </span>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {currentPara.explanation}
                </p>
              </div>

              {/* Performans Özeti */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Okuma Süresi</span>
                  <span className="text-base font-bold text-white font-mono">{elapsedSeconds} saniye</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Hız</span>
                  <span className="text-base font-bold text-cyan-400 font-mono">{actualWpm} Kelime / Dk</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Kavrama</span>
                  <span className={`text-base font-bold font-mono ${
                    currentPara.options[selectedAnswer]?.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {currentPara.options[selectedAnswer]?.isCorrect ? '%100 Doğru' : 'Geliştirilmeli'}
                  </span>
                </div>
              </div>

              {/* ── Sosyal Medya & Hikaye Paylaşım Kartı ── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-pink-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-400 text-xs font-bold">
                    <Share2 className="w-4 h-4 text-pink-400" />
                    <span>Hızını Arkadaşlarına Göster!</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Sonucunu hikayende paylaş, <strong className="text-white">@dersolabegitim</strong>'i etiketle!
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
                  <button
                    onClick={handleCopyShareText}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://www.instagram.com/dersolabegitim/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

              {/* Sonraki Metne Geçiş */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Farklı bir metinle hızını yeniden test etmek ister misin?
                </span>
                <button
                  onClick={() => handleParagraphChange((selectedParaIndex + 1) % PARAGRAPHS.length)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs sm:text-sm border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Sonraki Metne Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Teacher Consultation Link */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-slate-300 text-center sm:text-left">
              Paragraf çözme hızını ve anlama taktiklerini bire bir derste geliştirmek ister misin?
            </span>
            <Link
              href="/instructors?category=Sözel"
              className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 shrink-0"
            >
              <span>Türkçe Eğitmenleriyle Çalış</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  )
}
