import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Cursor, Intro, Marquee } from './fx'
import { hasWebGL2, prefersReducedMotion, scroll } from './scroll'
import { Booking, Footer, Management } from './sections/Booking'
import { Gallery, Manifesto, Music, Stages, Story } from './sections/Middle'
import { Hero, Nav } from './sections/Top'

const Scene = lazy(() => import('./gl/Scene'))

export default function App() {
  const [gl, setGl] = useState<boolean | null>(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    setGl(!reduced && hasWebGL2())

    const onMove = (e: PointerEvent) => {
      scroll.mouse.x = e.clientX / window.innerWidth
      scroll.mouse.y = e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    if (reduced) {
      const on = () => (scroll.y = window.scrollY)
      window.addEventListener('scroll', on, { passive: true })
      return () => {
        window.removeEventListener('scroll', on)
        window.removeEventListener('pointermove', onMove)
      }
    }

    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0 } })
    lenis.on('scroll', (l: Lenis) => {
      scroll.y = l.scroll
      scroll.progress = l.progress
      scroll.velocity = l.velocity
    })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        {gl && (
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        )}
        <a href="#talep" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-ink">
          Talep formuna geç
        </a>
        <Intro />
        <Cursor />
        <Nav />
        <main>
          <Hero fallback={gl === false} />
          <Manifesto />
          <div className="relative z-10 -rotate-2 bg-ember py-4 text-ink sm:py-6">
            <Marquee items={['Ninni', 'Boşver', 'Yüreğine Sor', 'Ece Kıdeyş']} className="display text-[clamp(3rem,9vw,8rem)]" />
          </div>
          <Story />
          <Music />
          <Gallery />
          <Stages />
          <div className="relative z-10 bg-violet py-4 text-cream sm:py-6">
            <Marquee base={-3} items={['Konser', 'Festival', 'Gala', 'Düğün', 'Lansman', 'Özel davet']} className="display text-[clamp(2.6rem,7vw,6.4rem)]" />
          </div>
          <Management />
          <Booking />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
