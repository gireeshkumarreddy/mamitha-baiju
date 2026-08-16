import { useScroll, useTransform } from 'framer-motion'
import HeroIntroStage from './components/HeroIntroStage'
import MomentsSection from './components/MomentsSection'
import ReelSection from './components/ReelSection'
import ScreenSection from './components/ScreenSection'
import GallerySection from './components/GallerySection'
import FinaleSection from './components/FinaleSection'
import ButterflyStream from './components/ButterflyStream'
import { JourneyProvider, PointerParallaxProvider, useViewport } from './lib/heroMotion'
import { INTRO_VH } from './lib/curve'

export default function App() {
  const { vh } = useViewport()

  /* One value drives the entire page: viewports scrolled, ANCHORED AT THE
   * HERO. The intro sits before it at negative s, so inserting it moved not
   * one downstream mark. Because the journey is a distance rather than a
   * 0→1 fraction, appending a section extends it instead of re-timing
   * everything, and the butterflies never reset at a section boundary. */
  const { scrollY } = useScroll()
  const journey = useTransform(scrollY, (v) => (vh > 0 ? v / vh - INTRO_VH : -INTRO_VH))

  return (
    <PointerParallaxProvider>
      <JourneyProvider progress={journey}>
        <main className="relative w-full">
          <HeroIntroStage />
          <MomentsSection />
          <ReelSection />
          <ScreenSection />
          <GallerySection />
          <FinaleSection />
          <ButterflyStream />
        </main>
      </JourneyProvider>
    </PointerParallaxProvider>
  )
}
