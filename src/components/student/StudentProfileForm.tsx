'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateStudentProfile } from '@/actions/student-profile'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_PRIMARY, PIXEL_CARD } from '@/lib/theme'

type Track = 'sayisal' | 'sozel' | 'ea' | 'dil'

const GRADES = [5, 6, 7, 8, 9, 10, 11, 12]
const MEZUN_GRADE = 13

const TRACK_LABELS: Record<Track, string> = {
  sayisal: 'Sayısal',
  sozel: 'Sözel',
  ea: 'Eşit Ağırlık',
  dil: 'Dil',
}

interface StudentProfileFormProps {
  name: string
  schoolName: string
  grade: number | null
  track: Track | null
}

export function StudentProfileForm({ name: initialName, schoolName: initialSchoolName, grade: initialGrade, track: initialTrack }: StudentProfileFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [schoolName, setSchoolName] = useState(initialSchoolName)
  const [grade, setGrade] = useState(initialGrade ? String(initialGrade) : '')
  const [track, setTrack] = useState<Track | ''>(initialTrack ?? '')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const gradeNumber = grade ? Number(grade) : undefined
  const isLise = gradeNumber !== undefined && gradeNumber >= 9

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!gradeNumber) { setError('Sınıf seçmelisin'); return }

    startTransition(async () => {
      const result = await updateStudentProfile({
        name,
        schoolName,
        grade: gradeNumber,
        track: isLise && track ? track : undefined,
      })
      if (!result.success) { setError(result.error); return }
      showToast('Bilgilerin güncellendi.')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-4`}>
      <p className="font-bold text-[var(--yazi)]">Profil Bilgilerim</p>

      <div>
        <label className="block text-[var(--yazi)] font-bold mb-2">Ad Soyad</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
        />
      </div>

      <div>
        <label className="block text-[var(--yazi)] font-bold mb-2">Okul Adı</label>
        <input
          required
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
        />
      </div>

      <div>
        <label className="block text-[var(--yazi)] font-bold mb-2">Sınıf</label>
        <select
          required
          value={grade}
          onChange={(e) => { setGrade(e.target.value); setTrack('') }}
          className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
        >
          <option value="" disabled>Seç</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}. Sınıf</option>
          ))}
          <option value={MEZUN_GRADE}>Mezun</option>
        </select>
      </div>

      {isLise && (
        <div>
          <label className="block text-[var(--yazi)] font-bold mb-2">Alan</label>
          <select
            required
            value={track}
            onChange={(e) => setTrack(e.target.value as Track)}
            className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
          >
            <option value="" disabled>Seç</option>
            {(Object.keys(TRACK_LABELS) as Track[]).map((t) => (
              <option key={t} value={t}>{TRACK_LABELS[t]}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm font-bold text-[var(--tehlike)]">{error}</p>}

      <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2`}>
        {isPending ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </form>
  )
}
