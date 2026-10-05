import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import { ArrowTopRightOnSquareIcon, ClipboardDocumentIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { profile, socials } from '@/content/profile'
import { build, GRIDS } from '@/os/icons/appArt'
import { useOS } from '@/store/useOS'

/*
 * Contact as a physical ID lanyard — a port of React Bits' <Lanyard />
 * (rope joints + spherical joint + kinematic drag on a Rapier rigid body).
 * Instead of the original card.glb / lanyard.png assets, the card and the
 * strap are painted here on canvases with Jowie's own details; the only
 * image loaded is the same-origin profile photo for the badge.
 */

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>
  }
}

const CARD_W = 1.6
const CARD_H = 2.25

function brandColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#e95420'
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Draw one of the app pixel icons onto a canvas. */
function drawPixelIcon(ctx: CanvasRenderingContext2D, grid: string[], x: number, y: number, px: number) {
  const art = build(grid)
  const draw = (d: string, fill: string) => {
    ctx.fillStyle = fill
    for (const m of d.matchAll(/M(\d+) (\d+)/g)) ctx.fillRect(x + Number(m[1]) * px, y + Number(m[2]) * px, px, px)
  }
  draw(art.shadow, 'rgba(0,0,0,0.45)')
  art.layers.forEach((l) => draw(l.d, l.fill))
}


