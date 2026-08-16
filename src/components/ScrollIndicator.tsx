import { motion, useTransform } from 'framer-motion'
import { useHeroScroll } from '../lib/heroMotion'

export default function ScrollIndicator() {
  const progress = useHeroScroll()
  const opacity = useTransform(progress, [0, 0.14], [1, 0])

  return (
    <motion.div
      className="pointer-events-none absolute bottom-[9vh] left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-[4.6vh]"
      style={{ opacity }}
    >
      <motion.div
        className="flex flex-col items-center gap-2.5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 2.55, ease: [0.16, 0.7, 0.22, 1] }}
      >
        {/* The portrait now runs to the bottom edge behind this, so the label
            carries a soft paper-coloured halo to stay legible over it. */}
        <span className="label text-[0.66rem] whitespace-nowrap text-[#2b2d31] [text-shadow:0_0_10px_#f7f7f5,0_0_4px_#f7f7f5]">
          Scroll to explore
        </span>
        <span className="flex h-[22px] w-[14px] items-start justify-center rounded-full border border-[rgba(43,45,49,0.35)] pt-[4px]">
          <span className="scroll-dot h-[4px] w-[1.5px] rounded-full bg-[#2b2d31]" />
        </span>
      </motion.div>
    </motion.div>
  )
}
