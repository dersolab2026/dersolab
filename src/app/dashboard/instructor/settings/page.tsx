import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ConnectGoogleCalendarButton } from '@/components/instructor/ConnectGoogleCalendarButton'

interface InstructorSettingsPageProps {
  searchParams: Promise<{ calendar_connected?: string; calendar_error?: string }>
}

export default async function InstructorSettingsPage({ searchParams }: InstructorSettingsPageProps) {
  const { calendar_connected, calendar_error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: instructorRow } = await supabase.from('instructors').select('calendar_connected').eq('user_id', user.id).single()

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Ayarlar</h1>
        <p className="text-muted-foreground">Google Takvim bağlantını buradan yönet.</p>
      </div>

      {calendar_connected && <p className="text-sm text-green-600">Google Takvimin başarıyla bağlandı.</p>}
      {calendar_error === 'missing_refresh_token' && (
        <p className="text-sm text-destructive">
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
        <p className="text-sm text-destructive">Bağlantı sırasında bir sorun oluştu, tekrar dener misin?</p>
      )}

      <ConnectGoogleCalendarButton isConnected={instructorRow?.calendar_connected ?? false} />
    </div>
  )
}
