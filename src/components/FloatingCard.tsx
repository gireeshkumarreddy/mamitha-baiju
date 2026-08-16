import { motion, useTransform } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import type { CardConfig, Placement } from '../config/heroLayout'
import { useHeroScroll, usePointer, type Breakpoint } from '../lib/heroMotion'

/** Reference-artboard px → fluid width, per breakpoint. */
const sizeFor = (px: number, bp: Breakpoint) =>
  bp === 'mobile'
    ? `${((px / 390) * 100).toFixed(2)}vw`
    : `min(${((px / 1536) * 100).toFixed(3)}vw, ${Math.round(px * 1.32)}px)`

interface FloatingCardProps {
  config: CardConfig
  placement: Placement
  breakpoint: Breakpoint
  children: ReactNode
}

/**
 * Five thin layers, each owning exactly one transform so nothing fights:
 *   1 · absolute placement + scroll parallax
 *   2 · pointer parallax
 *   3 · entrance
 *   4 · endless drift (CSS, so it never blocks the main thread)
 *   5 · resting tilt + hover
 */
export default function FloatingCard({
  config,
  placement,
  breakpoint,
  children,
}: FloatingCardProps) {
  const progress = useHeroScroll()
  const pointer = usePointer()

  // Nearer things travel further, both on scroll and under the cursor.
  const scrollY = useTransform(progress, [0, 1], [0, -120 - config.depth * 220])
  const pointerX = useTransform(pointer.x, (v) => v * config.depth * -46)
  const pointerY = useTransform(pointer.y, (v) => v * config.depth * -30)

  return (
    <motion.div
      className="floating-card absolute"
      style={{
        left: `${placement.left}%`,
        top: `${placement.top}%`,
        width: sizeFor(placement.width, breakpoint),
        height: placement.height ? sizeFor(placement.height, breakpoint) : undefined,
        zIndex: config.z,
        y: scrollY,
        willChange: 'transform',
      }}
    >
      <motion.div style={{ x: pointerX, y: pointerY }} className="h-full w-full">
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, y: 26, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.1,
            delay: config.enterDelay,
            ease: [0.22, 0.61, 0.24, 1],
          }}
        >
          <div
            className={`float-${config.float} h-full w-full`}
            style={
              {
                '--float-duration': `${config.duration}s`,
                '--float-delay': `${config.delay}s`,
              } as CSSProperties
            }
          >
            <motion.div
              className="h-full w-full cursor-pointer"
              initial={{ rotate: config.rotate }}
              whileHover={{ rotate: config.rotate * 0.22, scale: 1.035 }}
              transition={{ type: 'spring', stiffness: 170, damping: 20 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
