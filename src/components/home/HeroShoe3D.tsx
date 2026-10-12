'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const MODEL_URL = '/models/vans_shoe.glb'

// ── Timeline (seconds) ───────────────────────────────────────────────────────
const DROP_END = 1.7 // shoe falls + bounces, laces flapping loose
const TIE_START = 1.55 // laces start pulling tight while shoe settles
const TIE_END = 3.0 // fully tied
const FLASH_AT = 3.0 // gold shock-wave + sparks

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutBounce = (input: number) => {
  let t = input
  const n1 = 7.5625
  const d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
  return n1 * (t -= 2.625 / d1) * t + 0.984375
}

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

/** Vertical gradient used for the volumetric light beam. */
function beamTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, 'rgba(255,226,150,0)')
  grad.addColorStop(0.18, 'rgba(255,226,150,0.8)')
  grad.addColorStop(0.65, 'rgba(255,214,120,0.14)')
  grad.addColorStop(1, 'rgba(255,214,120,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * The GLB is a single mesh, so laces can't be animated with a rig. Instead we
 * find the lace vertices (bright, un-saturated texels on the upper part of the
 * shoe) and loosen/tighten them in the vertex shader.
 */
function buildLaceWeights(mesh: THREE.Mesh): { weights: Float32Array; maxDim: number } | null {
  const geo = mesh.geometry as THREE.BufferGeometry
  const pos = geo.attributes.position as THREE.BufferAttribute
  const uv = geo.attributes.uv as THREE.BufferAttribute | undefined
  const mat = mesh.material as THREE.MeshStandardMaterial
  const img = mat?.map?.image as (CanvasImageSource & { width: number; height: number }) | undefined
  if (!uv || !img || !img.width) return null

  const sampleSize = 512
  const canvas = document.createElement('canvas')
  canvas.width = sampleSize
  canvas.height = sampleSize
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, sampleSize, sampleSize)
  const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data

  geo.computeBoundingBox()
  const box = geo.boundingBox as THREE.Box3
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  // Find which axis is "up": the shortest of the two non-length axes is the
  // width; the sole sits at the min of the up axis. For this model Y is up.
  const up: 'x' | 'y' | 'z' = 'y'
  const weights = new Float32Array(pos.count)
  const minUp = box.min[up]
  const hUp = size[up] || 1

  for (let i = 0; i < pos.count; i++) {
    const h = ((pos as THREE.BufferAttribute).getY(i) - minUp) / hUp
    if (h < 0.5) continue
    const u = uv.getX(i)
    const v = uv.getY(i)
    const px = Math.min(sampleSize - 1, Math.max(0, Math.floor(u * sampleSize)))
    const py = Math.min(sampleSize - 1, Math.max(0, Math.floor(v * sampleSize)))
    const o = (py * sampleSize + px) * 4
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    const mx = Math.max(r, g, b)
    const mn = Math.min(r, g, b)
    // bright & neutral → white lace fabric
    if (mx > 190 && mx - mn < 40) weights[i] = Math.min(1, (h - 0.5) * 4)
  }
  return { weights, maxDim }
}

type Props = {
  replayKey?: number
  onLoaded?: () => void
}

