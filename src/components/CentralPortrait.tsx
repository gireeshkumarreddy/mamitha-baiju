import { motion, useTransform } from 'framer-motion'
import { MAIN_IMAGE_IS_CUTOUT, MEDIA } from '../config/media'
import { useHeroScroll, usePointer } from '../lib/heroMotion'

/**
 * The centre of the page.
 *
 * With a background-removed PNG (`MAIN_IMAGE_IS_CUTOUT = true`) this renders
 * bare: no frame, no mask, the person standing directly in the scene with the
 * type behind her and the cards layered around her.
 *
 * The photograph supplied today still carries its own background, so instead of
 * dropping a hard rectangle into a calm off-white page it renders as a portrait
 * column — arched top, edges feathered into the paper at the top and bottom, no
 * card frame — occupying exactly the position the silhouette held.
 */
export default function CentralPortrait() {
  const progress = useHeroScroll()
  const pointer = usePointer()

  const scrollY = useTransform(progress, [0, 1], [0, -70])
  const x = useTransform(pointer.x, (v) => v * -18)
  const y = useTransform(pointer.y, (v) => v * -10)

  const { src, position } = MEDIA.MAIN_MAMITHA_IMAGE
  const bare = MAIN_IMAGE_IS_CUTOUT

  /* Feather the top so the frame dissolves before it reaches her hair, and the
     bottom so she grounds into the page instead of ending on a cut line. */
  const feather =
    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 2.5%, #000 7%, #000 82%, rgba(0,0,0,0.5) 93%, transparent 100%)'

  return (
    <motion.div
      /* Sized by aspect: the cut-out is a 736×814 bust, so the box carries the
         image's own ratio and she lands identically at every viewport. */
      className={
        bare
          ? 'pointer-events-none absolute bottom-0 left-1/2 z-20 flex aspect-[736/814] w-[86vw] max-w-[560px] -translate-x-1/2 items-end justify-center sm:w-[42vw] lg:w-[33vw]'
          : 'pointer-events-none absolute bottom-0 left-1/2 z-20 flex aspect-[60/100] w-[54vw] max-w-[520px] -translate-x-1/2 items-end justify-center sm:w-[32vw] lg:aspect-[56/100] lg:w-[26.5vw]'
      }
      style={{ y: scrollY, willChange: 'transform' }}
    >
      <motion.div
        className="h-full w-full"
        style={{ x, y }}
        initial={{ opacity: 0, y: 34, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.72, ease: [0.16, 0.7, 0.22, 1] }}
      >
        {src ? (
          bare ? (
            <img
              src={src}
              alt="Mamitha Baiju"
              className="h-full w-full object-contain object-bottom"
              style={{ objectPosition: position ?? 'bottom' }}
              draggable={false}
            />
          ) : (
            <div
              className="h-full w-full overflow-hidden rounded-t-[42%] rounded-b-[10%]"
              style={{ maskImage: feather, WebkitMaskImage: feather }}
            >
              {/* No push-in: at 1:1 her hair starts exactly where the top
                  feather reaches full opacity, so the frame's own background
                  dissolves above her head and nothing clips her hairline. */}
              <img
                src={src}
                alt="Mamitha Baiju"
                className="h-full w-full object-cover"
                style={{ objectPosition: position ?? 'center' }}
                draggable={false}
              />
            </div>
          )
        ) : (
          <div className="relative h-full w-full">
            <svg
              viewBox="0 0 380 820"
              preserveAspectRatio="xMidYMax meet"
              className="h-full w-full"
              aria-hidden="true"
            >
              {/* Widened about the centre line so the silhouette carries the
                  same shoulder-to-height ratio as a standing figure. */}
              <g transform="translate(190,0) scale(1.23,1) translate(-190,0)">
                {/* torso — shoulders, a waist, hips, then off the bottom edge */}
                <path
                  d="M104 318 C132 296 248 296 276 318
                     C310 340 322 384 328 434
                     C333 476 322 506 314 540
                     C308 568 318 602 328 648
                     C339 706 342 764 343 820
                     L37 820 C38 764 41 706 52 648
                     C62 602 72 568 66 540
                     C58 506 47 476 52 434
                     C58 384 70 340 104 318 Z"
                  fill="#d8d8da"
                />
                {/* hair mass — narrower than the shoulders, falling past them */}
                <path
                  d="M190 14 C244 14 279 58 281 126
                     C283 196 274 268 266 326
                     C261 368 238 388 190 388
                     C142 388 119 368 114 326
                     C106 268 97 196 99 126
                     C101 58 136 14 190 14 Z"
                  fill="#d8d8da"
                />
                {/* strands falling in front of the shoulders */}
                <path
                  d="M116 236 C108 290 106 348 114 392 C118 414 126 428 136 436
                     C124 412 118 366 118 322 C118 288 119 262 116 236 Z"
                  fill="#d8d8da"
                />
                <path
                  d="M264 236 C272 290 274 348 266 392 C262 414 254 428 244 436
                     C256 412 262 366 262 322 C262 288 261 262 264 236 Z"
                  fill="#d8d8da"
                />
                {/* the near arm, a shade deeper so the body reads dimensional */}
                <path
                  d="M292 358 C310 408 318 476 318 540 C318 592 314 646 309 692
                     C306 640 300 566 294 506 C289 452 286 400 292 358 Z"
                  fill="#cfcfd2"
                  opacity="0.9"
                />
              </g>
            </svg>

            <span className="label absolute bottom-[27%] left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1.5 text-center text-[0.5rem] leading-[1.5] whitespace-nowrap text-[#6d7078] backdrop-blur-sm sm:bottom-[16%]">
              MAIN_MAMITHA_IMAGE
              <br />
              <span className="opacity-70">transparent png · replace me</span>
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
