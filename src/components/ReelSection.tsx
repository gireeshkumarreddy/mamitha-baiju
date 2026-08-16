import { motion, useTransform, type MotionValue } from 'framer-motion'
import MediaFrame from './MediaFrame'
import {
  ARCS,
  BOTTOM_ROW,
  GAP,
  MOBILE_SCALE,
  REEL,
  TOP_ROW,
  type Arc,
  type ReelCard,
} from '../config/reelLayout'
import { ramp } from '../lib/curve'
import { useBreakpoint, useJourney, useViewport } from '../lib/heroMotion'

/** y on the arc, in px, for a card at normalised x. */
const arcY = (arc: Arc, nx: number, vh: number) => (arc.k + arc.a * (nx - arc.h) ** 2) * vh

/** The arc's tangent at nx, in degrees — cards ride the curve, not a flat line. */
const arcAngle = (arc: Arc, nx: number, vw: number, vh: number) =>
  (Math.atan2(2 * arc.a * (nx - arc.h) * vh, vw) * 180) / Math.PI

interface RowGeometry {
  /** distance from the start of one card to the start of the next */
  offsets: number[]
  /** total track length in px — one full loop */
  track: number
  /** the widest card, so a wrapping card is fully off-screen before it jumps */
  widest: number
}

/**
 * Lays the row out by cumulative width rather than evenly in `u`.
 *
 * Even spacing would give ragged gaps because the cards are different widths;
 * spacing by cumulative width keeps every gap identical, and makes the track
 * length exactly the content length — which is what lets the loop wrap with no
 * seam, no blank stretch and no card popping into view mid-screen.
 */
function measureRow(cards: ReelCard[], vw: number, scale: number): RowGeometry {
  const gap = GAP * vw * scale
  const width = (c: ReelCard) => c.w * vw * scale

  /* The row travels leftward, so a card sits to the LEFT of the one before it.
     The step therefore has to be the *following* card's width — stepping by the
     current card's width instead leaves a gap that grows and shrinks with the
     width difference between neighbours, which on a row of mixed sizes opens
     holes several times the intended gap. */
  let cursor = 0
  const offsets = cards.map((c, i) => {
    if (i > 0) cursor += width(c) + gap
    return cursor
  })

  return {
    offsets,
    // closing the loop needs the same step again, back onto the first card
    track: cursor + width(cards[0]) + gap,
    widest: Math.max(...cards.map(width)),
  }
}

function Card({
  card,
  offset,
  row,
  arc,
  loop,
  vw,
  vh,
  scale,
}: {
  card: ReelCard
  offset: number
  row: RowGeometry
  arc: Arc
  loop: MotionValue<number>
  vw: number
  vh: number
  scale: number
}) {
  const width = card.w * vw * scale
  const height = width / card.ratio
  const start = vw + row.widest

  /** Position along the track, wrapped — this is the whole loop. */
  const pos = useTransform(loop, (l) => {
    const travelled = (offset + l * arc.speed * row.track) % row.track
    return travelled < 0 ? travelled + row.track : travelled
  })

  const x = useTransform(pos, (p) => start - p)
  const y = useTransform(x, (px) => arcY(arc, (px + width / 2) / vw, vh))
  const rotate = useTransform(x, (px) => arcAngle(arc, (px + width / 2) / vw, vw, vh) + card.skew)

  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ x, y, willChange: 'transform' }}
    >
      <motion.div
        className="-translate-y-1/2 overflow-hidden rounded-[1.4vw] shadow-[0_10px_30px_-14px_rgba(31,33,38,0.35)]"
        style={{ width, height, rotate }}
      >
        <MediaFrame slot={card.slot} tone={card.tone} hint="Reel" />
      </motion.div>
    </motion.div>
  )
}

function Row({
  cards,
  arc,
  loop,
  vw,
  vh,
  scale,
}: {
  cards: ReelCard[]
  arc: Arc
  loop: MotionValue<number>
  vw: number
  vh: number
  scale: number
}) {
  const row = measureRow(cards, vw, scale)
  return (
    <>
      {cards.map((card, i) => (
        <Card
          key={card.slot}
          card={card}
          offset={row.offsets[i]}
          row={row}
          arc={arc}
          loop={loop}
          vw={vw}
          vh={vh}
          scale={scale}
        />
      ))}
    </>
  )
}

/**
 * Section 03 — the looping reel.
 *
 * Two arcs of media travel leftward around the butterfly stream, which crosses
 * the middle of the section. The stream is *not* re-created here: it belongs to
 * the page-level <ButterflyStream>, driven by the same viewports-scrolled value
 * that drove the hero and section 02, so the same butterflies simply fly on
 * into this section without a reset.
 *
 * The canvas pins for two viewports of scroll, which is two complete loops,
 * then releases the page onward.
 */
export default function ReelSection() {
  const journey = useJourney()
  const breakpoint = useBreakpoint()
  const { vw, vh } = useViewport()

  const scale = breakpoint === 'mobile' ? MOBILE_SCALE : breakpoint === 'tablet' ? 1.35 : 1

  /** Loops completed. Starts a little before the section is fully in view, so
      the media is already in motion when the butterflies arrive. */
  const loop = useTransform(journey, (s) => Math.max(0, s - REEL.loopFrom) * REEL.loopsPerVh)

  /* The arcs ease in as the section rises, so nothing snaps into place. */
  const opacity = useTransform(journey, (s) => ramp(REEL.loopFrom - 0.35, REEL.loopFrom + 0.15, s))

  /* The section's standing mark — in while the reel is pinned, out as it
     hands over to the screens. */
  const markIn = useTransform(journey, (s) => ramp(3.2, 3.55, s) - ramp(5.7, 6.0, s))

  return (
    <section className="relative z-10 w-full" style={{ height: `${REEL.runway * 100}vh` }}>
      <motion.div
        className="sticky top-0 h-svh w-full overflow-hidden bg-[#fbfaf8]"
        style={{ opacity }}
      >
        <Row cards={TOP_ROW} arc={ARCS.top} loop={loop} vw={vw} vh={vh} scale={scale} />
        <Row cards={BOTTOM_ROW} arc={ARCS.bottom} loop={loop} vw={vw} vh={vh} scale={scale} />

        <motion.div
          className="absolute top-[4.5vh] left-6 z-[35] md:left-14"
          style={{ opacity: markIn }}
        >
          <span className="label block text-[0.6rem] text-[#8b8e96]">Gallery</span>
          <span className="font-editorial mt-1.5 block text-[1.1rem] text-[#2b2d31] md:text-[1.25rem]">
            Frames in motion
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
