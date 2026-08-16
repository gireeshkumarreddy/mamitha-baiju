import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import Header from './Header'
import BackgroundTypography from './BackgroundTypography'
import CentralPortrait from './CentralPortrait'
import FloatingCard from './FloatingCard'
import FloatingButterfly from './FloatingButterfly'
import HeroCard from './HeroCards'
import ScrollIndicator from './ScrollIndicator'
import HeroFooter from './HeroFooter'
import {
  BUTTERFLIES,
  HERO_CARDS,
  deriveTablet,
  type CardConfig,
  type Placement,
} from '../config/heroLayout'
import { HeroScrollProvider, useBreakpoint, type Breakpoint } from '../lib/heroMotion'

/** Which placement a card uses at this width — `null` means it sits this one out. */
function placementFor(card: CardConfig, bp: Breakpoint): Placement | null {
  if (bp === 'mobile') return card.mobile ?? null
  if (bp === 'tablet') {
    if (card.tablet === 'hidden') return null
    return card.tablet ?? deriveTablet(card.desktop)
  }
  return card.desktop
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const bp = useBreakpoint()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  return (
    <HeroScrollProvider progress={scrollYProgress}>
      <section
        ref={ref}
        className="relative h-svh min-h-[600px] w-full overflow-hidden bg-[#f7f7f5]"
      >
        <BackgroundTypography />

        {HERO_CARDS.map((card) => {
          const placement = placementFor(card, bp)
          if (!placement) return null
          return (
            <FloatingCard key={card.id} config={card} placement={placement} breakpoint={bp}>
              <HeroCard kind={card.kind} />
            </FloatingCard>
          )
        })}

        <CentralPortrait />

        {BUTTERFLIES.filter((b) => bp !== 'mobile' || b.mobile).map((b) => (
          <FloatingButterfly key={b.id} config={b} breakpoint={bp} />
        ))}

        <Header />
        <ScrollIndicator />
        <HeroFooter />
      </section>
    </HeroScrollProvider>
  )
}
