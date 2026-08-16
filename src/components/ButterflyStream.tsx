import { useMemo } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import ButterflyGlyph, { BUTTERFLY_SLOTS } from './butterfly/ButterflyArt'
import { rand, ramp, streamHeading, streamPoint, streamScale, type StreamSeed } from '../lib/curve'
import { useJourney, useViewport } from '../lib/heroMotion'

/**
 * How many butterflies make the ribbon.
 *
 * The ribbon reads as a stream because of the *gaps* between them, so the
 * count stays low enough that spacing holds at roughly 2× a butterfly's own
 * width along the whole path.
 */
const COUNT = 20

/** Wing-tip to wing-tip, in px, before the per-breakpoint scale. */
const SIZE = { min: 26, max: 52 }

interface Flyer extends StreamSeed {
  /** place along the ribbon, 0→1 */
  t: number
  slot: (typeof BUTTERFLY_SLOTS)[number]
  size: number
  /** 0→1, squared so most flyers stay small and only a few lead the trail */
  prominence: number
  flap: number
  /** individual wing-wobble, so they never look like one asset duplicated */
  wobble: number
  spin: number
}

/**
 * Built once, for the life of the page. These same butterflies fly every
 * section — nothing is ever re-seeded per section, which is what makes the
 * stream one continuous journey rather than several animations that happen to
 * look alike.
 */
function buildFlyers(): Flyer[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    t: i / (COUNT - 1),
    phase: rand(i * 2.3) * Math.PI * 2,
    drift: rand(i * 5.9) * 2 - 1,
    slot: BUTTERFLY_SLOTS[i % BUTTERFLY_SLOTS.length],
    size: SIZE.min + rand(i * 11.3) * (SIZE.max - SIZE.min),
    prominence: Math.pow(rand(i * 23.7), 2),
    flap: 0.6 + rand(i * 13.7) * 0.5,
    wobble: 6 + rand(i * 17.1) * 12,
    spin: rand(i * 19.3) * Math.PI * 2,
  }))
}

function Flyer({
  flyer,
  scale,
  drift,
}: {
  flyer: Flyer
  scale: number
  /** the ONE shared drift clock — see ButterflyStream */
  drift: MotionValue<number>
}) {
  const journey = useJourney()
  const { vw, vh } = useViewport()

  const combined = useTransform([journey, drift], ([s, d]: number[]) => ({ s, d }))

  const x = useTransform(combined, ({ s, d }) => streamPoint(flyer.t, s, vw, vh, flyer, d).x)
  const y = useTransform(combined, ({ s, d }) => streamPoint(flyer.t, s, vw, vh, flyer, d).y)
  const rotate = useTransform(combined, ({ s, d }) => {
    const heading = streamHeading(flyer.t, s, vw, vh, flyer, d)
    return heading + Math.sin(d * 9 + flyer.spin) * flyer.wobble
  })

  /* The intro arc: fully visible while the swarm holds, dissolving as the
     butterflies wander (BUTTERFLIES → MOVE → DISAPPEAR), gone while the hero
     comes forward, then the ribbon fades back in as it gathers. From s 0.3
     onward this is the original curve — held through the page, easing back
     only while section 02's ring is settled. */
  const opacity = useTransform(journey, (s) => {
    const introVis = Math.min(1, 1 - ramp(-0.75, -0.3, s) + ramp(0.04, 0.3, s))
    return introVis * (1 - 0.25 * Math.max(0, ramp(1.4, 1.7, s) - ramp(2.05, 2.35, s)))
  })

  const width = useTransform(journey, (s) => flyer.size * scale * streamScale(s, flyer.prominence))

  return (
    <motion.div className="absolute top-0 left-0" style={{ x, y, opacity }}>
      <motion.div className="-translate-x-1/2 -translate-y-1/2" style={{ rotate, width }}>
        <ButterflyGlyph
          id={`stream-${flyer.t}`}
          slot={flyer.slot}
          flap={flyer.flap}
          detail={flyer.size * scale > 20}
        />
      </motion.div>
    </motion.div>
  )
}

/**
 * The ribbon of butterflies that carries the page from section to section.
 *
 * It lives in a fixed layer so the formation stays continuous while content
 * scrolls beneath it. ONE animation-frame subscription drives the shared
 * drift clock for all twenty flyers — the previous version gave every flyer
 * its own per-frame callback, twenty standing rAF subscribers whose cost
 * never went away. Butterfly sprites carry no filters and their wing-beat is
 * compositor-only (see ButterflyArt), so the stream's steady-state cost is
 * twenty transform updates per frame and nothing else.
 */
export default function ButterflyStream() {
  const flyers = useMemo(buildFlyers, [])
  const { vw } = useViewport()

  // Small screens get smaller butterflies, not fewer — the line must stay a line.
  const scale = vw < 768 ? 0.62 : vw < 1180 ? 0.82 : 1

  /* Keeps the formation breathing when scrolling stops. */
  const drift = useMotionValue(0)
  useAnimationFrame((time) => {
    drift.set((time / 1000) * 0.06)
  })

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
      {flyers.map((f) => (
        <Flyer key={f.t} flyer={f} scale={scale} drift={drift} />
      ))}
    </div>
  )
}
