'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { PIXEL_INPUT } from '@/lib/theme'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
  minLength?: number
  placeholder?: string
}

export function PasswordInput({ value, onChange, required, minLength, placeholder }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all pr-11"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  )
}
