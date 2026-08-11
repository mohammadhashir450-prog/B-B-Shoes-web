'use client'

import { useEffect, useRef, useState } from 'react'

const SHOES = [
  {
    src: '/hero-sneaker.png',
    label: 'Sneakers',
    tag: 'Street & Sport',
    color: '#D4AF37',
  },
  {
    src: '/hero-women.png',
    label: "Women's",
    tag: 'Elegant Heels',
    color: '#C084FC',
  },
  {
    src: '/hero-slipper.png',
    label: 'Slippers',
    tag: 'Premium Leather',
    color: '#F97316',
  },
]

export default function Hero3DShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  /* ── Three.js 3D particle field ── */
  useEffect(() => {
    let renderer: import('three').WebGLRenderer | null = null
    let raf = 0
    let destroyed = false
    let cleanupMouse: (() => void) | null = null
    let cleanupResize: (() => void) | null = null

    const init = async () => {
      try {
        const THREE = await import('three')

        const canvas = canvasRef.current
        if (!canvas || destroyed) return

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        renderer.setClearColor(0x000000, 0)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
        camera.position.z = 5

        /* particle field */
        const geo = new THREE.BufferGeometry()
        const COUNT = 1800
        const positions = new Float32Array(COUNT * 3)
        const colors = new Float32Array(COUNT * 3)
        const palette = [
          new THREE.Color('#D4AF37'),
          new THREE.Color('#ffffff'),
          new THREE.Color('#C084FC'),
          new THREE.Color('#F97316'),
        ]
        for (let i = 0; i < COUNT; i++) {
          positions[i * 3]     = (Math.random() - 0.5) * 18
          positions[i * 3 + 1] = (Math.random() - 0.5) * 12
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10
          const c = palette[Math.floor(Math.random() * palette.length)]
          colors[i * 3]     = c.r
          colors[i * 3 + 1] = c.g
          colors[i * 3 + 2] = c.b
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        const mat = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.75 })
        const particles = new THREE.Points(geo, mat)
        scene.add(particles)

        /* rings */
        const ringGeo = new THREE.TorusGeometry(2.4, 0.012, 16, 120)
        const ringMat = new THREE.MeshBasicMaterial({ color: '#D4AF37', transparent: true, opacity: 0.3 })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 2.2
        scene.add(ring)

        const ring2Geo = new THREE.TorusGeometry(1.8, 0.008, 16, 120)
        const ring2Mat = new THREE.MeshBasicMaterial({ color: '#C084FC', transparent: true, opacity: 0.2 })
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
        ring2.rotation.x = -Math.PI / 3
        ring2.rotation.z = Math.PI / 6
        scene.add(ring2)

        /* mouse parallax */
        let mx = 0, my = 0
        const onMouse = (e: MouseEvent) => {
          mx = (e.clientX / window.innerWidth - 0.5) * 2
          my = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('mousemove', onMouse)
        cleanupMouse = () => window.removeEventListener('mousemove', onMouse)

        /* resize */
        const onResize = () => {
          if (!canvas || !renderer) return
          renderer.setSize(canvas.clientWidth, canvas.clientHeight)
          camera.aspect = canvas.clientWidth / canvas.clientHeight
          camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', onResize)
        cleanupResize = () => window.removeEventListener('resize', onResize)

        /* animate */
        const clock = new THREE.Clock()
        const animate = () => {
          if (destroyed) return
          raf = requestAnimationFrame(animate)
          const t = clock.getElapsedTime()
          particles.rotation.y = t * 0.04
          particles.rotation.x = t * 0.015
          ring.rotation.z = t * 0.12
          ring.rotation.y = t * 0.06
          ring2.rotation.z = -t * 0.08
          camera.position.x += (mx * 0.6 - camera.position.x) * 0.04
          camera.position.y += (-my * 0.4 - camera.position.y) * 0.04
          camera.lookAt(0, 0, 0)
          renderer!.render(scene, camera)
        }
        animate()
        setLoaded(true)
      } catch (e) {
        console.warn('Three.js init error', e)
        setLoaded(true)
      }
    }

    init()

    return () => {
      destroyed = true
      cancelAnimationFrame(raf)
      cleanupMouse?.()
      cleanupResize?.()
      renderer?.dispose()
    }
  }, [])

  /* auto-cycle */
  useEffect(() => {
    const t = setInterval(() => setActiveIndex(p => (p + 1) % SHOES.length), 3200)
    return () => clearInterval(t)
  }, [])

  const active = SHOES[activeIndex]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #06080F 0%, #0D1220 40%, #111827 100%)',
        minHeight: '560px',
        borderRadius: '2rem',
      }}
    >
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />

      {/* Gold radial glow (color changes per shoe) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${active.color}1A 0%, transparent 70%)`,
        transition: 'background 1s ease',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', minHeight: '560px',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 8px #D4AF37' }} />
          <span style={{ color: '#D4AF37', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            3D Showcase — {active.tag}
          </span>
        </div>

        {/* 3D shoe card carousel */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '20px', marginBottom: '36px', perspective: '1200px',
        }}>
          {SHOES.map((shoe, i) => {
            const isActive = i === activeIndex
            const diff = ((i - activeIndex) + SHOES.length) % SHOES.length
            const isPrev = diff === SHOES.length - 1
            const isNext = diff === 1

            let transform = 'scale(0.7) rotateY(45deg)'
            let opacity = 0.2
            let zIndex = 1
            let blur = '2px'
            let width = '160px'

            if (isActive) {
              transform = 'scale(1.08) rotateY(0deg) translateZ(40px)'
              opacity = 1; zIndex = 10; blur = '0px'; width = '220px'
            } else if (isPrev) {
              transform = 'translateX(-30px) scale(0.82) rotateY(28deg)'
              opacity = 0.55; zIndex = 5; blur = '1.5px'
            } else if (isNext) {
              transform = 'translateX(30px) scale(0.82) rotateY(-28deg)'
              opacity = 0.55; zIndex = 5; blur = '1.5px'
            }

            return (
              <div
                key={shoe.src}
                onClick={() => setActiveIndex(i)}
                style={{
                  position: 'relative', width, flexShrink: 0, cursor: 'pointer',
                  transform, opacity, filter: `blur(${blur})`, zIndex,
                  transition: 'all 0.65s cubic-bezier(0.34,1.2,0.64,1)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isActive ? shoe.color + '60' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(12px)',
                  boxShadow: isActive
                    ? `0 30px 80px -20px ${shoe.color}50, 0 0 40px ${shoe.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`
                    : '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                  <div style={{ height: isActive ? '200px' : '150px', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shoe.src}
                      alt={shoe.label}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
                        animation: isActive ? 'floatShoe 3.5s ease-in-out infinite' : 'none',
                        transition: 'all 0.65s ease',
                      }}
                    />
                    {isActive && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(135deg, transparent 40%, ${shoe.color}15 60%, transparent 70%)`,
                        animation: 'shoeShimmer 2.5s ease-in-out infinite',
                      }} />
                    )}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', margin: 0 }}>{shoe.label}</p>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', margin: '2px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{shoe.tag}</p>
                      </div>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: shoe.color + '20', border: `1px solid ${shoe.color}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: shoe.color, boxShadow: `0 0 8px ${shoe.color}` }} />
                      </div>
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)',
                    width: '60%', height: '20px', background: shoe.color, filter: 'blur(20px)', opacity: 0.45,
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Dot nav */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {SHOES.map((shoe, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View ${shoe.label}`}
              style={{
                width: i === activeIndex ? '28px' : '8px', height: '8px',
                borderRadius: '100px',
                background: i === activeIndex ? active.color : 'rgba(255,255,255,0.25)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.35s ease',
                boxShadow: i === activeIndex ? `0 0 12px ${active.color}80` : 'none',
              }}
            />
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '100px', padding: '10px 24px', backdropFilter: 'blur(10px)',
        }}>
          {[
            { value: '3D', label: 'Experience' },
            { value: '50K+', label: 'Happy Clients' },
            { value: '100%', label: 'Authentic' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', padding: '0 20px' }}>
                <p style={{ color: '#D4AF37', fontWeight: 800, fontSize: '14px', margin: 0, letterSpacing: '0.05em' }}>{stat.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', margin: '2px 0 0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{stat.label}</p>
              </div>
              {i < 2 && <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' }} />}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatShoe {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes shoeShimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </div>
  )
}
