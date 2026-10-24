import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { LiveClassroomClient } from '@/components/live/LiveClassroomClient'

interface LivePageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Canlı Ders Odası — DersoLab',
  description: 'DersoLab güvenli uçtan uca şifreli görüntülü canlı ders odası.',
}

export default async function LiveClassroomPage({ params }: LivePageProps) {
  const { id: bookingId } = await params

  // Geliştirme ortamında anında test edebilmek için demo modu
  if (process.env.NODE_ENV === 'development' && (bookingId === 'demo' || bookingId === 'test')) {
    return (
      <LiveClassroomClient
        bookingId="dersolab-demo-room"
        currentUserName="DersoLab Test Eğitmeni"
        isInstructor={true}
        otherPersonName="Test Öğrencisi"
        startTime={new Date().toISOString()}
        endTime={new Date(Date.now() + 40 * 60 * 1000).toISOString()}
        topicNote="Canlı Ders Odası & 3D Laboratuvar Testi"
      />
    )
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/canli-ders/${bookingId}`)
  }

  const admin = createAdminClient()

  // Rezervasyonu çek
  const { data: booking } = await admin
    .from('bookings')
    .select('id, student_id, instructor_id, start_time, end_time, status, topic_note')
    .eq('id', bookingId)
    .maybeSingle()

  if (!booking) {
    notFound()
  }

  // Yetki kontrolü: Yalnızca dersin öğrencisi veya eğitmeni (veya admin) odaya girebilir
  const isStudent = user.id === booking.student_id
  const isInstructor = user.id === booking.instructor_id

  const { data: currentUserRow } = await admin.from('users').select('name, role').eq('id', user.id).single()
  const isAdmin = currentUserRow?.role === 'admin'

  if (!isStudent && !isInstructor && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#080B11] text-white flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Yetkisiz Erişim</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Bu canlı ders odasına yalnızca bu rezervasyona kayıtlı öğrenci veya eğitmen katılabilir.
        </p>
      </div>
    )
  }

  // Karşı tarafın adını çek
  const otherUserId = isInstructor ? booking.student_id : booking.instructor_id
  const { data: otherUserRow } = await admin.from('users').select('name').eq('id', otherUserId).maybeSingle()

  return (
    <LiveClassroomClient
      bookingId={booking.id}
      currentUserName={currentUserRow?.name || (isInstructor ? 'Eğitmen' : 'Öğrenci')}
      isInstructor={isInstructor || isAdmin}
      otherPersonName={otherUserRow?.name || (isInstructor ? 'Öğrenci' : 'Eğitmen')}
      startTime={booking.start_time}
      endTime={booking.end_time}
      topicNote={booking.topic_note}
    />
  )
}
