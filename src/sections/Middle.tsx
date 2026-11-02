import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { chapters, facts, links, manifesto, releases, stages, timeline } from '../content'
import { Curtain, Equalizer } from '../fx'
import { Arrow, Parallax, Reveal, ScrollWords, SplitTitle, ease } from '../ui'

export function Manifesto() {
  return (
    <section className="relative z-10 mx-auto max-w-[1600px] px-4 py-[22vh] sm:px-8" aria-label="Manifesto">
      <ScrollWords
        text={manifesto}
        className="max-w-[20ch] font-display text-[clamp(2rem,5.6vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
      />
    </section>
  )
}

export function Story() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(chapters.length - 1, Math.max(0, Math.floor(v * chapters.length)))
    setActive(i)
  })
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const ch = chapters[active]
  return (
    <section id="hikaye" className="relative z-10 bg-ink py-24 sm:py-36">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitTitle text="Hikâye" className="display text-[clamp(3.6rem,12vw,11rem)]" />
          <Reveal className="max-w-[34ch] pb-3 text-lg leading-[1.5] text-cream/75">
            Konservatuvardan beş ülkenin sahnesine, ekrandan kendi şarkılarına.
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-8">
          {/* sabit fotoğraf: bölüm değiştikçe maskeyle geçiş */}
          <div className="hidden md:col-span-5 md:block">
            <div className="sticky top-[12vh] h-[76vh]">
              <div className="relative h-full overflow-hidden rounded-[28px] bg-night">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={ch.img}
                    src={`./img/${ch.img}-720.webp`}
                    alt={ch.alt}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                    exit={{ opacity: 0.4 }}
                    transition={{ duration: 1.1, ease }}
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/70 via-transparent to-transparent mix-blend-multiply" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={ch.kicker}
                      className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] italic leading-none text-cream"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.6, ease }}
                    >
                      {ch.kicker}
                    </motion.span>
                  </AnimatePresence>
                  <span className="font-display text-sm font-bold tabular-nums text-cream/80">
                    {active + 1} / {chapters.length}
                  </span>
                </div>
              </div>
              <div className="mt-4 h-[2px] w-full overflow-hidden rounded bg-cream/10">
                <motion.div style={{ width: bar }} className="h-full bg-gradient-to-r from-ember to-violet" />
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {chapters.map((c, i) => (
              <article
                key={c.title}
                className={`flex min-h-[64vh] flex-col justify-center border-t border-cream/10 py-12 transition-opacity duration-700 md:min-h-[82vh] ${i === active ? 'md:opacity-100' : 'md:opacity-30'}`}
              >
                <img
                  src={`./img/${c.img}-720.webp`}
                  alt={c.alt}
                  loading="lazy"
                  className="mb-8 aspect-[4/5] w-full rounded-[22px] object-cover object-top md:hidden"
                />
                <p className="font-serif text-2xl italic text-flame">{c.kicker}</p>
                <h3 className="mt-3 max-w-[16ch] font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[1] tracking-[-0.04em] text-balance">
                  {c.title}
                </h3>
                <p className="mt-6 max-w-[52ch] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.65] text-cream/80">{c.text}</p>
              </article>
            ))}
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-3 gap-4 border-t border-cream/15 pt-12">
          {facts.map((f, i) => (
            <Reveal key={f.unit} delay={i * 0.08} className="min-w-0">
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="font-display text-[clamp(3rem,9vw,8rem)] font-extrabold leading-none tracking-[-0.06em] text-fire">{f.value}</span>
                <span className="ml-1 font-serif text-[clamp(1.1rem,2vw,1.8rem)] italic text-cream/80">{f.unit}</span>
                <span className="mt-3 block max-w-[24ch] text-sm leading-[1.4] text-mist sm:text-base">{f.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>

        <ol className="mt-16 border-t border-cream/15">
          {timeline.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.06}>
              <li className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-cream/15 py-6 md:grid-cols-[10rem_1fr_1.2fr]">
                <span className="font-serif text-3xl italic text-flame">{t.year}</span>
                <span className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{t.title}</span>
                <span className="col-start-2 text-mist md:col-start-3">{t.text}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Cover({ title, meta, hue, i }: { title: string; meta: string; hue: string; i: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return (
    <Reveal delay={i * 0.08}>
      <a
        href={links.spotify}
        target="_blank"
        rel="noreferrer"
        data-cursor="Dinle" className="group block [perspective:900px]"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 12 })
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        aria-label={`${title} şarkısını Spotify'da dinle`}
      >
        <div
          className={`relative aspect-square overflow-hidden rounded-[20px] bg-gradient-to-br ${hue} transition-transform duration-300 ease-out`}
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          <div className="absolute inset-0 opacity-50 mix-blend-overlay [background:radial-gradient(circle_at_30%_25%,#fff_0,transparent_45%)]" />
          <div className="absolute -bottom-[18%] -right-[18%] aspect-square w-[78%] rounded-full border-[14px] border-ink/25" />
          <div className="absolute -bottom-[6%] -right-[6%] aspect-square w-[54%] rounded-full border border-ink/30" />
          <span className="absolute left-5 top-5 font-display text-sm font-bold text-ink/70">Ece Kıdeyş</span>
          <span className="display absolute bottom-5 left-5 right-5 text-[clamp(2rem,4.6vw,3.6rem)] text-ink">{title}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-mist">{meta}</span>
          <span className="inline-flex items-center gap-2 text-sm text-cream/80 transition-colors group-hover:text-flame">
            Dinle <Arrow className="h-3.5 w-3.5" />
          </span>
        </div>
      </a>
    </Reveal>
  )
}

function Embed({ src, title, className, href }: { src: string; title: string; className: string; href: string }) {
  if (import.meta.env.VITE_PREVIEW)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={`group relative flex flex-col items-start justify-end gap-3 overflow-hidden rounded-[20px] bg-night p-6 ${className}`}>
        <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,rgba(139,61,255,.45),transparent_60%),radial-gradient(90%_80%_at_0%_100%,rgba(255,106,26,.35),transparent_60%)]" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:scale-110"><Arrow className="h-6 w-6" /></span>
        <span className="relative font-display text-2xl font-semibold tracking-[-0.02em]">{title}</span>
        <span className="relative text-sm text-mist">Önizlemede yeni sekmede açılır; canlı sitede oynatıcı bu kutuda çalışır.</span>
      </a>
    )
  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-night ${className}`}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}

export function Music() {
  return (
    <section id="muzik" className="relative z-10 py-24 sm:py-36">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-end gap-[0.12em] text-[clamp(3.6rem,13vw,12rem)]">
            <SplitTitle text="Dinle" className="display" />
            <Equalizer className="mb-[0.12em]" />
          </div>
          <Reveal className="max-w-[36ch] pb-3 text-lg leading-[1.5] text-cream/80">
            Single’lar, canlı yorumlar ve sahne kayıtları. Doğrudan bu sayfada dinleyin.
          </Reveal>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {releases.map((r, i) => (
            <Cover key={r.title} {...r} i={i} />
          ))}
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <Reveal>
            <Embed href={links.spotify} src={links.spotifyEmbed} title="Spotify’da Ece Kıdeyş" className="h-[460px] lg:h-full lg:min-h-[480px]" />
          </Reveal>
          <Reveal delay={0.1}>
            <Embed href={links.youtube} src={links.youtubeEmbed} title="YouTube kanalından videolar" className="aspect-video w-full" />
          </Reveal>
        </div>
        <Reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-cream/80">
          <a className="inline-flex items-center gap-2 hover:text-flame" href={links.spotify} target="_blank" rel="noreferrer">Spotify <Arrow className="h-3.5 w-3.5" /></a>
          <a className="inline-flex items-center gap-2 hover:text-flame" href={links.youtube} target="_blank" rel="noreferrer">YouTube <Arrow className="h-3.5 w-3.5" /></a>
          <a className="inline-flex items-center gap-2 hover:text-flame" href={links.appleMusic} target="_blank" rel="noreferrer">Apple Music <Arrow className="h-3.5 w-3.5" /></a>
          <a className="inline-flex items-center gap-2 hover:text-flame" href={links.instagram} target="_blank" rel="noreferrer">Instagram <Arrow className="h-3.5 w-3.5" /></a>
        </Reveal>
      </div>
    </section>
  )
}

const shots = [
  { src: 'denim-stand', big: 960, alt: 'Kot ceket ve krem çizmelerle ayakta poz veren Ece Kıdeyş', ratio: 'aspect-[2/3]' },
  { src: 'sequin', big: 912, alt: 'Siyah payetli kıyafetiyle kolunu başının arkasına koymuş Ece Kıdeyş', ratio: 'aspect-[6/7]' },
  { src: 'polka-back', big: 1024, alt: 'Puantiyeli bluz ve kot pantolonla omzunun üzerinden bakan Ece Kıdeyş', ratio: 'aspect-[2/3]' },
  { src: 'denim-floor', big: 1024, alt: 'Kot ceketle yerde oturan Ece Kıdeyş', ratio: 'aspect-[2/3]' },
]

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%'])
  const words = useTransform(scrollYProgress, [0, 1], ['10%', '-30%'])
  return (
    <Curtain id="galeri" className="relative z-10 bg-plum">
      {/* masaüstü: yatay ray */}
      <div ref={ref} className="relative hidden h-[320vh] md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div style={{ x: words }} className="display pointer-events-none absolute top-[9vh] whitespace-nowrap text-[15vw] text-ink/40" aria-hidden="true">
            sahnede · kamerada · sahnede · kamerada
          </motion.div>
          <h2 className="sr-only">Galeri</h2>
          <motion.div style={{ x }} className="relative flex items-end gap-[4vw] pl-[8vw]">
            <div className="w-[26vw] shrink-0 pb-10">
              <p className="display text-[5.4vw] text-cream">Kare<br /><span className="text-ember">kare.</span></p>
              <p className="mt-6 max-w-[30ch] text-lg leading-[1.5] text-cream/75">Stüdyodan sahneye; her pozda aynı enerji, aynı cesaret.</p>
            </div>
            {shots.map((s, i) => (
              <figure key={s.src} className={`shrink-0 ${i % 2 ? 'w-[30vw] self-start' : 'w-[24vw]'}`}>
                <div className={`overflow-hidden rounded-[20px] ${s.ratio}`}>
                  <img
                    src={`./img/${s.src}-${s.big}.webp`}
                    alt={s.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                  />
                </div>
              </figure>
            ))}
          </motion.div>
        </div>
      </div>
      {/* mobil: dikey liste */}
      <div className="px-4 py-24 md:hidden">
        <h2 className="display text-[18vw] text-cream">Kare <span className="text-ember">kare.</span></h2>
        <div className="mt-10 grid grid-cols-2 gap-3">
          {shots.map((s, i) => (
            <Reveal key={s.src} delay={i * 0.05} className={i === 1 ? 'mt-12' : i === 3 ? '-mt-12' : ''}>
              <img src={`./img/${s.src}-720.webp`} alt={s.alt} loading="lazy" className={`w-full rounded-2xl object-cover ${s.ratio}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </Curtain>
  )
}

