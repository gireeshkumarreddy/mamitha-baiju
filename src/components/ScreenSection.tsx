import { useCallback, useEffect, useRef } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import {
  COPY_X,
  COPY_Y,
  CURVE,
  GLASS_FALLOFF,
  GLASS_SHEEN,
  PALETTE,
  SCREEN_SECTIONS,
  SEAM,
  VIDEO,
  type ScreenSectionConfig,
} from '../config/screenLayout'
import { ramp } from '../lib/curve'
import { useJourney, useViewport } from '../lib/heroMotion'

/* ----------------------------------------------------------------------------
   PERFORMANCE MODEL — why this player looks the way it does.

   · One <video> per section, pre-trimmed at build time, looping natively.
     No currentTime writes at runtime, ever: a JS seek drops frames while the
     decoder re-primes, and per-frame boundary checks were half the old cost.

   · Each strip's canvas paints ONLY ITS OWN SLIVER of the picture. The old
     painter blitted the full video zone into all 18 strip-wide canvases —
     ~8 MP of copies per frame per section. Slice painting totals ~one zone.

   · Painting rides requestVideoFrameCallback, so work happens exactly once
     per NEW video frame (24 fps here), not per display frame, and never
     while paused. rAF is only a fallback for browsers without rVFC.
   ------------------------------------------------------------------------- */

interface Slice {
  /** fraction of the video zone this canvas covers, horizontally */
  a: number
  b: number
}

function useSectionPlayer(
  stickyRef: React.RefObject<HTMLDivElement | null>,
  focusY: number,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvases = useRef(new Map<HTMLCanvasElement, Slice>())

  const registerCanvas = useCallback((el: HTMLCanvasElement | null, slice?: Slice) => {
    if (el && slice) canvases.current.set(el, slice)
  }, [])

  const paint = useCallback(() => {
    const v = videoRef.current
    if (!v || v.readyState < 2) return
    const vidW = v.videoWidth
    const vidH = v.videoHeight
    if (!vidW || !vidH) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    for (const [c, slice] of canvases.current) {
      if (!c.isConnected) {
        canvases.current.delete(c)
        continue
      }
      const cw = c.clientWidth
      const ch = c.clientHeight
      if (cw === 0 || ch === 0) continue
      const bw = Math.round(cw * dpr)
      const bh = Math.round(ch * dpr)
      if (c.width !== bw || c.height !== bh) {
        c.width = bw
        c.height = bh
      }
      const ctx = c.getContext('2d')
      if (!ctx) continue

      /* cover-crop of the FULL zone, biased to the face … */
      const zoneW = cw / (slice.b - slice.a)
      const destR = zoneW / ch
      const srcR = vidW / vidH
      let cropX = 0
      let cropY = 0
      let cropW = vidW
      let cropH = vidH
      if (srcR < destR) {
        cropH = vidW / destR
        cropY = focusY * (vidH - cropH)
      } else {
        cropW = vidH * destR
        cropX = 0.5 * (vidW - cropW)
      }
      /* … then only this strip's slice of that crop */
      ctx.drawImage(
        v,
        cropX + slice.a * cropW,
        cropY,
        (slice.b - slice.a) * cropW,
        cropH,
        0,
        0,
        bw,
        bh,
      )
    }
  }, [focusY])

  /* Paint scheduling: once per decoded frame. */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let alive = true
    let raf = 0

    type VideoWithRVFC = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number
    }
    const rvfc = (v as VideoWithRVFC).requestVideoFrameCallback?.bind(v)

    const onFrame = () => {
      if (!alive) return
      paint()
      if (rvfc) rvfc(onFrame)
    }
    const fallbackLoop = () => {
      if (!alive) return
      raf = requestAnimationFrame(fallbackLoop)
      if (!v.paused) paint()
    }

    const onReady = () => paint() // poster frame before any playback
    v.addEventListener('loadeddata', onReady)
    if (rvfc) rvfc(onFrame)
    else raf = requestAnimationFrame(fallbackLoop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      v.removeEventListener('loadeddata', onReady)
    }
  }, [paint])

  /* Playback control — IntersectionObserver, independent of rAF throttling.
     Muted is forced as a property (Chromium's autoplay policy checks the
     property, not the attribute). */
  useEffect(() => {
    const v = videoRef.current
    const host = stickyRef.current
    if (!v || !host) return

    v.muted = true
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const retryOnGesture = () => {
      v.play().catch(() => {})
      window.removeEventListener('pointerdown', retryOnGesture)
      window.removeEventListener('keydown', retryOnGesture)
      window.removeEventListener('touchstart', retryOnGesture)
    }
    const tryPlay = () => {
      v.play().catch(() => {
        window.addEventListener('pointerdown', retryOnGesture)
        window.addEventListener('keydown', retryOnGesture)
        window.addEventListener('touchstart', retryOnGesture)
      })
    }

    let inView = false
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView && !calm) tryPlay()
        else if (!inView && !v.paused) v.pause()
      },
      { threshold: 0.12 },
    )
    io.observe(host)

    const onVisible = () => {
      if (document.visibilityState === 'visible' && inView && !calm) tryPlay()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pointerdown', retryOnGesture)
      window.removeEventListener('keydown', retryOnGesture)
      window.removeEventListener('touchstart', retryOnGesture)
    }
  }, [stickyRef])

  return { videoRef, registerCanvas }
}

