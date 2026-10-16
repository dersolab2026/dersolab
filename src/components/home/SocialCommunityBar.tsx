'use client'

import React from 'react'
import Image from 'next/image'
import { ExternalLink, Sparkles, MessageCircle, Heart, Film } from 'lucide-react'

export function SocialCommunityBar() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#130E1F]/90 to-slate-900/90 border border-purple-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background Accent Glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Copy */}
        <div className="space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Image
              src="/fox-head.png"
              alt="DersoLab Maskot"
              width={18}
              height={18}
              className="w-4 h-4 object-contain"
            />
            <span>@dersolabegitim • Sosyal Medya Topluluğu</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sınava Hazırlıkta Bir Adım Önde Olun.
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Instagram ve TikTok hesaplarımızda her gün 1 soru çözümü, haftalık paragraf & edebiyat taktikleri ve canlı ders kesitlerini kaçırmayın!
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              Günün Sorusu & Quizler
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              3D Laboratuvar İpuçları
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              YKS & LGS Taktikleri
            </span>
          </div>
        </div>

        {/* Right: Direct Follow Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/dersolabegitim/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(236,72,153,0.35)] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram'da Takip Et</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* TikTok Link */}
          <a
            href="https://www.tiktok.com/@dersolabegitim"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.07c.01 1.83-.56 3.69-1.76 5.09-1.39 1.61-3.54 2.53-5.66 2.45-2.26-.06-4.43-1.19-5.71-3.04-1.43-2.02-1.7-4.75-.71-7 1.01-2.28 3.27-3.86 5.76-4.05.35-.03.7-.03 1.05 0v4.11c-.51-.06-1.03-.02-1.52.14-.99.31-1.78 1.12-2.05 2.12-.39 1.34.19 2.87 1.37 3.58 1.07.64 2.48.56 3.48-.19.78-.58 1.24-1.54 1.22-2.52V.02h-.01z"/>
            </svg>
            <span>TikTok'ta Keşfet</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  )
}
