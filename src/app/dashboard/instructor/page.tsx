import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getInstructorBookings } from '@/lib/bookings/get-instructor-bookings'
import { getLessonMaterialsForBookings } from '@/lib/lessons/get-lesson-materials'
import { InstructorBookingListItem } from '@/components/instructor/InstructorBookingListItem'
import { RejectedInstructorBanner } from '@/components/instructor/RejectedInstructorBanner'
import { OnboardingChecklist } from '@/components/instructor/OnboardingChecklist'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

export default async function InstructorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('avatar_url').eq('id', user.id).single()
  const { data: instructorRow } = await supabase
    .from('instructors').select('approval_status, calendar_connected, approval_note, subjects, bio, intro_video_url').eq('user_id', user.id).single()
  const { count: availabilityCount } = await supabase
    .from('instructor_availability').select('id', { count: 'exact', head: true })
    .eq('instructor_id', user.id).eq('is_active', true)
  const bookings = await getInstructorBookings(user.id)

  const needsAction = bookings.filter((b) => b.status === 'scheduled' && new Date(b.startTime) < new Date())
  const upcoming = bookings.filter((b) => b.status === 'scheduled' && new Date(b.startTime) >= new Date())
  const past = bookings.filter((b) => b.status !== 'scheduled')
  const materialsByBooking = await getLessonMaterialsForBookings(bookings.map((b) => b.id))

  return (
    <DashboardPageShell title="Derslerim" description="Rezervasyonlarını buradan yönetebilirsin.">
      {instructorRow?.approval_status === 'pending' && (
        <div className={`${PIXEL_CARD} p-3`}>
          <p className="text-sm font-semibold text-[#1B2430]">Profilin henüz onay bekliyor, onaylanana kadar öğrenciler seni göremez.</p>
        </div>
      )}
      {instructorRow?.approval_status === 'rejected' && (
        <RejectedInstructorBanner approvalNote={instructorRow.approval_note} />
      )}
      {instructorRow?.approval_status === 'approved' && !instructorRow.calendar_connected && (
        <div className={`${PIXEL_CARD} p-3`}>
          <p className="text-sm font-semibold text-[#1B2430]">
            Öğrenciler rezervasyon yapabilsin diye önce{' '}
            <Link href="/dashboard/instructor/settings" className="underline text-[#9C4A0C]">Google Takvimini bağlaman</Link> gerekiyor.
          </p>
        </div>
      )}

      {instructorRow?.approval_status === 'approved' && (
        <OnboardingChecklist
          steps={[
            { label: 'Google Takvimini Bağla', tip: 'Rezervasyon alabilmek için zorunludur', href: '/dashboard/instructor/settings', done: !!instructorRow.calendar_connected },
            { label: 'Müsaitlik Saatlerini Belirle', tip: 'Haftalık ders verebileceğin saatler', href: '/dashboard/instructor/availability', done: (availabilityCount ?? 0) > 0 },
            { label: 'Tanıtım Yazısı / Bio Ekle', tip: 'Deneyimlerini ve tarzını anlatan 2-3 cümle', href: '/dashboard/instructor/profile', done: !!instructorRow.bio?.trim() },
            { label: 'Branşlarını Belirle', tip: 'LGS, YKS, TYT, AYT derslerin', href: '/dashboard/instructor/profile', done: (instructorRow.subjects ?? []).length > 0 },
            { label: 'Profil Fotoğrafı Yükle', tip: 'Güven veren profesyonel bir fotoğraf', href: '/dashboard/instructor/profile', done: !!userRow?.avatar_url },
          ]}
        />
      )}

      {needsAction.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#1B2430]">Onay Bekleyen Dersler</h2>
          <p className="text-sm font-semibold text-[#1B2430]/70">Saati geçmiş, tamamlandı olarak işaretlemen gerekiyor.</p>
          <div className="space-y-3">
            {needsAction.map((b) => (
              <InstructorBookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Yaklaşan Dersler</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm font-bold text-[#1B2430]">Planlanmış ders yok.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <InstructorBookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Geçmiş Dersler</h2>
        {past.length === 0 ? (
          <p className="text-sm font-bold text-[#1B2430]">Henüz geçmiş ders yok.</p>
        ) : (
          <div className="space-y-3">
            {past.map((b) => (
              <InstructorBookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
