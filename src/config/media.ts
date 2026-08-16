/* ============================================================================
   MEDIA SLOTS

   Every slot carries a `src` and an `position` (CSS object-position). The
   position is not decoration — all of the supplied photographs are tall
   portraits dropped into near-square cards, so the crop window is chosen per
   image to keep Mamitha's face high, whole, and clear of every overlay.

   To swap an asset: drop the file in /public/images/ and change `src`. Then
   re-check `position` — the right value depends on where the face sits in
   the new frame.
   ========================================================================= */

export type MediaSlot =
  | 'MAIN_MAMITHA_IMAGE'
  | 'ON_SCREEN_IMAGE'
  | 'HER_WORLD_IMAGE'
  | 'MOMENTS_IMAGE'
  | 'BEHIND_THE_SCENES_IMAGE'
  | 'CURRENTLY_PLAYING_IMAGE'
  | 'VIDEO_THUMBNAIL'
  | 'QUOTE_IMAGE'
  | 'ADDITIONAL_IMAGE_01'
  | 'ADDITIONAL_IMAGE_02'
  | 'COMMENT_AVATAR'
  | 'MOMENT_01'
  | 'MOMENT_02'
  | 'MOMENT_03'
  | 'MOMENT_04'
  | 'MOMENT_05'
  | 'MOMENT_06'
  | 'MOMENT_07'
  | 'MOMENT_08'
  | 'REEL_01'
  | 'REEL_02'
  | 'REEL_03'
  | 'REEL_04'
  | 'REEL_05'
  | 'REEL_06'
  | 'REEL_07'
  | 'REEL_08'
  | 'REEL_09'
  | 'REEL_10'
  | 'REEL_11'
  | 'REEL_12'
  | 'REEL_13'
  | 'REEL_14'
  | 'GALLERY_01'
  | 'GALLERY_02'
  | 'GALLERY_03'
  | 'GALLERY_04'
  | 'GALLERY_05'
  | 'GALLERY_06'
  | 'GALLERY_07'
  | 'GALLERY_08'
  | 'GALLERY_09'
  | 'GALLERY_10'
  | 'FOOTER_01'
  | 'FOOTER_02'
  | 'FOOTER_03'
  | 'FOOTER_04'
  | 'FOOTER_05'
  | 'FOOTER_06'
  | 'FOOTER_07'

export interface Asset {
  src: string | null
  /** CSS object-position. Tuned per photograph so the face survives the crop. */
  position?: string
}

