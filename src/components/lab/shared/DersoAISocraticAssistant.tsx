'use client'

import React, { useState } from 'react'
import {
  Bot,
  Sparkles,
  Send,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  RotateCcw,
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

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-black text-violet-200">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={idx}>{part}</span>
  })
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
  const initialMessage: ChatMessage = {
    id: 'init-1',
    sender: 'ai',
    text: `Merhaba! Ben DersoAI Sokratik Deney Koçun. 🧠\nŞu an **${moduleTitle}** simülasyonundaki parametrelerini canlı olarak izliyorum. Değerleri değiştirdikçe sonuçların neden öyle çıktığını birlikte keşfedelim!`,
    timestamp: 'Şimdi',
  }

  const [isOpen, setIsOpen] = useState(true)
  const [inputQuestion, setInputQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])

  // Generate dynamic live observation string based on currentState
  const liveObservationText = React.useMemo(() => {
    const entries = Object.entries(currentState || {})
    if (entries.length === 0) return 'Simülasyon başlatıldı, gözlem yapmaya hazırım.'

    const summary = entries
      .slice(0, 5)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ')
    return `Canlı Parametreler: [ ${summary} ]`
  }, [currentState])

  const handleResetChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    playClickSound()
    setMessages([initialMessage])
  }

  const handleAskQuestion = async (qText: string) => {
    if (!qText.trim() || isTyping) return
    playClickSound()

    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: qText.trim(),
      timestamp: nowTime,
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInputQuestion('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/ai/lab-socratic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          moduleTitle,
          currentState,
          question: qText.trim(),
          history: updatedMessages.slice(-5).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      })

      const data = await response.json()
      const aiReplyText =
        data?.reply ||
        `Çok isabetli bir sorgulama! 💡 **${moduleTitle}** deneyinde şu anki parametrelerin (${liveObservationText}) üzerinden bir değişkeni sabit tutup diğerini değiştirdiğinde sistemin nasıl dengelendiğini gözlemle.`

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
      playSliderTick(520)
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Harika bir soru! 🧐 **${moduleTitle}** simülasyonundaki canlı değerlerin (${liveObservationText}) incelendiğinde; bağımsız değişkeni artırdığında çıktının doğrusal mı yoksa karesiyle mi değiştiğini slider'ı bir adım kaydırarak test etmeyi dene!`,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsTyping(false)
    }
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
              <span className="px-1.5 py-0.5 rounded-md bg-violet-500/20 border border-violet-500/30 text-[10px] font-bold text-violet-300">
                Gemini AI
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Canlı Değişkenleri Okuyan Akıllı Sokratik Rehber
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleResetChat}
              title="Sohbeti Sıfırla"
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/70 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
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
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
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
                  {renderFormattedText(m.text)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic p-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-violet-400" />
                <span>DersoAI canlı simülasyon parametrelerini analiz ediyor...</span>
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
                  disabled={isTyping}
                  onClick={() => handleAskQuestion(q)}
                  className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-violet-950/50 text-slate-300 hover:text-violet-200 border border-slate-800 hover:border-violet-500/40 transition-all disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Question Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAskQuestion(inputQuestion)
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isTyping}
              placeholder="Deneydeki değişkenler hakkında soru sor..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isTyping || !inputQuestion.trim()}
              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sor</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
