'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { TERMS_VERSION } from '@/lib/legal'
import { gecerliRolMu } from '@/lib/auth/account-type'
import { OAUTH_NOT_CEREZI, OAUTH_NOT_OMRU, notuYaz, type OAuthNotu } from '@/lib/auth/oauth-hint'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

interface RegisterParams {
  name: string
  email: string
  password: string
  role: 'student' | 'instructor' | 'parent'
  schoolName?: string
  grade?: number
  track?: 'sayisal' | 'sozel' | 'ea' | 'dil'
  termsVersion: typeof TERMS_VERSION
}

const emailSchema = z.string().trim().email('Geçerli bir e-posta adresi gir').max(254)
const passwordSchema = z.string().min(8, 'Şifre en az 8 karakter olmalı').max(128)
const gradeSchema = z.union([
  z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9),
  z.literal(10), z.literal(11), z.literal(12), z.literal(13),
])

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Ad soyad en az 2 karakter olmalı').max(100),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['student', 'instructor', 'parent']),
  schoolName: z.string().trim().min(2, 'Okul adını gir').max(120).optional(),
  grade: gradeSchema.optional(),
  track: z.enum(['sayisal', 'sozel', 'ea', 'dil']).optional(),
  termsVersion: z.literal(TERMS_VERSION),
}).superRefine((values, ctx) => {
  if (values.role !== 'student') return
  if (!values.schoolName) ctx.addIssue({ code: 'custom', path: ['schoolName'], message: 'Okul adını gir' })
  if (!values.grade) ctx.addIssue({ code: 'custom', path: ['grade'], message: 'Sınıfını seç' })
  if (values.grade && values.grade >= 9 && !values.track) {
    ctx.addIssue({ code: 'custom', path: ['track'], message: 'Alanını seç' })
  }
})

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
  return 'Kayıt oluşturulamadı, lütfen tekrar dene'
}

export async function registerUser(params: RegisterParams): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(params)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Form bilgilerini kontrol et' }
  const values = parsed.data
  const gradeTrack = values.grade ? (values.grade <= 8 ? 'lgs' : 'yks') : undefined

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        name: values.name,
        role: values.role,
        grade_track: gradeTrack,
        school_name: values.schoolName,
        grade: values.grade,
        track: values.track,
        terms_version: TERMS_VERSION,
      },
    },
  })

  if (error) return { success: false, error: friendlySignUpError(error.message) }
  return { success: true }
}

export async function loginUser(email: string, password: string): Promise<ActionResult> {
  const parsedEmail = emailSchema.safeParse(email)
  const parsedPassword = passwordSchema.safeParse(password)
  if (!parsedEmail.success || !parsedPassword.success) return { success: false, error: 'E-posta veya şifre hatalı' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: parsedEmail.data, password: parsedPassword.data })

  if (error) {
    if (error.code === 'email_not_confirmed') {
      return {
        success: false,
        error: 'E-posta adresini henüz onaylamamışsın. Kayıt olurken gönderdiğimiz onay e-postasındaki linke tıkla (gelen kutunda yoksa spam/gereksiz klasörüne bak).',
      }
    }
    return { success: false, error: 'E-posta veya şifre hatalı' }
  }

  return { success: true }
}

export async function logoutUser(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

/**
 * Google girisini baslatir.
 *
 * `not` yalnizca KAYIT formundan geliyor: kullanici orada hesap turunu
 * secip KVKK kutusunu isaretlemis oluyor. Google bu bilgiyi tasimadigi
 * icin kisa omurlu bir httpOnly cereze yaziyoruz; donuste callback okuyup
 * uyguluyor. Boylece ayni iki soru ikinci kez sorulmuyor.
 *
 * Giris (login) sayfasindan cagrildiginda not YOK — orada bir secim
 * yapilmiyor zaten.
 */
export async function signInWithGoogle(
  isNative = false,
  not?: OAuthNotu,
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: isNative ? 'com.dersolab.app://auth/callback' : `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  })
  if (error || !data.url) return { error: 'Google girişi başlatılamadı' }

  if (not && gecerliRolMu(not.rol)) {
    const cerezler = await cookies()
    cerezler.set(OAUTH_NOT_CEREZI, notuYaz(not), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // OAuth donusu capraz siteden geliyor; 'strict' cerezi dusururdu
      path: '/',
      maxAge: OAUTH_NOT_OMRU,
    })
  }

  return { url: data.url }
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const parsedEmail = emailSchema.safeParse(email)
  if (!parsedEmail.success) return { success: false, error: 'Geçerli bir e-posta adresi gir' }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })
  if (error) return { success: false, error: 'Şifre sıfırlama bağlantısı gönderilemedi, lütfen tekrar dene' }
  return { success: true }
}

export async function updatePassword(newPassword: string): Promise<ActionResult> {
  const parsedPassword = passwordSchema.safeParse(newPassword)
  if (!parsedPassword.success) return { success: false, error: parsedPassword.error.issues[0]?.message ?? 'Şifre geçersiz' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsedPassword.data })
  if (error) return { success: false, error: 'Şifre güncellenemedi, lütfen tekrar dene' }
  return { success: true }
}
