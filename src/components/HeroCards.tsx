import { Heart, Play, Plus } from 'lucide-react'
import type { CSSProperties, ReactElement, ReactNode } from 'react'
import MediaFrame from './MediaFrame'
import type { CardKind } from '../config/heroLayout'

/**
 * Every card is wrapped in its own container-query context so all of its type
 * and spacing can be written in `cqw` and scale with the card itself.
 *
 * The wrapper does nothing but establish the container: a container that uses
 * `cqw` in its *own* properties stops being a valid size source and its
 * children resolve every `cqw` to zero.
 */
function Shell({
  className = '',
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div className="cq h-full w-full">
      <div className={`lift h-full w-full ${className}`} style={style}>
        {children}
      </div>
    </div>
  )
}

const SOFT_SHADOW =
  'shadow-[0_1px_2px_rgba(31,33,38,0.04),0_16px_34px_-16px_rgba(31,33,38,0.2)]'

/* --------------------------------------------------------------- fragments */

function Rule() {
  return <span className="mt-[7cqw] block h-px w-[15cqw] bg-current opacity-35" />
}

function Waveform() {
  const bars = [
    3, 6, 4, 9, 14, 8, 5, 11, 16, 7, 4, 10, 15, 6, 3, 8, 13, 9, 5, 12, 16, 7, 4, 9, 6, 3, 8, 11, 5,
    3,
  ]
  return (
    <div className="flex h-[12cqw] items-center justify-center gap-[0.9cqw]">
      {bars.map((h, i) => (
        <span
          key={i}
          className="wave-bar w-[0.8cqw] rounded-full bg-[#2b2d31]"
          style={
            {
              height: `${Math.max(18, (h / 16) * 100)}%`,
              '--wave-duration': `${0.9 + (i % 5) * 0.16}s`,
              '--wave-delay': `${(i % 7) * 0.09}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------ LEFT · ZONE 1 ---------- */

/** micro — the typography specimen. */
function TypeSpecimen() {
  return (
    <Shell
      className={`flex items-center justify-center rounded-[13px] border border-white/80 ${SOFT_SHADOW}`}
      style={{ background: 'linear-gradient(150deg,#fbeaf0 0%,#efe8fa 55%,#e6effb 100%)' }}
    >
      <span className="font-editorial text-[38cqw] leading-none text-[#2b2d31]">Aa</span>
    </Shell>
  )
}

/** small — a spare frame, landscape. */
function Still() {
  return (
    <Shell className="card-media overflow-hidden rounded-[14px]">
      <MediaFrame slot="ADDITIONAL_IMAGE_02" tone="mint" hint="A still" />
    </Shell>
  )
}

/** large — the anchor photograph on the left. */
function Moments() {
  return (
    <Shell className="card-media overflow-hidden rounded-[18px]">
      <MediaFrame slot="MOMENTS_IMAGE" tone="sky" hint="Capturing moments" />
    </Shell>
  )
}

/** small — capturing moments, creating memories. */
function QuoteMoments() {
  return (
    <Shell className="card-surface flex flex-col justify-center gap-[6cqw] rounded-[14px] px-[10cqw] text-[#2b2d31]">
      <span className="aspect-square w-[22cqw] overflow-hidden rounded-[5cqw]">
        <MediaFrame slot="QUOTE_IMAGE" tone="blush" bare hint="Moment" />
      </span>
      <p className="label text-[7.6cqw] leading-[1.6]">
        Capturing moments,
        <br />
        creating memories.
      </p>
    </Shell>
  )
}

/* ------------------------------------------------ LEFT · ZONE 2 ---------- */

/** medium — film still with a play affordance. */
function OnScreen() {
  return (
    <Shell className="card-media overflow-hidden rounded-[16px]">
      <MediaFrame slot="ON_SCREEN_IMAGE" tone="sun" hint="On screen" icon="video">
        <span className="label absolute top-[5.5cqw] left-[5.5cqw] rounded-full bg-white/85 px-[4.5cqw] py-[2cqw] text-[4.8cqw] text-[#2b2d31]">
          On screen
        </span>
        <span className="absolute top-1/2 left-1/2 flex aspect-square w-[19cqw] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_14px_rgba(0,0,0,0.16)]">
          <Play className="ml-[1cqw] h-[7.5cqw] w-[7.5cqw] fill-[#2b2d31] text-[#2b2d31]" />
        </span>
      </MediaFrame>
    </Shell>
  )
}

/** small — actor · performer · artist. */
function Identity() {
  return (
    <Shell
      className={`flex flex-col justify-center rounded-[14px] border border-white/70 px-[11cqw] ${SOFT_SHADOW}`}
      style={{ background: 'linear-gradient(155deg,#dcf0e8 0%,#d3e6f7 48%,#e1daf7 100%)' }}
    >
      <p className="label text-[8cqw] leading-[1.85] text-[#2b2d31]">
        Actor
        <br />
        Performer
        <br />
        Artist
      </p>
      <Rule />
    </Shell>
  )
}

/** medium — a quieter, personal frame. */
function HerWorld() {
  return (
    <Shell className="card-media overflow-hidden rounded-[16px]">
      <MediaFrame slot="HER_WORLD_IMAGE" tone="blush" hint="Her world">
        <span className="label absolute bottom-[5cqw] left-[6cqw] text-[4.8cqw] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
          My world
        </span>
      </MediaFrame>
    </Shell>
  )
}

/* ----------------------------------------------- RIGHT · ZONE 1 ---------- */

/** medium — now playing. */
function CurrentlyPlaying() {
  return (
    <Shell className="card-surface flex flex-col items-center justify-center gap-[6cqw] rounded-[16px] px-[9cqw] text-[#2b2d31]">
      <div className="flex w-full items-center gap-[6cqw]">
        <span className="aspect-square w-[24cqw] shrink-0 overflow-hidden rounded-[4cqw]">
          <MediaFrame slot="CURRENTLY_PLAYING_IMAGE" tone="lavender" bare hint="Sleeve" />
        </span>
        <p className="label text-[6.4cqw] leading-[1.5]">
          Currently
          <br />
          playing
        </p>
      </div>
      <div className="flex w-full items-center gap-[6cqw]">
        <button
          type="button"
          aria-label="Play"
          className="flex aspect-square w-[21cqw] shrink-0 items-center justify-center rounded-full bg-[#2b2d31] text-white transition-transform duration-500 hover:scale-105"
        >
          <Play className="ml-[1.2cqw] h-[8cqw] w-[8cqw] fill-white" />
        </button>
        <Waveform />
      </div>
    </Shell>
  )
}

/** small — a note from the audience. */
function Comment() {
  return (
    <Shell className="card-surface flex flex-col rounded-[14px] px-[8cqw] py-[8cqw] text-[#2b2d31]">
      <div className="flex items-center gap-[5cqw]">
        <span className="aspect-square w-[14cqw] shrink-0 overflow-hidden rounded-full">
          <MediaFrame slot="COMMENT_AVATAR" tone="blush" bare hint="Viewer" />
        </span>
        <span className="font-ui text-[5.8cqw] text-[#8b8e96]">2h ago</span>
      </div>
      <p className="font-ui mt-[6cqw] text-[6.6cqw] leading-[1.62] text-[#3a3d43]">
        Your work is truly inspiring. The emotions, the depth — everything feels so real.
      </p>
      <span className="mt-auto flex aspect-square w-[15cqw] items-center justify-center rounded-[4cqw] bg-[#f2f2f0]">
        <Heart className="h-[7.5cqw] w-[7.5cqw] fill-[#2b2d31] text-[#2b2d31]" />
      </span>
    </Shell>
  )
}

/** medium — behind the scenes. */
function BehindScenes() {
  return (
    <Shell className="card-media overflow-hidden rounded-[16px]">
      <MediaFrame slot="BEHIND_THE_SCENES_IMAGE" tone="peach" hint="Behind the scenes" />
    </Shell>
  )
}

/* ----------------------------------------------- RIGHT · ZONE 2 ---------- */

/** small — the archive frame. */
function Archive() {
  return (
    <Shell className="card-media overflow-hidden rounded-[14px]">
      <MediaFrame slot="ADDITIONAL_IMAGE_01" tone="neutral" hint="From the archive" />
    </Shell>
  )
}

/** medium — .mp4 */
function VideoCard() {
  return (
    <Shell className="card-media overflow-hidden rounded-[16px]">
      <MediaFrame slot="VIDEO_THUMBNAIL" tone="dusk" hint="Showreel" icon="video">
        <span className="label absolute top-[5.5cqw] left-[6cqw] text-[4.8cqw] text-[#2b2d31]/70">
          Video
        </span>
        <span className="absolute top-[5cqw] right-[5cqw] flex aspect-square w-[12cqw] items-center justify-center rounded-full bg-white/70 text-[#2b2d31]">
          <Plus className="h-[6.5cqw] w-[6.5cqw]" strokeWidth={1.6} />
        </span>
        <span className="font-ui absolute right-[6.5cqw] bottom-[5.5cqw] text-[9.5cqw] leading-none font-medium text-[#2b2d31]">
          .mp4
        </span>
      </MediaFrame>
    </Shell>
  )
}

/** small — making stories that stay forever. */
function QuoteStories() {
  return (
    <Shell
      className={`flex flex-col justify-center rounded-[14px] border border-white/70 px-[10cqw] text-[#2b2d31] ${SOFT_SHADOW}`}
      style={{ background: 'linear-gradient(155deg,#ebe5fa 0%,#e2e3f8 55%,#f4eef9 100%)' }}
    >
      <p className="label text-[7.6cqw] leading-[1.7]">
        Making stories
        <br />
        that stay
        <br />
        forever.
      </p>
      <Rule />
    </Shell>
  )
}

/* ---------------------------------------------------------------- resolver */

const REGISTRY: Record<CardKind, () => ReactElement> = {
  typeSpecimen: TypeSpecimen,
  still: Still,
  moments: Moments,
  quoteMoments: QuoteMoments,
  onScreen: OnScreen,
  identity: Identity,
  herWorld: HerWorld,
  currentlyPlaying: CurrentlyPlaying,
  comment: Comment,
  behindScenes: BehindScenes,
  archive: Archive,
  video: VideoCard,
  quoteStories: QuoteStories,
}

export default function HeroCard({ kind }: { kind: CardKind }) {
  const Card = REGISTRY[kind]
  return <Card />
}
