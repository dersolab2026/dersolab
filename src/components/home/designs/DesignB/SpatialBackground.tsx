'use client'

import { useEffect, useRef } from 'react'

export function SpatialBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle nodes
    const particleCount = Math.min(width > 768 ? 55 : 25, 60)
    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
    }[] = []

    const colors = ['rgba(16, 185, 129, ', 'rgba(6, 182, 212, ', 'rgba(139, 92, 246, ']

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let mouseX = width / 2
    let mouseY = height / 2

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw faint spatial laser grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)'
      ctx.lineWidth = 1
      const gridSize = 60
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Gentle mouse interaction
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180) {
          p.x -= (dx / dist) * 0.4
          p.y -= (dy / dist) * 0.4
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}0.8)`
        ctx.fill()

        // Connect nearby particles with glowing laser links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist2 < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `${p.color}${0.2 * (1 - dist2 / 120)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep Cyber Gradient Backdrop */}
      <div className="absolute inset-0 bg-radial from-[#0B101E] via-[#05070D] to-[#020306]" />

      {/* Cyber Luminous Glow Beams */}
      <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-emerald-500/[0.07] rounded-full blur-[160px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/[0.06] rounded-full blur-[180px]" />
      <div className="absolute -bottom-40 left-1/3 w-[800px] h-[600px] bg-violet-600/[0.06] rounded-full blur-[170px]" />

      {/* Live Interactive Particle Grid Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-85" />
    </div>
  )
}