export const MEDIA: Record<MediaSlot, Asset> = {
  /* ------------------------------------------------------------- CENTRE -- */
  /** The supplied "main mamitha image", background removed (isnet
   *  segmentation → 1px mask erosion → feathered base, torn strip cropped).
   *  A true transparent cut-out: she stands directly in the composition. */
  MAIN_MAMITHA_IMAGE: { src: '/images/mamitha-cutout.png', position: 'bottom' },

  /* --------------------------------------------------------------- LEFT -- */
  /** image 09 · saree, raised hand. Near-square already, so barely cropped;
   *  the face lands at 28% down, well above the play button at the centre. */
  ON_SCREEN_IMAGE: { src: '/images/mamitha-09.jpg', position: '49% 13%' },

  /** image 02 · blue backdrop, smiling. Tall frame, so the window is pulled
   *  down to hold the head top and put the face at 45%. */
  HER_WORLD_IMAGE: { src: '/images/mamitha-02.jpg', position: '45% 46%' },

  /** image 06 · thumbs up, teal wall. The large left anchor: crop runs from
   *  just above her head to her hands, face at a third down. */
  MOMENTS_IMAGE: { src: '/images/mamitha-06.jpg', position: '54% 38%' },

  /** image 03 · bows. Her face sits low in the original, so this window is
   *  pinned to the bottom of the frame. */
  ADDITIONAL_IMAGE_02: { src: '/images/mamitha-03.jpg', position: '52% 100%' },

  /** image 01 · red dress, arches. Small square on the quote card. */
  QUOTE_IMAGE: { src: '/images/mamitha-01.jpg', position: '42% 68%' },

  /* -------------------------------------------------------------- RIGHT -- */
  /** image 08 · yellow sofa. The strongest smile of the set — face at 35%. */
  BEHIND_THE_SCENES_IMAGE: { src: '/images/mamitha-08.jpg', position: '48% 58%' },

  /** image 04 · neon portrait. Chips sit in the corners, face stays centre. */
  VIDEO_THUMBNAIL: { src: '/images/mamitha-04.jpg', position: '42% 50%' },

  /** image 07 · sunglasses, street. */
  ADDITIONAL_IMAGE_01: { src: '/images/mamitha-07.jpg', position: '53% 50%' },

  /** Sleeve art on the now-playing card — image 04 again, cropped tight to the
   *  face. The only reuse in the set: 8 photographs, 9 photo slots. */
  CURRENTLY_PLAYING_IMAGE: { src: '/images/mamitha-04.jpg', position: '42% 58%' },

  /* ---------------------------------------------------------------------- */
  /** Deliberately left as a tint: this is the avatar of a *viewer* leaving a
   *  comment, so putting Mamitha's face here would misread. Point it at a
   *  supplied fan/press photo if you'd rather it were filled. */
  COMMENT_AVATAR: { src: null },

  /* ---------------------------------------------------------- SECTION 02 -- */
  /* The supplied "section 2 image N" files, in the order given: N → MOMENT_0N.
     Every frame in the ring is narrower than its photograph, so each crop
     takes height — the y value below is chosen per image to hold her whole
     head inside the frame and land her face in its upper-middle. */

  /** image 01 · sunglasses, white saree. Face 33% down. */
  MOMENT_01: { src: '/images/section2-01.jpg', position: '50% 10%' },

  /** image 02 · orange backdrop. Face high in frame, so the window sits at the
   *  very top of the photograph. */
  MOMENT_02: { src: '/images/section2-02.jpg', position: '50% 0%' },

  /** image 03 · blue dress, yellow wall. Face 41% down. */
  MOMENT_03: { src: '/images/section2-03.jpg', position: '50% 45%' },

  /** image 04 · pink, sky. Face low in frame — window pinned to the bottom. */
  MOMENT_04: { src: '/images/section2-04.jpg', position: '50% 100%' },

  /** image 05 · floral dress. */
  MOMENT_05: { src: '/images/section2-05.jpg', position: '50% 5%' },

  /** image 06 · blue saree. Pulled up off the ideal so her hairline clears. */
  MOMENT_06: { src: '/images/section2-06.jpg', position: '50% 15%' },

  /** image 07 · red saree close-up. Pulled well up: the centred crop would put
   *  her hairline within a whisker of the frame edge. */
  MOMENT_07: { src: '/images/section2-07.jpg', position: '50% 25%' },

  /** image 08 · blue silk. The only frame wider than its photograph, so this
   *  one crops width instead: 1.3% off the sides, her face well clear. */
  MOMENT_08: { src: '/images/section2-08.jpg', position: '42% 50%' },

  /* --------------------------------------------------- SECTION 03 · the reel -- */
  /* Supplied files "section 3 image 1–14", mapped by number. Every source is a
   * tall portrait going into a wider card, so each card shows a vertical
   * window of its image — the `position` places that window so the face (both
   * faces, on the duet frames) sits whole inside it. 04 is the one landscape
   * frame and crops width instead. Positions assume the card ratios in
   * reelLayout.ts; re-check them if a card's ratio changes. */
  REEL_01: { src: '/images/section3-01.jpg', position: '50% 48%' },
  REEL_02: { src: '/images/section3-02.jpg', position: '50% 21%' },
  REEL_03: { src: '/images/section3-03.jpg', position: '50% 11%' },
  REEL_04: { src: '/images/section3-04.avif', position: '53% 50%' },
  REEL_05: { src: '/images/section3-05.png', position: '50% 12%' },
  REEL_06: { src: '/images/section3-06.jpg', position: '50% 42%' },
  REEL_07: { src: '/images/section3-07.jpg', position: '50% 25%' },
  REEL_08: { src: '/images/section3-08.png', position: '50% 31%' },
  REEL_09: { src: '/images/section3-09.jpg', position: '50% 37%' },
  REEL_10: { src: '/images/section3-10.jpg', position: '50% 41%' },
  REEL_11: { src: '/images/section3-11.png', position: '50% 7%' },
  REEL_12: { src: '/images/section3-12.jpg', position: '50% 25%' },
  REEL_13: { src: '/images/section3-13.jpg', position: '50% 10%' },
  REEL_14: { src: '/images/section3-14.jpg', position: '50% 24%' },

  /* --------------------------------------------- SECTION 06 · the gallery -- */
  /* Supplied "section 6 image 1–10", mapped by number. All sources are taller
   * than their wide frames, so each `position` places the vertical window on
   * the faces — measured per image. 06 was never supplied and stays a
   * placeholder. 01 rides the 3.44:1 banner strip: a full face cannot fit a
   * window that shallow, so it is centred on her eyes-to-lips band, reading
   * as a deliberate cinematic strip. */
  GALLERY_01: { src: '/images/section6-01.jpg', position: '50% 51%' },
  GALLERY_02: { src: '/images/section6-02.jpg', position: '50% 30%' },
  GALLERY_03: { src: '/images/section6-03.jpg', position: '50% 42%' },
  GALLERY_04: { src: '/images/section6-04.jpg', position: '50% 9%' },
  GALLERY_05: { src: '/images/section6-05.jpg', position: '50% 35%' },
  /** the slot whose own image was never supplied — filled, as directed, with
   *  "section 3 image 1"; both faces sit whole in this window */
  GALLERY_06: { src: '/images/section3-01.jpg', position: '50% 52%' },
  GALLERY_07: { src: '/images/section6-07.jpg', position: '50% 85%' },
  GALLERY_08: { src: '/images/section6-08.jpg', position: '50% 36%' },
  GALLERY_09: { src: '/images/section6-09.jpg', position: '50% 45%' },
  GALLERY_10: { src: '/images/section6-10.jpg', position: '50% 51%' },

  /* ------------------------------------------- SECTION 07 · the closing fan -- */
  /* Supplied "footer 1–7", mapped by number into the fan left to right.
   * Positions place each crop window on her face. */
  FOOTER_01: { src: '/images/footer-01.jpg', position: '50% 28%' },
  FOOTER_02: { src: '/images/footer-02.jpg', position: '50% 10%' },
  FOOTER_03: { src: '/images/footer-03.jpg', position: '50% 0%' },
  FOOTER_04: { src: '/images/footer-04.jpg', position: '45% 50%' },
  FOOTER_05: { src: '/images/footer-05.jpg', position: '50% 50%' },
  FOOTER_06: { src: '/images/footer-06.jpg', position: '50% 57%' },
  FOOTER_07: { src: '/images/footer-07.jpg', position: '50% 5%' },
}

