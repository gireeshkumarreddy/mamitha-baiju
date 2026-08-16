import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import MediaFrame from './MediaFrame'
import { FINALE, FINALE_CTA, FOOTER_CARDS } from '../config/finaleLayout'
import { finaleTop, ramp } from '../lib/curve'
import { useJourney, useViewport } from '../lib/heroMotion'

const CARD_TONES = [
  'blush',
  'sky',
  'sun',
  'lavender',
  'mint',
  'peach',
  'neutral',
  'blush',
  'sky',
  'lavender',
  'sun',
  'mint',
] as const

/**
 * Section 07 — the closing scene.
 *
 * No video plays here any more. The rounded light canvas carries the final
 * call-to-action in its clear upper air — the invitation, the GET IN TOUCH
 * pill, the contact links — and a fan of twelve photographs rises across its
 * lower half, near-upright at the centre and rotating outward to ±26°, the
 * outermost bleeding off the corners. The page-level butterfly stream orbits
 * the whole composition (the finale stage in lib/curve.ts), passing in front
 * of the z-40 cards and behind the z-50 ones — arriving, at last, at the end
 * of the journey.
 */
export default function FinaleSection() {
  const journey = useJourney()
  const { vw, vh } = useViewport()
  const hostRef = useRef<HTMLElement | null>(null)

  const ft = finaleTop(vw, vh)
  const arrival = useTransform(journey, (s) => ramp(ft - 0.75, ft - 0.05, s))
  const canvasY = useTransform(arrival, (a) => (1 - a) * 60)

  /* Phones recompose rather than shrink: a squarer canvas, larger type. */
  const isMobile = vw < 768
  const aspect = isMobile ? 1.02 : FINALE.aspect
  const canvasW = isMobile ? 0.94 : FINALE.canvasW
  const typeScale = isMobile ? 1.8 : 1
  const cardScale = isMobile ? 1.3 : 1

  return (
    <section
      ref={hostRef}
      className="relative z-10 w-full"
      style={{ height: `${FINALE.runwayVh * 100}vh`, background: FINALE.stage }}
    >
      <motion.div
        className="cq absolute left-1/2 -translate-x-1/2 overflow-hidden"
        style={{
          top: isMobile ? '12vh' : '18vh',
          width: `${canvasW * 100}vw`,
          aspectRatio: `${aspect}`,
          background: FINALE.bg,
          borderRadius: isMobile ? '4vw' : '1.6vw',
          opacity: arrival,
          y: canvasY,
          boxShadow: '0 30px 80px -30px rgba(0,0,0,0.7)',
        }}
      >
        {/* ----------------------------------------------- the closing message */}
        {FINALE_CTA.headline.map((line, i) => (
          <h2
            key={line}
            className="font-heavy absolute left-1/2 z-[30] -translate-x-1/2 leading-none whitespace-nowrap uppercase"
            style={{
              top: `${FINALE_CTA.headlineY[i] * 100}%`,
              fontSize: `${FINALE_CTA.headlineSize * typeScale * 100}cqw`,
              letterSpacing: '0.004em',
              color: FINALE.ink,
            }}
          >
            {line}
          </h2>
        ))}

        <p
          className="font-ui absolute left-1/2 z-[30] -translate-x-1/2 text-center leading-none font-medium whitespace-nowrap"
          style={{
            top: `${FINALE_CTA.supportY * 100}%`,
            fontSize: `${0.0135 * typeScale * 100}cqw`,
            color: FINALE.soft,
          }}
        >
          {FINALE_CTA.support}
        </p>

        <a
          href={FINALE_CTA.cta.href}
          className="label group absolute left-1/2 z-[30] flex -translate-x-1/2 items-center rounded-full bg-[#111113] text-white transition-colors duration-500 hover:bg-[#33343a]"
          style={{
            top: `${FINALE_CTA.cta.y * 100}%`,
            /* pixel floors keep this a real touch target on small canvases */
            fontSize: `max(${0.0115 * typeScale * 100}cqw, 0.62rem)`,
            padding: `max(${0.9 * typeScale}cqw, 13px) max(${2.2 * typeScale}cqw, 24px)`,
            gap: `max(${0.7 * typeScale}cqw, 6px)`,
            minHeight: 44,
          }}
        >
          {FINALE_CTA.cta.label}
          <ArrowUpRight
            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ width: `${1.2 * typeScale}cqw`, height: `${1.2 * typeScale}cqw` }}
            strokeWidth={1.8}
          />
        </a>

        <div
          className="absolute left-1/2 z-[30] flex -translate-x-1/2 items-center"
          style={{ top: `${FINALE_CTA.linksY * 100}%`, gap: `${2 * typeScale}cqw` }}
        >
          {FINALE_CTA.links.map((link, i) => (
            <span key={link.label} className="flex items-center" style={{ gap: `${2 * typeScale}cqw` }}>
              {i > 0 && (
                <span
                  className="rounded-full bg-[#b9bcbe]"
                  style={{ width: `${0.28 * typeScale}cqw`, height: `${0.28 * typeScale}cqw` }}
                />
              )}
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="label flex items-center text-[#4c4e53] transition-opacity duration-300 hover:opacity-55"
                style={{ fontSize: `max(${0.011 * typeScale * 100}cqw, 0.58rem)`, minHeight: 34 }}
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        {/* --------------------------------------------------------- the fan */}
        {FOOTER_CARDS.map((card, i) => (
          <div
            key={card.slot}
            className="absolute"
            style={{
              left: `${card.cx * 100}%`,
              top: `${card.cy * 100}%`,
              width: `${card.w * cardScale * 100}%`,
              zIndex: card.z,
            }}
          >
            <div
              className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[0.9cqw] shadow-[0_1.2cqw_3cqw_rgba(0,0,0,0.28)]"
              style={{ aspectRatio: `${card.ratio}`, transform: `rotate(${card.rot}deg)` }}
            >
              <MediaFrame slot={card.slot} tone={CARD_TONES[i]} hint={`footer ${i + 1}`} />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
