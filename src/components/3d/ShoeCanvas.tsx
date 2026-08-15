'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, PresentationControls } from '@react-three/drei'
import { Model } from './Shoe'

export default function ShoeCanvas() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={2} castShadow />
        <pointLight position={[-4, 2, -2]} intensity={1.2} color="#D4AF37" />

        <Environment preset="city" />

        <Suspense fallback={null}>
          <PresentationControls
            global
            speed={1.4}
            zoom={0.8}
            polar={[-0.3, 0.3]}
            azimuth={[-0.8, 0.8]}
            snap={true}
          >
            <Model scale={8} position={[0, -0.5, 0]} />
          </PresentationControls>

          <ContactShadows
            position={[0, -0.9, 0]}
            opacity={0.5}
            scale={4}
            blur={2.5}
            far={1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