function starfield(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.15 + rnd() * 0.6})`
    const size = rnd() > 0.85 ? 4 : 2
    ctx.fillRect(Math.round(rnd() * w), Math.round(rnd() * h), size, size)
  }
}

function cardTextures(accent: string) {
  const W = 640
  const H = 900
  const RES = 1.6
  const make = () => {
    const c = document.createElement('canvas')
    // drawn in 640×900 units, rasterised at 1.6× so small text stays crisp up close
    c.width = W * RES
    c.height = H * RES
    const ctx = c.getContext("2d")!
    ctx.scale(RES, RES)
    return [c, ctx] as const
  }

  // front
  const [fc, f] = make()
  roundRect(f, 0, 0, W, H, 36)
  f.save()
  f.clip()
  const g = f.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#1d1640')
  g.addColorStop(1, '#0c0b1c')
  f.fillStyle = g
  f.fillRect(0, 0, W, H)
  starfield(f, W, H, 7)
  // accent header band + strap slot
  f.fillStyle = accent
  f.fillRect(0, 0, W, 150)
  f.fillStyle = '#0c0b1c'
  roundRect(f, W / 2 - 70, 34, 140, 26, 13)
  f.fill()
  f.fillStyle = '#fff'
  f.font = '800 30px "Montserrat Variable", Montserrat, sans-serif'
  f.textAlign = 'center'
  f.fillText('CREW PASS', W / 2, 116)
  // badge: the pixel astronaut, swapped for the profile photo once it loads
  const BX = W / 2 - 120
  const BY = 196
  const BS = 240
  f.fillStyle = 'rgba(255,255,255,0.08)'
  roundRect(f, BX, BY, BS, BS, 28)
  f.fill()
  drawPixelIcon(f, GRIDS.about, W / 2 - 112, 204, 14)
  // name + role
  const parts = profile.name.split(' ')
  f.fillStyle = '#fff'
  f.font = '800 52px "Montserrat Variable", Montserrat, sans-serif'
  f.fillText(parts[0], W / 2, 520)
  f.font = '800 52px "Montserrat Variable", Montserrat, sans-serif'
  f.fillText(parts.slice(1).join(' '), W / 2, 578)
  f.fillStyle = accent
  f.font = '800 30px "Montserrat Variable", Montserrat, sans-serif'
  f.fillText(profile.role.toUpperCase(), W / 2, 628)
  // details
  f.fillStyle = 'rgba(255,255,255,0.18)'
  f.fillRect(80, 664, W - 160, 2)
  f.fillStyle = 'rgba(255,255,255,0.85)'
  f.font = '600 29px "Montserrat Variable", Montserrat, sans-serif'
  const handles = [profile.email, ...socials.filter((s) => s.label !== 'Email').map((s) => `${s.label}  ${s.handle}`)]
  handles.slice(0, 3).forEach((t, i) => f.fillText(t, W / 2, 718 + i * 46))
  f.fillStyle = accent
  f.fillRect(0, H - 22, W, 22)
  f.restore()

  // back
  const [bc, b] = make()
  roundRect(b, 0, 0, W, H, 36)
  b.save()
  b.clip()
  b.fillStyle = accent
  b.fillRect(0, 0, W, H)
  b.fillStyle = 'rgba(0,0,0,0.18)'
  for (let y = 0; y < H; y += 8) b.fillRect(0, y, W, 2)
  drawPixelIcon(b, GRIDS.projects, W / 2 - 128, 220, 16)
  b.fillStyle = '#fff'
  b.textAlign = 'center'
  b.font = '800 40px "Montserrat Variable", Montserrat, sans-serif'
  b.fillText('Thanks for', W / 2, 600)
  b.fillText('stopping by', W / 2, 650)
  b.font = '500 24px "Montserrat Variable", Montserrat, sans-serif'
  b.fillText('Drag me around', W / 2, 720)
  b.restore()

  const front = new THREE.CanvasTexture(fc)
  const back = new THREE.CanvasTexture(bc)
  for (const t of [front, back]) {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  }
  // the -z face is seen from behind: mirror so it reads correctly
  back.wrapS = THREE.RepeatWrapping
  back.repeat.x = -1

  if (profile.avatar) {
    const photo = new Image()
    photo.decoding = 'async'
    photo.onload = () => {
      f.save()
      roundRect(f, BX, BY, BS, BS, 28)
      f.clip()
      f.fillStyle = '#0c0b1c'
      f.fillRect(BX, BY, BS, BS)
      f.drawImage(photo, BX, BY, BS, BS)
      // knock the photo back so it sits in the dark card instead of glowing on it
      f.fillStyle = 'rgba(12, 11, 28, 0.28)'
      f.fillRect(BX, BY, BS, BS)
      f.restore()
      f.strokeStyle = accent
      f.lineWidth = 6
      roundRect(f, BX + 3, BY + 3, BS - 6, BS - 6, 26)
      f.stroke()
      front.needsUpdate = true
    }
    photo.src = profile.avatar
  }
  return { front, back }
}

function strapTexture(accent: string) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 64
  const x = c.getContext('2d')!
  x.fillStyle = '#16122a'
  x.fillRect(0, 0, c.width, c.height)
  x.fillStyle = accent
  x.fillRect(0, 0, c.width, 6)
  x.fillRect(0, c.height - 6, c.width, 6)
  x.fillStyle = '#fdf3e1'
  x.font = '800 30px "Montserrat Variable", Montserrat, sans-serif'
  x.textBaseline = 'middle'
  const text = profile.name.toUpperCase()
  const w = x.measureText(text).width
  let px = 24
  while (px < c.width) {
    x.fillText(text, px, c.height / 2 + 1)
    px += w + 24
    x.fillStyle = accent
    x.fillRect(px, c.height / 2 - 5, 10, 10)
    x.fillStyle = '#fdf3e1'
    px += 34
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

function Band({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)
  const lerped = useRef(new Map<RapierRigidBody, THREE.Vector3>())
  const [vec, ang, rot, dir] = useMemo(() => [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], [])
  const segment = { type: 'dynamic' as const, canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 }

  const accent = useMemo(brandColor, [])
  const { front, back } = useMemo(() => cardTextures(accent), [accent])
  const strap = useMemo(() => strapTexture(accent), [accent])
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
  )
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)
  const [isSmall] = useState(() => window.innerWidth < 1024)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragged ? 'var(--cursor-grabbing)' : 'var(--cursor-grab)'
    return () => void (document.body.style.cursor = '')
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp())
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return
    // smooth the two middle joints so the strap doesn't jitter
    for (const body of [j1.current, j2.current]) {
      const t = body.translation()
      let l = lerped.current.get(body)
      if (!l) lerped.current.set(body, (l = new THREE.Vector3(t.x, t.y, t.z)))
      const clamped = Math.max(0.1, Math.min(1, l.distanceTo(t as THREE.Vector3)))
      l.lerp(t as THREE.Vector3, delta * (minSpeed + clamped * (maxSpeed - minSpeed)))
    }
    curve.points[0].copy(j3.current.translation() as THREE.Vector3)
    curve.points[1].copy(lerped.current.get(j2.current)!)
    curve.points[2].copy(lerped.current.get(j1.current)!)
    curve.points[3].copy(fixed.current.translation() as THREE.Vector3)
    band.current.geometry.setPoints(curve.getPoints(isSmall ? 16 : 32))
    // keep the card facing forward
    ang.copy(card.current.angvel() as THREE.Vector3)
    rot.copy(card.current.rotation() as unknown as THREE.Vector3)
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
  })

  curve.curveType = 'chordal'

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as Element).setPointerCapture(e.pointerId)
    const t = card.current!.translation()
    drag(new THREE.Vector3().copy(e.point).sub(vec.set(t.x, t.y, t.z)))
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as Element).releasePointerCapture(e.pointerId)
    drag(false)
  }

  return (
    <>
      <group position={[0, 4.7, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segment} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.01]} />
          <group onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} onPointerUp={onUp} onPointerDown={onDown}>
            <mesh>
              <boxGeometry args={[CARD_W, CARD_H, 0.02]} />
              {[0, 1, 2, 3].map((i) => (
                <meshStandardMaterial key={i} attach={`material-${i}`} color="#d9d4e4" metalness={0.3} roughness={0.5} />
              ))}
              <meshPhysicalMaterial attach="material-4" map={front} alphaTest={0.5} transparent clearcoat={1} clearcoatRoughness={0.15} roughness={0.55} metalness={0.25} />
              <meshPhysicalMaterial attach="material-5" map={back} alphaTest={0.5} transparent clearcoat={1} clearcoatRoughness={0.15} roughness={0.55} metalness={0.25} />
            </mesh>
            {/* clip + ring */}
            <mesh position={[0, CARD_H / 2 + 0.12, 0]}>
              <boxGeometry args={[0.34, 0.3, 0.06]} />
              <meshStandardMaterial color="#c9c9d2" metalness={0.95} roughness={0.25} />
            </mesh>
            <mesh position={[0, 1.42, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.09, 0.025, 12, 24]} />
              <meshStandardMaterial color="#c9c9d2" metalness={0.95} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[
            {
              color: new THREE.Color('white'),
              resolution: isSmall ? new THREE.Vector2(1000, 2000) : new THREE.Vector2(1000, 1000),
              useMap: 1,
              map: strap,
              repeat: new THREE.Vector2(-4, 1),
              lineWidth: 1,
            },
          ]}
          depthTest={false}
        />
      </mesh>
    </>
  )
}

export default function LanyardOverlay() {
  const close = () => useOS.getState().setOverlay(null)
  const notify = useOS((s) => s.notify)
  const [leaving, setLeaving] = useState(false)
  const dismiss = () => {
    setLeaving(true)
    window.setTimeout(close, 220)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      notify({ title: 'Email address copied', body: profile.email, appId: 'contact' })
    } catch {
      notify({ title: 'Couldn’t copy', body: profile.email, appId: 'contact' })
    }
  }

  const mobile = window.innerWidth < 768
  const action =
    'inline-flex h-10 items-center gap-2 rounded-full bg-white/12 px-4 text-[14px] font-bold text-white backdrop-blur-md transition-colors hover:bg-white/22 [&>svg]:size-4'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact card"
      className={`fixed inset-0 z-[45000] transition-opacity duration-200 ${leaving ? 'opacity-0' : 'animate-in opacity-100 fade-in-0'}`}
    >
      <div aria-hidden className="absolute inset-0 bg-[rgb(8_6_20/0.55)] backdrop-blur-[3px]" />
      <Canvas
        className="!absolute inset-0"
        camera={{ position: [0, 0, mobile ? 21 : 15.5], fov: mobile ? 24 : 20 }}
        gl={{ alpha: true }}
        dpr={[1, 2]}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
        onPointerMissed={dismiss}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>

      <button
        type="button"
        onClick={dismiss}
        className="absolute top-12 right-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-white/12 px-4 text-[14px] font-bold text-white backdrop-blur-md transition-colors hover:bg-white/22"
      >
        <XMarkIcon className="size-4" /> Close
      </button>

      <div className="absolute inset-x-0 bottom-8 flex flex-wrap justify-center gap-2 px-4 max-md:bottom-24">
        <a className={action} href={`mailto:${profile.email}`}>
          <EnvelopeIcon /> Email me
        </a>
        <button type="button" className={action} onClick={copy}>
          <ClipboardDocumentIcon /> Copy email
        </button>
        {socials
          .filter((s) => s.label !== 'Email')
          .map((s) => (
            <a key={s.label} className={action} href={s.href} target="_blank" rel="noreferrer">
              {s.label} <ArrowTopRightOnSquareIcon />
            </a>
          ))}
      </div>
      <p className="pointer-events-none absolute inset-x-0 top-14 text-center text-[13px] font-semibold text-white/60 max-md:top-24">
        Drag the card · click anywhere to close
      </p>
    </div>
  )
}
