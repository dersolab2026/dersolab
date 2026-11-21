'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { requestDemoLessonByEmail } from '@/actions/demo-lessons'

interface DemoLessonEmailFormProps {
  initialSubject?: string
  defaultName?: string
  defaultEmail?: string
  isParent?: boolean
}

export function DemoLessonEmailForm({
  initialSubject = '',
  defaultName = '',
  defaultEmail = '',
  isParent = false,
}: DemoLessonEmailFormProps) {
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState(initialSubject)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await requestDemoLessonByEmail(name, email, { phone, subject })
      if (!result.success) {
        setError(result.error)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-emerald-500/20 shadow-2xl">
        <p className="font-bold text-white text-lg">Talebin alındı!</p>
        <p className="mt-2 text-sm font-semibold text-slate-400">
          {phone.trim()
            ? 'Kurucu eğitmenlerimiz en kısa sürede telefon veya e-posta üzerinden seninle iletişime geçip ücretsiz tanışma dersini planlayacak.'
            : 'Kurucu eğitmenlerimiz en kısa sürede e-posta adresinden seninle iletişime geçip ücretsiz tanışma dersini planlayacak.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0a0a] rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-2xl space-y-4">
      <p className="font-bold text-white text-lg">
        {isParent ? 'Çocuğunuz İçin Ücretsiz Tanışma Dersi' : 'Tanışma Dersinle Başla'}
      </p>
      <p className="text-sm font-semibold text-slate-400">
        {isParent
          ? 'Kart bilgisi gerekmeden bire bir seviye tespiti ve çalışma planı oluşturuyoruz. Bilgilerinizi bırakın, kurucu eğitmenlerimiz sizinle iletişime geçsin.'
          : 'Hoş Geldin Paketini hesap açmadan da alabilirsin: kart bilgisi yok, tamamen ücretsiz bire bir tanışma dersi.'}
      </p>
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1">Ad Soyad</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız ve Soyadınız"
          className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1">E-posta</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@email.com"
          className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">
            Telefon <span className="text-xs font-normal text-slate-500">(isteğe bağlı — hızlı dönüş için)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XX XXX XX XX"
            className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">
            Sınav / Branş <span className="text-xs font-normal text-slate-500">(isteğe bağlı)</span>
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Örn: LGS Matematik, TYT Kimya"
            className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>
      {error && <p className="text-sm font-bold text-red-400">{error}</p>}
      <button type="submit" disabled={isPending} className="mt-2 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60 flex justify-center items-center">
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ücretsiz Tanışma Dersi Talep Et'}
      </button>
    </form>
  )
}
