import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import { InkPortrait } from './InkPortrait'
import { LiquidOrb } from './LiquidOrb'

export default function Scene() {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const [dpr, setDpr] = useState<number>(mobile ? 1 : 1.5)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const onVis = () => setActive(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={dpr}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          gl.setClearColor('#0b0710', 0)
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Suspense fallback={null}>
          <InkPortrait />
          <LiquidOrb />
          <Environment resolution={256} frames={1}>
            <color attach="background" args={['#0b0710']} />
            <Lightformer form="rect" intensity={6} color="#ff6a1a" position={[-4, 2, -2]} scale={[6, 2, 1]} />
            <Lightformer form="rect" intensity={5} color="#8b3dff" position={[4, -1, -2]} scale={[6, 3, 1]} />
            <Lightformer form="circle" intensity={4} color="#fff1e6" position={[0, 5, 2]} scale={2} />
            <Lightformer form="ring" intensity={3} color="#ff8a3d" position={[0, -4, 3]} scale={3} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}