export default function HeroShoe3D({ replayKey = 0, onLoaded }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const replayRef = useRef(replayKey)
  const restartRef = useRef<() => void>(() => {})
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

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
    renderer.toneMappingExposure = 1.0
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' })

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const camTarget = new THREE.Vector3(0, -0.8, 0)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex
    ;(scene as THREE.Scene & { environmentIntensity?: number }).environmentIntensity = 0.38

    // ── Lighting: warm key, gold rim lights, cool fill ──
    const key = new THREE.SpotLight(0xfff0d0, 38, 30, 0.5, 0.7, 1.2)
    key.position.set(2.5, 7, 4)
    key.target.position.set(0, -1, 0)
    scene.add(key, key.target)
    const rimL = new THREE.DirectionalLight(0xffc860, 2.6)
    rimL.position.set(-5, 2.5, -3)
    scene.add(rimL)
    const rimR = new THREE.DirectionalLight(0xffb347, 2.0)
    rimR.position.set(5, 1.5, -3)
    scene.add(rimR)
    const fill = new THREE.DirectionalLight(0xb7c9ff, 0.5)
    fill.position.set(-3, 1, 5)
    scene.add(fill)
    scene.add(new THREE.AmbientLight(0xffffff, 0.18))
    const flash = new THREE.PointLight(0xffd36b, 0, 14, 1.6)
    flash.position.set(0, 0.2, 1.5)
    scene.add(flash)

    // ── Podium ──
    const FLOOR_Y = -1.55
    const podium = new THREE.Group()
    podium.position.y = FLOOR_Y
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(2.05, 2.15, 0.14, 96),
      new THREE.MeshStandardMaterial({ color: 0x0b0c10, metalness: 0.95, roughness: 0.22, envMapIntensity: 1.3 })
    )
    disc.position.y = -0.07
    podium.add(disc)
    const goldRim = new THREE.Mesh(
      new THREE.TorusGeometry(2.08, 0.018, 16, 160),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 1.6, metalness: 1, roughness: 0.25 })
    )
    goldRim.rotation.x = Math.PI / 2
    podium.add(goldRim)
    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.35, 1.37, 128),
      new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    )
    innerRing.rotation.x = -Math.PI / 2
    innerRing.position.y = 0.004
    podium.add(innerRing)
    // soft contact shadow + warm pool of light on the podium
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.7),
      new THREE.MeshBasicMaterial({
        map: radialTexture('rgba(0,0,0,0.85)', 'rgba(0,0,0,0)'),
        transparent: true,
        depthWrite: false,
      })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.006
    podium.add(shadow)
    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(1.9, 64),
      new THREE.MeshBasicMaterial({
        map: radialTexture('rgba(255,205,110,0.3)', 'rgba(255,205,110,0)'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    pool.rotation.x = -Math.PI / 2
    pool.position.y = 0.008
    podium.add(pool)
    podium.scale.setScalar(1.2)
    scene.add(podium)

    // ── Volumetric beam from above ──
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 2.2, 11, 48, 1, true),
      new THREE.MeshBasicMaterial({
        map: beamTexture(),
        transparent: true,
        opacity: 0.11,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    )
    beam.position.y = FLOOR_Y + 5.5
    beam.scale.set(1.3, 1, 1.3)
    scene.add(beam)

    // ── Shock rings + spark burst ──
    const rings = [0, 1].map(() => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(0.96, 1, 128),
        new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
      )
      m.rotation.x = -Math.PI / 2
      m.position.y = FLOOR_Y + 0.02
      m.visible = false
      scene.add(m)
      return m
    })

    const SPARKS = 90
    const sparkGeo = new THREE.BufferGeometry()
    const sparkPos = new Float32Array(SPARKS * 3)
    const sparkVel = new Float32Array(SPARKS * 3)
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
    const sparks = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({
        size: 0.09,
        map: radialTexture('rgba(255,236,170,1)', 'rgba(255,200,80,0)'),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    sparks.frustumCulled = false
    scene.add(sparks)
    let sparkT = -1
    const burst = () => {
      for (let i = 0; i < SPARKS; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 0.8 + Math.random() * 2.4
        sparkPos[i * 3] = Math.cos(a) * 0.3
        sparkPos[i * 3 + 1] = FLOOR_Y + 0.4 + Math.random() * 0.4
        sparkPos[i * 3 + 2] = Math.sin(a) * 0.3
        sparkVel[i * 3] = Math.cos(a) * sp
        sparkVel[i * 3 + 1] = 0.8 + Math.random() * 2.2
        sparkVel[i * 3 + 2] = Math.sin(a) * sp
      }
      sparkT = 0
    }

    // ── Ambient gold dust ──
    const DUST = 90
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(DUST * 3)
    const dustSeed = new Float32Array(DUST)
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 7
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 3.5
      dustSeed[i] = Math.random() * 10
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        size: 0.05,
        map: radialTexture('rgba(255,222,130,1)', 'rgba(255,222,130,0)'),
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
    scene.add(dust)

    // ── Shoe rig ──
    const pivot = new THREE.Group()
    const squash = new THREE.Group()
    pivot.add(squash)
    scene.add(pivot)

    const uniforms = {
      uLoose: { value: 1 },
      uTime: { value: 0 },
      uAmp: { value: 0.05 },
    }

    const pointer = { x: 0, y: 0 }
    let dragYaw = 0
    let dragging = false
    let lastX = 0
    let t0 = performance.now()
    let flashed = false
    restartRef.current = () => {
      t0 = performance.now()
      dragYaw = 0
      flashed = false
    }

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      const dist = Math.max(9.2, 5.0 / (0.536 * (w / h)))
      camera.position.set(0, 0.25, dist)
      camera.lookAt(camTarget)
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

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return
        const model = gltf.scene

        model.traverse((o) => {
          const mesh = o as THREE.Mesh
          if (!mesh.isMesh) return
          const mat = mesh.material as THREE.MeshStandardMaterial
          mat.envMapIntensity = 1.4
          mat.color.multiplyScalar(0.82)
          mat.roughness = Math.min(mat.roughness ?? 1, 0.78)

          // lace weights → vertex attribute + shader patch
          try {
            const lace = buildLaceWeights(mesh)
            if (lace) {
              mesh.geometry.setAttribute('aLace', new THREE.BufferAttribute(lace.weights, 1))
              uniforms.uAmp.value = lace.maxDim * 0.06
              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uLoose = uniforms.uLoose
                shader.uniforms.uTime = uniforms.uTime
                shader.uniforms.uAmp = uniforms.uAmp
                shader.vertexShader = shader.vertexShader
                  .replace(
                    '#include <common>',
                    `#include <common>
                     attribute float aLace;
                     uniform float uLoose;
                     uniform float uTime;
                     uniform float uAmp;`
                  )
                  .replace(
                    '#include <begin_vertex>',
                    `#include <begin_vertex>
                     float lw = aLace * uLoose;
                     float wob = sin(uTime * 9.0 + position.x * 55.0 + position.z * 40.0);
                     float wob2 = cos(uTime * 7.0 + position.z * 60.0);
                     transformed += normal * lw * uAmp * (1.0 + 0.55 * wob);
                     transformed.y += lw * uAmp * (0.9 + 0.7 * wob2);
                     transformed.x += lw * uAmp * 0.6 * wob2;`
                  )
              }
              mat.needsUpdate = true
            }
          } catch {
            /* laces stay static if anything goes wrong */
          }
        })

        // The source model is pitched (heel up). Fit a line through the sole
        // (length axis is Z) and rotate the model so the sole sits perfectly flat on the podium.
        model.updateMatrixWorld(true)
        let levelBox = new THREE.Box3().setFromObject(model)
        const pts: THREE.Vector3[] = []
        model.traverse((o) => {
          const m = o as THREE.Mesh
          if (!m.isMesh) return
          const p = m.geometry.attributes.position as THREE.BufferAttribute
          const step = Math.max(1, Math.floor(p.count / 6000))
          for (let i = 0; i < p.count; i += step) {
            pts.push(new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)).applyMatrix4(m.matrixWorld))
          }
        })
        // Outsole profile: lowest point of each slice along the length (Z axis),
        // then a line fit through the middle of the sole.
        const zMin = levelBox.min.z
        const zLen = levelBox.max.z - zMin || 1
        const BINS = 48
        const lows = new Array<number>(BINS).fill(Infinity)
        pts.forEach((v) => {
          const bi = Math.min(BINS - 1, Math.floor(((v.z - zMin) / zLen) * BINS))
          if (v.y < lows[bi]) lows[bi] = v.y
        })
        const prof: Array<[number, number]> = []
        for (let i = Math.floor(BINS * 0.18); i < Math.floor(BINS * 0.82); i++) {
          if (Number.isFinite(lows[i])) prof.push([zMin + ((i + 0.5) / BINS) * zLen, lows[i]])
        }
        if (prof.length > 6) {
          const mz = prof.reduce((a2, q) => a2 + q[0], 0) / prof.length
          const my = prof.reduce((a2, q) => a2 + q[1], 0) / prof.length
          let num = 0
          let den = 0
          prof.forEach((q) => {
            num += (q[0] - mz) * (q[1] - my)
            den += (q[0] - mz) * (q[0] - mz)
          })
          const angle = Math.atan2(num, den || 1)
          if (Math.abs(angle) < 0.7) model.rotation.x += angle
        }
        model.updateMatrixWorld(true)
        levelBox = new THREE.Box3().setFromObject(model)
        const size = levelBox.getSize(new THREE.Vector3())
        const center = levelBox.getCenter(new THREE.Vector3())
        const s = 4.4 / (Math.max(size.x, size.y, size.z) || 1)
        const holder = new THREE.Group()
        holder.add(model)
        holder.scale.setScalar(s)
        holder.position.set(-center.x * s, -levelBox.min.y * s, -center.z * s)
        t0 = performance.now()
        setReady(true)
        onLoaded?.()
        squash.add(holder)
        return
      },
      undefined,
      () => {
        if (!disposed) setFailed(true)
      }
    )

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let lastNow = performance.now()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const now = performance.now()
      const dt = Math.min(0.05, (now - lastNow) / 1000)
      lastNow = now
      const t = reduce ? 10 : (now - t0) / 1000
      const time = now / 1000
      uniforms.uTime.value = time

      // drop from above with a bounce
      const drop = clamp01(t / DROP_END)
      const fall = 1 - easeOutBounce(drop)
      const y = FLOOR_Y + fall * 6.2

      // untied → tied
      const tie = easeInOut(clamp01((t - TIE_START) / (TIE_END - TIE_START)))
      uniforms.uLoose.value = reduce ? 0 : 1 - tie

      // cinch squash as the laces pull tight
      const pull = Math.sin(clamp01((t - 2.3) / 0.7) * Math.PI)
      squash.scale.set(1 + pull * 0.03, 1 - pull * 0.05, 1 + pull * 0.03)

      const idle = t > TIE_END ? Math.sin(time * 1.3) * 0.035 : 0
      pivot.position.y = y + idle + 0.02 + (t > TIE_END ? 0.05 + Math.sin(time * 1.3) * 0.015 : 0) * easeOutCubic(clamp01((t - TIE_END) / 0.8))

      const spin = (1 - easeInOut(clamp01(t / 2.6))) * Math.PI * 1.4
      const auto = t > TIE_END ? Math.sin(time * 0.45) * 0.18 : 0
      const targetY = -0.55 + pointer.x * 0.42 + spin + dragYaw + auto
      const k = 1 - Math.exp(-dt * 7)
      pivot.rotation.y += (targetY - pivot.rotation.y) * k
      pivot.rotation.x += (pointer.y * -0.14 + (1 - drop) * 0.4 - pivot.rotation.x) * k
      pivot.rotation.z = (1 - drop) * 0.3 * Math.sin(t * 5)

      // podium reacts to height
      const near = 1 - clamp01((y - FLOOR_Y) / 5)
      shadow.scale.setScalar(0.45 + near * 0.55)
      ;(shadow.material as THREE.MeshBasicMaterial).opacity = 0.2 + near * 0.8
      ;(pool.material as THREE.MeshBasicMaterial).opacity = 0.35 + near * 0.65
      goldRim.rotation.z = time * 0.1

      // landing impact + final "locked" flash
      if (!flashed && t >= FLASH_AT) {
        flashed = true
        burst()
      }
      const flashK = clamp01(1 - Math.abs(t - FLASH_AT - 0.1) / 0.7)
      flash.intensity = flashK * 55

      rings.forEach((ring, i) => {
        const start = i === 0 ? DROP_END * 0.62 : FLASH_AT
        const r = clamp01((t - start) / 1.2)
        ring.visible = r > 0 && r < 1
        ring.scale.setScalar((0.7 + easeOutCubic(r) * 3.4) * 1.2)
        ;(ring.material as THREE.MeshBasicMaterial).opacity = (1 - r) * (i === 0 ? 0.55 : 0.85)
      })

      // sparks
      if (sparkT >= 0) {
        sparkT += dt
        const p = sparkGeo.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < SPARKS; i++) {
          sparkVel[i * 3 + 1] -= 3.2 * dt
          p.setXYZ(
            i,
            p.getX(i) + sparkVel[i * 3] * dt,
            p.getY(i) + sparkVel[i * 3 + 1] * dt,
            p.getZ(i) + sparkVel[i * 3 + 2] * dt
          )
        }
        p.needsUpdate = true
        ;(sparks.material as THREE.PointsMaterial).opacity = clamp01(1 - sparkT / 1.6)
        if (sparkT > 1.6) sparkT = -1
      }

      const dp = dustGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < DUST; i++) {
        dp.setY(i, dp.getY(i) + 0.003 + Math.sin(time + dustSeed[i]) * 0.0008)
        if (dp.getY(i) > 2.6) dp.setY(i, -2.6)
        dp.setX(i, dp.getX(i) + Math.cos(time * 0.6 + dustSeed[i]) * 0.0014)
      }
      dp.needsUpdate = true

      // soft camera drift
      camera.position.x += (pointer.x * 0.5 - camera.position.x) * (1 - Math.exp(-dt * 2.5))
      camera.lookAt(camTarget)

      renderer.render(scene, camera)
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
      className={`h-full w-full cursor-grab touch-pan-y transition-opacity duration-700 active:cursor-grabbing ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
      aria-label="Interactive 3D sneaker"
      role="img"
    />
  )
}
