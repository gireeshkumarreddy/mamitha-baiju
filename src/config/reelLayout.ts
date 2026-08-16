import type { MediaSlot } from './media'
import type { Tone } from '../components/MediaFrame'

/* ============================================================================
   SECTION 03 — THE REEL

   Two shallow arcs of rounded cards, the upper one bowing down and the lower
   one bowing up, framing the butterfly stream that crosses the middle. Both
   arcs run off the right edge and travel leftward, looping endlessly.

   THE ARCS
   Each is a parabola in normalised coordinates — x as a fraction of viewport
   width, y as a fraction of viewport height:

       y(nx) = k + a · (nx − h)²

   The three constants were fitted to the card centres measured off the
   reference, so the curvature is the reference's own rather than an invented
   one. Cards are rotated to the arc's tangent at their position, which is what
   makes the row read as a curve instead of a tilted list.
   ========================================================================= */

export interface Arc {
  /** y at the vertex, as a fraction of viewport height */
  k: number
  /** curvature; negative bows downward on screen */
  a: number
  /** nx of the vertex */
  h: number
  /** loops per viewport of pinned scroll */
  speed: number
}

export const ARCS: Record<'top' | 'bottom', Arc> = {
  /* fitted to centres (0.21, 0.203) (0.46, 0.259) (0.66, 0.269) (0.85, 0.249) */
  top: { k: 0.27, a: -0.399, h: 0.62, speed: 1.0 },
  /* fitted to centres (0.358, 0.781) (0.599, 0.730) (0.757, 0.711) (0.931, 0.708) */
  bottom: { k: 0.706, a: 0.214, h: 0.95, speed: 0.82 },
}

export interface ReelCard {
  slot: MediaSlot
  /** card width as a fraction of viewport width */
  w: number
  /** the card's own width ÷ height */
  ratio: number
  tone: Tone
  /** a touch of tilt on top of the arc tangent, so the row is not mechanical */
  skew: number
}

/** Gap between cards, as a fraction of viewport width. */
export const GAP = 0.05

/** Cards are sized and proportioned from the reference's own mix. */
export const TOP_ROW: ReelCard[] = [
  { slot: 'REEL_01', w: 0.228, ratio: 1.09, tone: 'dusk', skew: -1.2 },
  { slot: 'REEL_02', w: 0.231, ratio: 1.08, tone: 'peach', skew: 0.8 },
  { slot: 'REEL_03', w: 0.172, ratio: 0.91, tone: 'blush', skew: -0.6 },
  { slot: 'REEL_04', w: 0.202, ratio: 1.15, tone: 'sun', skew: 1.4 },
  { slot: 'REEL_05', w: 0.19, ratio: 0.86, tone: 'sky', skew: -1.0 },
  { slot: 'REEL_06', w: 0.21, ratio: 1.3, tone: 'mint', skew: 0.6 },
  { slot: 'REEL_07', w: 0.18, ratio: 0.94, tone: 'lavender', skew: -0.8 },
]

export const BOTTOM_ROW: ReelCard[] = [
  { slot: 'REEL_08', w: 0.3, ratio: 1.46, tone: 'sky', skew: 1.0 },
  { slot: 'REEL_09', w: 0.169, ratio: 0.83, tone: 'peach', skew: -0.8 },
  { slot: 'REEL_10', w: 0.166, ratio: 0.89, tone: 'dusk', skew: 0.6 },
  { slot: 'REEL_11', w: 0.143, ratio: 0.81, tone: 'neutral', skew: -1.2 },
  { slot: 'REEL_12', w: 0.2, ratio: 1.1, tone: 'lavender', skew: 0.9 },
  { slot: 'REEL_13', w: 0.18, ratio: 0.95, tone: 'blush', skew: -0.6 },
  { slot: 'REEL_14', w: 0.22, ratio: 1.2, tone: 'sun', skew: 1.1 },
]

/* ----------------------------------------------------------------------------
   Scroll marks, in viewports scrolled. The section starts at s = 3.1 and its
   canvas pins until s = 5.1, giving two full loops before the page releases.
   ------------------------------------------------------------------------- */
export const REEL = {
  /** where the section's canvas pins */
  pin: 3.1,
  /** the media starts drifting a little before the section is fully in view */
  loopFrom: 2.9,
  /** loops completed per viewport of scroll */
  loopsPerVh: 0.9,
  /** scroll runway for the section, in viewports (canvas itself is 1) */
  runway: 3,
}

/** Phones need bigger cards or the reel reads as confetti. */
export const MOBILE_SCALE = 2.2
