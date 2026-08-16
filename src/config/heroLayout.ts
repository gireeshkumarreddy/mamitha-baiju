import type { ButterflySlot } from './media'

/* ============================================================================
   HERO LAYOUT
   ----------------------------------------------------------------------------
   Every floating element is described here and nowhere else. Change a number,
   the composition moves — no component edits required.

   THE STRUCTURE — transcribed from the approved reference (1280 × 465 hero).

        │  L1  │  L2  │      PORTRAIT      │  R1  │  R2  │
       10.5–20% 26–40%      36.7–63.2%     61–77%  76–92%

   Cards sit closer to the portrait than to the page edges, which is what gives
   the composition its held-together feel, and they are small: the widest is
   9.4% of the viewport. The reference's own deliberate overlaps are kept — the
   quote card clipping the photograph beneath it, HER WORLD and the comment
   card just touching the portrait — but nothing else collides.

   `left`/`top` are percentages of the hero. `width`/`height` are reference
   pixels against a 1536-wide artboard, so both scale with viewport width.
   Vertical positions are stretched 1.25× from the reference, because a real
   viewport is far taller in proportion than the reference's wide hero crop.

   Sizes follow a deliberate hierarchy: large photographs anchor each side,
   medium frames support them, small cards carry text, micro cards punctuate.

   Coordinates are percentages of the hero box (left/top = the card's top-left).
   Sizes are given in *reference pixels* against a 1536×1024 artboard; they are
   converted to fluid `vw` at render time with a sane upper clamp, so the whole
   composition scales with the viewport instead of drifting apart.
   ========================================================================= */

export type CardKind =
  | 'typeSpecimen'
  | 'still'
  | 'moments'
  | 'quoteMoments'
  | 'onScreen'
  | 'identity'
  | 'herWorld'
  | 'currentlyPlaying'
  | 'comment'
  | 'behindScenes'
  | 'archive'
  | 'video'
  | 'quoteStories'

/** Purely descriptive — which zone a card belongs to. */
export type Column = 'L1' | 'L2' | 'R1' | 'R2'

/** Size band, so the hierarchy is legible at a glance. */
export type Weight = 'micro' | 'small' | 'medium' | 'large'

export interface Placement {
  /** % from the left edge of the hero */
  left: number
  /** % from the top edge of the hero */
  top: number
  /** width in reference px (artboard = 1536px wide) */
  width: number
  /** height in reference px; omit for content-driven height */
  height?: number
}

export interface CardConfig {
  id: string
  kind: CardKind
  column: Column
  weight: Weight
  desktop: Placement
  /** omit to derive from desktop; 'hidden' to drop it on tablets */
  tablet?: Placement | 'hidden'
  /** omit to hide on phones. On mobile, sizes read against a 390px artboard. */
  mobile?: Placement
  /** resting tilt, degrees — kept small so the columns still read as columns */
  rotate: number
  /** 0 = far background, 1 = closest to the viewer. Drives parallax + mouse. */
  depth: number
  /** which drift path to follow */
  float: 'a' | 'b' | 'c' | 'd'
  /** drift duration, seconds */
  duration: number
  /** drift offset, seconds — keeps the cards out of sync */
  delay: number
  /** entrance order, seconds after load */
  enterDelay: number
  /** stacking; the portrait sits at 20 */
  z: number
}

/**
 * Tablets keep all four zones. Cards grow a little (a card that is 12% of a
 * desktop viewport reads as too small on a narrow one) and the stacks start
 * higher, because a portrait viewport has height to spare below the fold of
 * the composition where the portrait stands.
 */
export const deriveTablet = (p: Placement): Placement => ({
  left: 50 + (p.left - 50) * 0.99,
  top: 25 + (p.top - 30) * 0.95,
  width: p.width * 1.1,
  height: p.height ? p.height * 1.1 : undefined,
})

