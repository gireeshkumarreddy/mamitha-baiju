import { motion } from 'framer-motion'

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'Twitter', href: '#' },
]

export default function HeroFooter() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-40 px-7 pb-6 md:px-14 md:pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 2.4 }}
    >
      <div className="mx-auto flex max-w-[1680px] items-end justify-between gap-6">
        <p className="font-ui text-[0.6rem] leading-[1.6] whitespace-nowrap text-[#6d7078] md:text-[0.7rem]">
          © 2025 Mamitha Baiju.
          <span className="hidden sm:inline"> All Rights Reserved.</span>
        </p>
        <ul className="flex items-center gap-4 md:gap-8">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className="label text-[0.58rem] text-[#2b2d31] transition-opacity duration-300 hover:opacity-55 md:text-[0.65rem]"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
