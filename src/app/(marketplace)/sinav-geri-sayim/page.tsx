import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { EXAM_TYPE_LABELS, type ExamType } from '@/lib/exams/scoring'
import { kalanGun } from '@/lib/coaching/streak'

export const metadata: Metadata = {
  title: 'Sınava Kaç Gün Kaldı? · YKS, LGS Geri Sayım | DersoLab',
  description:
    'TYT, AYT, YDT ve LGS sınavlarına kaç gün kaldığını gör. Tarihler ÖSYM ve MEB duyurularına göre güncelleniyor.',
}

// Tarihler veritabanindan geliyor ve gun gectikce degisiyor; sayfa her
// istekte yeniden uretiliyor.
export const dynamic = 'force-dynamic'

export default async function GeriSayimPage() {
  const supabase = await createClient()
  const { data: tarihler } = await supabase
    .from('exam_dates')
    .select('exam_type, label, exam_date, is_official')
    .eq('is_public', true)
    .order('exam_date')

  const bugun = new Date().toISOString().slice(0, 10)

  const kartlar = (tarihler ?? [])
    .map((t) => ({
      ...t,
      kalan: kalanGun(t.exam_date, bugun),
    }))
    .filter((t) => t.kalan !== null)

  const resmiOlmayanVar = kartlar.some((k) => !k.is_official)

  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl space-y-6 p-5 py-10">
        <div className="rounded-2xl border-4 border-[#1B2430] bg-[#F4F1E8] p-6 shadow-[0_8px_0_#1B2430] sm:p-8">
          <h1 className="font-sans text-2xl font-black leading-snug text-[#1B2430] sm:text-4xl">
            Sınava Kaç Gün Kaldı?
          </h1>
          <p className="mt-2 font-sans font-semibold text-[#1B2430]">
            TYT, AYT, YDT ve LGS için geri sayım.
          </p>
        </div>

        {kartlar.length === 0 ? (
          <div className="rounded-2xl border-4 border-[#1B2430] bg-[#F4F1E8] p-6 shadow-[0_8px_0_#1B2430]">
            <p className="font-semibold text-[#1B2430]">
              Yaklaşan sınav tarihi henüz girilmemiş.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {kartlar.map((k) => (
              <div key={`${k.exam_type}-${k.label}`}
                className="rounded-2xl border-4 border-[#1B2430] bg-[#F4F1E8] p-6 text-center shadow-[0_8px_0_#1B2430]">
                <p className="text-sm font-black uppercase tracking-wide text-[#1B2430]/60">
                  {EXAM_TYPE_LABELS[k.exam_type as ExamType] ?? k.exam_type.toUpperCase()} · {k.label}
                </p>
                <p className="my-1 font-sans text-5xl font-black tabular-nums text-[#DD7B3A]">
                  {k.kalan}
                </p>
                <p className="font-bold text-[#1B2430]">gün kaldı</p>
                <p className="mt-2 text-sm font-semibold text-[#1B2430]/70">
                  {new Date(k.exam_date + 'T00:00:00Z').toLocaleDateString('tr-TR', {
                    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
                  })}
                  {!k.is_official && (
                    <span className="ml-2 inline-block rounded border-2 border-[#1B2430] bg-[#E8C468] px-1.5 text-xs font-bold text-[#1B2430]">
                      tahmini
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        {resmiOlmayanVar && (
          <div className="rounded-2xl border-4 border-[#1B2430] bg-[#F4F1E8] p-5 shadow-[0_8px_0_#1B2430]">
            <p className="text-sm font-semibold text-[#1B2430]/80">
              <strong>&quot;Tahmini&quot;</strong> etiketli tarihler resmî değildir. ÖSYM 2027 sınav
              takvimini henüz açıklamadı; bu tarihler önceki yılların düzenine göre
              öngörülmüştür. Resmî takvim açıklandığında burası güncellenecek.
            </p>
          </div>
        )}

        <div className="rounded-2xl border-4 border-[#1B2430] bg-[#F4F1E8] p-6 text-center shadow-[0_8px_0_#1B2430]">
          <p className="font-sans text-lg font-bold text-[#1B2430]">
            Kalan günü nasıl kullanacağını bilmek, kaç gün kaldığını bilmekten önemli.
          </p>
          <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
            DersoLab&apos;da denemelerini takip et, koçunla haftalık plan yap.
          </p>
          <Link
            href="/register"
            className="mt-4 inline-block rounded-xl border-4 border-[#1B2430] bg-[#DD7B3A] px-8 py-3 text-lg font-bold text-[#F4F1E8] shadow-[0_4px_0_#1B2430] transition-all active:translate-y-1 active:shadow-none"
          >
            Ücretsiz Kaydolun
          </Link>
        </div>
      </div>
    </div>
  )
}
