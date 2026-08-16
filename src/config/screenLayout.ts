/* ============================================================================
   SECTIONS 04 + 05 — THE CURVED CRT SCREENS

   Two curved televisions floating on black, mirrored: section 04 plays the
   video on the left of the glass with a pink editorial panel on the right;
   section 05 answers it with the panel on the left and the video on the
   right. Each screen has its own file — 04 the dance segment, 05 the
   separately supplied section-5 video.

   THE GEOMETRY (shared)
   The surface is a real cylinder: the flat layout is rendered into vertical
   strips, each rotated onto the arc and pushed to its own depth, so content
   lies on the curve. The bend is CONCAVE — the middle of the glass sits back,
   both sides come forward.

   Coordinates are percentages of the FLAT SURFACE, not the viewport. Type is
   sized in `cqw` of that surface, capped by an equivalent `vh` value (equal at
   the design aspect) so letterboxed viewports cannot let width-sized type
   outgrow the height-placed layout.
   ========================================================================= */

/** Fraction of the surface the video occupies (the panel gets the rest). */
export const SEAM = 53.1

export const PALETTE = {
  stage: '#000000',
  paper: '#f4f4f2',
  ink: '#0d0d0d',
}

export const CURVE = {
  /** Strips the surface is built from. 12 halves the 3D layer count across
   *  the two screens versus 18 while the bow stays visually smooth — each
   *  facet is 4.7° and the seam overlap hides the joints. Video decode gets
   *  the GPU headroom. */
  segments: 12,
  /** how far the cylinder wraps, in degrees */
  arc: 56,
  /** viewing distance; shorter exaggerates the curve */
  perspective: 1300,
  /** the flat surface, as multiples of the viewport */
  width: 0.95,
  height: 0.54,
  /** the arc it starts flatter at, so the curve deepens as you scroll in */
  arriveArc: 20,
}

export const VIDEO = {
  /**
   * Vertical focus for the cover-crop, as object-position-y. The source is a
   * 720×1280 portrait; the zones are ~1.4:1 landscape, so only ~40% of the
   * frame's height shows. Her head was tracked across the dance at y 0.25–0.44
   * (hair-top scan at 1s/8s/16s/24s); 0.38 keeps the face whole at every
   * sampled moment, cropping legs rather than head.
   */
  focusY: 0.38,
}

export interface ScreenCopy {
  label: string
  title: string
  lines: string[]
  body: string
}

export interface ScreenSectionConfig {
  id: string
  /** where the section's canvas pins, in viewports scrolled */
  pin: number
  /** scroll runway, in viewports; the canvas itself is 1 */
  runway: number
  /** which side of the glass the video fills; the panel mirrors it */
  videoSide: 'left' | 'right'
  panel: { bg: string; soft: string }
  copy: ScreenCopy
  /**
   * This screen's own video file. Each loops with the native `loop`
   * attribute: no currentTime writes, no JS loop timers, no scroll-coupled
   * playback, no element recreation — the browser plays 0 → end → 0 on its
   * own. (Section 04's segment is rebuilt any time with `npm run video:split`.)
   */
  src: string
  /** face bias for this screen's cover-crop; falls back to VIDEO.focusY */
  focusY?: number
}

export const SCREEN_SECTIONS: ScreenSectionConfig[] = [
  {
    id: 'in-motion',
    pin: 6.1,
    runway: 2.5,
    videoSide: 'left',
    panel: { bg: '#f5a5cc', soft: '#7c3f5e' },
    copy: {
      label: 'Dance / Performance',
      title: 'In Motion',
      lines: ['A different rhythm.', 'A different side of me.'],
      body: 'From expressive movement to effortless performances, I bring my own energy and personality to every moment.',
    },
    /** 00:00 → 00:18 of the uploaded video, an actual separate file. The
     *  query busts any stale cache of the identically-named full-length file
     *  this path once served. */
    src: '/videos/section4.mp4?v=18s',
  },
  {
    id: 'beyond-the-frame',
    pin: 8.6,
    runway: 2.5,
    videoSide: 'right',
    panel: { bg: '#edc860', soft: '#6d5216' },
    copy: {
      label: 'Movement / Moments',
      title: 'Beyond the Frame',
      lines: ['Every moment has its own rhythm.'],
      body: 'A collection of movement, expression and moments that live beyond the screen.',
    },
    /** The separately supplied section-5 video ("new video section 5"),
     *  web-encoded, looping natively in full. Face tracked at y ≈ 0.40. */
    src: '/videos/section5-motion.mp4',
    focusY: 0.34,
  },
]

/** Copy anchor on the panel, % of the surface, per panel side. */
export const COPY_X = { right: 58.2, left: 5.0 }
export const COPY_Y = { label: 20, title: 27, lines: 49, lineStep: 5.6, body: 65, bodyWidth: 33 }

/**
 * Glass shading. On a concave screen the middle of the glass recedes, so the
 * falloff darkens the centre band and leaves the near edges clean; the sheen
 * crosses the glass diagonally.
 */
export const GLASS_FALLOFF =
  'linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 20%,' +
  ' rgba(0,0,0,0.085) 44%, rgba(0,0,0,0.085) 56%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.04) 100%)'

export const GLASS_SHEEN =
  'linear-gradient(172deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 26%,' +
  ' rgba(255,255,255,0) 52%, rgba(255,255,255,0.02) 100%)'
