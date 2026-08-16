import { motion, useTransform } from 'framer-motion'
import type { ButterflyConfig } from '../config/heroLayout'
import ButterflyGlyph from './butterfly/ButterflyArt'
import { ramp } from '../lib/curve'
import { useHeroScroll, useJourney, usePointer, type Breakpoint } from '../lib/heroMotion'

interface Props {
  config: ButterflyConfig
  breakpoint: Breakpoint
}

/**
 * A butterfly resident in the hero. As the page starts to move these hand off
 * to <ButterflyStream>: they fade out over the same scroll range the stream
 * fades in, so the gathering reads as *these* butterflies forming the ribbon
 * rather than a second set appearing from nowhere.
 */
export default function FloatingButterfly({ config, breakpoint }: Props) {
  const progress = useHeroScroll()
  const journey = useJourney()
  const pointer = usePointer()

  const scrollY = useTransform(progress, [0, 1], [0, -90 - config.depth * 260])
  const pointerX = useTransform(pointer.x, (v) => v * config.depth * -38)
  const pointerY = useTransform(pointer.y, (v) => v * config.depth * -26)

  /* The hero keeps its own scattered butterflies alongside the incoming
     ribbon, as the reference shows; they only hand off once the ribbon has
     gathered into a line. */
  const resting = 0.62 + config.depth * 0.38
  const opacity = useTransform(journey, (s) => resting * (1 - ramp(0.22, 0.5, s)))

  const onPhone = breakpoint === 'mobile'
  const spot = onPhone && config.mobile ? config.mobile : config
  const width = onPhone
    ? `${Math.round(config.size * 0.6)}px`
    : `min(${((config.size / 1536) * 100).toFixed(3)}vw, ${Math.round(config.size * 1.3)}px)`

  const steps = config.path.x.length
  const times = Array.from({ length: steps }, (_, i) => i / (steps - 1))

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: `${spot.left}%`,
        top: `${spot.top}%`,
        width,
        zIndex: config.z,
        y: scrollY,
        willChange: 'transform',
      }}
    >
      <motion.div style={{ x: pointerX, y: pointerY }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: config.enterDelay, ease: [0.22, 0.61, 0.24, 1] }}
        >
          {/* the flight path itself */}
          <motion.div
            animate={{
              x: config.path.x,
              y: config.path.y,
              rotate: config.path.rotate,
              scale: config.path.scale,
            }}
            transition={{
              duration: config.duration,
              delay: config.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              times,
            }}
            style={{ opacity }}
          >
            {/* no drop-shadow: a filter on a continuously-transforming element
                forces re-rasterisation and costs far more than it shows */}
            <ButterflyGlyph id={`bf-${config.id}`} slot={config.slot} flap={config.flap} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
