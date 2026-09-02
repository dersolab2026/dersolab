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
} from 'lucide-react'
import type { LabType } from './CampusCorridorScene'

interface CampusLabSceneProps {
  labType: LabType
  onBack: () => void
}

const LAB_DATA: Record<
  LabType,
  {
    title: string
    code: string
    instructors: {
      id: string
      name: string
      title: string
      uni: string
      rating: string
      avatar: string
      slots: string[]
    }[]
  }
> = {
  matematik: {
    title: 'Matematik Laboratuvarı',
    code: 'MATH-101',
    instructors: [
      {
        id: '1',
        name: 'Dr. Selim Kaya',
        title: 'TYT-AYT Matematik & Geometri Uzmanı',
        uni: 'Boğaziçi Üniversitesi / Matematik',
        rating: '4.98 (142 Seans)',
        avatar: '👨‍🏫',
        slots: ['Pazartesi 19:00', 'Salı 20:00', 'Perşembe 18:30', 'Cumartesi 11:00'],
      },
      {
        id: '2',
        name: 'Merve Hoca',
        title: 'Türev, İntegral & LGS Koçu',
        uni: 'ODTÜ / Matematik Öğretmenliği',
        rating: '4.95 (98 Seans)',
        avatar: '👩‍🏫',
        slots: ['Çarşamba 19:00', 'Cuma 18:00', 'Pazar 14:00'],
      },
    ],
  },
  fizik: {
    title: 'Fizik Laboratuvarı',
    code: 'PHYS-201',
    instructors: [
      {
        id: '3',
        name: 'Ahmet Eren',
        title: 'Mekanik, Elektrik & Modern Fizik',
        uni: 'İTÜ / Fizik Mühendisliği',
        rating: '4.99 (110 Seans)',
        avatar: '👨‍🔬',
        slots: ['Salı 18:00', 'Perşembe 19:30', 'Cumartesi 15:00'],
      },
    ],
  },
  kimya: {
    title: 'Kimya Laboratuvarı',
    code: 'CHEM-301',
    instructors: [
      {
        id: '4',
        name: 'Zeynep Hoca',
        title: 'Organik Kimya & AYT Kimya',
        uni: 'Hacettepe Üniversitesi / Kimya',
        rating: '4.96 (85 Seans)',
        avatar: '👩‍🔬',
        slots: ['Pazartesi 20:00', 'Çarşamba 18:30', 'Pazar 16:00'],
      },
    ],
  },
  biyoloji: {
    title: 'Biyoloji Laboratuvarı',
    code: 'BIO-401',
    instructors: [
      {
        id: '5',
        name: 'Dr. Burak Demir',
        title: 'Kalıtım & İnsan Fizyolojisi',
        uni: 'İstanbul Tıp / Biyoloji',
        rating: '4.97 (92 Seans)',
        avatar: '👨‍⚕️',
        slots: ['Salı 19:00', 'Cuma 20:00', 'Cumartesi 13:00'],
      },
    ],
  },
}

export function CampusLabScene({ labType, onBack }: CampusLabSceneProps) {
  const data = LAB_DATA[labType] || LAB_DATA.matematik
  const [selectedInstructor, setSelectedInstructor] = useState(data.instructors[0])
  const [selectedSlot, setSelectedSlot] = useState(selectedInstructor.slots[0])

  return (
    <div className="relative min-h-[680px] sm:min-h-[780px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
      {/* Background: Classroom with Blackboard */}
      <img
        src="/campus-classroom-chalkboard.jpg"
        alt="DersoLab Laboratuvar & Kara Tahta"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />

      {/* Top Header */}
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Koridora Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-200/90 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
            {data.code} · {data.title.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Classroom Blackboard & Calendar Station */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8 grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Instructor Avatars */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono text-amber-300 font-bold block">
            ✦ LABORATUVAR EĞİTMENLERİ:
          </span>

          <div className="space-y-3">
            {data.instructors.map((ins) => {
              const isSelected = selectedInstructor.id === ins.id
              return (
                <button
                  key={ins.id}
                  type="button"
                  onClick={() => {
                    setSelectedInstructor(ins)
                    setSelectedSlot(ins.slots[0])
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-black border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-102'
                      : 'bg-black/70 border-white/10 hover:border-amber-500/30 text-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl">
                    {ins.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-serif truncate">{ins.name}</h4>
                      <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        4.9
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">{ins.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{ins.uni}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Live Interactive Chalkboard Weekly Calendar */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-950/95 border-2 border-amber-500/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-3xl space-y-6">
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

            {/* Time Slots on Chalkboard */}
            <div className="space-y-3">
              <span className="text-xs text-slate-300 block">Uygun Saatlerden Birini Seçin:</span>
              <div className="grid grid-cols-2 gap-2.5">
                {selectedInstructor.slots.map((slot) => {
                  const isSlotActive = selectedSlot === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-between ${
                        isSlotActive
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-102'
                          : 'bg-black/60 text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
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

            {/* Selected Booking Summary */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Seçilen Eğitmen & Saat:</span>
                <span className="font-bold text-amber-300">
                  {selectedInstructor.name} ({selectedSlot})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Bağlantı Türü:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  Google Meet HD (1:1 Canlı)
                </span>
              </div>
            </div>

            {/* Final Action Button */}
            <Link
              href={`/demo-ders?instructor=${encodeURIComponent(selectedInstructor.name)}&slot=${encodeURIComponent(selectedSlot)}`}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-bold text-sm shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Bu Seansı 20 Dk Ücretsiz Başlat</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
