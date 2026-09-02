import Link from 'next/link'
import Image from 'next/image'

interface AuthShellProps {
  /** Sayfanın tek h1'i. Arama motoru ve ekran okuyucu bunu okuyor. */
  baslik?: string
  subtitle?: string
  cardMaxWidth?: string
  children: React.ReactNode
  role?: 'student' | 'instructor' | 'parent' | null
}

function DynamicRoleHeader({ role }: { role?: 'student' | 'instructor' | 'parent' | null }) {
  let themeFrom = 'from-orange-500/20'
  let themeTo = 'to-amber-500/20'
  let themeBorder = 'border-orange-500/20'
  let themeShadow = 'shadow-orange-500/10'
  let textFrom = 'from-orange-400'
  let textTo = 'to-amber-400'
  let glowColor = 'bg-orange-500/10'
  let mascotSrc = '/fox-head.png'

  if (role === 'instructor') {
    themeFrom = 'from-blue-500/20'
    themeTo = 'to-cyan-500/20'
    themeBorder = 'border-blue-500/20'
    themeShadow = 'shadow-blue-500/10'
    textFrom = 'from-blue-400'
    textTo = 'to-cyan-400'
    glowColor = 'bg-blue-500/10'
  } else if (role === 'parent') {
    themeFrom = 'from-emerald-500/20'
    themeTo = 'to-teal-500/20'
    themeBorder = 'border-emerald-500/20'
    themeShadow = 'shadow-emerald-500/10'
    textFrom = 'from-emerald-400'
    textTo = 'to-teal-400'
    glowColor = 'bg-emerald-500/10'
  } else if (role === null) {
    // default main logo
  }

  return (
    <>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${glowColor} blur-[120px] rounded-full pointer-events-none transition-colors duration-500 z-0`} />
      <Link href="/" className="relative z-10 flex flex-row items-center justify-center gap-4 mb-8 cursor-pointer group">
        <div className={`w-14 h-14 relative transition-all duration-500 group-hover:scale-105`}>
          <Image 
            src={mascotSrc} 
            alt="DersoLab Avatar" 
            fill
            sizes="56px"
            className="object-contain" 
          />
        </div>
        <span className="text-4xl font-black tracking-tight text-white group-hover:scale-[1.02] transition-transform duration-500">
          Derso<span className={`text-transparent bg-clip-text bg-gradient-to-r ${textFrom} ${textTo} transition-colors duration-500`}>Lab</span>
        </span>
      </Link>
    </>
  )
}

export function AuthShell({
  baslik,
  subtitle,
  cardMaxWidth = '460px',
  children,
  role = null
}: AuthShellProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 bg-[#0a0a0a] text-slate-200 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none z-0" />

      <div
        className="relative z-10 w-full bg-white/[0.02] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        style={{ maxWidth: cardMaxWidth }}
      >
        <DynamicRoleHeader role={role} />

        {baslik && (
          <h1 className="text-2xl font-bold text-white mb-2 text-center tracking-tight">{baslik}</h1>
        )}

        {subtitle && (
          <p className="font-semibold text-slate-400 mb-6 text-center text-sm">{subtitle}</p>
        )}

        <div className="text-left w-full">
          {children}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-500">
          <Link href="/hakkimizda" className="hover:text-slate-300 transition-colors">Hakkımızda</Link>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Gizlilik Politikası</Link>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Kullanım Şartları</Link>
        </div>
      </div>
    </div>
  )
}
