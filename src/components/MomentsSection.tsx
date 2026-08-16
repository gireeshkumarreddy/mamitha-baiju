import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import MediaFrame from './MediaFrame'
import { HEADLINE, MOMENTS, type MomentItem, type Spot } from '../config/momentsLayout'
import { ramp } from '../lib/curve'
import { useBreakpoint, useJourney, useViewport, type Breakpoint } from '../lib/heroMotion'

/* ----------------------------------------------------------------------------
   Scroll marks, in viewports scrolled. The canvas pins at s = 1.0 and releases
   at s = 2.1, so the ring lands while the section holds still — and the rest of
   the pinned window is spent looking at the finished composition, not at an
   animation still resolving.
   ------------------------------------------------------------------------- */
const ARRIVE: readonly [number, number] = [1.0, 1.16] // frames fade in on the orbit
const SETTLE: readonly [number, number] = [1.16, 1.44] // orbit → the ring
const COPY: readonly [number, number] = [1.34, 1.62] // title, labels

/** Scroll runway for the section, in viewports. The canvas itself is 1. */
const RUNWAY = 2.1

interface Geometry {
  /** the pinned canvas's top edge in viewport pixels */
  top: MotionValue<number>
  vw: number
  vh: number
}

/** Frame width — quoted against both axes so short viewports shrink, not clip. */
const frameWidth = (spot: Spot, vw: number, vh: number) =>
  Math.min((spot.vw / 100) * vw, (spot.vh / 100) * vh)

/**
 * One frame of the ring, travelling in from the transition orbit.
 *
 * The card is anchored by its centre at its reference position; the orbit is
 * applied as a viewport-pixel offset — the gap between where the orbit wants
 * it and where the ring wants it — scaled by how far the settle has run. At
 * the end that offset is literally zero, so the reference arrangement is
 * pixel-accurate and the animation cannot leave it drifted.
 */
