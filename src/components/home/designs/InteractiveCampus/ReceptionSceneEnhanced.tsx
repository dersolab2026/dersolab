'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Coffee,
  CheckCircle2,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react'

interface ReceptionSceneEnhancedProps {
  onBack: () => void
  onGoToCorridor: () => void
}

export function ReceptionSceneEnhanced({ onBack, onGoToCorridor }: ReceptionSceneEnhancedProps) {
  const [mascotDialog, setMascotDialog] = useState<string>(
    'Merhaba! Ben DersoLab Akademi Rehberi. Laboratuvarlara geçmek için kapıya tıklayabilir veya bana merak ettiğin bir soruyu sorabilirsin!'
  )
  const [showCoffeeReward, setShowCoffeeReward] = useState(false)
  const [activeInfoModal, setActiveInfoModal] = useState<'parent' | 'instructor' | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const askMascot = (_question: string, answer: string) => {
    setMascotDialog(answer)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    })
  }

  const px = mousePos.x * 10
  const py = mousePos.y * 7

  return (
    <div
      className="relative min-h-[700px] sm:min-h-[820px] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_90px_rgba(0,0,0,0.95)] select-none bg-[#05070f]"
      onMouseMove={handleMouseMove}
    >
      {/* Fotogerçekçi Lobi Arka Planı — Parallax */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate(${px * -0.35}px, ${py * -0.25}px) scale(1.05)`,
          backgroundImage: 'url(/campus-reception-mascot.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.08s ease-out',
        }}
      />

      {/* Üst karartma */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-transparent to-slate-950/90 pointer-events-none" />
      {/* Alt sis */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      {/* Top Header & Breadcrumb */}
      <div className="relative z-20 p-5 sm:p-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Dışarı Çık (Bina Girişi)</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Coffee Easter Egg Button */}
          <button
            type="button"
            onClick={() => setShowCoffeeReward(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Danışma İkramı ☕</span>
          </button>
        </div>
      </div>

      {/* Mascot Interactive Dialog Station */}
      <div className="relative z-20 max-w-2xl mx-auto px-4 mt-2 mb-6">
        <div className="p-6 rounded-3xl bg-slate-950/95 border-2 border-amber-400/70 shadow-[0_0_50px_rgba(245,158,11,0.35)] backdrop-blur-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦊</span>
              <span className="text-xs font-bold text-amber-300 font-mono">DERSOLAB AKADEMİ REHBER TİLKİ</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              ● Canlı Danışma Aktif
            </span>
          </div>

          <p className="text-sm sm:text-base text-white font-serif leading-relaxed italic">
            "{mascotDialog}"
          </p>

          {/* Quick Mascot Questions */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-amber-200/80 block">Maskota Sor:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  askMascot(
                    '20 Dk Ücretsiz Ders',
                    'İlk seansın için hiçbir kredi kartı gerekmez! İstediğin öğretmeni seçip 20 dakikalık tanışma seansını hemen başlatabilirsin.'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-amber-500/20 border border-white/15 text-xs text-slate-200 hover:text-amber-200 transition-all cursor-pointer"
              >
                ❓ 20 Dk ücretsiz ders nasıl çalışır?
              </button>

              <button
                type="button"
                onClick={() =>
                  askMascot(
                    'Yanmayan Kredi',
                    'DersoLab’da satın aldığın ders kredileri asla ay sonunda silinmez veya yanmaz. Sınav hedefine kadar hesabında güvendedir.'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-amber-500/20 border border-white/15 text-xs text-slate-200 hover:text-amber-200 transition-all cursor-pointer"
              >
                ⏳ Ders kredilerim yanıyor mu?
              </button>

              <button
                type="button"
                onClick={() =>
                  askMascot(
                    'Öğretmen Kalitesi',
                    'Platformdaki her öğretmenimizin Boğaziçi, ODTÜ, İTÜ gibi köklü üniversite diplomaları ve pedagojik formasyonları tek tek tescillidir!'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-amber-500/20 border border-white/15 text-xs text-slate-200 hover:text-amber-200 transition-all cursor-pointer"
              >
                🎓 Öğretmenler ne kadar güvenilir?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3 Portals */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 pb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Student Lab Corridor Portal */}
        <button
          type="button"
          onClick={onGoToCorridor}
          className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-500 via-amber-600 to-rose-600 text-slate-950 font-bold border-2 border-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-105 transition-all text-left space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-black/20 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-slate-950" />
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/25 text-slate-950 font-extrabold">
              1:1 CANLI SEANSLAR
            </span>
          </div>
          <div>
            <h3 className="text-lg font-extrabold font-serif">Öğrenci Laboratuvarları</h3>
            <p className="text-xs text-slate-950/90 font-medium leading-snug">
              Matematik, Fizik, Kimya kapılarına git ve canlı öğretmen takvimlerini aç →
            </p>
          </div>
        </button>

        {/* Parent Info Desk */}
        <button
          type="button"
          onClick={() => setActiveInfoModal('parent')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-white border border-emerald-500/40 shadow-xl hover:scale-102 transition-all text-left space-y-3 cursor-pointer backdrop-blur-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Veli Masası
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Veli Bilgilendirme</h3>
            <p className="text-xs text-slate-300 font-light leading-snug">
              Onaylı öğretmen belgeleri, yazılı seans raporları ve yanmayan kredi güvencesi.
            </p>
          </div>
        </button>

        {/* Instructor Desk */}
        <button
          type="button"
          onClick={() => setActiveInfoModal('instructor')}
          className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-white border border-purple-500/40 shadow-xl hover:scale-102 transition-all text-left space-y-3 cursor-pointer backdrop-blur-xl group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
              Eğitmen Odası
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Eğitmen Başvurusu</h3>
            <p className="text-xs text-slate-300 font-light leading-snug">
              Otomatik takvim, hazır Meet odaları ve aylık düzenli banka IBAN hakedişi.
            </p>
          </div>
        </button>
      </div>

      {/* Coffee Easter Egg Reward Modal */}
      {showCoffeeReward && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-3xl bg-slate-950 border-2 border-amber-400 p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto text-3xl">
              ☕
            </div>
            <h3 className="text-xl font-bold text-white font-serif">Danışma İkramı Kazanıldı!</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              DersoLab lobimizi ziyaret ettiğiniz için teşekkürler! İlk 20 dakikalık seansınızın yanında <strong>Ücretsiz Deneme Sınavı Net Analizi</strong> hesabınıza tanımlandı.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowCoffeeReward(false)
                onGoToCorridor()
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
            >
              Harika, Laboratuvarlara Geç →
            </button>
          </div>
        </div>
      )}

      {/* Role Info Modal */}
      {activeInfoModal && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-950 border-2 border-amber-500/50 p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
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
