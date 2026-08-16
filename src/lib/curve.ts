import { GALLERY, GALLERY_LOOP } from '../config/galleryLayout'
import { FINALE } from '../config/finaleLayout'

/* ----------------------------------------------------------------------------
   Small maths shared by the scroll choreography.
   ------------------------------------------------------------------------- */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Eased 0→1 ramp between two scroll marks. */
export const ramp = (from: number, to: number, v: number) => {
  const t = clamp01((v - from) / (to - from))
  return t * t * (3 - 2 * t)
}

export const mix = (a: number, b: number, t: number) => a + (b - a) * t

export interface Point {
  x: number
  y: number
}

export const mixPoint = (a: Point, b: Point, t: number): Point => ({
  x: mix(a.x, b.x, t),
  y: mix(a.y, b.y, t),
})

/** Deterministic pseudo-random in [0,1) — same layout on every load. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/* ============================================================================
   THE BUTTERFLY STREAM

   One parametric path per butterfly, blended through five shapes as the page
   scrolls. Blending a sine ribbon toward a circle passes through exactly the
   curving arcs the transition wants, so "curve" needs no shape of its own.

   `t` is the butterfly's place along the ribbon (0→1). `s` is the journey in
   *viewports scrolled*, which is what keeps the stream continuous: the same
   thirty butterflies fly the whole page, and each section simply owns a slice
   of s. Nothing is ever unmounted, reset or re-seeded between sections.

     s < 0      THE INTRO: the page opens one intro-section early, and the
                journey is anchored at the hero — so the intro occupies
                negative s and not one downstream mark moves. The stream
                holds a large S-curve swarm filling the first screen, then
                travels left and gathers into the hero's entering ribbon as
                s rises to 0. Scroll is the transition.
     s ≈ 0      flowing into the hero from the left edge
     0.10–0.42  gathering into a straight ribbon
     0.38–0.70  the ribbon breathes into a travelling wave
     0.68–1.05  the wave closes into an orbit  (section 02 pins at s = 1.0)
     1.05–2.05  the orbit holds, turning clockwise around the ring
     2.05–2.95  the orbit unwinds and crosses into section 03
     2.95–5.30  a wave crossing the middle of the reel, drifting with scroll
     5.30–6.30  the ribbon parts into two trails, above and below the curved
                screens of sections 04 and 05
     10.6–11.4  the trails gather into the gallery circuit — a closed loop
                threaded through section 06's ten cards in reference order,
                advanced by scroll, breathing on its own when scroll rests
     finale     as section 07 arrives (its start depends on the gallery's
                vw-based height, so the marks are computed per-call), the
                circuit hands over to a slow orbit around the card fan

   Every stage is a blend, never a cut: the same twenty butterflies take each
   new destination while their paths stay continuous in s, so nothing resets
   at any section boundary.
   ========================================================================= */

export const STREAM_STAGES = {
  gather: [0.1, 0.42] as const,
  wave: [0.38, 0.7] as const,
  orbit: [0.68, 1.05] as const,
  crossing: [2.05, 2.95] as const,
  screen: [5.3, 6.3] as const,
  gallery: [10.6, 11.4] as const,
}

/** The intro section's height, in viewports. The journey is hero-anchored, so
 *  the intro spans s ∈ [−INTRO_VH, 0) and nothing downstream re-times. */
export const INTRO_VH = 1.3

/** Where section 07 starts, in viewports — after the vw-tall gallery canvas. */
export const finaleTop = (vw: number, vh: number) => GALLERY.top + (GALLERY.aspect * vw) / vh

/* ----------------------------------------------------------------------------
   The gallery circuit. GALLERY_LOOP's anchors (canvas fractions) are threaded
   with a closed Catmull-Rom spline, so the ribbon curves past each card
   rather than cornering at it. `u` is position around the loop, 0→1.
   ------------------------------------------------------------------------- */

const frac = (v: number) => v - Math.floor(v)

function loopPoint(u: number): Point {
  const P = GALLERY_LOOP
  const n = P.length
  const f = frac(u) * n
  const i = Math.floor(f)
  const t = f - i
  const p0 = P[(i - 1 + n) % n]
  const p1 = P[i % n]
  const p2 = P[(i + 1) % n]
  const p3 = P[(i + 2) % n]
  const t2 = t * t
  const t3 = t2 * t
  /* Catmull-Rom cubic. The t³ coefficient is −a+3b−3c+d — mis-weighting `c`
     here breaks C0 continuity at every knot and the ribbon teleports as it
     crosses each anchor, so keep this exactly the textbook form. */
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
  return { x: cr(p0[0], p1[0], p2[0], p3[0]), y: cr(p0[1], p1[1], p2[1], p3[1]) }
}

