'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { RefreshCw, AlertCircle, ShieldAlert, CheckCircle2, Info } from 'lucide-react'

export type TikTokPrivacyLevel =
  | ''
  | 'PUBLIC_TO_EVERYONE'
  | 'MUTUAL_FOLLOW_FRIENDS'
  | 'FOLLOWER_OF_CREATOR'
  | 'SELF_ONLY'

export interface TikTokDirectPostSettings {
  privacyLevel: TikTokPrivacyLevel
  allowComment: boolean
  allowDuet: boolean
  allowStitch: boolean
  commercialContentEnabled: boolean
  brandOrganicToggle: boolean
  brandContentToggle: boolean
}

export interface TikTokCreatorInfo {
  creator_avatar_url?: string
  creator_nickname?: string
  creator_username?: string
  privacy_level_options?: string[]
  comment_disabled?: boolean
  duet_disabled?: boolean
  stitch_disabled?: boolean
  max_video_post_duration_sec?: number
}

const PRIVACY_LABELS: Record<string, string> = {
  PUBLIC_TO_EVERYONE: 'Herkes (Public to everyone)',
  MUTUAL_FOLLOW_FRIENDS: 'Arkadaşlar (Mutual followers)',
  FOLLOWER_OF_CREATOR: 'Takipçiler (Followers)',
  SELF_ONLY: 'Sadece Ben (Only me)',
}

const FALLBACK_PRIVACY_OPTIONS = ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY']

interface TikTokDirectPostPanelProps {
  isVideo: boolean
  value: TikTokDirectPostSettings
  onChange: (next: TikTokDirectPostSettings) => void
  onValidityChange?: (valid: boolean, reason?: string) => void
}

export function validateTikTokSettings(settings: TikTokDirectPostSettings): { valid: boolean; reason?: string } {
  if (!settings.privacyLevel) {
    return { valid: false, reason: 'Lütfen TikTok gizlilik düzeyini seçin.' }
  }
  if (settings.commercialContentEnabled && !settings.brandOrganicToggle && !settings.brandContentToggle) {
    return { valid: false, reason: 'Ticari içerik açıkken en az bir seçenek işaretlenmelidir.' }
  }
  if (settings.brandContentToggle && settings.privacyLevel === 'SELF_ONLY') {
    return { valid: false, reason: "Markalı içerik 'Sadece Ben' olarak paylaşılamaz." }
  }
  return { valid: true }
}

