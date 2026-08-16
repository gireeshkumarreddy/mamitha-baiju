import { motion, useTransform } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useHeroScroll, usePointer } from '../lib/heroMotion'

const ENTER = { duration: 1.8, ease: [0.16, 0.7, 0.22, 1] as const }

/* One line, letterspaced, in a soft warm grey that sits well behind the
   portrait. The wordmark's own serif, so the logo and the architectural type
   read as one identity. */
const INK: CSSProperties = {
  backgroundImage: 'linear-gradient(176deg,#d6cfc4 0%,#ded8ce 48%,#e9e4dc 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

/**
 * MAMITHA BAIJU, set across the top of the hero behind everything else —
 * "BAIJU" trailing the first word on the same baseline at about two-thirds
 * the size, as in the approved reference.
 */
export default function BackgroundTypography() {
  const progress = useHeroScroll()
  const pointer = usePointer()

  const y = useTransform(progress, [0, 1], [0, 110])
  const opacity = useTransform(progress, [0, 0.75], [1, 0.2])
  const x = useTransform(pointer.x, (v) => v * -10)
  const py = useTransform(pointer.y, (v) => v * -7)

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[9%] z-0 flex justify-center select-none md:top-[7.5%]"
      style={{ y, opacity, willChange: 'transform, opacity' }}
    >
      <motion.div style={{ x, y: py }}>
        <motion.h2
          className="font-display flex items-baseline justify-center tracking-[0.16em] whitespace-nowrap uppercase"
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ENTER, delay: 0.34 }}
        >
          {/* the gradient lives on each word rather than the flex parent:
              background-clip:text against block-level children is unreliable
              and would render the whole line invisible */}
          <span className="text-[14vw] leading-[1] md:text-[min(9.6vw,18vh)]" style={INK}>
            Mamitha
          </span>
          <span className="text-[9.6vw] leading-[1] md:text-[min(6.6vw,12.4vh)]" style={INK}>
            Baiju
          </span>
        </motion.h2>
      </motion.div>
    </motion.div>
  )
}
