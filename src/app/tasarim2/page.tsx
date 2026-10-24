import { redirect } from 'next/navigation'
import { MasterHumanDesignView } from '@/components/home/designs/MasterHumanDesignView'

export default function Tasarim2TestPage() {
  if (process.env.NODE_ENV === 'production') {
    redirect('/')
  }
  return <MasterHumanDesignView initialPersona="student" />
}
