'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Star,
  Award,
  ArrowRight,
  HelpCircle,
  Zap,
  Mic,
  Settings,
  PhoneOff,
} from 'lucide-react'
import { campusSound } from './CampusSoundEngine'
import type { LabType } from './CampusCorridorScene'

interface LabSceneEnhancedProps {
  labType: LabType
  onBack: () => void
}

const LAB_DATA: Record<
  LabType,
  {
    title: string
    code: string
    chalkFormula: string
    chalkExplanation: string
    instructors: {
      id: string
      name: string
      title: string
      uni: string
      rating: string
      avatar: string
      slots: string[]
      bio: string
    }[]
  }
> = {
  matematik: {
    title: 'Matematik Laboratuvarı',
    code: 'MATH-101',
    chalkFormula: '∫ (3x² + 2x - 5) dx = x³ + x² - 5x + C',
    chalkExplanation: 'Türev ve İntegral sorularını ezberletmeden, geometrik mantığıyla kavratıyoruz.',
    instructors: [
      {
        id: '1',
        name: 'Dr. Selim Kaya',
        title: 'TYT-AYT Matematik & Geometri Uzmanı',
        uni: 'Boğaziçi Üniversitesi / Matematik',
        rating: '4.98 (142 Seans)',
        avatar: '👨‍🏫',
        slots: ['Pazartesi 19:00', 'Salı 20:00', 'Perşembe 18:30', 'Cumartesi 11:00'],
        bio: '12 yıllık sınav tecrübesi; derece öğrencilerinin türev-integral koçu.',
      },
      {
        id: '2',
        name: 'Merve Hoca',
        title: 'LGS & Fonksiyonlar Koçu',
        uni: 'ODTÜ / Matematik Öğretmenliği',
        rating: '4.95 (98 Seans)',
        avatar: '👩‍🏫',
        slots: ['Çarşamba 19:00', 'Cuma 18:00', 'Pazar 14:00'],
        bio: 'Yeni nesil hikayeli matematik sorularında pratik çözüm stratejileri.',
      },
    ],
  },
  fizik: {
    title: 'Fizik Laboratuvarı',
    code: 'PHYS-201',
    chalkFormula: 'F_net = m · a ⟹ W = ΔE_k = 1/2 · m · (v₂² - v₁²)',
    chalkExplanation: 'Kuvvet, hareket ve elektrik devrelerini simülasyonlarla somutlaştırıyoruz.',
    instructors: [
      {
        id: '3',
        name: 'Ahmet Eren',
        title: 'Mekanik & Modern Fizik',
        uni: 'İTÜ / Fizik Mühendisliği',
        rating: '4.99 (110 Seans)',
        avatar: '👨‍🔬',
        slots: ['Salı 18:00', 'Perşembe 19:30', 'Cumartesi 15:00'],
        bio: 'Fizik formüllerini ezberletmeden simülasyonla zihne kazıma yöntemi.',
      },
    ],
  },
  kimya: {
    title: 'Kimya Laboratuvarı',
    code: 'CHEM-301',
    chalkFormula: 'P · V = n · R · T ⟹ pH = -log[H₃O⁺] = 7.00',
    chalkExplanation: 'Organik kimya reaksiyonları ve gaz hesaplamalarında nokta atışı çözümler.',
    instructors: [
      {
        id: '4',
        name: 'Zeynep Hoca',
        title: 'Organik Kimya & AYT Kimya',
        uni: 'Hacettepe Üniversitesi / Kimya',
        rating: '4.96 (85 Seans)',
        avatar: '👩‍🔬',
        slots: ['Pazartesi 20:00', 'Çarşamba 18:30', 'Pazar 16:00'],
        bio: 'ÖSYM’nin en çok sorduğu organik bileşikler ve tepkime mekanizmaları.',
      },
    ],
  },
  biyoloji: {
    title: 'Biyoloji Laboratuvarı',
    code: 'BIO-401',
    chalkFormula: '6CO₂ + 6H₂O + Işık ⟶ C₆H₁₂O₆ + 6O₂',
    chalkExplanation: 'Sistemler ve kalıtım soy ağaçlarını görsel zihin haritalarıyla pekiştiriyoruz.',
    instructors: [
      {
        id: '5',
        name: 'Dr. Burak Demir',
        title: 'Kalıtım & İnsan Fizyolojisi',
        uni: 'İstanbul Tıp / Biyoloji',
        rating: '4.97 (92 Seans)',
        avatar: '👨‍⚕️',
        slots: ['Salı 19:00', 'Cuma 20:00', 'Cumartesi 13:00'],
        bio: 'Tıp fakültesi hedefine yönelik derinlemesine sistemler anlatımı.',
      },
    ],
  },
}

