import type { MediaSlot } from './media'
import type { Tone } from '../components/MediaFrame'

/* ============================================================================
   SECTION 06 — THE GALLERY WALL

   A deep black canvas with ten colourful cards descending in the reference's
   diagonal rhythm: top-right → down the left flank → through the centre →
   settling bottom-right. The negative space is the composition — nothing may
   be centred, evened out, or gridded.

   Coordinates are read off the reference (1200 × 1500) as fractions of the
   canvas. The canvas itself is `ASPECT` × viewport-width tall, so the section
   scrolls naturally and the butterfly circuit gets runway.
   ========================================================================= */

export const GALLERY = {
  /** where the section starts, in viewports scrolled (sum of all before it) */
  top: 11.1,
  /** canvas height = ASPECT × viewport width (the reference is 1200×1500) */
  aspect: 1.25,
  /** phones scale the cards up so they stay readable; positions are shared */
  mobileScale: 1.6,
}

export interface GalleryCard {
  id: string
  slot: MediaSlot
  tone: Tone
  /** centre of the card, fraction of the canvas */
  cx: number
  cy: number
  /** width as a fraction of canvas width; height from the card's own ratio */
  w: number
  /** width ÷ height, measured off the reference */
  ratio: number
  /** resting tilt, degrees — kept tiny; the reference cards sit straight */
  tilt: number
  /** 0 = far, 1 = near; drives the gentle scroll parallax */
  depth: number
  /** drift path (see .float-* in index.css) */
  float: 'a' | 'b' | 'c' | 'd'
  duration: number
  delay: number
  /**
   * Stacking vs the butterfly stream, which rides at z-45: cards at 50 let
   * the ribbon pass BEHIND them, cards at 40 let it pass IN FRONT — the
   * alternation is what gives the circuit its between-the-cards depth.
   */
  z: 40 | 50
  /** the card's own short line, revealed with its image */
  caption: { label: string; line: string }
}

/** In the reference's own visual order, top to bottom. */
export const GALLERY_CARDS: GalleryCard[] = [
  { id: 'banner', slot: 'GALLERY_01', tone: 'sun', cx: 0.75, cy: 0.021, w: 0.217, ratio: 3.44, tilt: 0, depth: 0.35, float: 'a', duration: 13, delay: 0.4, z: 50, caption: { label: 'First frames', line: 'Where every story begins.' } },
  { id: 'storefront', slot: 'GALLERY_02', tone: 'neutral', cx: 0.781, cy: 0.143, w: 0.204, ratio: 1.63, tilt: -0.4, depth: 0.55, float: 'b', duration: 12, delay: 1.6, z: 40, caption: { label: 'Between takes', line: 'The laughter the camera keeps.' } },
  { id: 'pattern', slot: 'GALLERY_03', tone: 'lavender', cx: 0.617, cy: 0.263, w: 0.183, ratio: 1.64, tilt: 0.5, depth: 0.7, float: 'c', duration: 11, delay: 0.9, z: 50, caption: { label: 'In transit', line: 'Stories travel with me.' } },
  { id: 'abstract', slot: 'GALLERY_04', tone: 'mint', cx: 0.396, cy: 0.363, w: 0.179, ratio: 1.59, tilt: -0.3, depth: 0.45, float: 'd', duration: 13.5, delay: 2.2, z: 40, caption: { label: 'In character', line: 'Stillness, held like breath.' } },
  { id: 'gradient', slot: 'GALLERY_05', tone: 'blush', cx: 0.237, cy: 0.458, w: 0.193, ratio: 1.64, tilt: 0.4, depth: 0.8, float: 'a', duration: 12.5, delay: 3.1, z: 50, caption: { label: 'Golden hour', line: 'Friends, sky, and nothing else.' } },
  { id: 'portfolio', slot: 'GALLERY_06', tone: 'neutral', cx: 0.267, cy: 0.568, w: 0.212, ratio: 1.57, tilt: -0.5, depth: 0.5, float: 'b', duration: 14, delay: 0.2, z: 40, caption: { label: 'Unwritten', line: 'A moment yet to come.' } },
  { id: 'cluster', slot: 'GALLERY_07', tone: 'dusk', cx: 0.5, cy: 0.692, w: 0.229, ratio: 1.62, tilt: 0.3, depth: 0.9, float: 'c', duration: 11.5, delay: 1.2, z: 50, caption: { label: 'Quiet light', line: 'Small scenes, full hearts.' } },
  { id: 'portrait', slot: 'GALLERY_08', tone: 'sky', cx: 0.737, cy: 0.803, w: 0.212, ratio: 1.51, tilt: -0.4, depth: 0.6, float: 'd', duration: 12.8, delay: 2.6, z: 40, caption: { label: 'Listening', line: 'Every frame pays attention.' } },
  { id: 'type-card', slot: 'GALLERY_09', tone: 'peach', cx: 0.782, cy: 0.881, w: 0.194, ratio: 1.66, tilt: 0.5, depth: 0.75, float: 'a', duration: 13.2, delay: 0.7, z: 50, caption: { label: 'Off guard', line: 'The candid ones stay longest.' } },
  { id: 'tags', slot: 'GALLERY_10', tone: 'neutral', cx: 0.625, cy: 0.955, w: 0.158, ratio: 1.38, tilt: -0.3, depth: 0.4, float: 'b', duration: 12.2, delay: 1.9, z: 40, caption: { label: 'Side by side', line: 'Walking into the next scene.' } },
]

/**
 * The editorial content occupying the composition's two big negative-space
 * zones: the main statement in the empty top-left quadrant, the numbered
 * index down the empty right flank. Positions are canvas fractions.
 */
export const GALLERY_TEXT = {
  main: {
    x: 0.045,
    y: 0.055,
    label: 'My journey, frame by frame',
    line: 'From the characters I’ve played to the stories I’ve been lucky enough to be part of, every project has given me a new perspective.',
    tagline: 'Actor · Performer · Storyteller',
  },
  index: {
    x: 0.965,
    y: 0.35,
    items: [
      ['01', 'Film'],
      ['02', 'Performance'],
      ['03', 'Character'],
      ['04', 'Story'],
    ],
  },
}

/**
 * The butterfly circuit — a closed loop threaded through every card in the
 * reference's visual order, then returning up the left flank to close.
 * Points are canvas fractions; the stream samples this with a Catmull-Rom
 * spline, so the ribbon curves past each card rather than cornering at it.
 */
export const GALLERY_LOOP: Array<[number, number]> = [
  [0.75, 0.021], // yellow banner
  [0.781, 0.143], // storefront
  [0.617, 0.263], // pattern card
  [0.396, 0.363], // green abstract
  [0.237, 0.458], // gradient card
  [0.267, 0.568], // portfolio
  [0.5, 0.692], // dark cluster
  [0.737, 0.803], // portrait
  [0.782, 0.881], // orange type card
  [0.625, 0.955], // grey tags
  // the return leg, back up the left flank
  [0.3, 0.83],
  [0.13, 0.48],
  [0.32, 0.13],
]
