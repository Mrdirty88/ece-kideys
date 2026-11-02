// Tek kaydırma kaynağı: Lenis. WebGL sahnesi bu nesneyi her karede okur (React state yok).
export const scroll = {
  y: 0,
  progress: 0, // sayfa geneli 0..1
  velocity: 0,
  mouse: { x: 0.5, y: 0.5 },
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasWebGL2 = () => {
  try {
    const c = document.createElement('canvas')
    return !!c.getContext('webgl2')
  } catch {
    return false
  }
}
