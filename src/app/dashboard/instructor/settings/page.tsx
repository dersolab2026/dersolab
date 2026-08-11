import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ConnectGoogleCalendarButton } from '@/components/instructor/ConnectGoogleCalendarButton'
import { PauseProfileButton } from '@/components/instructor/PauseProfileButton'
import { DeleteAccountButton } from '@/components/instructor/DeleteAccountButton'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

interface InstructorSettingsPageProps {
  searchParams: Promise<{ calendar_connected?: string; calendar_error?: string }>
}

export default async function InstructorSettingsPage({ searchParams }: InstructorSettingsPageProps) {
  const { calendar_connected, calendar_error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: instructorRow } = await supabase.from('instructors').select('calendar_connected, paused').eq('user_id', user.id).single()

  return (
    <DashboardPageShell title="Ayarlar" description="Google Takvim bağlantını buradan yönet.">
      {calendar_connected && <p className="text-sm font-semibold text-[#6FA89E]">Google Takvimin başarıyla bağlandı.</p>}
      {calendar_error === 'missing_refresh_token' && (
        <p className="text-sm font-semibold text-red-600">
          Google bu hesap için gerekli izni döndürmedi. Lütfen{' '}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Google hesap izinleri
          </a>{' '}
          sayfasından DersoLab&apos;ı kaldırıp tekrar bağlamayı dene.
        </p>
      )}
      {calendar_error && calendar_error !== 'missing_refresh_token' && (
        <p className="text-sm font-semibold text-red-600">Bağlantı sırasında bir sorun oluştu, tekrar dener misin?</p>
      )}

      <ConnectGoogleCalendarButton isConnected={instructorRow?.calendar_connected ?? false} />

      <div className={`${PIXEL_CARD} p-5 space-y-4`}>
        <div>
          <p className="font-bold text-[#1B2430]">Hesap Ayarları</p>
          <p className="text-sm font-semibold text-[#1B2430]/70">Profilini dondurabilir ya da hesabını tamamen silebilirsin.</p>
        </div>
        <PauseProfileButton paused={instructorRow?.paused ?? false} />
        <div className="pt-2 border-t-2 border-[#1B2430]/10">
          <DeleteAccountButton />
        </div>
      </div>
    </DashboardPageShell>
  )
}
