import { motion, useTransform } from 'framer-motion'
import Hero from './Hero'
import { INTRO_VH, ramp } from '../lib/curve'
import { useJourney } from '../lib/heroMotion'

/**
 * The opening scene and its reveal.
 *
 * The hero is PINNED beneath this stage for the whole intro: it sits behind a
 * paper veil at 94% scale while the butterfly swarm owns the screen (the
 * swarm is the page-level stream at negative journey — see lib/curve.ts).
 * As the visitor scrolls, the butterflies wander and dissolve, the veil
 * melts, and the hero scales up to full size — coming forward from the
 * background rather than sliding in from below. The pin releases exactly at
 * s = 0, after which the hero scrolls away natively and every downstream
 * mark is untouched.
 *
 * The veil sits at z-44 — above all hero content, beneath the butterfly
 * stream at z-45 — and the header hides itself during the intro (see Header).
 */
export default function HeroIntroStage() {
  const journey = useJourney()

  const reveal = useTransform(journey, (s) => ramp(-0.62, -0.04, s))
  const scale = useTransform(reveal, (a) => 0.94 + a * 0.06)
  const veil = useTransform(journey, (s) => 1 - ramp(-0.5, -0.06, s))

  return (
    <div className="relative w-full" style={{ height: `${(INTRO_VH + 1) * 100}vh` }}>
      <div
        className="sticky top-0 h-svh w-full overflow-hidden"
        style={{ background: '#f7f7f5' }}
      >
        <motion.div
          className="h-full w-full"
          style={{ scale, transformOrigin: '50% 38%', willChange: 'transform' }}
        >
          <Hero />
        </motion.div>

        {/* the veil the hero comes forward through */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[44]"
          style={{ background: '#f7f7f5', opacity: veil }}
        />
      </div>
    </div>
  )
}
