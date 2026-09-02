'use client'

import { useState, useEffect } from 'react'
import { Joyride, STATUS, Step } from 'react-joyride'
import type { UserRole } from '@/types'

interface OnboardingTourProps {
  role: UserRole
}

export function OnboardingTour({ role }: OnboardingTourProps) {
  const [run, setRun] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [isMounted, setIsMounted] = useState(false)
  
  // Client-side hydration issues avoid
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sadece client'ta local storage kontrolü yapmak için
  useEffect(() => {
    if (!isMounted) return

    const isFirstTime = localStorage.getItem(`dersolab-tour-${role}`)
    if (!isFirstTime && (role === 'student' || role === 'instructor')) {
      // Role göre adımları belirle
      const tourSteps: Step[] = []
      
      if (role === 'student') {
        tourSteps.push(
          {
            target: 'body', // İlk adım genel bir hoş geldin
            content: 'DersoLab\'a Hoş Geldin! 🎉 Sana özel panelinde nasıl gezineceğini kısaca anlatalım.',
            placement: 'center',
          },
          {
            target: '#tour-bookings',
            content: 'Yaklaşan ve geçmiş derslerini, programını buradan takip edebilirsin.',
            placement: 'right',
          },
          {
            target: '#tour-ai-asistan',
            content: 'Çözemediğin soruları buraya yükle, yapay zekamız adım adım sana anlatsın!',
            placement: 'right',
          },
          {
            target: '#tour-netlerim',
            content: 'Deneme sonuçlarını girip gelişim grafiğini anlık olarak buradan izleyebilirsin.',
            placement: 'right',
          },
          {
            target: '#tour-kocluk-formu',
            content: 'Haftalık hedeflerini ve çalışma alışkanlıklarını buradan değerlendirebiliriz.',
            placement: 'right',
          }
        )
      } else if (role === 'instructor') {
        tourSteps.push(
          {
            target: 'body',
            content: 'DersoLab Eğitmen Paneline Hoş Geldin! 👨‍🏫 Başlamadan önce kısa bir tur atalım.',
            placement: 'center',
          },
          {
            target: '#tour-availability',
            content: 'Öğrencilerin sana randevu alabilmesi için buradan müsait saatlerini belirlemelisin.',
            placement: 'right',
          },
          {
            target: '#tour-profile',
            content: 'Profilini eksiksiz doldurmak, öğrencilerin seni seçmesinde en büyük etkendir!',
            placement: 'right',
          },
          {
            target: '#tour-desk-odemeler',
            content: 'Tamamlanan derslerin kazançlarını ve geçmiş ödemelerini şeffafça buradan takip edebilirsin.',
            placement: 'right',
          }
        )
      }
      
      setSteps(tourSteps)
      
      // Kısa bir gecikme ile turu başlat ki DOM tamamlansın
      const timer = setTimeout(() => {
        setRun(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [role, isMounted])

  const handleJoyrideCallback = (data: any) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      // Tur bittiğinde veya atlandığında tekrar çıkmaması için kaydet
      localStorage.setItem(`dersolab-tour-${role}`, 'true')
    }
  }

  // Tur adımı yoksa veya client'ta render olmadıysa boş render yap
  if (!isMounted || steps.length === 0) return null

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      locale={{
        back: 'Geri',
        close: 'Kapat',
        last: 'Bitir',
        next: 'İleri',
        skip: 'Turu Geç',
      }}
      // @ts-ignore - react-joyride types are slightly mismatched
      styles={{
        options: {
          arrowColor: 'rgba(15, 23, 42, 0.95)',
          backgroundColor: 'rgba(15, 23, 42, 0.95)', // bg-slate-900
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          primaryColor: '#f59e0b', // amber-500
          textColor: '#f1f5f9', // slate-100
          width: 350,
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: 'left',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
        },
        tooltipContent: {
          padding: '10px 0',
        },
        buttonNext: {
          backgroundColor: '#f59e0b',
          color: '#0f172a',
          fontWeight: 'bold',
          borderRadius: '0.5rem',
        },
        buttonBack: {
          color: '#94a3b8',
          marginRight: '8px',
        },
        buttonSkip: {
          color: '#94a3b8',
        }
      }}
    />
  )
}