export function TikTokDirectPostPanel({
  isVideo,
  value,
  onChange,
  onValidityChange,
}: TikTokDirectPostPanelProps) {
  const [creatorInfo, setCreatorInfo] = useState<TikTokCreatorInfo | null>(null)
  const [loadingInfo, setLoadingInfo] = useState(false)
  const [infoError, setInfoError] = useState<string | null>(null)

  const fetchCreatorInfo = useCallback(async () => {
    setLoadingInfo(true)
    setInfoError(null)
    try {
      let localToken: string | undefined
      try {
        const parsed = JSON.parse(localStorage.getItem('dersolab_social_api_keys_v1') || '{}')
        if (typeof parsed?.tiktokToken === 'string' && parsed.tiktokToken.trim()) {
          localToken = parsed.tiktokToken.trim()
        }
      } catch {
        // localStorage yoksa ortam değişkenini kullan
      }

      const res = await fetch('/api/admin/social/tiktok/creator-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localToken ? { tiktokAccessToken: localToken } : {}),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.creatorInfo) {
        setInfoError(data?.error || 'TikTok hesap bilgileri yüklenemedi.')
        setCreatorInfo(null)
        return
      }
      const info = data.creatorInfo as TikTokCreatorInfo
      setCreatorInfo(info)

      // Hesap genelinde kapalı izinleri otomatik pasife çek
      const needsSync =
        (info.comment_disabled && value.allowComment) ||
        (info.duet_disabled && value.allowDuet) ||
        (info.stitch_disabled && value.allowStitch)
      if (needsSync) {
        onChange({
          ...value,
          allowComment: info.comment_disabled ? false : value.allowComment,
          allowDuet: info.duet_disabled ? false : value.allowDuet,
          allowStitch: info.stitch_disabled ? false : value.allowStitch,
        })
      }
    } catch {
      setInfoError('TikTok hesap bilgisi sorgulanamadı.')
    } finally {
      setLoadingInfo(false)
    }
  }, [value, onChange])

  useEffect(() => {
    fetchCreatorInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const check = validateTikTokSettings(value)
    onValidityChange?.(check.valid, check.reason)
  }, [value, onValidityChange])

  const privacyOptions =
    creatorInfo?.privacy_level_options && creatorInfo.privacy_level_options.length > 0
      ? creatorInfo.privacy_level_options
      : FALLBACK_PRIVACY_OPTIONS

  const validity = validateTikTokSettings(value)

  function handleBrandContentChange(checked: boolean) {
    const next: TikTokDirectPostSettings = {
      ...value,
      brandContentToggle: checked,
      privacyLevel: checked && value.privacyLevel === 'SELF_ONLY' ? '' : value.privacyLevel,
    }
    onChange(next)
  }

  return (
    <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/25 space-y-4">
      {/* Başlık + Hesap Kimliği */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {creatorInfo?.creator_avatar_url ? (
            <img
              src={creatorInfo.creator_avatar_url}
              alt={creatorInfo.creator_nickname || 'TikTok Avatar'}
              className="w-10 h-10 rounded-full object-cover border border-cyan-400/50"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-xs">
              TT
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">
                {creatorInfo?.creator_nickname || 'TikTok Hesap Bilgisi'}
              </span>
              {creatorInfo?.creator_username && (
                <span className="text-[11px] font-mono text-cyan-300">
                  @{creatorInfo.creator_username}
                </span>
              )}
              {creatorInfo && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {creatorInfo?.max_video_post_duration_sec
                ? `Maks. video süresi: ${creatorInfo.max_video_post_duration_sec} sn`
                : infoError || 'TikTok Direct Post ayarları (Creator Info)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchCreatorInfo}
          disabled={loadingInfo}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loadingInfo ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Bilgileri Yenile</span>
        </button>
      </div>

      {/* 1. Gizlilik Düzeyi (Varsayılan Seçimsiz) */}
      <div className="space-y-1.5">
        <label htmlFor="tiktok-privacy-select" className="block text-xs font-bold text-white">
          Kimler bu içeriği görebilir? <span className="text-orange-400">*</span>
        </label>
        <select
          id="tiktok-privacy-select"
          value={value.privacyLevel}
          onChange={(e) =>
            onChange({
              ...value,
              privacyLevel: e.target.value as TikTokPrivacyLevel,
            })
          }
          className="w-full rounded-xl bg-[#0b101b] border border-white/15 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="">— Gizlilik düzeyi seçin (zorunlu) —</option>
          {privacyOptions.map((opt) => {
            const isBlockedSelfOnly = opt === 'SELF_ONLY' && value.brandContentToggle
            return (
              <option key={opt} value={opt} disabled={isBlockedSelfOnly}>
                {PRIVACY_LABELS[opt] || opt}
                {isBlockedSelfOnly ? ' (Markalı içerikte kullanılamaz)' : ''}
              </option>
            )
          })}
        </select>
        {value.brandContentToggle && (
          <p className="text-[11px] text-amber-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Markalı içerik &quot;Sadece Ben&quot; olarak paylaşılamaz.</span>
          </p>
        )}
      </div>

      {/* 2. Etkileşim İzinleri (Varsayılan Kapalı / İşaretsiz) */}
      <div className="space-y-2">
        <span className="block text-xs font-bold text-white">Kullanıcıların şunları yapmasına izin ver:</span>
        <div className="flex flex-wrap gap-3">
          <label
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
              creatorInfo?.comment_disabled
                ? 'bg-white/[0.02] border-white/5 text-slate-500 cursor-not-allowed'
                : value.allowComment
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-300'
            }`}
          >
            <input
              type="checkbox"
              disabled={Boolean(creatorInfo?.comment_disabled)}
              checked={value.allowComment}
              onChange={(e) => onChange({ ...value, allowComment: e.target.checked })}
              className="rounded border-white/20 text-cyan-500 focus:ring-0"
            />
            <span>Yorum (Comment)</span>
          </label>

          {isVideo && (
            <>
              <label
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  creatorInfo?.duet_disabled
                    ? 'bg-white/[0.02] border-white/5 text-slate-500 cursor-not-allowed'
                    : value.allowDuet
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={Boolean(creatorInfo?.duet_disabled)}
                  checked={value.allowDuet}
                  onChange={(e) => onChange({ ...value, allowDuet: e.target.checked })}
                  className="rounded border-white/20 text-cyan-500 focus:ring-0"
                />
                <span>Düet (Duet)</span>
              </label>

              <label
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  creatorInfo?.stitch_disabled
                    ? 'bg-white/[0.02] border-white/5 text-slate-500 cursor-not-allowed'
                    : value.allowStitch
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={Boolean(creatorInfo?.stitch_disabled)}
                  checked={value.allowStitch}
                  onChange={(e) => onChange({ ...value, allowStitch: e.target.checked })}
                  className="rounded border-white/20 text-cyan-500 focus:ring-0"
                />
                <span>Birleştirme (Stitch)</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* 3. Ticari İçerik Bildirimi (Varsayılan Kapalı) */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-white">Ticari içerik bildirimi (Commercial Content)</p>
            <p className="text-[11px] text-slate-400">
              İçerik kendinizi veya üçüncü bir markayı tanıtıyorsa açık konuma getirin.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={value.commercialContentEnabled}
            onClick={() =>
              onChange({
                ...value,
                commercialContentEnabled: !value.commercialContentEnabled,
                brandOrganicToggle: !value.commercialContentEnabled ? value.brandOrganicToggle : false,
                brandContentToggle: !value.commercialContentEnabled ? value.brandContentToggle : false,
              })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              value.commercialContentEnabled ? 'bg-cyan-500' : 'bg-white/15'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                value.commercialContentEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {value.commercialContentEnabled && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={value.brandOrganicToggle}
                onChange={(e) => onChange({ ...value, brandOrganicToggle: e.target.checked })}
                className="mt-0.5 rounded border-white/20 text-cyan-500 focus:ring-0"
              />
              <span>
                <strong className="text-white">Kendi Markanız (Your Brand):</strong> Kendi markanızı veya ürününüzü
                tanıtıyorsunuz — gönderide &quot;Tanıtım içeriği&quot; etiketi görünür.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={value.brandContentToggle}
                onChange={(e) => handleBrandContentChange(e.target.checked)}
                className="mt-0.5 rounded border-white/20 text-cyan-500 focus:ring-0"
              />
              <span>
                <strong className="text-white">Markalı İçerik (Branded Content):</strong> Başka bir marka için
                ücretli ortaklık — gönderide &quot;Ücretli ortaklık&quot; etiketi görünür.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 4. Yasal Beyan (Music Usage & Branded Content Policy) */}
      <div className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          {value.commercialContentEnabled && value.brandContentToggle ? (
            <>
              Paylaşarak TikTok&apos;un{' '}
              <a
                href="https://www.tiktok.com/legal/page/global/bc-policy/en"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 underline hover:text-cyan-200"
              >
                Markalı İçerik Politikasını
              </a>{' '}
              ve{' '}
              <a
                href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 underline hover:text-cyan-200"
              >
                Müzik Kullanım Onayını
              </a>{' '}
              kabul etmiş olursunuz.
            </>
          ) : (
            <>
              Paylaşarak TikTok&apos;un{' '}
              <a
                href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 underline hover:text-cyan-200"
              >
                Müzik Kullanım Onayını
              </a>{' '}
              kabul etmiş olursunuz.
            </>
          )}
        </p>
      </div>

      {!validity.valid && validity.reason && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{validity.reason}</span>
        </div>
      )}
    </div>
  )
}
