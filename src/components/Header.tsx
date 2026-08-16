import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { ramp } from '../lib/curve'
import { useJourney } from '../lib/heroMotion'

const NAV = ['Home', 'Movies', 'Roles', 'Gallery', 'About', 'Contact']

export default function Header() {
  const [active, setActive] = useState('Home')
  const [open, setOpen] = useState(false)
  const journey = useJourney()

  /* The header sits above the intro veil, so it hides itself until the hero
     has come forward — the opening screen belongs to the butterflies alone. */
  const introGate = useTransform(journey, (s) => ramp(-0.28, -0.04, s))
  const gateEvents = useTransform(introGate, (o) => (o < 0.05 ? 'none' : 'auto'))

  /* The overlay owns the screen while open — keep the page from scrolling
     underneath it. */
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-50"
      style={{ opacity: introGate, pointerEvents: gateEvents }}
    >
      <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-6 px-7 pt-7 pb-6 md:px-14 md:pt-9 md:pb-8">
        {/* wordmark */}
        <a href="#" className="font-editorial leading-[0.98] text-[#2b2d31] select-none">
          <span className="block text-[1.05rem] tracking-[0.2em] md:text-[1.2rem]">MAMITHA</span>
          <span className="block pl-[0.9em] text-[1.05rem] tracking-[0.2em] md:text-[1.2rem]">
            BAIJU
          </span>
        </a>

        {/* desktop nav */}
        <nav className="hidden items-center gap-7 min-[1000px]:flex xl:gap-11">
          {NAV.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActive(item)}
              className="label relative py-1 text-[0.7rem] text-[#2b2d31] transition-opacity duration-300 hover:opacity-55"
            >
              {item}
              {active === item && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -bottom-1.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#2b2d31]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="label group hidden items-center gap-2 rounded-full bg-[#2b2d31] px-6 py-3 text-[0.66rem] text-white transition-colors duration-500 hover:bg-[#43464d] sm:inline-flex"
          >
            Follow
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(43,45,49,0.14)] bg-white/60 text-[#2b2d31] backdrop-blur-sm min-[1000px]:hidden"
          >
            <Menu className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <div className="mx-auto h-px max-w-[1680px] bg-[rgba(43,45,49,0.09)] md:mx-14 md:max-w-none" />

      {/* ---------------------------------------------- mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[80] flex flex-col bg-[#f7f7f5] min-[1000px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 0.7, 0.22, 1] }}
          >
            <div className="flex items-center justify-between px-7 pt-7 pb-6">
              <span className="font-editorial leading-[0.98] text-[#2b2d31]">
                <span className="block text-[1.05rem] tracking-[0.2em]">MAMITHA</span>
                <span className="block pl-[0.9em] text-[1.05rem] tracking-[0.2em]">BAIJU</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(43,45,49,0.14)] text-[#2b2d31]"
              >
                <X className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
              {NAV.map((item, i) => (
                <motion.button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActive(item)
                    setOpen(false)
                  }}
                  className="font-editorial flex items-baseline gap-4 py-2.5 text-left text-[2.2rem] leading-none text-[#2b2d31]"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 0.7, 0.22, 1] }}
                >
                  <span className="label w-7 text-[0.6rem] text-[#a5a8ae]">
                    0{i + 1}
                  </span>
                  {item}
                  {active === item && (
                    <span className="ml-1 h-[5px] w-[5px] rounded-full bg-[#2b2d31]" />
                  )}
                </motion.button>
              ))}
            </nav>

            <motion.div
              className="flex items-center justify-between px-8 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.5 }}
            >
              <span className="label text-[0.6rem] text-[#8b8e96]">Actor / Performer / Artist</span>
              <a
                href="#"
                className="label inline-flex items-center gap-2 rounded-full bg-[#2b2d31] px-6 py-3 text-[0.66rem] text-white"
              >
                Follow
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
