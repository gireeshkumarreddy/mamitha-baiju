import { motion, useTransform } from 'framer-motion'
import type { CSSProperties } from 'react'
import MediaFrame from './MediaFrame'
import { GALLERY, GALLERY_CARDS, GALLERY_TEXT, type GalleryCard } from '../config/galleryLayout'
import { ramp } from '../lib/curve'
import { useBreakpoint, useJourney, useViewport } from '../lib/heroMotion'

/**
 * One floating card. Static position (no layout work, ever); life comes from
 * three cheap transform layers — a gentle depth parallax against scroll, the
 * shared CSS drift paths, and a whisper of resting tilt.
 *
 * THE REVEAL: the image is clipped by its own frame and rises from below it
 * with a fade as the card scrolls into view — each photograph surfaces inside
 * its placeholder, never travelling between placeholders. Its caption follows
 * a beat later, so the text changes card by card as the visitor scrolls.
 */
function Card({ card, scale }: { card: GalleryCard; scale: number }) {
  const journey = useJourney()
  const { vh, vw } = useViewport()

  /* Where this card's centre lives, in viewports scrolled — parallax drifts
     it against scroll by its depth while it crosses the screen. */
  const centreS = GALLERY.top + (card.cy * GALLERY.aspect * vw) / vh
  const y = useTransform(journey, (s) => (s - centreS) * card.depth * -26)

  /* The reveal runs while the card climbs the lower half of the viewport. */
  const reveal = useTransform(journey, (s) => ramp(centreS - 0.85, centreS - 0.4, s))
  const imgY = useTransform(reveal, (r) => `${(1 - r) * 104}%`)
  const captionIn = useTransform(journey, (s) => ramp(centreS - 0.55, centreS - 0.28, s))
  const captionY = useTransform(captionIn, (a) => (1 - a) * 10)

  const w = card.w * scale * 100

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${card.cx * 100}%`,
        top: `${card.cy * 100}%`,
        width: `${w}vw`,
        zIndex: card.z,
        y,
        willChange: 'transform',
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div
          className={`float-${card.float}`}
          style={
            {
              '--float-duration': `${card.duration}s`,
              '--float-delay': `${card.delay}s`,
            } as CSSProperties
          }
        >
          <div className="relative">
            <div
              className="overflow-hidden rounded-[0.7vw] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)]"
              style={{ aspectRatio: `${card.ratio}`, transform: `rotate(${card.tilt}deg)` }}
            >
              <motion.div
                className="h-full w-full"
                style={{ y: imgY, opacity: reveal, willChange: 'transform, opacity' }}
              >
                <MediaFrame slot={card.slot} tone={card.tone} hint={card.id} />
              </motion.div>
            </div>

            {/* the card's own line about Mamitha */}
            <motion.div
              className="absolute top-full right-0 left-0 mt-2.5"
              style={{ opacity: captionIn, y: captionY }}
            >
              <div className="label flex items-baseline justify-between text-[0.5rem] md:text-[0.6rem]">
                <span className="text-[#8b8e96]">{card.caption.label}</span>
                <span className="text-[#f4f4f2]">{GALLERY_CARDS.indexOf(card) + 1 < 10 ? '0' : ''}{GALLERY_CARDS.indexOf(card) + 1}</span>
              </div>
              <p className="font-ui mt-1.5 text-[0.68rem] leading-[1.45] font-medium text-[#9a9da3] md:text-[0.74rem]">
                {card.caption.line}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Section 06 — the gallery wall.
 *
 * Ten cards on deep black, placed exactly to the reference's descending
 * diagonal; the negative space IS the composition. The canvas is taller than
 * a viewport and scrolls natively — no pinning — which hands the butterfly
 * circuit its runway: the page-level stream threads a closed loop through
 * these same card anchors (see STREAM_STAGES.gallery in lib/curve.ts),
 * advancing card-to-card as the user scrolls. Cards alternate z 40/50 around
 * the stream's z-45, so the ribbon passes behind some and in front of others.
 */
/** An editorial block occupying one of the wall's negative-space zones,
 *  fading up as it scrolls into view — same reveal language as the cards. */
function TextBlock({
  cy,
  children,
  className,
  style,
}: {
  cy: number
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const journey = useJourney()
  const { vh, vw } = useViewport()
  const centreS = GALLERY.top + (cy * GALLERY.aspect * vw) / vh
  const opacity = useTransform(journey, (s) => ramp(centreS - 0.85, centreS - 0.45, s))
  const y = useTransform(opacity, (a) => (1 - a) * 24)

  return (
    <motion.div className={className} style={{ ...style, opacity, y }}>
      {children}
    </motion.div>
  )
}

export default function GallerySection() {
  const bp = useBreakpoint()
  const scale = bp === 'mobile' ? GALLERY.mobileScale : 1
  const T = GALLERY_TEXT

  return (
    <section
      className="relative z-10 w-full overflow-hidden bg-black"
      style={{ height: `${GALLERY.aspect * scale * 100}vw` }}
    >
      {GALLERY_CARDS.map((card) => (
        <Card key={card.id} card={card} scale={scale} />
      ))}

      {/* the main editorial statement, in the empty top-left quadrant */}
      <TextBlock
        cy={T.main.y + 0.06}
        className="absolute z-[30] max-w-[46vw] min-w-[250px] md:max-w-[34vw]"
        style={{ left: `${T.main.x * 100}%`, top: `${T.main.y * 100}%` }}
      >
        <span className="label block text-[0.58rem] text-[#8b8e96] md:text-[0.64rem]">
          {T.main.label}
        </span>
        <p className="font-editorial mt-4 text-[1.15rem] leading-[1.35] text-[#f4f4f2] md:mt-5 md:text-[1.55vw]">
          {T.main.line}
        </p>
        <span className="label mt-4 block text-[0.56rem] text-[#9a9da3] md:mt-5 md:text-[0.62rem]">
          {T.main.tagline}
        </span>
      </TextBlock>

      {/* the numbered index, down the empty right flank */}
      <TextBlock
        cy={T.index.y + 0.08}
        className="absolute z-[30] hidden text-right md:block"
        style={{ right: `${(1 - T.index.x) * 100}%`, top: `${T.index.y * 100}%` }}
      >
        {T.index.items.map(([n, label]) => (
          <div key={n} className="mt-[1.6vw] first:mt-0">
            <span className="label block text-[0.56rem] text-[#8b8e96]">{n}</span>
            <span className="font-editorial mt-1 block text-[1.15vw] leading-none text-[#e9e9e7]">
              {label}
            </span>
          </div>
        ))}
      </TextBlock>
    </section>
  )
}
