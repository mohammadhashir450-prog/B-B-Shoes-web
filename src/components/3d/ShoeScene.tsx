// src/components/3d/ShoeScene.tsx
'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei'
import { ShoeModel } from './ShoeModel'

interface ShoeSceneProps {
  scrollProgress: React.MutableRefObject<number>
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#D4AF37" wireframe />
    </mesh>
  )
}

export default function ShoeScene({ scrollProgress }: ShoeSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 2.8], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[-4, 2, -2]} intensity={1.2} color="#D4AF37" />
      <pointLight position={[4, -2, 4]}  intensity={0.6} color="#ffffff" />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Shoe + soft shadow */}
      <Suspense fallback={<Loader />}>
        <ShoeModel scrollProgress={scrollProgress} />
        <ContactShadows
          position={[0, -0.65, 0]}
          opacity={0.55}
          scale={3}
          blur={2.5}
          far={1.2}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  )
}
