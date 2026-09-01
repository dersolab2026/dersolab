'use client'

import {
  Video,
  Compass,
  ClipboardCheck,
  Coins,
  ShieldCheck,
  LineChart,
  CalendarCheck,
  Wallet,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

export function PersonaFeatures({ persona }: { persona: PersonaType }) {
  if (persona === 'student') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase mb-2">
            Öğrenci Deneyimi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Başarı İçin İhtiyacın Olan Tüm Eğitim Ekosistemi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Yalnızca konu anlatımı değil, hedefe ulaştıran eksiksiz bir öğrenme deneyimi.
          </p>
        </div>

        {/* Luxury Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Bento Card 1 (Large - Span 2) */}
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                Google Meet 1:1
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Bire Bir Canlı Online Dersler</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Eğitmenin açık saatlerinden dilediğin anı seç. Rezervasyon anında Google Meet linkin oluşturulur, takvimine
              ve e-postana davet düşer. Ekran paylaşımı ve dijital tahta ile interaktif ders yap.
            </p>
            {/* Visual Micro Widget */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-700">Canlı HD Ders Odası · Google Meet</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">20 Dk Tanışma Paketi</span>
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bireysel Koçluk & Rehberlik</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Haftalık çalışma temposu, deneme net analizleri, sınav stratejisi ve bölüm tercihinde uzman koçunla adım
              adım ilerle.
            </p>
          </div>

          {/* Bento Card 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 mb-5">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ödev ve Dijital Not Arşivi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Öğretmeninin verdiği ödevleri yükle, geri bildirim al. İşlenen tüm derslerin notları hesabında güvenle
              saklanır.
            </p>
          </div>

          {/* Bento Card 4 (Span 2) */}
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <Coins className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                Süresiz Bakiye
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Esnek Ders Kredisi — Asla Yanmaz</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Aylık zorunlu abonelikler veya yanan paketler yok. İhtiyacın kadar ders kredisi alırsın; kullanmadığın
              krediler dilediğin tarihe kadar hesabında hazır bekler.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (persona === 'parent') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase mb-2">
            Veli Güvencesi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Eğitimde Sıfır Belirsizlik, Yüksek Standart
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Çocuğunuzun geleceğine yatırım yaparken tam kontrol ve şeffaflık sağlayın.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                %100 Doğrulanmış
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belgeleri Onaylanmış Seçkin Öğretmenler</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              Platformumuzda ders veren her eğitmenin diploması, akademik geçmişi ve uzmanlığı yönetim ekibimizce tek tek
              doğrulanır. Çocuğunuzu yalnızca yetkinliği tescilli öğretmenlere emanet edersiniz.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Akademik referans ve kimlik doğrulama süzgecinden geçmiş kadro</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-5">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Veli İzleme Paneli</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Çocuğunuzun kaç ders yaptığını, hangi ödevleri tamamladığını ve deneme netlerini tek ekrandan izleyin.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Öğretmen Değerlendirmeleri</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Her ders sonrası öğretmenin öğrenci için yazdığı katılım, odak ve gelişim notlarını doğrudan okuyun.
            </p>
          </div>

          <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <Coins className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                Güvenli Bütçe
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Esnek ve Yanmayan Paket Güvencesi</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Satın aldığınız ders paketleri süre sınırlaması olmaksızın çocuğunuzun hesabında güvendedir. Taahhüt veya
              otomatik çekim sürprizi yaşamazsınız.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Instructor
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
        <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase mb-2">
          Eğitmen Ayrıcalıkları
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sadece Dersinize Odaklanın, Operasyonu Bize Bırakın
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Takvim çakışmaları, link gönderme ve ödeme takibiyle uğraşmadan profesyonelce ders verin.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              Otomatik Senkronizasyon
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Akıllı Ajanda ve Google Meet Entegrasyonu</h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
            Müsait olduğunuz saat aralıklarını panelden seçin. Öğrenci rezervasyon yaptığında Google Takviminize anında
            işlenir ve Google Meet toplantı linki otomatik oluşturulup iki tarafa da iletilir.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sıfır takvim çakışması ve otomatik ders hatırlatmaları</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-5">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Zamanında ve Güvenli Hakediş</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tamamlanan tüm derslerinizin ödemesi her ay düzenli ve şeffaf biçimde doğrudan banka (IBAN) hesabınıza aktarılır.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-5">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Hazır Dijital Ders Araçları</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Öğrencilerinize doğrudan panelden ödev atayın, teslimleri inceleyin ve ders notlarınızı tek tıkla paylaşın.
          </p>
        </div>

        <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(15,23,42,0.08)] transition-all">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200/60">
              Geniş Ağ
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Türkiye Genelinden Öğrenci Portföyü</h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Bireysel tanıtım veya pazarlama zahmetine girmeden, alanınızda ders almak isteyen binlerce öğrenciye doğrudan
            profilinizle ulaşın.
          </p>
        </div>
      </div>
    </div>
  )
}
