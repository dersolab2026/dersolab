'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Users,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react'

interface CampusReceptionSceneProps {
  onBack: () => void
  onGoToCorridor: () => void
}

export function CampusReceptionScene({ onBack, onGoToCorridor }: CampusReceptionSceneProps) {
  const [activeInfoModal, setActiveInfoModal] = useState<'parent' | 'instructor' | null>(null)

  return (
    <div className="relative min-h-[680px] sm:min-h-[780px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
      {/* Background Image: Grand Reception with Waving Fox Mascot */}
      <img
        src="/campus-reception-mascot.jpg"
        alt="DersoLab Danışma & Maskot"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle Lighting Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />

      {/* Top Header & Navigation */}
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Dışarı Çık (Bina Girişi)</span>
        </button>

        <span className="font-mono text-xs text-amber-200/90 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
          AŞAMA II: DANIŞMA & MASKOT LOBİSİ
        </span>
      </div>

      {/* Mascot Animated Speech Bubble */}
      <div className="relative z-10 max-w-xl mx-auto px-4 mt-2 mb-6">
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border-2 border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.3)] backdrop-blur-2xl text-center space-y-2.5 animate-float-slow">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold font-mono">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DERSOLAB REHBER TİLKİ:</span>
          </div>
          <p className="text-sm sm:text-base text-white font-medium leading-relaxed font-serif">
            "Merhaba! DersoLab Akademi Danışma Masası'na hoş geldin. Ben senin sanal rehberinim. Şimdi nereye geçmek
            istersin?"
          </p>
        </div>
      </div>

      {/* Interactive Reception Desk Portals */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Student Lab Corridor Portal */}
        <button
          type="button"
          onClick={onGoToCorridor}
          className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-500/90 via-amber-600 to-rose-600 text-slate-950 font-bold border-2 border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 transition-all text-left space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/20 text-slate-950">
              Popüler
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold font-serif">Öğrenci Laboratuvarları</h3>
            <p className="text-xs text-slate-900 font-medium leading-snug">
              Matematik, Fizik, Kimya kapılarına git ve canlı öğretmen takvimlerini aç →
            </p>
          </div>
        </button>

        {/* Parent Info Desk */}
        <button
          type="button"
          onClick={() => setActiveInfoModal('parent')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-950/85 hover:bg-slate-900/95 text-white border border-emerald-500/40 shadow-xl hover:scale-102 transition-all text-left space-y-3 cursor-pointer backdrop-blur-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Veli Masası
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-serif">Veli Bilgilendirme</h3>
            <p className="text-xs text-slate-300 font-light leading-snug">
              Onaylı öğretmen belgeleri, yazılı seans raporları ve yanmayan kredi güvencesi.
            </p>
          </div>
        </button>

        {/* Instructor Desk */}
        <button
          type="button"
          onClick={() => setActiveInfoModal('instructor')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-950/85 hover:bg-slate-900/95 text-white border border-purple-500/40 shadow-xl hover:scale-102 transition-all text-left space-y-3 cursor-pointer backdrop-blur-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
              Eğitmen Odası
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-serif">Eğitmen Başvurusu</h3>
            <p className="text-xs text-slate-300 font-light leading-snug">
              Otomatik takvim, hazır Meet odaları ve aylık düzenli banka IBAN hakedişi.
            </p>
          </div>
        </button>
      </div>

      {/* Info Modal Popup for Parent / Instructor */}
      {activeInfoModal && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-950 border-2 border-amber-500/50 p-6 sm:p-8 space-y-5 shadow-2xl">
            {activeInfoModal === 'parent' ? (
              <>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white font-serif">Veli Danışma Güvencesi</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <p>✓ <strong>%100 Onaylı Eğitmenler:</strong> Tüm öğretmenlerimizin diplomaları tescillidir.</p>
                  <p>✓ <strong>Yazılı Seans Raporu:</strong> Her dersten sonra öğretmenin değerlendirme notu iletilir.</p>
                  <p>✓ <strong>Süresiz Kredi:</strong> Satın aldığınız ders kredileri asla yanmaz.</p>
                </div>
                <div className="pt-2 flex gap-3">
                  <Link
                    href="/register?role=parent"
                    className="flex-1 py-3 text-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Veli Hesabı Oluştur
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal(null)}
                    className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Kapat
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-purple-400" />
                  <h3 className="text-xl font-bold text-white font-serif">Eğitmen Başvuru Odası</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <p>✓ <strong>Otomatik Google Meet:</strong> Rezervasyon anında ders odanız anında hazır.</p>
                  <p>✓ <strong>Düzenli IBAN Aktarımı:</strong> Ders ücretleriniz her ay hesabınıza aktarılır.</p>
                  <p>✓ <strong>Esnek Saatler:</strong> Müsait olduğunuz günleri siz belirlersiniz.</p>
                </div>
                <div className="pt-2 flex gap-3">
                  <Link
                    href="/register?role=instructor"
                    className="flex-1 py-3 text-center rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Eğitmen Başvurusu Yap
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveInfoModal(null)}
                    className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Kapat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
