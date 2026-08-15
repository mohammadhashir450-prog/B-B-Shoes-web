// src/components/3d/ShoeModel.tsx
'use client'

import { useRef, useEffect } from 'react'
import { useGLTF, Environment, ContactShadows, PresentationControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ShoeModelProps {
  scrollProgress: React.MutableRefObject<number>
}

export function ShoeModel({ scrollProgress }: ShoeModelProps) {
  const { nodes, materials } = useGLTF('/shoe.glb')
  const groupRef = useRef<THREE.Group>(null)
  const floatRef  = useRef({ y: 0, active: true })

  // Subtle float animation
  useFrame((_, delta) => {
    if (!groupRef.current) return
    const t = performance.now() * 0.001

    // Blend float with scroll-driven position
    const sp = scrollProgress.current
    const floatY = Math.sin(t * 1.4) * 0.06
    const targetY = floatY + sp * -0.3

    groupRef.current.position.y += (targetY - groupRef.current.position.y) * delta * 3

    // Scroll-driven rotation: remap 0→1 to show all sides
    const targetRotY = sp * Math.PI * 1.8
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * delta * 4

    // Slight tilt on scroll
    const targetRotX = sp * 0.3
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * delta * 3

    // Scale pulse: grow then shrink slightly
    const targetScale = 1 + Math.sin(t * 0.8) * 0.012
    groupRef.current.scale.setScalar(targetScale)
  })

  return (
    <PresentationControls
      global
      speed={1.4}
      zoom={0.8}
      polar={[-0.25, 0.25]}
      azimuth={[-0.6, 0.6]}
      snap={true}
    >
      <group ref={groupRef} dispose={null}>
        <mesh
          geometry={(nodes.Shoe as THREE.Mesh).geometry}
          material={materials.phong1SG}
          position={[0.002, 0.076, 0.005]}
          scale={0.149}
          castShadow
          receiveShadow
        />
      </group>
    </PresentationControls>
  )
}

useGLTF.preload('/shoe.glb')
