import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

/* ----------------------------------------------------------------------------
   Pointer parallax
   Normalised cursor position (-0.5 … 0.5 on both axes), spring-smoothed once
   and shared by every floating element. One listener for the whole scene.
   ------------------------------------------------------------------------- */

interface Pointer {
  x: MotionValue<number>
  y: MotionValue<number>
}

const PointerContext = createContext<Pointer | null>(null)

export function PointerParallaxProvider({ children }: { children: ReactNode }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 42, damping: 22, mass: 0.7 })
  const y = useSpring(rawY, { stiffness: 42, damping: 22, mass: 0.7 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return

    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5)
      rawY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [rawX, rawY])

  return <PointerContext.Provider value={{ x, y }}>{children}</PointerContext.Provider>
}

export function usePointer(): Pointer {
  const ctx = useContext(PointerContext)
  if (!ctx) throw new Error('usePointer must be used inside <PointerParallaxProvider>')
  return ctx
}

/* ----------------------------------------------------------------------------
   Hero scroll progress — published by <Hero>, consumed by everything inside it.
   ------------------------------------------------------------------------- */

const HeroScrollContext = createContext<MotionValue<number> | null>(null)

export function HeroScrollProvider({
  progress,
  children,
}: {
  progress: MotionValue<number>
  children: ReactNode
}) {
  return <HeroScrollContext.Provider value={progress}>{children}</HeroScrollContext.Provider>
}

export function useHeroScroll(): MotionValue<number> {
  const ctx = useContext(HeroScrollContext)
  if (!ctx) throw new Error('useHeroScroll must be used inside <HeroScrollProvider>')
  return ctx
}

/* ----------------------------------------------------------------------------
   Journey progress — how many viewports the page has scrolled.

   Deliberately NOT normalised 0→1. Every stage of the butterfly choreography
   is quoted in viewports, so appending a section changes where the page ends
   without shifting a single mark that came before it. A normalised value would
   re-time the entire journey each time the page grew.
   ------------------------------------------------------------------------- */

const JourneyContext = createContext<MotionValue<number> | null>(null)

export function JourneyProvider({
  progress,
  children,
}: {
  progress: MotionValue<number>
  children: ReactNode
}) {
  return <JourneyContext.Provider value={progress}>{children}</JourneyContext.Provider>
}

export function useJourney(): MotionValue<number> {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used inside <JourneyProvider>')
  return ctx
}

/* ----------------------------------------------------------------------------
   Viewport size — the stream and the orbit are computed in viewport pixels.
   ------------------------------------------------------------------------- */

export function useViewport() {
  const [size, setSize] = useState(() => ({
    vw: typeof window === 'undefined' ? 1440 : window.innerWidth,
    vh: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))

  useEffect(() => {
    const onResize = () => setSize({ vw: window.innerWidth, vh: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

/* ----------------------------------------------------------------------------
   Breakpoint — the layout config carries a placement per breakpoint, so this
   needs to be a real value, not just a CSS class.
   ------------------------------------------------------------------------- */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const read = (): Breakpoint => {
  if (typeof window === 'undefined') return 'desktop'
  if (window.innerWidth < 768) return 'mobile'
  if (window.innerWidth < 1180) return 'tablet'
  return 'desktop'
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(read)

  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setBp(read()))
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return bp
}

/** Reference-artboard px → fluid vw, clamped so it stops growing on 4K panels. */
export const fluid = (px: number, boost = 1) =>
  `min(${((px / 1536) * 100 * boost).toFixed(3)}vw, ${Math.round(px * boost * 1.32)}px)`
