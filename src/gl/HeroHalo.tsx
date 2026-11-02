import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { scroll } from '../scroll'
import { liquidFragment, liquidVertex } from './LiquidOrb'

// Sabit fotoğrafın çevresinde: yörüngede dönen metal halkalar ve süzülen sıvı damlalar.
// Fotoğrafın ekrandaki yerini her karede DOM'dan okur, sahneyi ona hizalar.
const blobs = [
  { x: -0.62, y: 0.42, s: 0.2, f: 1.1, sp: 0.7 },
  { x: 0.6, y: -0.38, s: 0.27, f: 1.0, sp: 0.5 },
  { x: 0.7, y: 0.5, s: 0.1, f: 1.4, sp: 0.9 },
  { x: -0.55, y: -0.55, s: 0.13, f: 1.3, sp: 0.6 },
]

function Blob({ b, i }: { b: (typeof blobs)[number]; i: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAmp: { value: 0.07 }, uFreq: { value: b.f } }), [b.f])
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    uniforms.uTime.value = t * b.sp + i * 10
    const m = ref.current
    if (!m) return
    m.position.y = Math.sin(t * b.sp + i) * 0.06
    m.position.x = Math.cos(t * b.sp * 0.7 + i) * 0.04
    m.rotation.y = t * 0.2
  })
  return (
    <group position={[b.x, b.y, 0.15]} scale={b.s}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 96, 96]} />
        <CustomShaderMaterial
          baseMaterial={THREE.MeshPhysicalMaterial}
          vertexShader={liquidVertex}
          fragmentShader={liquidFragment}
          uniforms={uniforms}
          metalness={0.7}
          roughness={0.14}
          clearcoat={1}
          clearcoatRoughness={0.06}
          iridescence={0.7}
          iridescenceIOR={1.4}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  )
}

const photoVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
// Fotoğraf olduğu gibi gösterilir: yalnızca kemer biçiminde maskelenir, bozulma yok
const photoFragment = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uSize;   // piksel
  uniform vec2 uImg;
  uniform float uReveal;
  void main(){
    float ra=uSize.x/uSize.y, ia=uImg.x/uImg.y;
    vec2 sc=ra>ia?vec2(1.0,ia/ra):vec2(ra/ia,1.0);
    vec2 off=(1.0-sc)*vec2(0.72,0.78);
    vec4 c=texture2D(uTex,vUv*sc+off);
    vec2 px=vUv*uSize;
    float R=uSize.x*0.5;
    float a=1.0;
    if(px.y>uSize.y-R){ a=smoothstep(R+1.0,R-1.0,length(px-vec2(R,uSize.y-R))); }
    float br=28.0;
    if(px.y<br){
      if(px.x<br) a=min(a,smoothstep(br+1.0,br-1.0,length(px-vec2(br,br))));
      if(px.x>uSize.x-br) a=min(a,smoothstep(br+1.0,br-1.0,length(px-vec2(uSize.x-br,br))));
    }
    a*=step(1.0-uReveal,vUv.y);
    gl_FragColor=vec4(c.rgb,a);
  }
`

function PhotoPlane() {
  const tex = useTexture('./img/hero-1200.webp')
  tex.colorSpace = THREE.SRGBColorSpace
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { camera, size } = useThree()
  const el = useRef<HTMLElement | null>(null)
  const uniforms = useMemo(
    () => ({ uTex: { value: tex }, uSize: { value: new THREE.Vector2(1, 1) }, uImg: { value: new THREE.Vector2(1200, 1622) }, uReveal: { value: 0 } }),
    [tex],
  )
  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    if (!el.current) {
      el.current = document.getElementById('hero-photo')
      document.documentElement.classList.add('gl-photo')
    }
    const r = el.current?.getBoundingClientRect()
    if (!r) return
    const cam = camera as THREE.PerspectiveCamera
    const h = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z
    const w = h * (size.width / size.height)
    m.position.set(((r.left + r.width / 2) / size.width - 0.5) * w, -((r.top + r.height / 2) / size.height - 0.5) * h, 0)
    m.scale.set((r.width / size.width) * w, (r.height / size.height) * h, 1)
    const u = mat.current?.uniforms ?? uniforms
    u.uSize.value.set(r.width, r.height)
    u.uReveal.value = THREE.MathUtils.smoothstep(state.clock.getElapsedTime(), 1.7, 3.0)
    m.visible = r.bottom > -50
  })
  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={photoVertex} fragmentShader={photoFragment} uniforms={uniforms} transparent toneMapped={false} />
    </mesh>
  )
}

export function HeroHalo() {
  const group = useRef<THREE.Group>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()
  const el = useRef<HTMLElement | null>(null)
  const v = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    if (!el.current) el.current = document.getElementById('hero-photo')
    const r = el.current?.getBoundingClientRect()
    if (!r) return
    // ekran → z=0 düzlemindeki dünya koordinatı
    const cam = camera as THREE.PerspectiveCamera
    const h = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z
    const w = h * (size.width / size.height)
    const cx = ((r.left + r.width / 2) / size.width - 0.5) * w
    const cy = -((r.top + r.height / 2) / size.height - 0.5) * h
    const ph = (r.height / size.height) * h
    v.set(cx, cy, 0)
    g.position.lerp(v, Math.min(1, dt * 12))
    const s = scroll.y / window.innerHeight
    const out = 1 - THREE.MathUtils.smoothstep(s, 0.5, 1.0)
    const intro = THREE.MathUtils.smoothstep(state.clock.getElapsedTime(), 1.6, 3.2)
    const k = Math.max(0.0001, ph * 0.62 * out * intro)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, k, 5, dt))
    g.visible = out > 0.01
    const t = state.clock.getElapsedTime()
    if (ringA.current) {
      ringA.current.rotation.set(1.15 + Math.sin(t * 0.3) * 0.08, 0.35, t * 0.25)
    }
    if (ringB.current) {
      ringB.current.rotation.set(1.35, -0.55 + Math.cos(t * 0.25) * 0.1, -t * 0.18)
    }
    g.rotation.y = (scroll.mouse.x - 0.5) * 0.25
    g.rotation.x = (scroll.mouse.y - 0.5) * 0.15
  })

  return (
    <>
    <PhotoPlane />
    <group ref={group} scale={0.0001}>
      <group position={[0, -0.28, 0]}>
      <mesh ref={ringA}>
        <torusGeometry args={[1.05, 0.022, 32, 220]} />
        <meshPhysicalMaterial color="#ff8a3d" metalness={1} roughness={0.15} clearcoat={1} envMapIntensity={1.6} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[1.22, 0.008, 24, 220]} />
        <meshPhysicalMaterial color="#c9a8ff" metalness={1} roughness={0.2} envMapIntensity={1.4} />
      </mesh>
      </group>
      {blobs.map((b, i) => (
        <Blob key={i} b={b} i={i} />
      ))}
    </group>
    </>
  )
}
