import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { StudentProfileForm } from '@/components/student/StudentProfileForm'
import { ChangePasswordForm } from '@/components/account/ChangePasswordForm'
import { DeleteAccountButton } from '@/components/instructor/DeleteAccountButton'
import { PIXEL_CARD } from '@/lib/theme'

export default async function StudentSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: userRow }, { data: studentRow }] = await Promise.all([
    supabase.from('users').select('name').eq('id', user.id).single(),
    supabase.from('students').select('school_name, grade, track').eq('user_id', user.id).single(),
  ])

  return (
    <DashboardPageShell title="Ayarlar" description="Profil bilgilerini ve hesabını buradan yönet.">
      <StudentProfileForm
        name={userRow?.name ?? ''}
        schoolName={studentRow?.school_name ?? ''}
        grade={studentRow?.grade ?? null}
        track={studentRow?.track ?? null}
      />

      <ChangePasswordForm />

      <div className={`${PIXEL_CARD} p-5 space-y-4`}>
        <div>
          <p className="font-bold text-[#1B2430]">Hesap Ayarları</p>
          <p className="text-sm font-semibold text-[#1B2430]/70">Hesabını tamamen silebilirsin.</p>
        </div>
        <DeleteAccountButton />
      </div>
    </DashboardPageShell>
  )
}
