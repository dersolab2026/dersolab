'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RotateCw, Lock, Unlock } from 'lucide-react'

interface AtomVisualizer3DProps {
  elementSymbol: string
  elementName: string
  atomicNumber: number
  colorHex?: string
}

export function AtomVisualizer3D({
  elementSymbol,
  elementName,
  atomicNumber,
  colorHex = '#10B981',
}: AtomVisualizer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [touchInteract, setTouchInteract] = useState(false)
  const rotationRef = useRef({ x: 0, y: 0, isDragging: false, prevX: 0, prevY: 0 })

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 280

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 22

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(colorHex, 3, 50)
    pointLight.position.set(5, 5, 8)
    scene.add(pointLight)

    // Master Group for User Rotation
    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // Nucleus Group
    const nucleusGroup = new THREE.Group()
    const nucleusColor = new THREE.Color(colorHex)

    // Core sphere (glowing nucleus)
    const coreGeometry = new THREE.SphereGeometry(1.8, 32, 32)
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: nucleusColor,
      emissive: nucleusColor,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    })
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    nucleusGroup.add(coreMesh)

    // Protons / Neutrons small cluster spheres
    const clusterCount = Math.min(Math.max(atomicNumber, 4), 18)
    const subSphereGeo = new THREE.SphereGeometry(0.55, 16, 16)
    const subMaterialProton = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red for protons
      roughness: 0.3,
    })
    const subMaterialNeutron = new THREE.MeshStandardMaterial({
      color: 0x60a5fa, // Blue for neutrons
      roughness: 0.3,
    })

    for (let i = 0; i < clusterCount; i++) {
      const radius = 1.3
      const phi = Math.acos(-1 + (2 * i) / clusterCount)
      const theta = Math.sqrt(clusterCount * Math.PI) * phi
      const sphere = new THREE.Mesh(
        subSphereGeo,
        i % 2 === 0 ? subMaterialProton : subMaterialNeutron
      )
      sphere.position.set(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      )
      nucleusGroup.add(sphere)
    }

    masterGroup.add(nucleusGroup)

    // Electron Shells (Orbits)
    let shellCount = 1
    if (atomicNumber > 2) shellCount = 2
    if (atomicNumber > 10) shellCount = 3
    if (atomicNumber > 18) shellCount = 4

    const orbitsGroup = new THREE.Group()
    const electronMeshes: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; axis: THREE.Vector3 }[] = []

    const electronGeo = new THREE.SphereGeometry(0.35, 16, 16)
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
    })

    const orbitGeometries: THREE.BufferGeometry[] = []
    const orbitMaterials: THREE.Material[] = []

    // Predefined orbit tilt rotations
    const tilts = [
      new THREE.Vector3(1, 0.4, 0).normalize(),
      new THREE.Vector3(0.2, 1, 0.5).normalize(),
      new THREE.Vector3(-0.6, 0.4, 1).normalize(),
      new THREE.Vector3(0.7, -0.7, 0.3).normalize(),
    ]

    for (let s = 0; s < shellCount; s++) {
      const orbitRadius = 4.2 + s * 2.2
      const orbitPoints: THREE.Vector3[] = []
      const segments = 64

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        orbitPoints.push(new THREE.Vector3(Math.cos(theta) * orbitRadius, Math.sin(theta) * orbitRadius, 0))
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints)
      orbitGeometries.push(orbitGeo)
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.35,
      })
      orbitMaterials.push(orbitMat)
      const ring = new THREE.LineLoop(orbitGeo, orbitMat)

      const tiltAxis = tilts[s % tilts.length]
      ring.rotation.x = tiltAxis.x * Math.PI
      ring.rotation.y = tiltAxis.y * Math.PI
      ring.rotation.z = tiltAxis.z * Math.PI

      orbitsGroup.add(ring)

      // Add electrons for this shell
      const electronsInThisShell = Math.min(s === 0 ? Math.min(atomicNumber, 2) : 4, atomicNumber)
      for (let e = 0; e < electronsInThisShell; e++) {
        const electronMesh = new THREE.Mesh(electronGeo, electronMat)
        orbitsGroup.add(electronMesh)
        electronMeshes.push({
          mesh: electronMesh,
          orbitRadius,
          speed: (1.5 - s * 0.25) * (e % 2 === 0 ? 1 : -1),
          angle: (e * Math.PI * 2) / electronsInThisShell,
          axis: tiltAxis,
        })
      }
    }

    masterGroup.add(orbitsGroup)

    // Drag Interaction (Mouse & Touch)
    const onPointerDown = (e: PointerEvent) => {
      rotationRef.current.isDragging = true
      rotationRef.current.prevX = e.clientX
      rotationRef.current.prevY = e.clientY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!rotationRef.current.isDragging) return
      const deltaX = e.clientX - rotationRef.current.prevX
      const deltaY = e.clientY - rotationRef.current.prevY
      rotationRef.current.prevX = e.clientX
      rotationRef.current.prevY = e.clientY

      rotationRef.current.y += deltaX * 0.008
      rotationRef.current.x += deltaY * 0.008
    }

    const onPointerUp = () => {
      rotationRef.current.isDragging = false
    }

    const domElement = renderer.domElement
    domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    // Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // User drag orientation
      masterGroup.rotation.y = rotationRef.current.y
      masterGroup.rotation.x = rotationRef.current.x

      // Rotate nucleus
      nucleusGroup.rotation.y += delta * 0.8
      nucleusGroup.rotation.x += delta * 0.4

      // Orbit electrons
      electronMeshes.forEach((e) => {
        e.angle += e.speed * delta * 2.0
        const localX = Math.cos(e.angle) * e.orbitRadius
        const localY = Math.sin(e.angle) * e.orbitRadius
        const pos = new THREE.Vector3(localX, localY, 0)

        // Apply tilt rotation
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), e.axis.x * Math.PI)
        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), e.axis.y * Math.PI)
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), e.axis.z * Math.PI)

        e.mesh.position.copy(pos)
      })

      // Gentle wobble of the whole orbit group
      orbitsGroup.rotation.y = Math.sin(time * 0.4) * 0.2
      orbitsGroup.rotation.x = Math.cos(time * 0.3) * 0.15

      renderer.render(scene, camera)
    }

    animate()

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Comprehensive Resource Disposal
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)

      domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      // Geometries
      coreGeometry.dispose()
      subSphereGeo.dispose()
      electronGeo.dispose()
      orbitGeometries.forEach((g) => g.dispose())

      // Materials
      coreMaterial.dispose()
      subMaterialProton.dispose()
      subMaterialNeutron.dispose()
      electronMat.dispose()
      orbitMaterials.forEach((m) => m.dispose())

      renderer.dispose()
    }
  }, [atomicNumber, colorHex])

  return (
    <div className="relative w-full h-[280px] flex items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
      {/* 3D Canvas Mount with touch-action control */}
      <div
        ref={mountRef}
        className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing ${
          touchInteract ? 'touch-none' : 'touch-pan-y'
        }`}
      />

      {/* Floating Atom Overlay Info */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Canlı 3D Model</span>
        <span className="text-xs font-semibold text-white/90">
          {elementName} ({elementSymbol})
        </span>
      </div>

      {/* Touch / Drag Lock Toggle for Mobile */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setTouchInteract((prev) => !prev)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
            touchInteract
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
          }`}
          title={touchInteract ? 'Dokunarak döndürme aktif (Sayfa kaymaz)' : 'Sayfayı kaydırmak serbest (Döndürmek için açın)'}
        >
          {touchInteract ? <Unlock className="w-3 h-3 text-cyan-400" /> : <Lock className="w-3 h-3 text-slate-400" />}
          <span>{touchInteract ? '3D Döndür' : 'Kaydırma Modu'}</span>
        </button>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-slate-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Z = {atomicNumber} Proton / Elektron</span>
      </div>
    </div>
  )
}
