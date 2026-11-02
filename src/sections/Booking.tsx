import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { artist, form, links, management } from '../content'
import { Arrow, Reveal, SplitTitle, ease } from '../ui'

export function Management() {
  return (
    <section id="menajerlik" className="relative z-10 bg-onyx py-24 sm:py-32" aria-labelledby="menajerlik-baslik">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[24px] border border-gold/25 bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(214,175,95,.16),transparent_70%)]" />
            {management.logo ? (
              <img src={management.logo} alt={`${management.company} logosu`} className="relative h-[78%] w-auto object-contain" />
            ) : (
              <div className="relative text-center" role="img" aria-label="İzmir Wellness Club logosu için yer tutucu">
                <div className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-[#8C6A2E] via-[#FBE7B0] to-[#8C6A2E]" />
                <p className="font-serif text-[clamp(2rem,3.4vw,3rem)] leading-none text-gold-light">İzmir Wellness Club</p>
                <p className="mt-4 text-xs tracking-[0.3em] text-gold/70">LOGO YER TUTUCU</p>
              </div>
            )}
          </div>
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 id="menajerlik-baslik" className="display text-[clamp(2.6rem,6vw,5.6rem)] text-[#F7F3EA]">
            Menajerlik
          </h2>
          <Reveal className="mt-6 max-w-[52ch] text-lg leading-[1.6] text-[#A9A296]">
            <p>{management.text}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[#A9A296]">Menajerlik</p>
              <p className="mt-1 font-display text-xl font-semibold text-gold-light">{management.company}</p>
            </div>
            {management.email && (
              <div>
                <p className="text-sm text-[#A9A296]">E-posta</p>
                <a href={`mailto:${management.email}`} className="mt-1 block break-all text-xl text-[#F7F3EA] hover:text-gold-light">
                  {management.email}
                </a>
              </div>
            )}
            {management.phone && (
              <div>
                <p className="text-sm text-[#A9A296]">WhatsApp</p>
                <a href={`https://wa.me/${management.whatsapp}`} target="_blank" rel="noreferrer" className="mt-1 block text-xl text-[#F7F3EA] hover:text-gold-light">
                  {management.phone}
                </a>
              </div>
            )}
            <div>
              <p className="text-sm text-[#A9A296]">Instagram</p>
              <a href={management.instagram} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-2 text-xl text-[#F7F3EA] hover:text-gold-light">
                @izmirwellnessclubofficial <Arrow className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

type Data = Record<string, string>

function Field({ label, name, required, children, wide }: { label: string; name: string; required?: boolean; children: React.ReactNode; wide?: boolean }) {
  return (
    <label htmlFor={name} className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-sm text-mist">
        {label}
        {required && <span className="text-flame"> *</span>}
      </span>
      {children}
    </label>
  )
}

function compose(d: Data) {
  const rows: [string, string][] = [
    ['Ad Soyad', d.ad],
    ['Kurum / Firma', d.kurum],
    ['E-posta', d.eposta],
    ['Telefon', d.telefon],
    ['Etkinlik türü', d.tur],
    ['Tarih', d.tarih],
    ['Saat', d.saat],
    ['Şehir / Mekân', d.mekan],
    ['Katılımcı sayısı', d.kisi],
    ['Performans süresi', d.sure],
    ['Performans biçimi', d.bicim],
    ['Ses ve ışık sistemi', d.teknik],
    ['Bütçe aralığı', d.butce],
    ['Repertuvar / şarkı istekleri', d.repertuvar],
    ['Etkinliğin içeriği ve notlar', d.icerik],
  ]
  return rows
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

export function Booking() {
  const [sent, setSent] = useState<null | { body: string }>(null)
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    if (!f.checkValidity()) {
      f.reportValidity()
      setError('Lütfen yıldızlı alanları doldurun.')
      return
    }
    setError('')
    const data = Object.fromEntries(new FormData(f).entries()) as Data
    const body = compose(data)
    const subject = `${artist.name} etkinlik talebi: ${data.tur} · ${data.tarih}`
    const via = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('value')
    if (via === 'whatsapp' && management.whatsapp) {
      if (!import.meta.env.VITE_PREVIEW)
      window.open(`https://wa.me/${management.whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`, '_blank', 'noopener')
    } else if (!import.meta.env.VITE_PREVIEW) {
      window.location.href = `mailto:${management.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
    setSent({ body })
  }

  return (
    <section id="talep" className="relative z-10 bg-ink py-24 sm:py-36" aria-labelledby="talep-baslik">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <span id="talep-baslik" className="sr-only">Etkinlik talep formu</span>
            <SplitTitle text="Davet edin." className="display text-[clamp(3rem,7vw,6.6rem)]" />
            <Reveal className="mt-6 max-w-[38ch] text-lg leading-[1.55] text-cream/80">
              Etkinliğinizi anlatın; menajerlik ekibi tarih, içerik ve teknik ihtiyaçlara göre size özel bir teklifle dönsün.
            </Reveal>
            <Reveal delay={0.1} className="mt-8 text-sm leading-[1.6] text-mist">
              Talepler <span className="text-cream">{management.company}</span> menajerliğine iletilir.
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease }}
                className="rounded-[24px] bg-gradient-to-br from-violet to-ember p-8 text-ink sm:p-12"
                role="status"
              >
                <p className="display text-[clamp(2.4rem,5vw,4rem)]">Teşekkürler.</p>
                <p className="mt-4 max-w-[46ch] text-lg leading-[1.5]">
                  {import.meta.env.VITE_PREVIEW ? 'Bu bir önizleme: canlı sitede talep doğrudan menajerliğe iletilir. Oluşan talep metni aşağıda.' : 'Talebiniz e-posta ya da WhatsApp uygulamanızda hazır metinle açıldı. Gönder’e bastığınızda menajerlik ekibi en kısa sürede dönüş yapacak.'}
                </p>
                <pre className="mt-6 max-h-60 overflow-auto whitespace-pre-wrap rounded-2xl bg-ink/15 p-4 font-sans text-sm">{sent.body}</pre>
                <button onClick={() => setSent(null)} className="mt-6 rounded-full bg-ink px-6 py-3 font-medium text-cream">
                  Yeni talep
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-x-8 gap-y-8 sm:grid-cols-2"
                aria-label="Etkinlik talep formu"
              >
                <Field label="Ad Soyad" name="ad" required>
                  <input id="ad" name="ad" required autoComplete="name" className="field" placeholder="Adınız ve soyadınız" />
                </Field>
                <Field label="Kurum / Firma" name="kurum">
                  <input id="kurum" name="kurum" autoComplete="organization" className="field" placeholder="Varsa" />
                </Field>
                <Field label="E-posta" name="eposta" required>
                  <input id="eposta" name="eposta" type="email" required autoComplete="email" className="field" placeholder="ornek@eposta.com" />
                </Field>
                <Field label="Telefon" name="telefon" required>
                  <input id="telefon" name="telefon" type="tel" required autoComplete="tel" className="field" placeholder="05xx xxx xx xx" />
                </Field>

                <fieldset className="sm:col-span-2">
                  <legend className="text-sm text-mist">
                    Etkinlik türü<span className="text-flame"> *</span>
                  </legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {form.eventTypes.map((t, i) => (
                      <label key={t} className="chip">
                        <input type="radio" name="tur" value={t} required={i === 0} className="sr-only" />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field label="Tarih" name="tarih" required>
                  <input id="tarih" name="tarih" type="date" required className="field" />
                </Field>
                <Field label="Saat" name="saat">
                  <input id="saat" name="saat" type="time" className="field" />
                </Field>
                <Field label="Şehir / Mekân" name="mekan" required>
                  <input id="mekan" name="mekan" required className="field" placeholder="Örn. İzmir, Alsancak · otel balo salonu" />
                </Field>
                <Field label="Tahmini katılımcı" name="kisi">
                  <select id="kisi" name="kisi" className="field" defaultValue="">
                    <option value="" disabled>Seçin</option>
                    {form.audiences.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Performans süresi" name="sure">
                  <select id="sure" name="sure" className="field" defaultValue="">
                    <option value="" disabled>Seçin</option>
                    {form.durations.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Performans biçimi" name="bicim">
                  <select id="bicim" name="bicim" className="field" defaultValue="">
                    <option value="" disabled>Seçin</option>
                    {form.formats.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Mekânda ses ve ışık sistemi var mı?" name="teknik">
                  <select id="teknik" name="teknik" className="field" defaultValue="">
                    <option value="" disabled>Seçin</option>
                    <option>Var</option>
                    <option>Yok, sizin getirmenizi istiyoruz</option>
                    <option>Emin değilim</option>
                  </select>
                </Field>
                <Field label="Bütçe aralığı" name="butce">
                  <select id="butce" name="butce" className="field" defaultValue="">
                    <option value="" disabled>Seçin</option>
                    {form.budgets.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Repertuvar / şarkı istekleri" name="repertuvar" wide>
                  <input id="repertuvar" name="repertuvar" className="field" placeholder="Özellikle duymak istediğiniz şarkılar, ilk dans şarkısı vb." />
                </Field>
                <Field label="Etkinliğin içeriği" name="icerik" required wide>
                  <textarea
                    id="icerik"
                    name="icerik"
                    required
                    rows={4}
                    className="field resize-y"
                    placeholder="Etkinliğin konsepti, akışı, dress code, sahne alınacak bölüm ve eklemek istedikleriniz"
                  />
                </Field>

                <label className="flex items-start gap-3 text-sm leading-[1.5] text-mist sm:col-span-2">
                  <input type="checkbox" name="kvkk" required className="mt-1 h-4 w-4 accent-[#ff6a1a]" />
                  <span>
                    Paylaştığım bilgilerin yalnızca bu talebin değerlendirilmesi amacıyla {management.company} tarafından işlenmesini kabul ediyorum (KVKK).
                    <span className="text-flame"> *</span>
                  </span>
                </label>

                {error && (
                  <p className="text-flame sm:col-span-2" role="alert">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  <button
                    type="submit"
                    value="email"
                    className="group inline-flex h-14 items-center gap-3 rounded-full bg-ember px-8 font-medium text-ink transition-colors hover:bg-flame"
                  >
                    Talebi gönder
                    <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </button>
                  {management.whatsapp && (
                    <button
                      type="submit"
                      value="whatsapp"
                      className="inline-flex h-14 items-center rounded-full border border-cream/35 px-8 font-medium hover:border-flame hover:text-flame"
                    >
                      WhatsApp ile gönder
                    </button>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-ink pt-20">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-8 px-4 sm:px-8">
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-cream/80">
          <a href={links.instagram} target="_blank" rel="noreferrer" className="hover:text-flame">Instagram</a>
          <a href={links.youtube} target="_blank" rel="noreferrer" className="hover:text-flame">YouTube</a>
          <a href={links.spotify} target="_blank" rel="noreferrer" className="hover:text-flame">Spotify</a>
          <a href={links.appleMusic} target="_blank" rel="noreferrer" className="hover:text-flame">Apple Music</a>
        </div>
        <p className="text-sm text-mist">Menajerlik: {management.company}</p>
      </div>
      <p
        className="display mt-10 select-none whitespace-nowrap px-2 text-center text-[15.5vw] leading-[0.85] text-transparent [-webkit-text-stroke:1px_rgba(255,106,26,.55)]"
        aria-hidden="true"
      >
        Ece Kıdeyş
      </p>
      <div className="mx-auto flex max-w-[1600px] justify-between px-4 py-6 text-xs text-mist sm:px-8">
        <span>© {new Date().getFullYear()} {artist.name}</span>
        <a href="#top" className="hover:text-cream">Başa dön ↑</a>
      </div>
    </footer>
  )
}