function Frame({
  item,
  spot,
  geo,
  breakpoint,
}: {
  item: MomentItem
  spot: Spot
  geo: Geometry
  breakpoint: Breakpoint
}) {
  const journey = useJourney()
  const { vw, vh } = geo

  /* Tighter than the butterfly orbit, so the ribbon travels around the ring
     rather than through it. */
  const radius = Math.min(vw * 0.24, vh * 0.3)
  const driver = useTransform([journey, geo.top], ([p, top]: number[]) => ({ p, top }))

  const offsetX = useTransform(driver, ({ p }) => {
    const settled = ramp(SETTLE[0], SETTLE[1], p)
    if (settled >= 1) return 0
    const angle = (item.orbit + p * 0.5) * Math.PI * 2
    return (vw * 0.5 + Math.cos(angle) * radius - (spot.cx / 100) * vw) * (1 - settled)
  })

  const offsetY = useTransform(driver, ({ p, top }) => {
    const settled = ramp(SETTLE[0], SETTLE[1], p)
    if (settled >= 1) return 0
    const angle = (item.orbit + p * 0.5) * Math.PI * 2
    const orbitY = vh * 0.5 + Math.sin(angle) * radius * 0.86
    return (orbitY - (top + (spot.cy / 100) * vh)) * (1 - settled)
  })

  const scale = useTransform(journey, (p) => 0.72 + ramp(SETTLE[0], SETTLE[1], p) * 0.28)
  const opacity = useTransform(journey, (p) => ramp(ARRIVE[0], ARRIVE[1], p))
  const captionOpacity = useTransform(journey, (p) => ramp(COPY[0], COPY[1], p))

  const width = frameWidth(spot, vw, vh)

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${spot.cx}%`,
        top: `${spot.cy}%`,
        x: offsetX,
        y: offsetY,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      {/* anchored by the frame's centre, so the ring holds at any scale */}
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ scale }}>
          <div className="relative" style={{ width, aspectRatio: `${spot.ratio}` }}>
            <MediaFrame slot={item.slot} tone={item.tone} hint={item.name} />

            {/* number left, label right, on one baseline under the frame —
                hung below the box so the centre anchor stays on the image */}
            <motion.div
              className="label absolute top-full right-0 left-0 mt-2 flex items-baseline justify-between text-[0.44rem] whitespace-nowrap text-[#2b2d31] md:text-[0.54rem]"
              style={{ opacity: captionOpacity }}
            >
              <span className="text-[#a09a90]">{item.index}</span>
              <span>{item.name}</span>
            </motion.div>

            {item.bubble && breakpoint !== 'mobile' && (
              /* reference: the little chat bubble tucked against the hand */
              <motion.span
                className="font-ui absolute top-[46%] left-full ml-1.5 flex items-center gap-1.5 rounded-full bg-[#dff5c8] px-2.5 py-1 text-[0.5rem] whitespace-nowrap text-[#2b2d31] shadow-[0_2px_8px_rgba(31,33,38,0.1)]"
                style={{ opacity: captionOpacity }}
              >
                Hello!
                <span className="text-[0.42rem] text-[#7d8a6c]">17:47</span>
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/** The hand-drawn rule under the title — reference: a red-orange squiggle. */
function Squiggle() {
  return (
    <svg viewBox="0 0 220 16" className="h-auto w-full" aria-hidden="true" fill="none">
      <path
        d="M2 9 C18 -1 34 -1 50 9 C66 19 82 19 98 9 C114 -1 130 -1 146 9 C162 19 178 19 194 9 C202 4 210 3 218 6"
        stroke="#e0512c"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Section 02 — the ring of frames the butterfly ribbon delivers you into.
 *
 * The canvas is pinned at one viewport tall inside a taller scroll runway:
 * that buys the transition the scroll distance it needs while keeping the
 * finished composition readable in a single screen, which is the whole point
 * of the arrangement.
 */
export default function MomentsSection() {
  const ref = useRef<HTMLElement>(null)
  const journey = useJourney()
  const breakpoint = useBreakpoint()
  const { vw, vh } = useViewport()

  const isSmall = breakpoint === 'mobile'

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  /* The canvas is sticky, so its top sits at 0 for the whole pinned window.
     Before it pins, it rides down with the section. */
  const top = useTransform(scrollYProgress, (q) => Math.max(0, vh - q * (vh + RUNWAY * vh)))

  const copyOpacity = useTransform(journey, (p) => ramp(COPY[0], COPY[1], p))
  const copyY = useTransform(journey, (p) => (1 - ramp(COPY[0], COPY[1], p)) * 26)

  const geo: Geometry = { top, vw, vh }
  const head = isSmall ? HEADLINE.mobile : HEADLINE.desktop

  return (
    <section ref={ref} className="relative z-10 w-full" style={{ height: `${RUNWAY * 100}vh` }}>
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#f7f0e6]">
        {MOMENTS.map((item) => (
          <Frame
            key={item.id}
            item={item}
            spot={isSmall ? item.mobile : item.desktop}
            geo={geo}
            breakpoint={breakpoint}
          />
        ))}

        {/* the centred title block, ringed by the frames */}
        <motion.span
          className="label absolute left-1/2 z-[5] -translate-x-1/2 text-[0.5rem] whitespace-nowrap text-[#8b8579] md:text-[0.62rem]"
          style={{ top: `${head.kickerCy}%`, opacity: copyOpacity, y: copyY }}
        >
          {HEADLINE.kicker}
        </motion.span>

        <motion.h2
          className="font-display absolute left-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 text-[7.5vw] leading-none tracking-[0.01em] whitespace-nowrap text-[#2b2d31] uppercase md:text-[min(3.9vw,7.4vh)]"
          style={{ top: `${head.cy}%`, opacity: copyOpacity, y: copyY }}
        >
          {HEADLINE.text}
        </motion.h2>

        <motion.div
          className="absolute left-1/2 z-[5] w-[38vw] -translate-x-1/2 md:w-[min(11vw,21vh)]"
          style={{ top: `${head.ruleCy}%`, opacity: copyOpacity, y: copyY }}
        >
          <Squiggle />
        </motion.div>
      </div>
    </section>
  )
}
