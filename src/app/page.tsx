import Link from 'next/link'
import { Press_Start_2P } from 'next/font/google'

const pressStart2P = Press_Start_2P({ subsets: ['latin'], weight: '400' })

export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 bg-[#D5EAE3] relative overflow-hidden">

      {/* Retro Çizgili Arka Plan Efekti */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      <div className="relative z-10 w-full max-w-[560px] bg-[#F4F1E8] rounded-2xl p-8 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-center">

        <h1 className={`${pressStart2P.className} text-4xl sm:text-5xl text-[#1B2430] mb-6 leading-snug`}>
          DersoLab
        </h1>

        <div className="flex justify-center mb-8">
          <img
            src="/fox-mascot.png"
            alt="DersoLab Fox Mascot"
            className="w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <div className="font-sans font-semibold text-[#1B2430] flex flex-col gap-4">
          <Link
            href="/login"
            className="block w-full py-3 px-4 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
          >
            Giriş Yap
          </Link>
          <Link
            href="/forgot-password"
            className="block w-full py-3 px-4 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
          >
            Şifremi Unuttum
          </Link>
          <Link
            href="/register"
            className="block w-full py-4 bg-[#DD7B3A] text-[#F4F1E8] font-bold text-lg rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
          >
            Kaydol
          </Link>
        </div>
      </div>
    </div>
  )
}
