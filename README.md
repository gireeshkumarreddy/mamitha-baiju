# Mamitha Baiju — Portfolio

A cinematic interactive portfolio: seven scroll-choreographed sections tied
together by one continuous butterfly journey, from a swarm-filled opening
scene to a closing call-to-action.

React 18 · TypeScript · Tailwind v4 · Framer Motion · Vite.

```bash
npm install
npm run dev
```

## The journey

| Section | Purpose | Treatment |
| --- | --- | --- |
| Intro | opening scene | butterfly swarm over a veil; the hero comes forward as it dissolves |
| Hero | who she is | cut-out portrait, floating editorial cards, oversized name |
| 02 · My World | identity | pinned ring of eight photographs settling from an orbit |
| 03 · Gallery | visual story | two looping arcs of frames, "frames in motion" |
| 04 · In Motion | performance | dance video on a concave CRT screen, pink panel |
| 05 · Beyond the Frame | more performance | mirrored screen, yellow panel, its own video |
| 06 · My Journey | portfolio / story | ten-card wall on black with editorial copy and captions |
| 07 · Closing | contact / collaborate | seven-photo fan, "Let's create something memorable", GET IN TOUCH |

## Architecture notes

**One journey value.** Everything is driven by a single scroll distance
measured in viewports, anchored at the hero (`src/App.tsx`). The intro lives
at negative values, so sections can be added or re-timed without shifting one
another. Every stage of the butterfly choreography is a slice of this value
(`src/lib/curve.ts`) — the same twenty butterflies fly the entire page and
never reset at a section boundary.

**Butterflies are compositor-only.** Wing-beats are CSS transforms on whole
`<svg>` elements (never on SVG interior groups, which repaint), there are no
filters on moving elements, and one shared clock drives all flyers
(`src/components/butterfly/`, `ButterflyStream.tsx`).

**The curved screens are real geometry.** Sections 04/05 build a concave
cylinder from rotated strips whose transform derives from a single motion
value (a second one can flush on a different frame and tear the surface).
Each screen has its own pre-encoded file looping natively — no `currentTime`
writes, no scroll-coupled playback — painted per decoded frame into
slice-sized canvases via `requestVideoFrameCallback`. The files are rebuilt
from the original footage with `npm run video:split` (section 04) and
`npm run video:section5` (requires ffmpeg and the local source videos).

**Faces are placement-verified.** Every photograph's crop window
(`object-position`) was set from where the face sits in that image — see the
comments in `src/config/media.ts`. If you change a card's aspect ratio,
re-check its images' positions.

## Where to edit things

```
src/config/
  media.ts          every image/video slot and its face-aware crop
  heroLayout.ts     hero cards + resident butterflies
  momentsLayout.ts  section 02 ring + title
  reelLayout.ts     section 03 arcs + loop speed
  screenLayout.ts   sections 04/05 — curve, panels, copy, video files
  galleryLayout.ts  section 06 wall, captions, editorial copy, butterfly loop
  finaleLayout.ts   section 07 fan, CTA copy, contact links
src/lib/curve.ts    the butterfly journey (all stages)
src/lib/heroMotion.tsx  journey/pointer/viewport plumbing
```

Contact details (email, Instagram, IMDb) live in
`src/config/finaleLayout.ts` → `FINALE_CTA`.

## Assets

Everything the site needs lives in `public/images` and `public/videos`
(two web-encoded H.264 files) — the repository is self-contained and
deployable as-is. The original supplied photographs and videos the site was
built from stay in the project folder locally but are git-ignored
(root-level media patterns in `.gitignore`); only the `video:*` scripts
reference them, and only when re-encoding.
