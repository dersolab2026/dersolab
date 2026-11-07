import Link from 'next/link'
import { ShieldCheck, Sparkles, Calculator } from 'lucide-react'
import { InstructorCard } from '@/components/marketplace/InstructorCard'
import { SubjectFilter } from '@/components/marketplace/SubjectFilter'
import { getInstructors } from '@/lib/marketplace/get-instructors'
import { getNextAvailableSlots } from '@/lib/availability/get-next-slots'

interface InstructorsPageProps {
  searchParams: Promise<{ subject?: string; category?: string }>
}

export default async function InstructorsPage({ searchParams }: InstructorsPageProps) {
  const { subject, category } = await searchParams
  const instructors = await getInstructors({ subject, category })
  const nextSlots = await getNextAvailableSlots(
    instructors.filter((i) => i.isCalendarConnected).map((i) => i.userId),
  )

  return (
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full relative">
      <div className="relative z-10 mx-auto max-w-5xl space-y-6 p-5 py-10">
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-black text-white leading-snug">
              Eğitmenler
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              Alanında uzman eğitmenleri inceleyin, hedeflerinize uygun dersi hemen başlatın.
            </p>
          </div>
          <Link
            href="/hesaplama"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-black transition-all shrink-0"
          >
            <Calculator className="w-4 h-4" />
            <span>Hedef Net & Sıralama Simülatörü</span>
          </Link>
        </div>

        {/* Hoş Geldin Paketi Vurgusu */}
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-7 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FA89E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#6FA89E]/20 text-[#6FA89E] border border-[#6FA89E]/30 text-xs font-bold">
              🎁 HOŞ GELDİN PAKETİ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">İlk Tanışma Dersiniz Bizden Hediye</h2>
            <p className="text-sm font-semibold text-slate-400 max-w-xl">
              Kredi harcamadan ve hiçbir kart bilgisi girmeden eğitmeninizle tanışın, hedeflerinizi birlikte planlayın.
            </p>
          </div>
          <a
            href="/demo-ders"
            className="relative z-10 shrink-0 inline-flex items-center justify-center bg-[#DD7B3A] text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-[#DD7B3A]/90 transition-all shadow-[0_0_15px_rgba(221,123,58,0.3)]"
          >
            Ücretsiz Dersi Başlat →
          </a>
        </div>

        {/* %100 Eğitmen Değişim Garantisi & Yanmayan Kredi Güvencesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                %100 Eğitmen Değişim Garantisi
              </p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">
                Ders kredileriniz tek bir öğretmene kilitli değildir; dilediğiniz zaman farklı branş veya eğitmenlerle kullanabilirsiniz.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/15 p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-amber-300 uppercase tracking-wide">
                Zorunlu Aylık Abonelik Yok, Krediler Yanmaz
              </p>
              <p className="text-xs font-medium text-slate-300 mt-0.5">
                Aldığınız kredi paketleri dönem boyunca geçerlidir; dersten 24 saat öncesine kadar yapılan iptallerde krediniz anında iade edilir.
              </p>
            </div>
          </div>
        </div>

        <SubjectFilter activeSubject={subject} activeCategory={category} />

        {instructors.length === 0 ? (
          <p className="font-sans font-semibold text-slate-400">Bu branşta henüz eğitmen bulunmuyor.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <InstructorCard
                key={instructor.userId}
                instructor={instructor}
                nextSlot={nextSlots.get(instructor.userId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
