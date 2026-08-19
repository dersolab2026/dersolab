'use client'

import { useState, useMemo } from 'react'
import { WeeklyPlan } from '@/components/coaching/WeeklyPlan'
import {
  eslestir, haftaninPazartesi, type PlanItem, type StudyLogLite,
} from '@/lib/coaching/plan-progress'

/**
 * Hafta gezinmesini yoneten sarmalayici.
 *
 * Plan satirlari ve gunluk kayitlari sunucudan bir kerede geliyor, hafta
 * degistirmek yeni bir istek acmiyor. Eslestirme de burada, istemcide
 * yapiliyor: hesap tamamen saf ve veri zaten elde.
 */

interface Props {
  studentId: string
  planItems: PlanItem[]
  /** plan_week degeri satirlarla birlikte geliyor. */
  planWeeks: Record<string, string>
  studyLogs: StudyLogLite[]
  subjects: string[]
  canEdit: boolean
}

export function CoachingPlanPanel({ studentId, planItems, planWeeks, studyLogs, subjects, canEdit }: Props) {
  const [hafta, setHafta] = useState(() => haftaninPazartesi(new Date()))

  const haftaninSatirlari = useMemo(
    () => planItems.filter((p) => planWeeks[p.id] === hafta),
    [planItems, planWeeks, hafta],
  )

  const ilerleme = useMemo(
    () => eslestir(haftaninSatirlari, studyLogs),
    [haftaninSatirlari, studyLogs],
  )

  return (
    <WeeklyPlan
      studentId={studentId}
      planWeek={hafta}
      items={ilerleme}
      subjects={subjects}
      canEdit={canEdit}
      onWeekChange={setHafta}
    />
  )
}
