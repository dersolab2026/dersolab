'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

interface RegisterParams {
  name: string
  email: string
  password: string
  role: 'student' | 'parent' | 'instructor'
  gradeTrack?: 'lgs' | 'yks'
}

export async function registerUser(params: RegisterParams): Promise<ActionResult> {
  if (params.password.length < 8) return { success: false, error: 'Şifre en az 8 karakter olmalı' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: { data: { name: params.name, role: params.role, grade_track: params.gradeTrack } },
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function loginUser(email: string, password: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false, error: 'E-posta veya şifre hatalı' }
  return { success: true }
}

export async function logoutUser(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
