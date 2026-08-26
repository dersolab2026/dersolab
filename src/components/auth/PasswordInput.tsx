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
        className={`${PIXEL_INPUT} pr-11`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--yazi)]/60 hover:text-[var(--yazi)]"
        aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  )
}
