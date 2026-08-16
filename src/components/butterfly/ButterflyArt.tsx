import type { CSSProperties } from 'react'
import { BUTTERFLY_MEDIA, type ButterflySlot } from '../../config/media'

/* ----------------------------------------------------------------------------
   Shared butterfly artwork — used by the hero's resident butterflies and by
   the scroll-driven stream that carries the page through every section.

   BUILT FOR THE COMPOSITOR. A butterfly is three stacked <svg> sprites: the
   hind wing pair, the fore wing pair, and the static body. The wing-beat is a
   CSS transform on the svg *elements* (see .wing-fold in index.css), which the
   browser runs entirely on the compositor. The earlier version animated groups
   inside one svg — that repaints the vector art every frame, and twenty
   butterflies repainting forever was a measurable, permanent GPU drain. There
   are also deliberately no filters here: a drop-shadow on an animated element
   forces re-rasterisation and costs far more than it shows.
   ------------------------------------------------------------------------- */

export interface Colourway {
  foreIn: string
  foreOut: string
  hindIn: string
  hindOut: string
  margin: string
  spot: string
  body: string
}

export const COLOURS: Record<ButterflySlot, Colourway> = {
  BUTTERFLY_BLUE: {
    foreIn: '#eaf4fd',
    foreOut: '#6fb3e8',
    hindIn: '#dcedfb',
    hindOut: '#87c2ee',
    margin: '#3f6f9e',
    spot: '#f4faff',
    body: '#3d4450',
  },
  BUTTERFLY_LAVENDER: {
    foreIn: '#f2edfd',
    foreOut: '#a68ce6',
    hindIn: '#e9e1fb',
    hindOut: '#b9a4ee',
    margin: '#6b5698',
    spot: '#faf7ff',
    body: '#443f52',
  },
  BUTTERFLY_PEACH: {
    foreIn: '#fdf0e6',
    foreOut: '#f0a976',
    hindIn: '#fce6d6',
    hindOut: '#f4bd93',
    margin: '#a86a41',
    spot: '#fff8f1',
    body: '#4e4238',
  },
  BUTTERFLY_PINK: {
    foreIn: '#fdeef3',
    foreOut: '#eb9ab5',
    hindIn: '#fbe2ea',
    hindOut: '#f2b1c6',
    margin: '#a35c76',
    spot: '#fff6f9',
    body: '#4c4048',
  },
  BUTTERFLY_YELLOW: {
    foreIn: '#fdf8e4',
    foreOut: '#efcb63',
    hindIn: '#fbf2d3',
    hindOut: '#f4dc8f',
    margin: '#a3873a',
    spot: '#fffdf4',
    body: '#4b4636',
  },
  BUTTERFLY_MINT: {
    foreIn: '#e9f7f0',
    foreOut: '#82ccab',
    hindIn: '#ddf1e7',
    hindOut: '#a3dcc2',
    margin: '#4d8a6d',
    spot: '#f5fcf9',
    body: '#3d4a44',
  },
}

export const BUTTERFLY_SLOTS: ButterflySlot[] = [
  'BUTTERFLY_BLUE',
  'BUTTERFLY_LAVENDER',
  'BUTTERFLY_PEACH',
  'BUTTERFLY_PINK',
  'BUTTERFLY_YELLOW',
  'BUTTERFLY_MINT',
]

/* Wing outlines, drawn for the right side and mirrored for the left.
   Body sits on x = 100 in a 200 × 190 viewBox. */
const FOREWING =
  'M100 76 C106 45 125 18 149 7 C172 -3 189 8 187 31 C185 56 165 80 137 92 C123 98 110 98 100 94 Z'
const HINDWING =
  'M100 98 C117 95 141 101 153 116 C166 132 160 154 141 162 C122 169 105 153 99 131 C96 121 97 107 100 98 Z'

