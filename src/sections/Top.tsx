import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { artist, links } from '../content'
import { INTRO_DELAY } from '../fx'
import { Arrow, ease } from '../ui'

const nav = [
  { href: '#hikaye', label: 'Hikâye' },
  { href: '#muzik', label: 'Müzik' },
  { href: '#galeri', label: 'Galeri' },
  { href: '#sahne', label: 'Sahne' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? 'bg-ink/85' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:h-20 sm:px-8">
          <a href="#top" className="font-display text-[15px] font-bold tracking-[-0.03em]" aria-label="Ece Kıdeyş, başa dön">
            Ece Kıdeyş<span className="text-ember">.</span>
          </a>
          <nav className="hidden items-center gap-9 text-[15px] md:flex" aria-label="Ana menü">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-cream/75 transition-colors hover:text-cream">
                {n.label}
              </a>
            ))}
            <a
              href="#talep"
              className="rounded-full bg-ember px-5 py-2.5 font-medium text-ink transition-colors hover:bg-flame"
            >
              Etkinlik talebi
            </a>
          </nav>
          <button
            className="flex h-11 items-center gap-2 text-[15px] md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobil-menu"
          >
            Menü
            <span className="flex flex-col gap-[5px]" aria-hidden="true">
              <span className="block h-[1.5px] w-6 bg-cream" />
              <span className="block h-[1.5px] w-4 self-end bg-ember" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobil-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            className="fixed inset-0 z-[70] flex flex-col bg-plum px-4 pb-10 pt-4"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex h-16 items-center justify-between">
              <span className="font-display text-[15px] font-bold">Ece Kıdeyş<span className="text-ember">.</span></span>
              <button className="h-11 text-[15px]" onClick={() => setOpen(false)}>
                Kapat
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2" aria-label="Mobil menü">
              {[...nav, { href: '#talep', label: 'Talep' }].map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="display text-[13vw] text-cream"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease }}
                >
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto flex gap-6 text-cream/80">
              <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={links.youtube} target="_blank" rel="noreferrer">YouTube</a>
              <a href={links.spotify} target="_blank" rel="noreferrer">Spotify</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Hero(_: { fallback: boolean }) {
  const first = 'Ece'
  const last = 'Kıdeyş'
  return (
    <section id="top" className="relative flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden">
      {/* WebGL yoksa da akışkan his veren yedek zemin */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[20%] top-[10%] h-[70vmax] w-[70vmax] rounded-full bg-violet/35 blur-[90px]" />
        <div className="absolute -right-[10%] -top-[20%] h-[60vmax] w-[60vmax] rounded-full bg-ember/30 blur-[100px]" />
      </div>

      {/* Sabit fotoğraf: bozulmaz, oynamaz; çevresi akışkan ve 3D */}
      <motion.div
        id="hero-photo"
        className="absolute left-1/2 top-[10svh] h-[46svh] w-[min(72vw,34svh)] -translate-x-1/2 md:left-auto md:right-[7vw] md:top-[12svh] md:h-[80svh] md:w-[min(36vw,60svh)] md:translate-x-0"
        initial={{ clipPath: 'inset(100% 0% 0% 0% round 999px 999px 28px 28px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 28px 28px)' }}
        transition={{ duration: 1.4, ease, delay: INTRO_DELAY }}
      >
        <img
          src="./img/hero-1200.webp"
          srcSet="./img/hero-720.webp 720w, ./img/hero-1200.webp 1200w"
          sizes="(min-width: 768px) 36vw, 78vw"
          alt="Ece Kıdeyş, siyah beyaz portre"
          className="h-full w-full rounded-t-full rounded-b-[28px] object-cover object-[72%_22%] shadow-[0_40px_120px_-20px_rgba(139,61,255,.55)]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-[28px] ring-1 ring-inset ring-cream/15" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-8 sm:px-8 sm:pb-12">
        <motion.p
          className="mb-4 max-w-[24ch] font-serif text-[clamp(1.35rem,min(3vw,4svh),2.6rem)] italic leading-[1.08] text-cream"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: INTRO_DELAY + 1.1 }}
        >
          {artist.tagline}
        </motion.p>
        <h1 className="display text-[clamp(3.6rem,min(16vw,22svh),16rem)] text-cream [text-shadow:0_8px_60px_rgba(11,7,16,.55)]" aria-label={artist.name}>
          {[first, last].map((word, wi) => (
            <span key={word} className={`block ${wi === 1 ? 'text-ember' : ''}`} aria-hidden="true">
              {[...word].map((ch, i) => (
                <span key={i} className="-mb-[0.2em] inline-block overflow-hidden pb-[0.24em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '115%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.3, ease, delay: INTRO_DELAY + 0.25 + (wi * 3 + i) * 0.06 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: INTRO_DELAY + 1.3 }}
        >
          <a href="#muzik" data-cursor="Dinle" className="group inline-flex h-12 items-center gap-3 rounded-full bg-cream px-6 font-medium text-ink">
            Şarkıları dinle
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
          <a href="#talep" className="inline-flex h-12 items-center rounded-full border border-cream/35 bg-ink/30 px-6 font-medium text-cream transition-colors hover:border-ember hover:text-flame">
            Sahne için davet et
          </a>
          <span className="ml-auto hidden text-sm text-mist md:block">{artist.role}</span>
        </motion.div>
      </div>
    </section>
  )
}