export const HERO_CARDS: CardConfig[] = [
  /* ------------------------------------------------ LEFT · ZONE 1 (4–16%) -- */
  {
    id: 'type-specimen',
    kind: 'typeSpecimen',
    column: 'L1',
    weight: 'micro',
    desktop: { left: 14.3, top: 31.8, width: 80, height: 60 },
    mobile: { left: 5, top: 27.5, width: 74, height: 58 },
    rotate: -2.5,
    depth: 0.4,
    float: 'a',
    duration: 11,
    delay: 0.2,
    enterDelay: 1.0,
    z: 30,
  },
  {
    id: 'still',
    kind: 'still',
    column: 'L1',
    weight: 'small',
    desktop: { left: 80.6, top: 53.3, width: 118, height: 96 },
    rotate: 1.6,
    depth: 0.55,
    float: 'c',
    duration: 13,
    delay: 1.4,
    enterDelay: 1.09,
    z: 18,
  },
  {
    id: 'moments',
    kind: 'moments',
    column: 'L1',
    weight: 'large',
    desktop: { left: 12.1, top: 49.8, width: 126, height: 144 },
    mobile: { left: 2, top: 55, width: 126, height: 138 },
    rotate: -1.2,
    depth: 0.8,
    float: 'b',
    duration: 12,
    delay: 2.6,
    enterDelay: 1.18,
    z: 28,
  },
  {
    id: 'quote-moments',
    kind: 'quoteMoments',
    column: 'L1',
    weight: 'small',
    desktop: { left: 10.5, top: 77.6, width: 112, height: 101 },
    rotate: 2,
    depth: 0.95,
    float: 'd',
    duration: 10,
    delay: 0.8,
    enterDelay: 1.27,
    z: 34,
  },

  /* ----------------------------------------------- LEFT · ZONE 2 (19–32%) -- */
  {
    id: 'on-screen',
    kind: 'onScreen',
    column: 'L2',
    weight: 'medium',
    desktop: { left: 27.9, top: 38.3, width: 144, height: 88 },
    mobile: { left: 55, top: 27.5, width: 138, height: 142 },
    rotate: -1.5,
    depth: 0.68,
    float: 'b',
    duration: 12.5,
    delay: 0.6,
    enterDelay: 1.36,
    z: 32,
  },
  {
    id: 'identity',
    kind: 'identity',
    column: 'L2',
    weight: 'small',
    desktop: { left: 26.3, top: 63.3, width: 120, height: 78 },
    mobile: { left: 4, top: 37, width: 118, height: 132 },
    rotate: 1.4,
    depth: 0.36,
    float: 'a',
    duration: 14,
    delay: 1.9,
    enterDelay: 1.45,
    z: 16,
  },
  {
    id: 'her-world',
    kind: 'herWorld',
    column: 'L2',
    weight: 'medium',
    desktop: { left: 32.3, top: 76.7, width: 116, height: 108 },
    rotate: -1,
    depth: 0.5,
    float: 'c',
    duration: 13.5,
    delay: 3.2,
    enterDelay: 1.54,
    z: 19,
  },

  /* ---------------------------------------------- RIGHT · ZONE 1 (66–80%) -- */
  {
    id: 'currently-playing',
    kind: 'currentlyPlaying',
    column: 'R1',
    weight: 'medium',
    desktop: { left: 65.6, top: 38.3, width: 124, height: 112 },
    mobile: { left: 60, top: 63, width: 128, height: 140 },
    rotate: 1.3,
    depth: 0.6,
    float: 'd',
    duration: 12.8,
    delay: 0.4,
    enterDelay: 1.63,
    z: 33,
  },
  {
    id: 'comment',
    kind: 'comment',
    column: 'R1',
    weight: 'small',
    desktop: { left: 61.3, top: 68.7, width: 112, height: 138 },
    rotate: -1.6,
    depth: 0.92,
    float: 'a',
    duration: 10.5,
    delay: 2.2,
    enterDelay: 1.72,
    z: 35,
  },
  {
    id: 'behind-the-scenes',
    kind: 'behindScenes',
    column: 'R1',
    weight: 'medium',
    desktop: { left: 69.5, top: 79.4, width: 114, height: 96 },
    rotate: 1,
    depth: 0.74,
    float: 'b',
    duration: 13.8,
    delay: 0.1,
    enterDelay: 1.81,
    z: 29,
  },

  /* ---------------------------------------------- RIGHT · ZONE 2 (82–96%) -- */
  {
    id: 'archive',
    kind: 'archive',
    column: 'R2',
    weight: 'small',
    desktop: { left: 75.8, top: 31.8, width: 126, height: 110 },
    rotate: -2,
    depth: 0.42,
    float: 'c',
    duration: 14.5,
    delay: 2.9,
    enterDelay: 1.9,
    z: 17,
  },
  {
    id: 'video',
    kind: 'video',
    column: 'R2',
    weight: 'medium',
    desktop: { left: 85.8, top: 85.6, width: 89, height: 72 },
    mobile: { left: 58, top: 46.5, width: 116, height: 116 },
    rotate: 2.2,
    depth: 0.56,
    float: 'd',
    duration: 11.5,
    delay: 1.5,
    enterDelay: 1.99,
    z: 26,
  },
  {
    id: 'quote-stories',
    kind: 'quoteStories',
    column: 'R2',
    weight: 'small',
    desktop: { left: 78, top: 79.4, width: 104, height: 96 },
    rotate: -1.8,
    depth: 0.66,
    float: 'a',
    duration: 11,
    delay: 3.6,
    enterDelay: 2.08,
    z: 31,
  },
]

/* ----------------------------------------------------------------- WINGS -- */

