'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const MODEL_URL = '/models/vans_shoe.glb'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const easeOutBounce = (input: number) => {
  let t = input
  const n1 = 7.5625
  const d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
  return n1 * (t -= 2.625 / d1) * t + 0.984375
}

/** Soft radial texture used for the ground shadow + glow sprites. */
function radialTexture(inner: string, outer: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, inner)
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

type Props = {
  /** Increment to replay the drop-in + lace-up animation. */
  replayKey?: number
  onLoaded?: () => void
}

export default function HeroShoe3D({ replayKey = 0, onLoaded }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const replayRef = useRef(replayKey)
  const restartRef = useRef<() => void>(() => {})
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // Restart the intro when the parent bumps replayKey.
  useEffect(() => {
    if (replayRef.current !== replayKey) {
      replayRef.current = replayKey
      restartRef.current()
    }
  }, [replayKey])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let raf = 0

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.5, 7)
    camera.lookAt(0, -0.1, 0)

    // Image based lighting without any network request.
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const key = new THREE.DirectionalLight(0xfff1d6, 2.4)
    key.position.set(4, 6, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffd27a, 1.6)
    rim.position.set(-5, 2, -4)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))

    // Ground contact shadow
    const shadowTex = radialTexture('rgba(40,28,8,0.55)', 'rgba(40,28,8,0)')
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 1.5),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -1.22
    scene.add(shadow)

    // Gold shock-ring when the shoe lands and the laces cinch
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.97, 1, 96),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0, depthWrite: false })
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = -1.2
    ring.visible = false
    scene.add(ring)

    // Floating gold dust
    const COUNT = 70
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(COUNT * 3)
    const dustSeed = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 7
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 4.2
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 3
      dustSeed[i] = Math.random() * 10
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        size: 0.06,
        map: radialTexture('rgba(255,222,130,1)', 'rgba(255,222,130,0)'),
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    scene.add(dust)

    const pivot = new THREE.Group() // position + rotation
    const squash = new THREE.Group() // lace-cinch squash & stretch
    pivot.add(squash)
    scene.add(pivot)

    const pointer = { x: 0, y: 0 }
    let dragYaw = 0
    let dragging = false
    let lastX = 0
    let t0 = performance.now()
    restartRef.current = () => {
      t0 = performance.now()
      dragYaw = 0
    }

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      // keep the shoe fully framed on narrow / tall containers
      camera.position.z = w / h < 1 ? 7 / Math.max(0.62, w / h) * 0.85 : 7
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2
      if (dragging) {
        dragYaw += (e.clientX - lastX) * 0.012
        lastX = e.clientX
      }
    }
    const onLeave = () => {
      pointer.x = 0
      pointer.y = 0
    }
    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
    }
    const onUp = () => {
      dragging = false
    }
    mount.addEventListener('pointermove', onMove)
    mount.addEventListener('pointerleave', onLeave)
    mount.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    let loaded = false
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return
        const model = gltf.scene
        model.traverse((o) => {
          const mesh = o as THREE.Mesh
          if (mesh.isMesh) {
            const mat = mesh.material as THREE.MeshStandardMaterial
            if (mat) {
              mat.envMapIntensity = 1.3
              mat.needsUpdate = true
            }
          }
        })
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const s = 3.7 / (Math.max(size.x, size.y, size.z) || 1)
        model.scale.setScalar(s)
        model.position.set(-center.x * s, -center.y * s, -center.z * s)
        squash.add(model)
        loaded = true
        t0 = performance.now()
        setReady(true)
        onLoaded?.()
      },
      undefined,
      () => {
        if (!disposed) setFailed(true)
      }
    )

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const now = performance.now()
      const t = reduce ? 10 : (now - t0) / 1000
      const time = now / 1000

      // Phase 1 (0–1.5s) drop from above with a bounce
      const drop = clamp01(t / 1.5)
      const y = (1 - easeOutBounce(drop)) * 5.4
      // Phase 2 (1.5–2.3s) lace-up cinch: squash, tighten, release
      const cinch = Math.sin(clamp01((t - 1.5) / 0.8) * Math.PI)
      squash.scale.set(1 + cinch * 0.035, 1 - cinch * 0.055, 1 + cinch * 0.035)

      const idle = t > 2.3 ? Math.sin(time * 1.3) * 0.05 : 0
      pivot.position.y = y + idle - 0.12

      const spin = (1 - easeInOut(clamp01(t / 2.0))) * Math.PI * 1.15
      const targetY = -0.6 + pointer.x * 0.45 + spin + dragYaw
      pivot.rotation.y += (targetY - pivot.rotation.y) * 0.1
      pivot.rotation.x += (pointer.y * -0.16 + (1 - drop) * 0.35 - pivot.rotation.x) * 0.1
      pivot.rotation.z = (1 - drop) * 0.25

      // shadow reacts to height
      const sh = 1 - clamp01(y / 5)
      shadow.scale.setScalar(0.5 + sh * 0.5)
      ;(shadow.material as THREE.MeshBasicMaterial).opacity = 0.25 + sh * 0.75

      const r = clamp01((t - 1.5) / 1.1)
      ring.visible = r > 0 && r < 1
      ring.scale.setScalar(0.6 + r * 3.4)
      ;(ring.material as THREE.MeshBasicMaterial).opacity = (1 - r) * 0.7

      const pos = dustGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < COUNT; i++) {
        pos.setY(i, pos.getY(i) + 0.0035 + Math.sin(time + dustSeed[i]) * 0.0009)
        if (pos.getY(i) > 2.4) pos.setY(i, -2.4)
        pos.setX(i, pos.getX(i) + Math.cos(time * 0.6 + dustSeed[i]) * 0.0016)
      }
      pos.needsUpdate = true

      if (loaded || true) renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      mount.removeEventListener('pointermove', onMove)
      mount.removeEventListener('pointerleave', onLeave)
      mount.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose()
      })
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) return null

  return (
    <div
      ref={mountRef}
      className={`h-full w-full cursor-grab active:cursor-grabbing touch-pan-y transition-opacity duration-700 ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
      aria-label="Interactive 3D sneaker"
      role="img"
    />
  )
}
