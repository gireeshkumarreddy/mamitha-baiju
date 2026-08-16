import type { MediaSlot } from './media'

/* ============================================================================
   SECTION 07 — THE CLOSING SCENE

   The final call-to-action: the rounded light canvas floating on black, a
   fan of SEVEN photographs rising across its lower half like a hand of
   cards — near-upright at the centre, rotating outward to ±26°, the outermost
   bleeding off the corners — with the closing message and contact options in
   the clear air above. The butterflies orbit the whole composition, arriving
   at the end of their journey.

   No video plays here. The panels are photographs.
   ========================================================================= */

export const FINALE = {
  /** canvas width as a fraction of the viewport, centred */
  canvasW: 0.92,
  /** the canvas frame's aspect */
  aspect: 1.566,
  /** section height, viewports — canvas plus breathing room */
  runwayVh: 1.45,
  stage: '#000000',
  bg: '#e9ebea',
  ink: '#111113',
  soft: '#6f7276',
}

export interface FooterCard {
  slot: MediaSlot
  /** centre, fraction of the canvas */
  cx: number
  cy: number
  /** width, fraction of canvas width */
  w: number
  /** width ÷ height */
  ratio: number
  rot: number
  /** stacking vs the butterfly stream at z-45 */
  z: 40 | 50
}

/** The fan, left to right — slot N carries "footer N". Seven photographs,
 *  sized up so the hand of cards still fills the canvas width with a gentle
 *  overlap at the centre. */
export const FOOTER_CARDS: FooterCard[] = Array.from({ length: 7 }, (_, i) => {
  const t = i / 6
  const arch = Math.sin(t * Math.PI)
  return {
    slot: `FOOTER_${String(i + 1).padStart(2, '0')}` as MediaSlot,
    cx: 0.075 + (0.925 - 0.075) * t,
    cy: 0.845 - arch * 0.1,
    w: 0.138 + arch * 0.026,
    ratio: 0.68,
    rot: -26 + 52 * t,
    z: (i % 2 === 0 ? 40 : 50) as 40 | 50,
  }
})

/** The closing message and contact options, fractions of the canvas. */
export const FINALE_CTA = {
  headline: ['Let’s create', 'something memorable.'],
  headlineY: [0.13, 0.265],
  headlineSize: 0.052,
  support: 'For films, collaborations, campaigns and creative projects.',
  supportY: 0.415,
  cta: { label: 'Get in touch', href: 'mailto:hello@mamithabaiju.com', y: 0.495 },
  links: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Email', href: 'mailto:hello@mamithabaiju.com' },
    { label: 'IMDb', href: 'https://www.imdb.com/' },
  ],
  linksY: 0.625,
}