export interface ButterflyConfig {
  id: string
  /** which artwork slot to use — falls back to a drawn butterfly in that hue */
  slot: ButterflySlot
  /** % of hero */
  left: number
  top: number
  /** rendered width in px on the reference artboard */
  size: number
  /** 0 = far, 1 = near */
  depth: number
  /** wing-beat period, seconds */
  flap: number
  /** flight-path duration, seconds */
  duration: number
  delay: number
  enterDelay: number
  /** flight path — offsets in px, rotation in degrees, plus a little breathing */
  path: { x: number[]; y: number[]; rotate: number[]; scale: number[] }
  z: number
  /** phones keep only a few — set this on the ones worth keeping */
  mobile?: { left: number; top: number }
}

export const BUTTERFLIES: ButterflyConfig[] = [
  {
    /* drifts across the top-left, over the big type */
    id: 'peach-tl',
    slot: 'BUTTERFLY_PEACH',
    left: 2.2,
    top: 25,
    size: 66,
    depth: 0.5,
    flap: 0.82,
    duration: 34,
    delay: 0,
    enterDelay: 2.2,
    path: {
      x: [0, 58, 96, 132, 96, 40, 0],
      y: [0, -34, -8, -52, -86, -44, 0],
      rotate: [-9, 5, -3, 9, -6, 4, -9],
      scale: [1, 1.05, 0.96, 1.04, 0.98, 1.03, 1],
    },
    z: 36,
    mobile: { left: 3, top: 27 },
  },
  {
    /* hovers near the right shoulder of BAIJU, edging toward the viewport rim */
    id: 'blue-tr',
    slot: 'BUTTERFLY_BLUE',
    left: 94.5,
    top: 21,
    size: 74,
    depth: 0.88,
    flap: 0.68,
    duration: 28,
    delay: 1.5,
    enterDelay: 2.3,
    path: {
      x: [0, -46, -12, 26, -8, -54, 0],
      y: [0, 38, 74, 46, 96, 40, 0],
      rotate: [11, -7, 6, -11, 8, -5, 11],
      scale: [1, 0.97, 1.05, 1, 1.04, 0.98, 1],
    },
    z: 37,
    mobile: { left: 84, top: 22 },
  },
  {
    /* stays low on the left, tucked between the columns */
    id: 'lavender-l',
    slot: 'BUTTERFLY_LAVENDER',
    left: 16.4,
    top: 92,
    size: 56,
    depth: 0.34,
    flap: 0.94,
    duration: 38,
    delay: 3,
    enterDelay: 2.4,
    path: {
      x: [0, 34, 74, 44, 96, 38, 0],
      y: [0, -30, -14, -54, -22, -40, 0],
      rotate: [7, -6, 4, -8, 5, -4, 7],
      scale: [1, 1.04, 0.97, 1.03, 0.99, 1.02, 1],
    },
    z: 19,
  },
  {
    /* circles the gap between the portrait and the right column */
    id: 'yellow-c',
    slot: 'BUTTERFLY_YELLOW',
    left: 63.4,
    top: 45,
    size: 52,
    depth: 0.62,
    flap: 0.86,
    duration: 30,
    delay: 2.2,
    enterDelay: 2.5,
    path: {
      x: [0, -26, 18, -38, 8, -20, 0],
      y: [0, -44, -18, -66, -30, -54, 0],
      rotate: [-7, 9, -11, 5, -8, 6, -7],
      scale: [1, 1.03, 0.98, 1.05, 0.97, 1.02, 1],
    },
    z: 27,
  },
  {
    /* the closest one — drifts across the lower middle, in front of the cards */
    id: 'pink-b',
    slot: 'BUTTERFLY_PINK',
    left: 33.5,
    top: 84,
    size: 58,
    depth: 0.85,
    flap: 0.74,
    duration: 26,
    delay: 4,
    enterDelay: 2.6,
    path: {
      x: [0, 52, 24, 78, 36, 18, 0],
      y: [0, -32, -68, -30, -78, -34, 0],
      rotate: [9, -5, 11, -9, 6, -7, 9],
      scale: [1, 0.98, 1.05, 1, 1.03, 0.97, 1],
    },
    z: 38,
    mobile: { left: 22, top: 52 },
  },
  {
    /* rests near the bottom-right corner, barely moving */
    id: 'mint-br',
    slot: 'BUTTERFLY_MINT',
    left: 96.5,
    top: 66,
    size: 60,
    depth: 0.7,
    flap: 0.9,
    duration: 32,
    delay: 1,
    enterDelay: 2.7,
    path: {
      x: [0, -30, -6, -48, -18, -36, 0],
      y: [0, -26, -58, -34, -72, -30, 0],
      rotate: [-10, 6, -4, 9, -6, 5, -10],
      scale: [1, 1.02, 0.98, 1.04, 0.99, 1.03, 1],
    },
    z: 34,
  },
]
