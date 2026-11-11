'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface NodeData {
  label: string
  color: number
  position: THREE.Vector3
  mesh?: THREE.Mesh
}

export function DersoLabTasteCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const width = container.clientWidth || 500
    const height = container.clientHeight || 500
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 8.5

    // Renderer setup with transparency and antialias
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Main Group for interactive mouse rotation
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // 1. Central Geodesic Icosahedron Core (Structural Integrity)
    const coreGeometry = new THREE.IcosahedronGeometry(2.1, 2)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    mainGroup.add(coreMesh)

    // Inner subtle glow sphere
    const innerGeo = new THREE.IcosahedronGeometry(1.4, 1)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Warm Amber
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    mainGroup.add(innerMesh)

    // 2. Surrounding Orbital Rings (Academic Focus Rings)
    const ringGeo1 = new THREE.TorusGeometry(3.2, 0.015, 16, 100)
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
    })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    ring1.rotation.x = Math.PI / 3
    ring1.rotation.y = Math.PI / 6
    mainGroup.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(3.6, 0.012, 16, 100)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald Net Gain
      transparent: true,
      opacity: 0.35,
    })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = Math.PI / 3
    mainGroup.add(ring2)

    // 3. Particle Field (Knowledge Atoms)
    const particleCount = 180
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    const amberColor = new THREE.Color(0xf59e0b)
    const titaniumColor = new THREE.Color(0xf8fafc)
    const emeraldColor = new THREE.Color(0x10b981)

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const rand = Math.random()
      const c = rand > 0.6 ? amberColor : rand > 0.3 ? titaniumColor : emeraldColor
      particleColors[i * 3] = c.r
      particleColors[i * 3 + 1] = c.g
      particleColors[i * 3 + 2] = c.b
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    mainGroup.add(particleSystem)

    // 4. Milestone Nodes (Subject Mastery Anchors)
    const nodes: NodeData[] = [
      { label: 'Matematik', color: 0xf59e0b, position: new THREE.Vector3(2.5, 1.2, 0.8) },
      { label: 'Fizik', color: 0x10b981, position: new THREE.Vector3(-2.2, 1.5, -0.6) },
      { label: 'Geometri', color: 0xfbbf24, position: new THREE.Vector3(1.8, -1.8, 1.1) },
      { label: 'Türkçe', color: 0x38bdf8, position: new THREE.Vector3(-1.9, -1.4, -1.2) },
      { label: 'Koçluk', color: 0x10b981, position: new THREE.Vector3(0.2, 2.7, -0.4) },
    ]

    const nodeMeshes: THREE.Mesh[] = []
    nodes.forEach((node) => {
      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16)
      const nodeMat = new THREE.MeshBasicMaterial({ color: node.color })
      const mesh = new THREE.Mesh(nodeGeo, nodeMat)
      mesh.position.copy(node.position)
      mainGroup.add(mesh)
      nodeMeshes.push(mesh)

      // Outer pulsating aura ring for each node
      const auraGeo = new THREE.RingGeometry(0.18, 0.22, 24)
      const auraMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      })
      const auraMesh = new THREE.Mesh(auraGeo, auraMat)
      auraMesh.position.copy(node.position)
      auraMesh.lookAt(camera.position)
      mainGroup.add(auraMesh)
    })

    // Mouse Interaction with smooth lerp
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      mouseX = x * 2
      mouseY = y * 2
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Idle rotations
      coreMesh.rotation.y += 0.003
      coreMesh.rotation.x += 0.0015
      innerMesh.rotation.y -= 0.004

      ring1.rotation.z += 0.002
      ring2.rotation.z -= 0.003

      particleSystem.rotation.y += 0.0012

      // Node breathing / slight floating
      nodeMeshes.forEach((mesh, idx) => {
        mesh.position.y += Math.sin(time * 2 + idx) * 0.0015
      })

      // Mouse Parallax Lerping
      targetRotationY = mouseX * 0.75
      targetRotationX = -mouseY * 0.75

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup to prevent memory leaks
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)

      coreGeometry.dispose()
      coreMaterial.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      ringGeo1.dispose()
      ringMat1.dispose()
      ringGeo2.dispose()
      ringMat2.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] cursor-grab active:cursor-grabbing select-none"
      title="DersoLab 3D Başarı Matrisi — İmleçle döndürebilirsiniz"
    />
  )
}
