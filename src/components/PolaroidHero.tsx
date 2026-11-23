import { useState } from 'react';
import { motion } from 'motion/react';
import { WEDDING_INFO } from '../data/weddingData';

interface PolaroidHeroProps {
  isRevealed: boolean;
}

export function PolaroidHero({ isRevealed }: PolaroidHeroProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative flex flex-col items-center px-6 pt-14 pb-10 text-center">
      {/* Top Kicker */}
      <p className="font-serif-editorial text-[10.5px] font-medium uppercase tracking-[0.26em] text-[#6D6A5F]">
        {WEDDING_INFO.kickerTop}
      </p>

      {/* Couple Names in Graceful Script */}
      <h1 className="mt-4 font-script text-[52px] leading-[1.05] text-[#3D3C33] text-balance">
        {WEDDING_INFO.coupleNameEn}
      </h1>

      {/* Korean Subtitle */}
      <p className="mt-1.5 font-kr text-[13px] tracking-[0.14em] text-[#6D6A5F]">
        {WEDDING_INFO.coupleSubtitleKr}
      </p>

      {/* Raised Champagne-Beige Paper Slit & Slowly Ejecting Polaroid Frame */}
      <div className="relative mt-9 flex w-full flex-col items-center">
        {/* Champagne-Cream Raised Embossed Paper Slit Bar (matching reference video) */}
        <div
          aria-hidden="true"
          className="relative z-20 flex w-[288px] flex-col items-center"
        >
          {/* Outer raised paper frame lip */}
          <div
            className="flex h-[15px] w-full items-center justify-center rounded-full px-2.5"
            style={{
              background:
                'linear-gradient(180deg, #EFE5D3 0%, #DFCEB4 52%, #CEB99B 100%)',
              boxShadow:
                '0 3px 8px rgba(73, 66, 54, 0.16), inset 0 1px 1px rgba(255, 253, 248, 0.8)',
            }}
          >
            {/* Dark recessed inner slot opening */}
            <div
              className="h-[5px] w-full rounded-full"
              style={{
                background:
                  'linear-gradient(180deg, #2B2821 0%, #524C3F 75%, #7C7362 100%)',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.55)',
              }}
            />
          </div>
        </div>

        {/* Clipping Window directly beneath the slit center */}
        <div className="relative z-10 -mt-[5px] flex w-full justify-center overflow-hidden pt-0 pb-6">
          <motion.div
            initial={{ y: '-112%', rotate: -1.4 }}
            animate={
              isRevealed
                ? { y: '0%', rotate: -0.5 }
                : { y: '-112%', rotate: -1.4 }
            }
            transition={{
              duration: 2.15,
              delay: 0.08,
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
        transition={{ duration: 0.9, delay: 1.25 }}
        className="mt-1 font-serif-editorial text-[10px] font-medium uppercase tracking-[0.24em] text-[#78756A]"
      >
        {WEDDING_INFO.locationCaptionTop}
      </motion.p>
    </section>
  );
}
