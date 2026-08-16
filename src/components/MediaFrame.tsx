import { Image as ImageIcon, Film, Music4, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { MEDIA, type MediaSlot } from '../config/media'

export type Tone =
  | 'sky'
  | 'lavender'
  | 'peach'
  | 'blush'
  | 'sun'
  | 'mint'
  | 'neutral'
  | 'dusk'

const TONES: Record<Tone, string> = {
  sky: 'linear-gradient(148deg,#dcebfa 0%,#c2dcf2 100%)',
  lavender: 'linear-gradient(148deg,#e7e1fb 0%,#cec3f0 100%)',
  peach: 'linear-gradient(148deg,#fce7d9 0%,#f5ccb6 100%)',
  blush: 'linear-gradient(148deg,#fbe5ed 0%,#f2cbd8 100%)',
  sun: 'linear-gradient(148deg,#fdf4d8 0%,#f7e6b2 100%)',
  mint: 'linear-gradient(148deg,#e0f2e9 0%,#c4e6d4 100%)',
  neutral: 'linear-gradient(148deg,#f1f1ef 0%,#dedddb 100%)',
  dusk: 'linear-gradient(148deg,#eae7f6 0%,#ccd5ea 100%)',
}

const ICONS: Record<'image' | 'video' | 'audio', LucideIcon> = {
  image: ImageIcon,
  video: Film,
  audio: Music4,
}

interface MediaFrameProps {
  slot: MediaSlot
  tone?: Tone
  /** alt text / caption for the real asset */
  hint?: string
  icon?: 'image' | 'video' | 'audio'
  className?: string
  /** overlay UI drawn above the image (play buttons, labels, …) */
  children?: ReactNode
  /** hide the slot name — used for tiny frames like the avatar */
  bare?: boolean
}

/**
 * Renders the real asset when `MEDIA[slot]` is filled in, and an unmistakable
 * labelled placeholder until then. Swap assets in `src/config/media.ts`.
 */
export default function MediaFrame({
  slot,
  tone = 'neutral',
  hint,
  icon = 'image',
  className = '',
  children,
  bare = false,
}: MediaFrameProps) {
  const { src, position } = MEDIA[slot]
  const Icon = ICONS[icon]

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {src ? (
        <img
          src={src}
          alt={hint ?? slot}
          className="h-full w-full object-cover"
          style={{ objectPosition: position ?? 'center' }}
          draggable={false}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center"
          style={{ background: TONES[tone] }}
        >
          <span className="flex items-center justify-center rounded-full bg-white/55 p-2 text-[#5c5f68] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Icon className="h-3.5 w-3.5" strokeWidth={1.4} />
          </span>
          {!bare && (
            <span className="label text-[0.5rem] leading-[1.4] break-all text-[#5c5f68]/70">
              {slot}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