function ForePair({ id, c, detail }: { id: string; c: Colourway; detail: boolean }) {
  const wing = (
    <>
      <path
        d={FOREWING}
        fill={`url(#${id}-fore)`}
        stroke={c.margin}
        strokeWidth="2.4"
        strokeLinejoin="round"
        opacity="0.96"
      />
      {detail && (
        <>
          <g stroke={c.margin} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.28">
            <path d="M102 82 C124 60 146 38 166 22" />
            <path d="M102 86 C126 74 152 60 176 44" />
            <path d="M103 90 C124 86 148 78 172 66" />
          </g>
          <g fill={c.spot} opacity="0.85">
            <circle cx="171" cy="30" r="4.6" />
            <circle cx="163" cy="52" r="3.8" />
            <circle cx="146" cy="72" r="3.2" />
          </g>
        </>
      )}
    </>
  )
  return (
    <>
      <defs>
        <linearGradient id={`${id}-fore`} x1="0.1" y1="0.9" x2="0.9" y2="0.1">
          <stop offset="0%" stopColor={c.foreIn} />
          <stop offset="100%" stopColor={c.foreOut} />
        </linearGradient>
      </defs>
      {wing}
      <g transform="translate(200,0) scale(-1,1)">{wing}</g>
    </>
  )
}

function HindPair({ id, c, detail }: { id: string; c: Colourway; detail: boolean }) {
  const wing = (
    <>
      <path
        d={HINDWING}
        fill={`url(#${id}-hind)`}
        stroke={c.margin}
        strokeWidth="2.2"
        strokeLinejoin="round"
        opacity="0.94"
      />
      {detail && (
        <>
          <g stroke={c.margin} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.26">
            <path d="M103 104 C122 108 140 118 152 132" />
            <path d="M102 114 C118 122 132 136 140 150" />
          </g>
          <g fill={c.spot} opacity="0.85">
            <circle cx="152" cy="140" r="3.6" />
            <circle cx="137" cy="151" r="2.9" />
          </g>
        </>
      )}
    </>
  )
  return (
    <>
      <defs>
        <linearGradient id={`${id}-hind`} x1="0.1" y1="0.1" x2="0.9" y2="1">
          <stop offset="0%" stopColor={c.hindIn} />
          <stop offset="100%" stopColor={c.hindOut} />
        </linearGradient>
      </defs>
      {wing}
      <g transform="translate(200,0) scale(-1,1)">{wing}</g>
    </>
  )
}

function Body({ c }: { c: Colourway }) {
  return (
    <>
      <path
        d="M100 62 C104.6 62 107.4 72 107.4 92 C107.4 114 104.6 133 100 141
           C95.4 133 92.6 114 92.6 92 C92.6 72 95.4 62 100 62 Z"
        fill={c.body}
      />
      <ellipse cx="100" cy="72" rx="8.2" ry="9.4" fill={c.body} />
      <circle cx="100" cy="58" r="6.4" fill={c.body} />
      <g stroke={c.body} strokeWidth="2.1" strokeLinecap="round" fill="none">
        <path d="M96 54 C89 40 79 30 68 25" />
        <path d="M104 54 C111 40 121 30 132 25" />
      </g>
      <circle cx="67" cy="24" r="3.1" fill={c.body} />
      <circle cx="133" cy="24" r="3.1" fill={c.body} />
    </>
  )
}

interface GlyphProps {
  /** unique per instance — the gradients are referenced by id */
  id: string
  slot: ButterflySlot
  /** wing-beat period, seconds */
  flap: number
  /** drop the veining and spots on very small butterflies, where they muddy */
  detail?: boolean
  className?: string
}

/**
 * A butterfly: the supplied cut-out PNG when one exists for this colourway,
 * otherwise the drawn sprite stack. Both get the same wing-beat.
 */
export default function ButterflyGlyph({
  id,
  slot,
  flap,
  detail = true,
  className = '',
}: GlyphProps) {
  const asset = BUTTERFLY_MEDIA[slot]
  const style = { '--flap': `${flap}s` } as CSSProperties

  if (asset) {
    return (
      <img
        src={asset}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`wing-photo h-auto w-full ${className}`}
        style={style}
      />
    )
  }

  const c = COLOURS[slot]
  return (
    <span
      className={`relative block w-full ${className}`}
      style={{ ...style, aspectRatio: '200 / 190' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 190" className="wing-fold wing-fold-hind absolute inset-0 h-full w-full">
        <HindPair id={`${id}-h`} c={c} detail={detail} />
      </svg>
      <svg viewBox="0 0 200 190" className="wing-fold absolute inset-0 h-full w-full">
        <ForePair id={`${id}-f`} c={c} detail={detail} />
      </svg>
      <svg viewBox="0 0 200 190" className="absolute inset-0 h-full w-full">
        <Body c={c} />
      </svg>
    </span>
  )
}
