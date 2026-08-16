import type { MediaSlot } from './media'
import type { Tone } from '../components/MediaFrame'

/* ============================================================================
   SECTION 02 — "THE RECAP 02"

   Transcribed from the approved reference: eight small frames ringed around a
   centred title on warm cream, each with a number and a label beneath it, and
   a stream of butterflies flowing around the outside of the ring.

   The ring is NOT a perfect circle — the reference's asymmetry is what makes
   it read as composed rather than generated, so every centre below is measured
   off the reference rather than placed on a mathematical circle.

   THE CANVAS IS ONE VIEWPORT. The whole composition has to be readable without
   scrolling, so each frame is anchored by its *centre* and sized against both
   viewport axes — a short laptop shrinks the frames instead of pushing the
   bottom of the ring off-screen.

     cx, cy   centre of the frame, % of the canvas
     vw, vh   frame width = min(vw% of viewport width, vh% of viewport height)
     ratio    the frame's own width ÷ height, so photographs keep their shape
   ========================================================================= */

export interface Spot {
  cx: number
  cy: number
  vw: number
  vh: number
  ratio: number
}

export interface MomentItem {
  id: string
  slot: MediaSlot
  /** the number printed under the frame */
  index: string
  /** temporary label — reference: Punkation, Sattel, Elegant, … */
  name: string
  tone: Tone
  /** a chat bubble rides on this one, as in the reference */
  bubble?: boolean
  desktop: Spot
  mobile: Spot
  /** where this frame sits on the transition orbit, in turns (0–1) */
  orbit: number
}

/** Clockwise from the top-left of the ring, exactly as the reference numbers them. */
export const MOMENTS: MomentItem[] = [
  {
    id: 'punkation',
    slot: 'MOMENT_01',
    index: '01',
    name: 'Punkation',
    tone: 'neutral',
    desktop: { cx: 33.4, cy: 20.2, vw: 5.7, vh: 13, ratio: 0.68 },
    mobile: { cx: 27, cy: 13, vw: 26, vh: 13, ratio: 0.68 },
    orbit: 0,
  },
  {
    id: 'sattel',
    slot: 'MOMENT_02',
    index: '02',
    name: 'Sattel',
    tone: 'sun',
    desktop: { cx: 43.9, cy: 11.6, vw: 6.3, vh: 14, ratio: 1.35 },
    mobile: { cx: 68, cy: 10, vw: 30, vh: 12, ratio: 1.35 },
    orbit: 0.125,
  },
  {
    id: 'elegant',
    slot: 'MOMENT_03',
    index: '03',
    name: 'Elegant',
    tone: 'sky',
    desktop: { cx: 62, cy: 15.2, vw: 5.6, vh: 13, ratio: 0.88 },
    mobile: { cx: 76, cy: 28, vw: 26, vh: 13, ratio: 0.88 },
    orbit: 0.25,
  },
  {
    id: 'gesture',
    slot: 'MOMENT_04',
    index: '04',
    name: 'Gesture',
    tone: 'mint',
    bubble: true,
    desktop: { cx: 72.9, cy: 30.9, vw: 5.5, vh: 13, ratio: 0.7 },
    mobile: { cx: 79, cy: 50, vw: 22, vh: 11, ratio: 0.7 },
    orbit: 0.375,
  },
  {
    id: 'tangerine',
    slot: 'MOMENT_05',
    index: '05',
    name: 'Tangerine',
    tone: 'peach',
    desktop: { cx: 70.2, cy: 66.1, vw: 6.4, vh: 14, ratio: 0.94 },
    mobile: { cx: 73, cy: 71, vw: 27, vh: 13, ratio: 0.94 },
    orbit: 0.5,
  },
  {
    id: 'video',
    slot: 'MOMENT_06',
    index: '06',
    name: 'Video',
    tone: 'dusk',
    desktop: { cx: 55.8, cy: 79.6, vw: 7.6, vh: 16, ratio: 1.18 },
    mobile: { cx: 50, cy: 88, vw: 30, vh: 13, ratio: 1.18 },
    orbit: 0.625,
  },
  {
    id: 'jitter',
    slot: 'MOMENT_07',
    index: '07',
    name: 'Jitter',
    tone: 'blush',
    desktop: { cx: 37.6, cy: 71.5, vw: 6.8, vh: 15, ratio: 0.83 },
    mobile: { cx: 25, cy: 73, vw: 27, vh: 13, ratio: 0.83 },
    orbit: 0.75,
  },
  {
    id: 'jake',
    slot: 'MOMENT_08',
    index: '08',
    name: 'Jake Paul',
    tone: 'lavender',
    desktop: { cx: 24.2, cy: 54.1, vw: 5.5, vh: 13, ratio: 0.74 },
    mobile: { cx: 20, cy: 50, vw: 22, vh: 11, ratio: 0.74 },
    orbit: 0.875,
  },
]

/** The centred title block — kicker over the headline, squiggle beneath. */
export const HEADLINE = {
  kicker: 'Mamitha Baiju',
  text: 'My World',
  desktop: { cy: 43.8, kickerCy: 36.6, ruleCy: 51.8 },
  mobile: { cy: 43, kickerCy: 37, ruleCy: 50 },
}
