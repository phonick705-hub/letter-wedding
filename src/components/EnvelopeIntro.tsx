import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PaperTextureOverlay } from './PaperTextureOverlay';

interface EnvelopeIntroProps {
  onOpenStart: () => void;
  onOpenComplete: () => void;
}

export function EnvelopeIntro({ onOpenStart, onOpenComplete }: EnvelopeIntroProps) {
  const [stage, setStage] = useState<'sealed' | 'untying' | 'opening' | 'done'>('sealed');

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('untying');
    onOpenStart();

    window.setTimeout(() => {
      setStage('opening');
    }, 420);

    window.setTimeout(() => {
      setStage('done');
      onOpenComplete();
    }, 1050);
  };

  const isUntyingOrLater = stage !== 'sealed';
  const isOpeningOrLater = stage === 'opening' || stage === 'done';

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          key="envelope-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: isOpeningOrLater ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          aria-label="청첩장 편지봉투 열기"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          }}
          className="fixed inset-y-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 cursor-pointer select-none overflow-hidden envelope-emboss shadow-[0_24px_80px_rgba(45,42,35,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C7258] sm:inset-y-6 sm:rounded-[28px]"
        >
          {/* Base Heavy Cotton Paper Emboss Texture */}
          <PaperTextureOverlay opacity={0.38} />

          {/* Subtle vignette for paper depth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, rgba(255,253,249,0.22) 0%, rgba(168,158,140,0.18) 100%)',
            }}
          />

          {/* Envelope Back Diagonal Folds (Left, Right, Bottom pocket seams) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 430 900"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="leftPocket" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#E1D9CB" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ECE5D8" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="rightPocket" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#DFD7C8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ECE5D8" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="bottomPocket" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#EFE9DD" stopOpacity="0.48" />
                <stop offset="100%" stopColor="#DFD7C8" stopOpacity="0.32" />
              </linearGradient>
              <filter id="seamShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#5C5546" floodOpacity="0.16" />
              </filter>
            </defs>

            {/* Left & Right Envelope Side Flaps */}
            <polygon points="0,250 185,435 0,720" fill="url(#leftPocket)" />
            <polygon points="430,250 245,435 430,720" fill="url(#rightPocket)" />

            {/* Lower Envelope Pocket Seam */}
            <path
              d="M 0 710 L 185 435 Q 215 415 245 435 L 430 710 L 430 900 L 0 900 Z"
              fill="url(#bottomPocket)"
              filter="url(#seamShadow)"
            />
            <path
              d="M 0 710 L 185 435 Q 215 415 245 435 L 430 710"
              fill="none"
              stroke="rgba(255,253,248,0.65)"
              strokeWidth="1.2"
            />
          </svg>

          {/* Top V-Shaped Envelope Flap */}
          <motion.div
            initial={{ rotateX: 0, y: 0 }}
            animate={
              isOpeningOrLater
                ? { rotateX: 165, y: -60, opacity: 0 }
                : { rotateX: 0, y: 0, opacity: 1 }
            }
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            className="pointer-events-none absolute inset-x-0 top-0 h-[54%]"
          >
            <svg
              viewBox="0 0 430 486"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="topFlapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#EFE9DD" />
                  <stop offset="70%" stopColor="#EAE3D5" />
                  <stop offset="100%" stopColor="#E4DCCD" />
                </linearGradient>
                <filter id="flapCastShadow" x="-15%" y="-10%" width="130%" height="135%">
                  <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#4E483B" floodOpacity="0.18" />
                </filter>
              </defs>
              {/* Soft V-flap extending from top corners down to center */}
              <path
                d="M 0 0 L 430 0 L 430 225 L 236 394 Q 215 412 194 394 L 0 225 Z"
                fill="url(#topFlapGrad)"
                filter="url(#flapCastShadow)"
              />
              {/* Crisp embossed edge bevel along the V-fold */}
              <path
                d="M 0 225 L 194 394 Q 215 412 236 394 L 430 225"
                fill="none"
                stroke="rgba(255,252,246,0.75)"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>

          {/* Center Round Translucent Paper Seal + Dimensional Blush Pink Silk Ribbon Bow */}
          <div className="pointer-events-none absolute inset-x-0 top-[42%] flex -translate-y-1/2 flex-col items-center justify-center">
            <motion.div
              animate={
                isOpeningOrLater
                  ? { scale: 1.06, opacity: 0, y: -24 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Round Translucent Vellum Paper Seal */}
              <div
                aria-hidden="true"
                className="h-[78px] w-[78px] rounded-full border border-white/55 shadow-[0_6px_18px_rgba(70,63,50,0.12)]"
                style={{
                  background:
                    'radial-gradient(circle at 38% 35%, rgba(255,253,250,0.68) 0%, rgba(235,229,218,0.48) 68%, rgba(214,206,192,0.42) 100%)',
                  backdropFilter: 'blur(2px)',
                }}
              />

              {/* Dimensional Blush Pink Silk Ribbon Bow */}
              <svg
                aria-hidden="true"
                viewBox="0 0 220 140"
                className="absolute h-[112px] w-[176px] overflow-visible"
              >
                <defs>
                  <linearGradient id="silkLeft" x1="0%" y1="20%" x2="100%" y2="80%">
                    <stop offset="0%" stopColor="#FCEEEB" />
                    <stop offset="45%" stopColor="#F3D6D3" />
                    <stop offset="100%" stopColor="#DFB8B3" />
                  </linearGradient>
                  <linearGradient id="silkRight" x1="100%" y1="20%" x2="0%" y2="80%">
                    <stop offset="0%" stopColor="#FCEEEB" />
                    <stop offset="50%" stopColor="#F2D4D0" />
                    <stop offset="100%" stopColor="#DDB5B0" />
                  </linearGradient>
                  <linearGradient id="silkTail" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E4BFBA" />
                    <stop offset="45%" stopColor="#F5DCD9" />
                    <stop offset="100%" stopColor="#ECC8C3" />
                  </linearGradient>
                  <linearGradient id="silkKnot" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBF0EE" />
                    <stop offset="60%" stopColor="#EFD0CC" />
                    <stop offset="100%" stopColor="#D9B1AC" />
                  </linearGradient>
                  <filter id="ribbonShadow" x="-25%" y="-25%" width="150%" height="160%">
                    <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#5C4E4A" floodOpacity="0.24" />
                  </filter>
                  <filter id="innerRibbonShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#7A615E" floodOpacity="0.22" />
                  </filter>
                </defs>

                {/* Left Swallowtail Ribbon End */}
                <motion.g
                  animate={
                    isUntyingOrLater
                      ? { x: -24, y: 14, rotate: -18, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: '104px 66px' }}
                  filter="url(#ribbonShadow)"
                >
                  <path
                    d="M 103 64 C 91 84, 77 104, 66 122 L 80 116 L 88 128 C 96 108, 102 88, 108 68 Z"
                    fill="url(#silkTail)"
                  />
                </motion.g>

                {/* Right Swallowtail Ribbon End */}
                <motion.g
                  animate={
                    isUntyingOrLater
                      ? { x: 24, y: 14, rotate: 18, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: '116px 66px' }}
                  filter="url(#ribbonShadow)"
                >
                  <path
                    d="M 117 64 C 129 84, 143 104, 154 122 L 140 116 L 132 128 C 124 108, 118 88, 112 68 Z"
                    fill="url(#silkTail)"
                  />
                </motion.g>

                {/* Left Satin Bow Loop */}
                <motion.g
                  animate={
                    isUntyingOrLater
                      ? { x: -28, y: -6, rotate: -22, scale: 0.92, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: '104px 58px' }}
                  filter="url(#ribbonShadow)"
                >
                  {/* Back inner fold */}
                  <path
                    d="M 104 58 C 76 42, 42 36, 38 56 C 35 72, 65 76, 102 64 Z"
                    fill="#D7B1AC"
                  />
                  {/* Front puffed silk loop */}
                  <path
                    d="M 103 57 C 74 30, 34 26, 30 50 C 26 71, 63 77, 102 62 Z"
                    fill="url(#silkLeft)"
                  />
                  {/* Satin highlight crease */}
                  <path
                    d="M 96 57 C 72 40, 44 37, 40 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.g>

                {/* Right Satin Bow Loop */}
                <motion.g
                  animate={
                    isUntyingOrLater
                      ? { x: 28, y: -6, rotate: 22, scale: 0.92, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: '116px 58px' }}
                  filter="url(#ribbonShadow)"
                >
                  {/* Back inner fold */}
                  <path
                    d="M 116 58 C 144 42, 178 36, 182 56 C 185 72, 155 76, 118 64 Z"
                    fill="#D7B1AC"
                  />
                  {/* Front puffed silk loop */}
                  <path
                    d="M 117 57 C 146 30, 186 26, 190 50 C 194 71, 157 77, 118 62 Z"
                    fill="url(#silkRight)"
                  />
                  {/* Satin highlight crease */}
                  <path
                    d="M 124 57 C 148 40, 176 37, 180 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.g>

                {/* Center Satin Knot */}
                <motion.g
                  animate={
                    isUntyingOrLater
                      ? { scale: 0.78, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: '110px 60px' }}
                  filter="url(#innerRibbonShadow)"
                >
                  <rect
                    x="99"
                    y="49"
                    width="22"
                    height="22"
                    rx="7"
                    fill="url(#silkKnot)"
                  />
                  <path
                    d="M 103 53 Q 110 51 117 53"
                    fill="none"
                    stroke="rgba(255,255,255,0.72)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </motion.g>
              </svg>
            </motion.div>
          </div>

          {/* Gentle Tap Prompt at Bottom */}
          <motion.div
            animate={{ opacity: isUntyingOrLater ? 0 : [0.55, 0.92, 0.55] }}
            transition={
              isUntyingOrLater
                ? { duration: 0.2 }
                : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
            className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center gap-1.5 text-center"
          >
            <span className="font-serif-editorial text-[11px] uppercase tracking-[0.28em] text-[#5B584E]">
              Tap ribbon to open
            </span>
            <span className="font-kr text-xs tracking-wide text-[#736F63]">
              리본을 눌러 초대장을 열어보세요
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