/**
 * Size along the journey.
 *
 * THE INTRO (s < 0): the swarm is the whole show, so the butterflies are far
 * larger — and spread by `prominence` into a clear hierarchy: a few near
 * camera-passing size, most medium, the rest small. The boost eases out as
 * the group travels into the hero, landing at ribbon size exactly at s ≈ 0.
 *
 * SECTION 04 (s ≈ 5.4+): mostly small with a handful of prominent leaders —
 * a flat multiplier made the ribbon read heavy, so prominence spreads it.
 */
export const streamScale = (s: number, prominence: number) => {
  const intro = 1 - ramp(-1.05, -0.08, s)
  return (
    (1 + intro * (0.35 + prominence * 2.3)) *
    (1 + ramp(5.4, 6.25, s) * (prominence * 1.5 - 0.35))
  )
}

export interface StreamSeed {
  /** keeps each butterfly off its neighbour's phase */
  phase: number
  /** cross-path wander, in viewport fractions */
  drift: number
}

export function streamPoint(
  t: number,
  s: number,
  vw: number,
  vh: number,
  seed: StreamSeed,
  /** slow time drift, so the orbit keeps turning when scrolling stops */
  drift = 0,
): Point {
  // 0 · the intro swarm: a large S-curve formation filling the first screen,
  //     alive on the shared drift clock. Scroll does NOT drag the group in
  //     one direction — each butterfly wanders its own scroll-driven arc
  //     around its formation spot, half turning clockwise, half counter, the
  //     roaming widening as the visitor scrolls. The stream fades out during
  //     this wander (see ButterflyStream) while the hero rises from behind.
  const wander = clamp01((s + 1.3) / 1.3)
  const wDir = seed.drift > 0 ? 1 : -1
  const wAng = seed.phase * 3 + s * wDir * (1.7 + Math.abs(seed.drift) * 1.7)
  const wRad = (0.045 + Math.abs(seed.drift) * 0.02 + wander * 0.1) * vh
  const swarm: Point = {
    x:
      (mix(0.1, 0.9, t) +
        Math.sin(drift * 1.3 + seed.phase) * 0.012 +
        seed.drift * 0.018) *
        vw +
      Math.cos(wAng) * wRad,
    y:
      (0.5 +
        Math.sin(t * Math.PI * 1.6 + 0.4) * 0.21 +
        Math.sin(drift * 1.7 + seed.phase * 2) * 0.014 +
        seed.drift * 0.05) *
        vh +
      Math.sin(wAng) * wRad * 0.8,
  }

  // 1 · flowing into the hero from the left edge, most of the ribbon still
  //     off-screen — the state the approved hero reference shows.
  const entering: Point = {
    x: mix(-0.58, 0.17, t) * vw,
    y: (0.26 + Math.sin(t * Math.PI * 2.4 + seed.phase) * 0.05 + seed.drift * 0.02) * vh,
  }

  // 2 · a thin line strung across the lower third
  const line: Point = {
    x: mix(-0.06, 1.06, t) * vw,
    y: (0.6 + Math.sin(t * Math.PI) * 0.015 + seed.drift * 0.35) * vh,
  }

  // 3 · the line breathes into a wave and rides up into the next section
  const wave: Point = {
    x: mix(-0.08, 1.08, t) * vw,
    y: (0.52 + Math.sin(t * Math.PI * 3 + seed.phase) * 0.14 + seed.drift * 0.3) * vh,
  }

  // 4 · the wave closes into an orbit, wider than tall so it rings a landscape
  //     composition. Screen-space y runs downward, so an increasing angle on
  //     (cos, sin) reads clockwise.
  const rx = vw * 0.4
  const ry = vh * 0.4
  const angle = t * Math.PI * 2 + s * Math.PI * 2 * 0.35 + drift + seed.phase * 0.12
  const wobble = 1 + seed.drift * 0.1
  const orbit: Point = {
    x: vw * 0.5 + Math.cos(angle) * rx * wobble,
    y: vh * 0.5 + Math.sin(angle) * ry * wobble,
  }

  // 5 · the orbit unwinds into a wave crossing the middle of the reel, between
  //     its two arcs of media. It keeps drifting so it never sits still.
  const travel = Math.max(0, s - 2.95) * 0.12
  const crossing: Point = {
    x: (mix(-0.12, 1.16, t) + travel) * vw,
    y: (0.45 + Math.sin(t * Math.PI * 2.2 + seed.phase) * 0.085 + seed.drift * 0.03) * vh,
  }

  // 6 · the ribbon parts around section 04's curved screen: the front half
  //     arcs over the top, the back half sweeps beneath. Both curves are
  //     traced off the reference.
  const overTop = t < 0.5
  const u = overTop ? t / 0.5 : (t - 0.5) / 0.5
  /* Both trails keep flowing after the screen has settled, so the section
     hands the stream on to whatever follows instead of parking it. */
  const onward = Math.max(0, s - 6.3) * 0.1
  const screen: Point = overTop
    ? {
        x: (mix(0.01, 0.6, u) + onward) * vw,
        y:
          (0.04 +
            0.17 * Math.pow(u, 0.5) +
            Math.sin(u * Math.PI * 2.5 + seed.phase) * 0.018 +
            seed.drift * 0.012) *
          vh,
      }
    : {
        x: (mix(0.02, 0.99, u) + onward) * vw,
        y:
          (0.8 +
            0.13 * u +
            Math.sin(u * Math.PI * 2.2 + seed.phase) * 0.02 +
            seed.drift * 0.012) *
          vh,
      }

  // 7 · the gallery circuit: a closed loop threaded through section 06's
  //     cards. Scroll advances the loop (primary); a slow drift keeps it
  //     breathing when scroll rests (secondary). Each flyer's `t` spreads the
  //     ribbon around the whole circuit, so as the loop advances every
  //     butterfly travels card → card → card in the reference's order.
  //     Canvas fractions → viewport px accounts for the section scrolling
  //     beneath the fixed stream layer.
  const canvasH = vw * GALLERY.aspect
  const gu = t + (s - GALLERY.top) * 0.16 + drift * 0.55 + seed.drift * 0.012
  const lp = loopPoint(gu)
  const wob = Math.sin(gu * Math.PI * 7 + seed.phase) * 0.014
  const gallery: Point = {
    x: (lp.x + wob) * vw,
    y: GALLERY.top * vh + (lp.y + wob * 0.6) * canvasH - s * vh,
  }

  // 8 · the finale: a slow orbit around section 07's card fan, anchored to
  //     the document so it arrives and stays with the canvas. Scroll turns it
  //     gently; the drift keeps it alive at rest.
  const ft = finaleTop(vw, vh)
  const canvasHpx = (FINALE.canvasW * vw) / FINALE.aspect
  const centreYdoc = (ft + 0.18) * vh + canvasHpx * 0.52
  const fAng = t * Math.PI * 2 + (s - ft) * 0.9 + drift * 0.5 + seed.phase * 0.1
  const finale: Point = {
    x: vw * 0.5 + Math.cos(fAng) * vw * 0.36 * (1 + seed.drift * 0.06),
    y:
      centreYdoc -
      s * vh +
      Math.sin(fAng) * canvasHpx * 0.46 * (1 + seed.drift * 0.06) +
      Math.sin(fAng * 3 + seed.phase) * 8,
  }

  /* The intro→hero handoff: idle swarm for the first third of the intro,
     then the travel occupies the rest of it, completing exactly at s = 0 —
     from the hero onward this factor is 1 and the maths below is untouched. */
  const base = mixPoint(swarm, entering, ramp(-0.85, -0.02, s))

  const a = mixPoint(base, line, ramp(STREAM_STAGES.gather[0], STREAM_STAGES.gather[1], s))
  const b = mixPoint(a, wave, ramp(STREAM_STAGES.wave[0], STREAM_STAGES.wave[1], s))
  const c = mixPoint(b, orbit, ramp(STREAM_STAGES.orbit[0], STREAM_STAGES.orbit[1], s))
  const d = mixPoint(c, crossing, ramp(STREAM_STAGES.crossing[0], STREAM_STAGES.crossing[1], s))
  const e = mixPoint(d, screen, ramp(STREAM_STAGES.screen[0], STREAM_STAGES.screen[1], s))
  const f = mixPoint(e, gallery, ramp(STREAM_STAGES.gallery[0], STREAM_STAGES.gallery[1], s))
  return mixPoint(f, finale, ramp(ft - 0.55, ft + 0.2, s))
}

/** Heading along the path, so each butterfly faces where it is going. */
export function streamHeading(
  t: number,
  s: number,
  vw: number,
  vh: number,
  seed: StreamSeed,
  drift = 0,
): number {
  const step = 0.012
  const a = streamPoint(Math.max(0, t - step), s, vw, vh, seed, drift)
  const b = streamPoint(Math.min(1, t + step), s, vw, vh, seed, drift)
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
}
