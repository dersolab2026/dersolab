'use client'

import { useState, useEffect, useMemo, useSyncExternalStore } from 'react'
import { Joyride, STATUS, type Step, type EventData } from 'react-joyride'
import type { UserRole } from '@/types'

interface OnboardingTourProps {
  role: UserRole
}

const emptySubscribe = () => () => {}

function getTourSteps(role: UserRole): Step[] {
  if (role === 'student') {
    return [
      {
        target: 'body',
        content: "DersoLab'a Hoş Geldin! 🎉 Sana özel panelinde nasıl gezineceğini kısaca anlatalım.",
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
      },
    ]
  }

  if (role === 'instructor') {
    return [
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
      },
    ]
  }

  return []
}

export function OnboardingTour({ role }: OnboardingTourProps) {
  const [run, setRun] = useState(false)
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const steps = useMemo(() => getTourSteps(role), [role])

  useEffect(() => {
    if (!isMounted || steps.length === 0) return

    const isFirstTime = localStorage.getItem(`dersolab-tour-${role}`)
    if (!isFirstTime && (role === 'student' || role === 'instructor')) {
      const timer = setTimeout(() => {
        setRun(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [role, isMounted, steps.length])

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      localStorage.setItem(`dersolab-tour-${role}`, 'true')
    }
  }

  if (!isMounted || steps.length === 0) return null

  return (
    <Joyride
      onEvent={handleJoyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      steps={steps}
      locale={{
        back: 'Geri',
        close: 'Kapat',
        last: 'Bitir',
        next: 'İleri',
        skip: 'Turu Geç',
      }}
      options={{
        buttons: ['primary', 'back', 'skip'],
        showProgress: true,
        arrowColor: '#0a0a0a',
        backgroundColor: '#0a0a0a',
        overlayColor: 'rgba(0, 0, 0, 0.75)',
        primaryColor: '#3b82f6',
        textColor: '#f1f5f9',
        zIndex: 10000,
      }}
      styles={{
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '12px 4px',
          fontSize: '14px',
          lineHeight: '1.5',
        },
        buttonPrimary: {
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 700,
          padding: '8px 16px',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
        },
        buttonBack: {
          color: '#94a3b8',
          fontSize: '13px',
          fontWeight: 600,
          marginRight: 10,
        },
        buttonSkip: {
          color: '#64748b',
          fontSize: '13px',
          fontWeight: 600,
        },
      }}
    />
  )
}
