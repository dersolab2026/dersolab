'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  X,
  Share2,
  Download,
  Flame,
  Smartphone,
} from 'lucide-react'
import type { SocialPostItem } from '@/types/social'
import { toast } from 'sonner'

export function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TikTokIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 3v10.5a4 4 0 1 1-3-3.87" />
      <path d="M15 3a5 5 0 0 0 5 5" />
    </svg>
  )
}

export interface PublishResultData {
  success: boolean
  isStory: boolean
  isPost: boolean
  contentType: string
  instagram?: {
    success: boolean
    mode: 'api' | 'manual_fallback'
    action: 'story' | 'post'
    message: string
    permalink?: string
  } | null
  tiktok?: {
    success: boolean
    mode: 'api' | 'manual_fallback'
    action: 'story' | 'post'
    message: string
    shareUrl?: string
  } | null
}

interface PublishSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  post: SocialPostItem | null
  publishResult: PublishResultData | null
  downloadCount?: number
}

export function PublishSuccessModal({
  isOpen,
  onClose,
  post,
  publishResult,
  downloadCount = 1,
}: PublishSuccessModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !post) return null

  const isStory = publishResult?.isStory ?? post.type === 'story'
  const fullText = `${post.caption}\n\n${(post.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`

  const igSuccess = Boolean(publishResult?.instagram?.success)
  const igIsApi = publishResult?.instagram?.mode === 'api'

  const ttSuccess = Boolean(publishResult?.tiktok?.success)
  const ttIsApi = publishResult?.tiktok?.mode === 'api'

  const anyApiSuccess = (igSuccess && igIsApi) || (ttSuccess && ttIsApi)

  function handleCopy() {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    toast.success('Metin ve etiketler kopyalandı!')
    setTimeout(() => setCopied(false), 2000)
  }

  const igUrl = publishResult?.instagram?.permalink || (isStory ? 'https://www.instagram.com/stories/create/' : 'https://www.instagram.com/')
  const ttUrl = publishResult?.tiktok?.shareUrl || (isStory ? 'https://www.tiktok.com/upload' : 'https://www.tiktok.com/creator-center/upload')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b0e17] border border-white/15 p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(249,115,22,0.15)] overflow-hidden space-y-6">
        {/* Arka Plan Parlama Efektleri */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 blur-[80px] pointer-events-none" />

        {/* Üst Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık & İkon Alanı */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tek Tuşla Çift Platform Paylaşımı</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
            <span>{anyApiSuccess ? '🎉 Başarıyla Yayınlandı!' : '📋 Görseller Hazırlandı & Buluta Yüklendi!'}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${
              isStory
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isStory ? '📸 9:16 Hikaye (Story)' : '📰 Gönderi (Feed Post)'}
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {anyApiSuccess
              ? `İçeriğiniz seçili platformlar için ${isStory ? '9:16 dikey Hikaye (Story) formatında' : 'tam çözünürlüklü Gönderi formatında'} başarıyla paylaşıldı.`
              : `Görselleriniz 1080p yüksek çözünürlükte bulut depolamaya yüklendi ve cihazınıza aktarıldı. Açıklama metni panoya kopyalandı.`}
          </p>
        </div>

        {/* İKİ PLATFORM KARTI (INSTAGRAM & TIKTOK) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. INSTAGRAM KARTI */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Instagram</h4>
                  <span className="text-[11px] text-pink-300 font-semibold">
                    {isStory ? 'Story (Hikaye)' : 'Akış Gönderisi'}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  igSuccess && igIsApi
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : !igSuccess && igIsApi
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {igSuccess && igIsApi
                    ? 'API ile Yayınlandı'
                    : !igSuccess && igIsApi
                    ? 'API Uyarısı (Web ile Aç)'
                    : 'Buluta Yüklendi'}
                </span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {publishResult?.instagram?.message ||
                (isStory
                  ? '9:16 dikey hikaye şablonu buluta yüklendi ve Instagram için hazırlandı.'
                  : 'Gönderi görselleri ve açıklama Instagram için buluta yüklendi.')}
            </p>

            <a
              href={igUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-200 text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram'da Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 2. TIKTOK KARTI */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent border border-cyan-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                  <TikTokIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">TikTok</h4>
                  <span className="text-[11px] text-cyan-300 font-semibold">
                    {isStory ? 'TikTok Story' : 'TikTok Gönderisi'}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  ttSuccess && ttIsApi
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : !ttSuccess && ttIsApi
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {ttSuccess && ttIsApi
                    ? 'API ile Yayınlandı'
                    : !ttSuccess && ttIsApi
                    ? 'Yetki / İzin Gerekli'
                    : 'Buluta Yüklendi'}
                </span>
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {publishResult?.tiktok?.message ||
                (isStory
                  ? 'TikTok Story 9:16 dikey video/görsel formatında hazırlandı.'
                  : 'TikTok fotoğraf albümü ve trend etiketler hazırlandı.')}
            </p>

            <a
              href={ttUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
              <span>TikTok Creator'da Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* BİLGİ & DOĞRULAMA KONTROL LİSTESİ */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              Görseller 1080p yüksek çözünürlükte <strong>DersoLab Bulut Depolamaya (Supabase Storage)</strong> yüklendi ve API'ye iletildi
            </span>
          </div>
          {downloadCount > 0 && (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                {downloadCount > 1
                  ? `${downloadCount} adet yüksek çözünürlüklü slayt görseli cihazınıza da aktarıldı`
                  : '1080p yüksek çözünürlüklü görsel cihazınıza da aktarıldı'}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Açıklama metni ve trend hashtag'ler panoya otomatik kopyalandı</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Gönderi durumu DersoLab sisteminde <strong>"Yayınlandı"</strong> olarak güncellendi</span>
          </div>
        </div>

        {/* METİN KOPYALAMA ALANI */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400">Paylaşım Metni & Hashtag'ler</label>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı!' : 'Yeniden Kopyala'}</span>
            </button>
          </div>
          <div className="max-h-24 overflow-y-auto p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 font-mono whitespace-pre-wrap">
            {fullText}
          </div>
        </div>

        {/* ALT BUTONLAR */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Harika, Stüdyoya Dön
          </button>
        </div>
      </div>
    </div>
  )
}