export function Stages() {
  return (
    <section id="sahne" className="relative z-10 bg-ink py-24 sm:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SplitTitle text="Sahne sizin." className="display text-[clamp(3rem,7.5vw,7rem)]" />
          <Reveal className="mt-8 max-w-[42ch] text-lg leading-[1.55] text-cream/80">
            Büyük bir konserden samimi bir davete kadar, her etkinlik için ayrı kurgulanmış bir performans.
          </Reveal>
          <Parallax amount={50} className="mt-12 hidden aspect-[4/5] w-[70%] overflow-hidden rounded-[20px] lg:block">
            <img src="./img/denim-floor-720.webp" alt="" className="h-[115%] w-full object-cover" loading="lazy" />
          </Parallax>
        </div>
        <ul className="border-t border-cream/15 lg:col-span-6 lg:col-start-7">
          {stages.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <li className="group relative overflow-hidden border-b border-cream/15">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] [@media(hover:hover)]:group-hover:scale-y-100" />
                <a href="#talep" className="relative flex flex-col gap-2 px-1 py-8 transition-colors duration-300 sm:flex-row sm:items-baseline sm:justify-between [@media(hover:hover)]:group-hover:text-ink">
                  <span className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{s.title}</span>
                  <span className="max-w-[30ch] text-mist transition-colors [@media(hover:hover)]:group-hover:text-ink/80">{s.text}</span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { ease }