/**
 * Is MAIN_MAMITHA_IMAGE a background-removed cut-out?
 *
 * `true` — the file renders bare: no mask, no frame, the person standing
 * directly in front of the type, exactly as the approved design intends.
 * (`false` would wrap a normal photograph in the soft-edged portrait column.)
 */
export const MAIN_IMAGE_IS_CUTOUT = true

/* ----------------------------------------------------------------------------
   Butterflies
   Transparent PNG / WebP cut-outs, ideally ~400px on the long edge. Drop them
   in /public/images/butterflies/ and point the slots here. Until then each one
   falls back to a hand-drawn butterfly illustration in the matching colour.
   ------------------------------------------------------------------------- */

export type ButterflySlot =
  | 'BUTTERFLY_BLUE'
  | 'BUTTERFLY_LAVENDER'
  | 'BUTTERFLY_PEACH'
  | 'BUTTERFLY_PINK'
  | 'BUTTERFLY_YELLOW'
  | 'BUTTERFLY_MINT'

export const BUTTERFLY_MEDIA: Record<ButterflySlot, string | null> = {
  BUTTERFLY_BLUE: null, // '/images/butterflies/butterfly-blue.png'
  BUTTERFLY_LAVENDER: null, // '/images/butterflies/butterfly-lavender.png'
  BUTTERFLY_PEACH: null, // '/images/butterflies/butterfly-peach.png'
  BUTTERFLY_PINK: null, // '/images/butterflies/butterfly-pink.png'
  BUTTERFLY_YELLOW: null, // '/images/butterflies/butterfly-yellow.png'
  BUTTERFLY_MINT: null, // '/images/butterflies/butterfly-mint.png'
}
