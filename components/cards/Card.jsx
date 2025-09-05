'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function Card({
  i = 0,
  title = 'brand',
  bullets = [],
  color = '#ffffff',
  accent = '#000000',
  text = '#080807',
  angle = 0,
  stickerSrc,
  stickerAlt = 'sticker',
  stickerEmoji = '✨',
}) {
  const container = useRef(null);

  return (
    <div
      ref={container}
      className="h-screen sticky top-0 z-10 flex items-center justify-center"
    > 
      <motion.div
        // ⟵ rotate from the CENTER (no translate), so it pivots exactly like Flowfest
        style={{
          backgroundColor: color,
          color: text,
          rotate: angle, // use motion's rotate prop (cleaner than manual transform)
        }}
        className="
          relative flex flex-col items-start justify-center origin-center transform-gpu
          h-[380px] w-[280px] md:h-[400px] md:w-[720px] max-w-[88vw]
          rounded-3xl p-7 md:p-10
          shadow-[0_8px_28px_rgba(0,0,0,0.12)]
          will-change-transform
        "
      >
        {/* sticker image */}
        <div className="absolute -top-7 right-2 md:-top-7 md:right-2 select-none">
          {stickerSrc ? (
            <Image
              src={stickerSrc}
              alt={stickerAlt}
              width={64}
              height={64}
              className="h-28 w-28 md:h-32 md:w-32 object-contain"
              priority={i === 0}
            />
          ) : (
            <span className="text-xl md:text-2xl">{stickerEmoji}</span>
          )}
        </div>

        {/* title */}
        <h2 className="mt-2 text-left lowercase font-DMbold text-[24px] md:text-5xl leading-none tracking-tight">
          {title}
        </h2>

        {/* underline / divider */}
        <div
          className="mt-3 h-[3px] w-[58%] md:w-[62%] rounded-full"
          style={{ backgroundColor: accent }}
        />

        {/* bullets */}
        <ul className="mt-6 grid w-full max-w-[520px] list-none grid-cols-1 gap-1.5 md:gap-2 font-DMsemi text-[15px] md:text-2xl leading-7">
          {bullets.map((b, idx) => (
            <li key={idx} className="pl-6 relative">
              <span className="absolute left-0 top-0 text-[18px] leading-7" aria-hidden>
                ✦
              </span>
              {b}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
