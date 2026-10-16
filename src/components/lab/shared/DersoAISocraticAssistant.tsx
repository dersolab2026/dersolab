'use client'

import React, { useState, useEffect } from 'react'
import {
  Bot,
  Sparkles,
  Send,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  RefreshCw,
} from 'lucide-react'
import { playClickSound, playSliderTick } from '@/lib/soundFx'

interface DersoAISocraticAssistantProps {
  branch: string
  moduleTitle: string
  currentState: Record<string, any>
  defaultQuestions?: string[]
}

interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

export function DersoAISocraticAssistant({
  branch,
  moduleTitle,
  currentState,
  defaultQuestions = [
    'Neden böyle oldu? Formülün mantığı nedir?',
    'LGS / YKS sınavında bu kısımdan nasıl tuzak soru gelir?',
    'Sonucu 2 katına çıkarmak için hangi parametreyi değiştirmeliyim?',
    'Günlük hayatta ve teknolojide bu prensip nerede kullanılır?',
  ],
}: DersoAISocraticAssistantProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [inputQuestion, setInputQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Merhaba! Ben DersoAI Sokratik Deney Asistanın. 🧠\nŞu an **${moduleTitle}** simülasyonundaki parametrelerini canlı olarak izliyorum. Değerleri değiştirdikçe sonuçların neden öyle çıktığını birlikte keşfedelim!`,
      timestamp: 'Şimdi',
    },
  ])

  // Generate dynamic live observation string based on currentState
  const liveObservationText = React.useMemo(() => {
    const entries = Object.entries(currentState)
    if (entries.length === 0) return 'Simülasyon başlatıldı, gözlem yapmaya hazırım.'

    const summary = entries
      .slice(0, 4)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ')
    return `Canlı Parametreler: [ ${summary} ]`
  }, [currentState])

  const handleAskQuestion = (qText: string) => {
    if (!qText.trim()) return
    playClickSound()

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: qText,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputQuestion('')
    setIsTyping(true)

    // Socratic response generator based on question & context
    setTimeout(() => {
      let aiResponse = ''
      const lower = qText.toLowerCase()

      if (lower.includes('neden') || lower.includes('mantık')) {
        aiResponse = `Harika bir soru! 🧐 Doğadaki bu olayı tek bir formül ezberlemek yerine sebep-sonuç ilişkisiyle düşün:\n\nŞu anki değerlerin (${liveObservationText}) incelendiğinde; bağımsız değişkeni artırdığında sistem bunu dengelemek için tepki verir. Sence girdi parametresini 2 katına çıkardığında çıktının değişme oranı doğrusal mı yoksa karesiyle mi orantılı? Simülasyon slider'ını bir adım kaydırıp test etmeyi dene!`
      } else if (lower.includes('lgs') || lower.includes('yks') || lower.includes('tuzak') || lower.includes('sınav')) {
        aiResponse = `🎯 **ÖSYM & MEB Soru Tuzağı Uyarısı:**\nSınavlarda genellikle "özkütle", "kütle" ve "hacim" veya "sıcaklık" ile "basınç" kavramlarını karıştırmanı beklerler. Özellikle 'Madde miktarı sabit tutulduğunda' ifadesine dikkat et!\n\nSimülasyonda bir değişkeni sabit tutup diğerini değiştirirken grafiğin eğiminin sana hangi sabiti verdiğini fark ettin mi?`
      } else if (lower.includes('2 kat') || lower.includes('değiştir') || lower.includes('nasıl')) {
        aiResponse = `⚡ **Hızlı Çözüm Taktisi:**\nSonucun değerini 2 katına çıkarmak için formüldeki pay ve payda ilişkisine bakmalısın. Eğer parametre paydaysa (ters orantı), değeri yarıya indirmelisin; paydaysa (doğru orantı) iki katına çıkarmalısın. Şimdi ekrandaki slider ile bunu dene ve sonucu gözlemle!`
      } else {
        aiResponse = `Çok isabetli bir sorgulama! 💡 **${moduleTitle}** konusunda bu durum ${branch} biliminin temel korunum yasalarıyla açıklanır.\n\nEkrandaki canlı göstergeleri incelediğinde, enerjinin veya dengenin nasıl korunduğunu görüyorsun. Bir sonraki adımda diğer parametreyi uç değerlere çekersen sence sistem nasıl davranır?`
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
      playSliderTick(520)
    }, 600)
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all">
      {/* Header bar */}
      <div
        onClick={() => {
          playClickSound()
          setIsOpen(!isOpen)
        }}
        className="p-4 bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">DersoAI Sokratik Deney Koçu</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Canlı Değişkenleri Okuyan Akıllı Rehber
            </div>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Live Sensor Capsule */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
            <BrainCircuit className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-mono truncate">
              {liveObservationText}
            </span>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-violet-400" />
                <span>DersoAI düşünüyor ve simülasyon verilerini analiz ediyor...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>Sokratik Sorularla Keşfet:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {defaultQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskQuestion(q)}
                  className="text-[11px] bg-slate-950 hover:bg-violet-950/50 hover:border-violet-500/40 border border-slate-800 text-slate-300 hover:text-violet-200 px-2.5 py-1.5 rounded-lg transition-all text-left cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAskQuestion(inputQuestion)
            }}
            className="flex items-center gap-2 pt-2"
          >
            <input
              type="text"
              placeholder="Simülasyon hakkında merak ettiğin bir soru sor..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim()}
              className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
