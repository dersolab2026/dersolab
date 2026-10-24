import { redirect } from 'next/navigation'
import { AllStarLandingView } from '@/components/home/designs/AllStarHero/AllStarLandingView'

export default function Tasarim3TestPage() {
  if (process.env.NODE_ENV === 'production') {
    redirect('/')
  }
  return <AllStarLandingView />
}
