import Link from 'next/link'
import { AuthShell } from '@/components/auth/AuthShell'

export default function HomePage() {
  return (
    <AuthShell
      cardMaxWidth="560px"
      mascotMaxWidth="none"
      mascotWidthClass="w-full"
      subtitle="Öğrenciler için online özel ders ve rehberlik platformu"
    >
      <Link
        href="/login"
        className="block w-full py-3 px-4 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all text-center"
      >
        Giriş Yap
      </Link>
      <Link
        href="/forgot-password"
        className="block w-full mt-4 py-3 px-4 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all text-center"
      >
        Şifremi Unuttum
      </Link>
      <Link
        href="/register"
        className="block w-full mt-4 py-4 bg-[#DD7B3A] text-[#F4F1E8] font-bold text-lg rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all text-center"
      >
        Kaydol
      </Link>
    </AuthShell>
  )
}
