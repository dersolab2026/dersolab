'use client'

import { useEffect, useRef } from 'react'
import type { PersonaType } from '../../PersonaSwitcher'

export function SurrealBackground({ persona = 'student' }: { persona?: PersonaType }) {
  const spotlightRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Dynamic Spotlight following cursor with role-tinted halo
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return
      const x = e.clientX
      const y = e.clientY

      if (persona === 'parent') {
        spotlightRef.current.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.14), rgba(220, 38, 38, 0.08) 40%, transparent 80%)`
      } else if (persona === 'instructor') {
        spotlightRef.current.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(168, 85, 247, 0.14), rgba(245, 158, 11, 0.08) 40%, transparent 80%)`
      } else {
        spotlightRef.current.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(220, 38, 38, 0.16), rgba(245, 158, 11, 0.08) 40%, transparent 80%)`
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Rising Surreal Dream Dust & Embers Canvas
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Embers palette depending on persona
    const emberColors =
      persona === 'parent'
        ? ['16, 185, 129', '52, 211, 153', '239, 68, 68', '245, 158, 11']
        : persona === 'instructor'
        ? ['168, 85, 247', '192, 132, 252', '245, 158, 11', '252, 211, 77']
        : ['245, 158, 11', '239, 68, 68', '217, 119, 6', '252, 211, 77']

    const embers: {
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      opacity: number
      fadeSpeed: number
      color: string
    }[] = []

    for (let i = 0; i < 45; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.8,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        fadeSpeed: Math.random() * 0.008 + 0.003,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.y -= e.speedY
        e.x += e.speedX
        e.opacity -= e.fadeSpeed

        if (e.opacity <= 0 || e.y < 0) {
          e.y = height + 10
          e.x = Math.random() * width
          e.opacity = Math.random() * 0.7 + 0.3
        }

        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${e.color}, ${e.opacity})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgb(${e.color})`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [persona])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070408]">
      {/* Deep Lynchian Crimson & Obsidian Ambient Vignette */}
      <div className="absolute inset-0 bg-radial from-[#1A0914] via-[#0D040A] to-[#040105]" />

      {/* Dynamic Cursor Spotlight (Lynchian Stage Light) */}
      <div ref={spotlightRef} className="absolute inset-0 transition-all duration-75" />

      {/* Dynamic Persona-Tinted Surrealist Auras */}
      {persona === 'student' && (
        <>
          <div className="absolute -top-32 left-1/3 w-[650px] h-[650px] bg-red-900/[0.22] rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute top-1/2 -right-20 w-[550px] h-[550px] bg-amber-600/[0.18] rounded-full blur-[160px] animate-pulse-glow" />
        </>
      )}

      {persona === 'parent' && (
        <>
          <div className="absolute -top-32 left-1/3 w-[650px] h-[650px] bg-emerald-900/[0.22] rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute top-1/2 -right-20 w-[550px] h-[550px] bg-red-900/[0.18] rounded-full blur-[160px] animate-pulse-glow" />
        </>
      )}

      {persona === 'instructor' && (
        <>
          <div className="absolute -top-32 left-1/3 w-[650px] h-[650px] bg-purple-900/[0.22] rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute top-1/2 -right-20 w-[550px] h-[550px] bg-amber-600/[0.18] rounded-full blur-[160px] animate-pulse-glow" />
        </>
      )}

      {/* Left and Right Waving Velvet Drapes */}
      <div
        className="absolute top-0 left-0 bottom-0 w-16 sm:w-28 opacity-40 bg-gradient-to-r from-red-950/80 via-red-900/30 to-transparent animate-curtain-left pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(136,19,55,0.4) 0px, rgba(76,5,25,0.8) 15px, rgba(136,19,55,0.4) 30px)',
        }}
      />
      <div
        className="absolute top-0 right-0 bottom-0 w-16 sm:w-28 opacity-40 bg-gradient-to-l from-red-950/80 via-red-900/30 to-transparent animate-curtain-right pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-90deg, rgba(136,19,55,0.4) 0px, rgba(76,5,25,0.8) 15px, rgba(136,19,55,0.4) 30px)',
        }}
      />

      {/* Live Rising Dream Dust / Embers Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

      {/* Perspective 3D Chevron Floor at Bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-[28rem] opacity-35"
        style={{
          perspective: '600px',
          perspectiveOrigin: '50% 0%',
        }}
      >
        <div
          className="w-[200%] -left-[50%] h-[200%] absolute"
          style={{
            transform: 'rotateX(74deg) translateY(-20%)',
            backgroundImage: `repeating-linear-gradient(45deg, #331826 0px, #331826 22px, #0e070c 22px, #0e070c 44px), repeating-linear-gradient(-45deg, #331826 0px, #331826 22px, #0e070c 22px, #0e070c 44px)`,
            backgroundBlendMode: 'difference',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 40%, transparent 95%)',
          }}
        />
      </div>
    </div>
  )
}