type RegisterCanvas = ReturnType<typeof useSectionPlayer>['registerCanvas']

/* ----------------------------------------------------------------------------
   The flat surface — video zone on one side, editorial panel on the other.
   Rendered once per strip; each strip shows its own slice, and its canvas
   covers only the zone∩strip window so nothing paints outside what shows.
   ------------------------------------------------------------------------- */
function Surface({
  section,
  registerCanvas,
  stripIndex,
  count,
  width,
  typeScale,
}: {
  section: ScreenSectionConfig
  registerCanvas: RegisterCanvas
  stripIndex: number
  count: number
  width: number
  /** phones read the same surface from much further away, proportionally —
      the copy scales up while every position stays put */
  typeScale: number
}) {
  const videoLeft = section.videoSide === 'left'
  const copyX = COPY_X[videoLeft ? 'right' : 'left']
  const ts = typeScale
  const fs = (cqw: number, vh: number) => `min(${cqw * ts}cqw, ${vh * ts}vh)`

  /* zone and strip windows in surface px → this strip's slice of the zone */
  const zoneL = (videoLeft ? -12 : 100 - SEAM) * 0.01 * width
  const zoneW = (SEAM + 12) * 0.01 * width
  const stripW = width / count
  const OVERLAP = 2.5
  const winL = stripIndex * stripW - OVERLAP
  const winR = (stripIndex + 1) * stripW + OVERLAP
  const interL = Math.max(zoneL, winL)
  const interR = Math.min(zoneL + zoneW, winR)
  const slice =
    interR > interL ? { a: (interL - zoneL) / zoneW, b: (interR - zoneL) / zoneW } : null

  return (
    <>
      <div
        className="absolute inset-y-0"
        style={{ left: '-12%', width: '124%', background: PALETTE.paper }}
      />
      <div
        className="absolute inset-y-0"
        style={
          videoLeft
            ? { left: `${SEAM}%`, width: `${100 - SEAM + 12}%`, background: section.panel.bg }
            : { left: '-12%', width: `${100 - SEAM + 12}%`, background: section.panel.bg }
        }
      />

      {slice && (
        <canvas
          ref={(el) => registerCanvas(el, slice)}
          className="absolute inset-y-0"
          style={{ left: interL, width: interR - interL, height: '100%' }}
          aria-label="Mamitha dancing"
        />
      )}

      {/* ------------------------------------------------- the editorial copy */}
      <span
        className="label absolute text-[#0d0d0d]"
        style={{ left: `${copyX}%`, top: `${COPY_Y.label}%`, fontSize: fs(0.62, 0.89) }}
      >
        {section.copy.label}
      </span>

      <h2
        className="font-heavy absolute leading-none whitespace-nowrap uppercase"
        style={{
          left: `${copyX - 0.3}%`,
          top: `${COPY_Y.title}%`,
          fontSize: fs(4.6, 6.6),
          letterSpacing: '0.005em',
          color: PALETTE.ink,
        }}
      >
        {section.copy.title}
      </h2>

      {section.copy.lines.map((line, i) => (
        <p
          key={line}
          className="font-ui absolute leading-none font-semibold tracking-[-0.015em]"
          style={{
            left: `${copyX}%`,
            top: `${COPY_Y.lines + i * COPY_Y.lineStep * ts}%`,
            fontSize: fs(1.5, 2.15),
            color: PALETTE.ink,
          }}
        >
          {line}
        </p>
      ))}

      <p
        className="font-ui absolute leading-[1.55] font-medium"
        style={{
          left: `${copyX}%`,
          top: `${COPY_Y.body + (ts - 1) * 6}%`,
          width: `${Math.min(COPY_Y.bodyWidth * ts, 42)}%`,
          fontSize: fs(1.05, 1.5),
          color: section.panel.soft,
        }}
      >
        {section.copy.body}
      </p>

      {/* glass: falloff toward the receding centre, then a soft sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: GLASS_FALLOFF, mixBlendMode: 'multiply' }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: GLASS_SHEEN, mixBlendMode: 'screen' }}
      />
    </>
  )
}

/** One vertical strip of the cylinder. */
function Strip({
  index,
  count,
  width,
  height,
  arc,
  section,
  registerCanvas,
  typeScale,
}: {
  index: number
  count: number
  width: number
  height: number
  arc: MotionValue<number>
  section: ScreenSectionConfig
  registerCanvas: RegisterCanvas
  typeScale: number
}) {
  const stripW = width / count
  const OVERLAP = 2.5

  /* CONCAVE: advance by +R, rotate, push back by −R — the centre strip lands
     at z ≈ 0 and the edges forward of it. Everything derives from the ONE
     `arc` value inside one callback: a radius from a second motion value can
     flush on a different frame and tear the cylinder into separated slats. */
  const place = (index + 0.5) / count - 0.5
  const transform = useTransform(arc, (a) => {
    const rad = width / ((a * Math.PI) / 180)
    return `translateZ(${rad}px) rotateY(${-place * a}deg) translateZ(${-rad}px)`
  })

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 overflow-hidden"
      style={{
        width: stripW + OVERLAP * 2,
        height,
        marginLeft: -(stripW / 2 + OVERLAP),
        marginTop: -height / 2,
        transform,
        transformOrigin: '50% 50%',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
      }}
    >
      <div className="cq absolute top-0" style={{ width, height, left: -index * stripW + OVERLAP }}>
        <Surface
          section={section}
          registerCanvas={registerCanvas}
          stripIndex={index}
          count={count}
          width={width}
          typeScale={typeScale}
        />
      </div>
    </motion.div>
  )
}

/** One curved screen: the cylinder, its video, and its copy. */
function CurvedScreen({ section }: { section: ScreenSectionConfig }) {
  const journey = useJourney()
  const { vw, vh } = useViewport()
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const { videoRef, registerCanvas } = useSectionPlayer(stickyRef, section.focusY ?? VIDEO.focusY)

  /* Phones get their own composition of the same screen: a taller glass, a
     gentler wrap, fewer strips, and copy scaled up — not the desktop layout
     squeezed down. */
  const isMobile = vw < 768
  const width = vw * CURVE.width
  const height = vh * (isMobile ? 0.66 : CURVE.height)
  const segments = isMobile ? 9 : CURVE.segments
  const typeScale = isMobile ? 1.9 : 1
  const depth = vw < 900 ? 0.55 : vw < 1180 ? 0.78 : 1

  const arrival = useTransform(journey, (s) => ramp(section.pin - 1.1, section.pin + 0.25, s))
  const arc = useTransform(
    arrival,
    (a) => (CURVE.arriveArc + (CURVE.arc - CURVE.arriveArc) * a) * depth,
  )
  const rotateX = useTransform(arrival, (a) => (1 - a) * 5)
  const opacity = useTransform(journey, (s) => ramp(section.pin - 1.4, section.pin - 0.6, s))

  return (
    <section
      className="relative z-10 w-full"
      style={{ height: `${section.runway * 100}vh`, background: PALETTE.stage }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-svh w-full overflow-hidden"
        style={{ background: PALETTE.stage }}
      >
        {/* pre-trimmed segment, looping natively — no seeking anywhere */}
        <video
          ref={videoRef}
          src={section.src}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          style={{ position: 'absolute', width: 2, height: 2, opacity: 0, pointerEvents: 'none' }}
        />

        <motion.div className="h-full w-full" style={{ perspective: `${CURVE.perspective}px`, opacity }}>
          <motion.div
            className="relative h-full w-full"
            style={{ rotateX, transformStyle: 'preserve-3d' }}
          >
            {Array.from({ length: segments }, (_, i) => (
              <Strip
                key={i}
                index={i}
                count={segments}
                width={width}
                height={height}
                arc={arc}
                section={section}
                registerCanvas={registerCanvas}
                typeScale={typeScale}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/** Sections 04 and 05 — mirrored curved screens, one trimmed file each. */
export default function ScreenSection() {
  return (
    <>
      {SCREEN_SECTIONS.map((s) => (
        <CurvedScreen key={s.id} section={s} />
      ))}
    </>
  )
}
