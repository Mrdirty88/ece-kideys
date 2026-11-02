import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './scroll'
import { ease } from './ui'

export const INTRO_DELAY = typeof window !== 'undefined' && prefersReducedMotion() ? 0 : 1.75

// Açılış: sayaç 0→100, isim harf harf, ardından mor-turuncu perdeler yukarı çekilir
export function Intro() {
  const [done, setDone] = useState(() => prefersReducedMotion())
  const [n, setN] = useState(0)
  useEffect(() => {
    if (done) return
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1500)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setDone(true), 250)
    }
    raf = requestAnimationFrame(tick)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.style.overflow = ''
    }
  }, [done])
  useEffect(() => {
    if (done) document.documentElement.style.overflow = ''
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[90]" aria-hidden="true" exit={{ pointerEvents: 'none' }}>
          {['bg-ember', 'bg-violet', 'bg-ink'].map((c, i) => (
            <motion.div
              key={c}
              className={`absolute inset-0 ${c}`}
              exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 0.9, ease, delay: (2 - i) * 0.12 }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="font-display text-[15px] font-bold text-cream">
              Ece Kıdeyş<span className="text-ember">.</span>
            </span>
            <div className="flex items-end justify-between gap-6">
              <p className="max-w-[18ch] font-serif text-[clamp(1.6rem,4vw,3rem)] italic leading-[1.05] text-cream/85">
                Siyah beyaz bir sahneye dökülen mor ve turuncu bir ses.
              </p>
              <span className="display text-[clamp(5rem,18vw,16rem)] tabular-nums text-cream">
                {n}
                <span className="text-ember">%</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Kaydırma hızına göre hızlanan, yön değiştiren dev yazı şeridi
export function Marquee({ items, className = '', base = 3 }: { items: string[]; className?: string; base?: number }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  const dir = useRef(1)
  const reduced = useRef(prefersReducedMotion())
  useAnimationFrame((_, delta) => {
    if (reduced.current) return
    let move = dir.current * base * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * Math.abs(f)
    x.set(wrap(-50, 0, x.get() + move))
  })
  const tx = useTransform(x, (v) => `${v}%`)
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <motion.div style={{ x: tx }} className="inline-flex">
        {[0, 1].map((k) => (
          <span key={k} className="inline-flex">
            {row.map((t, i) => (
              <span key={i} className="mx-[0.25em] inline-flex items-center gap-[0.5em]">
                <span className={i % 2 ? 'font-serif italic font-normal tracking-[-0.02em]' : ''}>{t}</span>
                <span className="inline-block h-[0.32em] w-[0.32em] rounded-full bg-current opacity-80" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// Masaüstünde fareyi izleyen halka; bağlantıların üstünde büyüyüp "Tıkla" der
export function Cursor() {
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion(),
  )
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { damping: 28, stiffness: 380, mass: 0.5 })
  const sy = useSpring(y, { damping: 28, stiffness: 380, mass: 0.5 })
  const [hover, setHover] = useState<null | string>(null)
  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = (e.target as HTMLElement).closest('a,button,label.chip,iframe')
      setHover(el ? (el.tagName === 'IFRAME' ? null : el.getAttribute('data-cursor') ?? '') : null)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, x, y])
  if (!enabled) return null
  const big = hover !== null
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[85] mix-blend-difference"
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-cream"
        animate={{ width: big ? 64 : 12, height: big ? 64 : 12 }}
        transition={{ duration: 0.3, ease }}
      />
      <AnimatePresence>
        {big && hover && (
          <motion.span
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {hover}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Bölümün kenarlarını kaydırmayla açan perde
export function Curtain({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] })
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0% 7% 0% 7% round 56px)', 'inset(0% 0% 0% 0% round 0px)'])
  return (
    <motion.section ref={ref} id={id} style={{ clipPath: clip }} className={className}>
      {children}
    </motion.section>
  )
}

// Müzik bölümünde "çalıyor" hissi veren ekolayzer
export function Equalizer({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex h-[0.7em] items-end gap-[0.08em] ${className}`} aria-hidden="true">
      {[0.9, 0.5, 1, 0.65, 0.8].map((h, i) => (
        <motion.span
          key={i}
          className="block w-[0.12em] rounded-full bg-ember"
          animate={{ scaleY: [h, 0.25, 1, 0.4, h] }}
          style={{ height: '100%', originY: 1 }}
          transition={{ duration: 1.1 + i * 0.13, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}
