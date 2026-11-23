import { useState } from 'react';
import { motion } from 'motion/react';
import { WEDDING_INFO } from '../data/weddingData';

interface PolaroidHeroProps {
  isRevealed: boolean;
}

export function PolaroidHero({ isRevealed }: PolaroidHeroProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative flex flex-col items-center px-6 pt-12 pb-10 text-center">
      {/* Top Kicker */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif-editorial text-[10.5px] font-medium uppercase tracking-[0.26em] text-[#6D6A5F]"
      >
        {WEDDING_INFO.kickerTop}
      </motion.p>

      {/* Couple Names in Graceful Script */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 font-script text-[52px] leading-[1.05] text-[#3D3C33] text-balance"
      >
        {WEDDING_INFO.coupleNameEn}
      </motion.h1>

      {/* Korean Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.28 }}
        className="mt-1.5 font-kr text-[13px] tracking-[0.14em] text-[#6D6A5F]"
      >
        {WEDDING_INFO.coupleSubtitleKr}
      </motion.p>

      {/* Paper Slit & Ejecting Polaroid Frame */}
      <div className="relative mt-8 flex w-full flex-col items-center">
        {/* Die-cut Horizontal Paper Slit (인화구 틈) */}
        <div
          aria-hidden="true"
          className="relative z-20 flex w-[282px] flex-col items-center"
        >
          {/* Upper embossed paper bevel */}
          <div className="h-[2px] w-full rounded-full bg-white/65" />
          {/* Dark recessed slot opening */}
          <div
            className="h-[7px] w-full rounded-full"
            style={{
              background:
                'linear-gradient(180deg, #2D2C25 0%, #4E4B40 65%, #847F70 100%)',
              boxShadow:
                'inset 0 2px 4px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.75)',
            }}
          />
        </div>

        {/* Clipping Window directly beneath the slit */}
        <div className="relative z-10 -mt-[2px] w-full overflow-hidden pt-1 pb-6 flex justify-center">
          <motion.div
            initial={{ y: '-110%', rotate: -1.6 }}
            animate={
              isRevealed
                ? { y: '0%', rotate: -0.6 }
                : { y: '-110%', rotate: -1.6 }
            }
            transition={{
              duration: 1.5,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-[248px] bg-[#FCFBF8] p-3 pb-7 shadow-[0_14px_34px_rgba(61,60,51,0.14),0_2px_8px_rgba(61,60,51,0.08)] ring-1 ring-[#49483E]/8"
          >
            {/* Photo Window */}
            <div className="relative aspect-[4/4.45] w-full overflow-hidden bg-[#E7E0D3]">
              {!imgError ? (
                <img
                  src={WEDDING_INFO.polaroidImageSrc}
                  alt={WEDDING_INFO.polaroidImageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#EDE6DA] to-[#DDD4C4] p-4 text-center">
                  <span className="font-script text-3xl text-[#49483E]">
                    J &amp; H
                  </span>
                  <span className="mt-1 font-kr text-[11px] text-[#78756A]">
                    {WEDDING_INFO.coupleSubtitleKr}
                  </span>
                </div>
              )}
              {/* Subtle warm analog film edge overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5"
              />
            </div>

            {/* Polaroid Bottom Margin with Date */}
            <div className="mt-4 flex items-center justify-center">
              <span className="font-serif-editorial text-[14.5px] italic tracking-[0.18em] text-[#49483E] tabular-nums">
                {WEDDING_INFO.polaroidDateLabel}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Location Caption Under Polaroid */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="mt-1 font-serif-editorial text-[10px] font-medium uppercase tracking-[0.24em] text-[#78756A]"
      >
        {WEDDING_INFO.locationCaptionTop}
      </motion.p>
    </section>
  );
}