export function LabSceneEnhanced({ labType, onBack }: LabSceneEnhancedProps) {
  const data = LAB_DATA[labType] || LAB_DATA.matematik
  const [selectedInstructor, setSelectedInstructor] = useState(data.instructors[0])
  const [selectedSlot, setSelectedSlot] = useState(selectedInstructor.slots[0])
  const [chalkboardMode, setChalkboardMode] = useState<'calendar' | 'formula'>('calendar')

  const handleInstructorSelect = (ins: typeof selectedInstructor) => {
    campusSound.playChalkTap()
    setSelectedInstructor(ins)
    setSelectedSlot(ins.slots[0])
  }

  const handleSlotSelect = (slot: string) => {
    campusSound.playChalkTap()
    setSelectedSlot(slot)
  }

  return (
    <div className="relative min-h-[720px] sm:min-h-[840px] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_100px_rgba(0,0,0,0.95)] select-none">
      {/* Background Image: High-Tech Classroom with Blackboard */}
      <img
        src="/campus-classroom-chalkboard.jpg"
        alt="DersoLab Laboratuvar & Kara Tahta"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-20 p-5 sm:p-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Koridora Dön</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Toggle Blackboard View */}
          <button
            type="button"
            onClick={() => {
              campusSound.playChalkTap()
              setChalkboardMode(chalkboardMode === 'calendar' ? 'formula' : 'calendar')
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-mono font-bold transition-all cursor-pointer backdrop-blur-xl shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{chalkboardMode === 'calendar' ? 'Kara Tahta Formül Modu ✏️' : 'Eğitmen Takvimini Göster 📅'}</span>
          </button>
        </div>
      </div>

      {/* Main Classroom Layout */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 pb-8 grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Teacher Roster */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-black/85 border border-amber-500/40 backdrop-blur-xl space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              {data.code} // AKTİF LABORATUVAR
            </span>
            <h3 className="text-xl font-bold text-white font-serif">{data.title}</h3>
            <p className="text-xs text-slate-300 font-light">{data.chalkExplanation}</p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-amber-300 font-bold block">
              ✦ LABORATUVAR EĞİTMENLERİ:
            </span>

            {data.instructors.map((ins) => {
              const isSelected = selectedInstructor.id === ins.id
              return (
                <button
                  key={ins.id}
                  type="button"
                  onClick={() => handleInstructorSelect(ins)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/25 via-slate-900 to-black border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-102'
                      : 'bg-black/80 border-white/10 hover:border-amber-500/40 text-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shrink-0">
                    {ins.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-serif truncate">{ins.name}</h4>
                      <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        {ins.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 truncate">{ins.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{ins.uni}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Interactive Blackboard & Calendar / Meet Simulator */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-950/95 border-2 border-amber-500/50 p-6 sm:p-8 shadow-[0_0_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl space-y-5">
            {chalkboardMode === 'calendar' ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-serif font-bold text-amber-300">
                      {selectedInstructor.name} · Canlı Seans Takvimi
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    20 Dk Ücretsiz Seans Açık
                  </span>
                </div>

                {/* Simulated Teacher Greeting */}
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3 shadow-inner">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg shrink-0">
                    {selectedInstructor.avatar}
                  </div>
                  <p className="text-xs text-slate-200 leading-snug">
                    "{selectedInstructor.bio} İstediğin saat dilimini seç, Google Meet üzerinden 1:1 canlı başlayalım!"
                  </p>
                </div>

                {/* Interactive Time Slots on Chalkboard */}
                <div className="space-y-2.5">
                  <span className="text-xs text-amber-200 font-semibold block">Uygun Saat Dilimini Seçin:</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedInstructor.slots.map((slot) => {
                      const isSlotActive = selectedSlot === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3.5 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-between ${
                            isSlotActive
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.7)] scale-102'
                              : 'bg-black/70 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {slot}
                          </span>
                          {isSlotActive && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Simulated Live Google Meet Room Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-black to-slate-900 border border-emerald-500/40 space-y-3 text-xs shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-emerald-400 font-bold">GOOGLE MEET HD ODA ÖNİZLEMESİ</span>
                    </div>
                    <span className="font-mono text-slate-400">1:1 ŞİFRELİ SEANS</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Öğretmen & Saat:</span>
                    <span className="font-bold text-amber-300 font-mono">
                      {selectedInstructor.name} · {selectedSlot}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                    <span>Ses & Görüntü: Hazır ✓</span>
                    <span>İnteraktif Beyaz Tahta: Aktif ✓</span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <Link
                  href={`/demo-ders?instructor=${encodeURIComponent(selectedInstructor.name)}&slot=${encodeURIComponent(selectedSlot)}`}
                  className="group relative w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-extrabold text-sm shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-102 active:scale-98 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Bu Seansı 20 Dk Ücretsiz Başlat</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              /* Chalkboard Formula Mode */
              <div className="p-6 rounded-2xl bg-black border border-amber-500/40 space-y-4 text-center">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                  KARA TAHTA ÇÖZÜM MODU
                </span>
                <div className="p-6 rounded-xl bg-slate-950 border border-white/10 font-mono text-base sm:text-lg text-emerald-300 tracking-wider shadow-inner">
                  {data.chalkFormula}
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  "DersoLab'da her seans interaktif dijital tahta üzerinde formülleri canlı çözerek işlenir."
                </p>
                <button
                  type="button"
                  onClick={() => {
                    campusSound.playChalkTap()
                    setChalkboardMode('calendar')
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  ← Eğitmen Takvimine Geri Dön
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
