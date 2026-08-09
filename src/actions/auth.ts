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

function friendlySignUpError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('already registered') || lower.includes('already exists')) {
    return 'Bu e-posta adresiyle zaten bir hesap var'
  }
  if (lower.includes('confirmation email') || lower.includes('sending')) {
    return 'Onay e-postası gönderilemedi, lütfen e-posta adresini kontrol edip tekrar dene'
  }
  if (lower.includes('invalid') && lower.includes('email')) {
    return 'Geçerli bir e-posta adresi gir'
  }
  if (lower.includes('security purposes') || lower.includes('rate limit')) {
    return 'Çok fazla deneme yaptın, lütfen biraz bekleyip tekrar dene'
  }
  if (/^[a-zçğıöşü0-9\s.,!?'"-]+$/i.test(message) && message.length < 200) {
    return message
  }
  return 'Kayıt oluşturulamadı, lütfen tekrar dene'
}

export async function registerUser(params: RegisterParams): Promise<ActionResult> {
  if (params.password.length < 8) return { success: false, error: 'Şifre en az 8 karakter olmalı' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: { data: { name: params.name, role: params.role, grade_track: params.gradeTrack } },
  })

  if (error) return { success: false, error: friendlySignUpError(error.message) }
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

export async function signInWithGoogle(): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  })
  if (error || !data.url) return { error: error?.message ?? 'Google girişi başlatılamadı' }
  return { url: data.url }
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updatePassword(newPassword: string): Promise<ActionResult> {
  const supabase = await createClient()
  if (newPassword.length < 8) return { success: false, error: 'Şifre en az 8 karakter olmalı' }
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { success: false, error: error.message }
  return { success: true }
}