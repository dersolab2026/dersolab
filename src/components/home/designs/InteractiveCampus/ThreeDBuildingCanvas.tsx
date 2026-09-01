'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ArrowRight, Video, ShieldCheck, Award, Volume2, VolumeX } from 'lucide-react'
import { campusSound } from './CampusSoundEngine'

interface ThreeDBuildingCanvasProps {
  onEnter: () => void
}

export function ThreeDBuildingCanvas({ onEnter }: ThreeDBuildingCanvasProps) {
  const particleRef = useRef<HTMLCanvasElement>(null)
  const isEnteringRef = useRef(false)
  const [isHoveringDoor, setIsHoveringDoor] = useState(false)
  const [isEntering, setIsEntering] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Three.js — sadece parçacık/atmosfer efekti için
  useEffect(() => {
    const canvas = particleRef.current
    if (!canvas) return
    const W = canvas.clientWidth || 1024
    const H = canvas.clientHeight || 860

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 5

    // Yüzen parçacıklar (bokeh/dust)
    const count = 280
    const positions = new Float32Array(count * 3)
    const velocities: number[] = []
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      velocities.push((Math.random() - 0.5) * 0.004, Math.random() * 0.006 + 0.002, 0)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Parlak nokta dokusu
    const ptCanvas = document.createElement('canvas')
    ptCanvas.width = ptCanvas.height = 64
    const ptCtx = ptCanvas.getContext('2d')!
    const grad = ptCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(253,224,71,1)')
    grad.addColorStop(0.4, 'rgba(245,158,11,0.6)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ptCtx.fillStyle = grad
    ptCtx.fillRect(0, 0, 64, 64)
    const ptTex = new THREE.CanvasTexture(ptCanvas)

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      map: ptTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
      color: 0xfde047,
      opacity: 0.7,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Büyük halo küreleri (arka ışık bokeh)
    const blobGeo = new THREE.BufferGeometry()
    const blobCount = 18
    const blobPos = new Float32Array(blobCount * 3)
    for (let i = 0; i < blobCount; i++) {
      blobPos[i * 3]     = (Math.random() - 0.5) * 16
      blobPos[i * 3 + 1] = (Math.random() - 0.5) * 10
      blobPos[i * 3 + 2] = -2 + Math.random() * -2
    }
    blobGeo.setAttribute('position', new THREE.BufferAttribute(blobPos, 3))
    const blobMat = new THREE.PointsMaterial({
      size: 1.8,
      map: ptTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xf59e0b,
      opacity: 0.06,
    })
    scene.add(new THREE.Points(blobGeo, blobMat))

    const timer = new THREE.Timer()
    let elapsed = 0
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      timer.update(); elapsed += timer.getDelta()

      const pos = geo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < count; i++) {
        pos.array[i * 3]     += velocities[i * 3]
        pos.array[i * 3 + 1] += velocities[i * 3 + 1]
        pos.array[i * 3 + 2] += Math.sin(elapsed * 0.5 + i) * 0.001

        // Sınır kontrolü — yukarı çıkınca aşağıdan tekrar gir
        if ((pos.array as Float32Array)[i * 3 + 1] > 7) {
          (pos.array as Float32Array)[i * 3 + 1] = -7
          ;(pos.array as Float32Array)[i * 3]     = (Math.random() - 0.5) * 18
        }
        if (Math.abs((pos.array as Float32Array)[i * 3]) > 10) {
          velocities[i * 3] *= -1
        }
      }
      pos.needsUpdate = true

      // Kamera hafif nefes
      camera.position.x = Math.sin(elapsed * 0.12) * 0.08
      camera.position.y = Math.cos(elapsed * 0.09) * 0.05

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!canvas) return
      const w = canvas.clientWidth, h = canvas.clientHeight
      camera.aspect = w / h; camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
      renderer.dispose()
    }
  }, [])

  // Parallax mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    })
  }

  const triggerEntry = () => {
    if (isEnteringRef.current) return
    isEnteringRef.current = true
    setIsEntering(true)
    campusSound.playDoorOpen()
    setTimeout(() => onEnter(), 1400)
  }

  const px = mousePos.x * 12  // parallax hareket miktarı
  const py = mousePos.y * 8

  return (
    <div
      className="relative rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_140px_rgba(0,0,0,0.99)] select-none bg-[#05070f] cursor-default"
      style={{ height: 860 }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Fotogerçekçi Bina Arka Planı (Parallax) ── */}
      <div
        className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate(${px * -0.4}px, ${py * -0.3}px) scale(1.06)`,
          backgroundImage: 'url(/dersolab-building-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isEntering ? 'brightness(3) blur(8px)' : 'brightness(0.92)',
          transition: isEntering ? 'filter 1.4s ease' : 'filter 0.3s, transform 0.08s ease-out',
        }}
      />

      {/* Üst karartma gradyanı */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070f]/70 via-transparent to-[#05070f]/80 pointer-events-none" />
      {/* Alt sis */}
      <div className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-[#05070f] to-transparent pointer-events-none" />

      {/* ── Three.js Parçacık Canvas (üst katman) ── */}
      <canvas
        ref={particleRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* ── İnteraktif Kapı Hotspot ── */}
      <div
        className="absolute cursor-pointer"
        style={{
          left: '50%',
          top: '53%',
          transform: 'translate(-50%, 0)',
          width: 56,
          height: 158,
        }}
        onMouseEnter={() => setIsHoveringDoor(true)}
        onMouseLeave={() => setIsHoveringDoor(false)}
        onClick={triggerEntry}
      >
        {/* Tamamen görünmez — sadece tıklama alanı */}
      </div>

      {/* Kapı açılıyor efekti */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '53%',
          transform: 'translate(-50%, 0)',
          width: 56,
          height: 158,
          perspective: 400,
        }}
      >
        {/* Sol kanat */}
        <div
          className="absolute left-0 top-0 h-full transition-all duration-700 ease-out origin-left"
          style={{
            width: '50%',
            transformStyle: 'preserve-3d',
            transform: isHoveringDoor
              ? 'rotateY(-62deg)'
              : 'rotateY(0deg)',
            background: isHoveringDoor
              ? 'linear-gradient(to right, rgba(253,224,71,0.22), rgba(253,224,71,0.04))'
              : 'linear-gradient(to right, rgba(253,224,71,0.04), rgba(253,224,71,0.01))',
            borderRight: '1px solid rgba(253,224,71,0.3)',
            backdropFilter: isHoveringDoor ? 'blur(1px) brightness(1.35)' : 'blur(0px)',
            boxShadow: isHoveringDoor ? 'inset -8px 0 24px rgba(253,224,71,0.2)' : 'none',
          }}
        />
        {/* Sağ kanat */}
        <div
          className="absolute right-0 top-0 h-full transition-all duration-700 ease-out origin-right"
          style={{
            width: '50%',
            transformStyle: 'preserve-3d',
            transform: isHoveringDoor
              ? 'rotateY(62deg)'
              : 'rotateY(0deg)',
            background: isHoveringDoor
              ? 'linear-gradient(to left, rgba(253,224,71,0.22), rgba(253,224,71,0.04))'
              : 'linear-gradient(to left, rgba(253,224,71,0.04), rgba(253,224,71,0.01))',
            borderLeft: '1px solid rgba(253,224,71,0.3)',
            backdropFilter: isHoveringDoor ? 'blur(1px) brightness(1.35)' : 'blur(0px)',
            boxShadow: isHoveringDoor ? 'inset 8px 0 24px rgba(253,224,71,0.2)' : 'none',
          }}
        />

        {/* İçeriden yayılan sıcak atrium ışığı */}
        <div
          className="absolute inset-x-4 top-8 bottom-0 transition-all duration-700 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(253,200,50,0.55) 0%, transparent 70%)',
            opacity: isHoveringDoor ? 1 : 0,
            filter: 'blur(6px)',
          }}
        />
      </div>

      {/* Zemin yansıması */}
      <div
        className="absolute pointer-events-none transition-all duration-500"
        style={{
          left: '50%',
          top: '73%',
          transform: 'translate(-50%, 0)',
          width: 120,
          height: 50,
          background: 'radial-gradient(ellipse, rgba(253,224,71,0.45) 0%, transparent 70%)',
          opacity: isHoveringDoor ? 1 : 0.18,
          filter: 'blur(10px)',
        }}
      />

      {/* Hover etiketi */}
      <div
        className="absolute pointer-events-none transition-all duration-300 flex flex-col items-center gap-1"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -100%)',
          opacity: isHoveringDoor ? 1 : 0,
        }}
      >
        <div className="text-xl animate-bounce">👇</div>
        <div className="px-3 py-1 rounded-full bg-black/85 border border-amber-400/70 text-amber-300 text-[11px] font-bold font-mono backdrop-blur-md shadow-lg">
          KAPIDAN GEÇ
        </div>
      </div>

      {/* ── Üst HUD ── */}
      <div className="absolute top-5 inset-x-5 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/85 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold backdrop-blur-xl shadow-2xl pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>DERSOLAB AKADEMİ — 3D KAMPÜS</span>
        </div>
        <button
          type="button"
          onClick={() => { const n = !soundEnabled; setSoundEnabled(n); campusSound.enabled = n }}
          className="p-2.5 rounded-xl bg-black/80 hover:bg-black border border-white/20 cursor-pointer backdrop-blur-xl shadow-lg transition-all pointer-events-auto"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* ── Merkez CTA ── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-auto">
        <div
          className="px-5 py-2 rounded-full bg-black/90 border-2 border-amber-400 backdrop-blur-2xl text-xs font-mono font-bold text-amber-300 transition-all duration-300"
          style={{ boxShadow: isHoveringDoor ? '0 0 45px rgba(245,158,11,0.9)' : '0 0 25px rgba(245,158,11,0.5)' }}
        >
          {isHoveringDoor ? '✦ KAPIDAN GEÇ — TIKLAYIN ✦' : '✦ KAPIYA TIKLAYIN VEYA AŞAĞIDAN GİRİN ✦'}
        </div>

        <button
          type="button"
          onClick={triggerEntry}
          className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-extrabold text-lg shadow-[0_0_70px_rgba(245,158,11,0.95)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="text-2xl">🚪</span>
          <span>DERSOLAB'A GİR</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* ── Alt Bilgi Şeridi ── */}
      <div className="absolute bottom-3 inset-x-5 z-20 p-2.5 rounded-2xl bg-black/85 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-around gap-3 text-xs text-slate-300 font-mono pointer-events-none">
        <span className="flex items-center gap-1.5 text-amber-300 font-bold">
          <Video className="w-3.5 h-3.5 text-emerald-400" />Şu An 14 Canlı Seans
        </span>
        <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Onaylı Öğretmen Kadrosu
        </span>
        <span className="flex items-center gap-1.5 text-rose-300 font-bold">
          <Award className="w-3.5 h-3.5 text-rose-400" />20 Dk Ücretsiz Tanışma Açık
        </span>
      </div>

      {/* Fly-through geçiş */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-400 via-amber-100 to-white transition-opacity duration-1400 z-30 ${isEntering ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}
