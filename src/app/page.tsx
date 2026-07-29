import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-16 text-center">
      <h1 className="text-4xl font-bold">DersoLab</h1>
      <p className="text-muted-foreground">LGS ve YKS için online özel ders ve kamp platformu</p>
      <div className="flex justify-center gap-3">
        <Link href="/instructors" className="underline">Eğitmen Bul</Link>
        <Link href="/register" className="underline">Kayıt Ol</Link>
      </div>
    </div>
  )
}
