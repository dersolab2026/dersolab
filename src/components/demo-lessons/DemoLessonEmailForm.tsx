'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { requestDemoLessonByEmail } from '@/actions/demo-lessons'

export function DemoLessonEmailForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await requestDemoLessonByEmail(name, email)
      if (!result.success) {
        setError(result.error)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
        <p className="font-bold text-white text-lg">Talebin alındı!</p>
        <p className="mt-2 text-sm font-semibold text-slate-400">
          Uygun bir eğitmenimiz e-posta adresinden seninle iletişime geçip dersi planlayacak.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-white/5 shadow-2xl space-y-4">
      <p className="font-bold text-white text-lg">Tanışma Dersinle Başla</p>
      <p className="text-sm font-semibold text-slate-400">
        Hoş Geldin Paketini hesap açmadan da alabilirsin: kredi kullanmayan bir tanışma dersi.
        Uygun bir eğitmenimiz e-posta adresinden seninle iletişime geçip dersi planlar.
      </p>
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1">Ad Soyad</label>
        <input 
          required 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all" 
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
          className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
        />
      </div>
      {error && <p className="text-sm font-bold text-red-500">{error}</p>}
      <button type="submit" disabled={isPending} className="mt-2 w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60 flex justify-center items-center">
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Tanışma Dersi Talep Et'}
      </button>
    </form>
  )
}
