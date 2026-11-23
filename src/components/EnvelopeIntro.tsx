import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface EnvelopeIntroProps {
  onOpenStart: () => void;
  onOpenComplete: () => void;
}

/**
 * 전체적으로 균일하고 화사한 옅은 베이지 톤의 거친 수제 코튼 종이 3D 범프맵 텍스처를 생성합니다.
 */
function createUniformPaleBeigePaperUrl(size = 384): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  let seed = 133791;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const buildGrid = (gridSize: number) => {
    const g = new Float32Array(gridSize * gridSize);
    for (let i = 0; i < g.length; i++) {
      g[i] = rand();
    }
    return g;
  };

  const sampleBilinear = (
    grid: Float32Array,
    gridSize: number,
    u: number,
    v: number
  ) => {
    const x = u * gridSize;
    const y = v * gridSize;
    const x0 = Math.floor(x) % gridSize;
    const y0 = Math.floor(y) % gridSize;
    const x1 = (x0 + 1) % gridSize;
    const y1 = (y0 + 1) % gridSize;
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    const v00 = grid[y0 * gridSize + x0];
    const v10 = grid[y0 * gridSize + x1];
    const v01 = grid[y1 * gridSize + x0];
    const v11 = grid[y1 * gridSize + x1];

    const ix0 = v00 + (v10 - v00) * sx;
    const ix1 = v01 + (v11 - v01) * sx;
    return ix0 + (ix1 - ix0) * sy;
  };

  const gCoarse = buildGrid(24);
  const gMedium = buildGrid(64);
  const gFine = buildGrid(144);
  const gMicro = buildGrid(256);

  const heightMap = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const n1 = sampleBilinear(gCoarse, 24, u, v);
      const n2 = sampleBilinear(gMedium, 64, u, v);
      const n3 = sampleBilinear(gFine, 144, u, v);
      const n4 = sampleBilinear(gMicro, 256, u, v);
      heightMap[y * size + x] = n1 * 0.42 + n2 * 0.30 + n3 * 0.18 + n4 * 0.10;
    }
  }

  for (let f = 0; f < 420; f++) {
    const fx = rand() * size;
    const fy = rand() * size;
    const angle = rand() * Math.PI * 2;
    const len = 5 + rand() * 12;
    const delta = (rand() > 0.5 ? 1 : -1) * 0.08;
    for (let s = 0; s < len; s++) {
      const px = (Math.floor(fx + Math.cos(angle) * s) + size) % size;
      const py = (Math.floor(fy + Math.sin(angle) * s) + size) % size;
      heightMap[py * size + px] = Math.max(
        0,
        Math.min(1, heightMap[py * size + px] + delta)
      );
    }
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  const lx = -0.58;
  const ly = -0.68;
  const lz = 0.44;
  const bumpStrength = 5.4;

  for (let y = 0; y < size; y++) {
    const ym = (y - 1 + size) % size;
    const yp = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;

      const dx = (heightMap[y * size + xp] - heightMap[y * size + xm]) * bumpStrength;
      const dy = (heightMap[yp * size + x] - heightMap[ym * size + x]) * bumpStrength;

      const invLen = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const nx = -dx * invLen;
      const ny = -dy * invLen;
      const nz = invLen;

      const diffuse = Math.max(0, nx * lx + ny * ly + nz * lz);
      const heightVal = heightMap[y * size + x];
      const shade = 0.69 + diffuse * 0.29 + (heightVal - 0.5) * 0.10;

      const r = Math.max(0, Math.min(255, Math.round(244 * shade + 14)));
      const g = Math.max(0, Math.min(255, Math.round(235 * shade + 12)));
      const b = Math.max(0, Math.min(255, Math.round(218 * shade + 10)));

      const idx = (y * size + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

export function EnvelopeIntro({ onOpenStart, onOpenComplete }: EnvelopeIntroProps) {
  const [stage, setStage] = useState<'sealed' | 'opening' | 'done'>('sealed');
  const [paperTextureUrl, setPaperTextureUrl] = useState<string>('');

  useEffect(() => {
    const url = createUniformPaleBeigePaperUrl(384);
    setPaperTextureUrl(url);
  }, []);

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    onOpenStart();

    // 봉투가 위아래로 아주 천천히 열리고(2.35초) 완전히 사라진 뒤 폴라로이드 인화 시작
    window.setTimeout(() => {
      setStage('done');
      onOpenComplete();
    }, 2350);
  };

  if (stage === 'done') return null;

  const isSealed = stage === 'sealed';
  const isOpening = stage === 'opening';

  const paperBgStyle = paperTextureUrl
    ? {
        backgroundImage: `url(${paperTextureUrl})`,
        backgroundSize: '340px 340px',
        backgroundRepeat: 'repeat',
      }
    : {
        backgroundColor: '#EFE6D8',
      };

  return (
    <div
      onClick={isSealed ? handleOpen : undefined}
      role={isSealed ? 'button' : undefined}
      tabIndex={isSealed ? 0 : undefined}
      aria-label={isSealed ? '청첩장 편지봉투 열기' : undefined}
      onKeyDown={(e) => {
        if (isSealed && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleOpen();
        }
      }}
      style={{ perspective: '1400px' }}
      className={`absolute inset-0 z-40 h-dvh select-none overflow-hidden sm:h-[calc(100dvh-3rem)] ${
        isSealed
          ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C7258]'
          : 'pointer-events-none'
      }`}
    >
      {/* 1. Envelope Back / Side Wings (Parts downward softly when opening so card reveals cleanly) */}
      <motion.div
        aria-hidden="true"
        initial={{ y: '0%', opacity: 1 }}
        animate={
          isOpening
            ? { y: '105%', opacity: 0 }
            : { y: '0%', opacity: 1 }
        }
        transition={{
          y: { duration: 1.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 1.0, delay: 1.05, ease: 'easeOut' },
        }}
        className="pointer-events-none absolute inset-0"
        style={paperBgStyle}
      />

      {/* 2. Lower Envelope Pocket (Glides slowly downward off screen) */}
      <motion.div
        initial={{ y: '0%', opacity: 1 }}
        animate={
          isOpening
            ? { y: '108%', opacity: 0 }
            : { y: '0%', opacity: 1 }
        }
        transition={{
          y: { duration: 1.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.95, delay: 1.15, ease: 'easeOut' },
        }}
        className="pointer-events-none absolute inset-0"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 430 900"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <pattern
              id="pocketPaperPatternVideo"
              patternUnits="userSpaceOnUse"
              width="340"
              height="340"
              patternTransform="translate(95, 140)"
            >
              {paperTextureUrl && (
                <image href={paperTextureUrl} width="340" height="340" />
              )}
            </pattern>
            <filter id="lowerFlapShadowVideo" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="-1.5" stdDeviation="3" floodColor="#6E6352" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Lower Envelope Pocket Flap */}
          <g filter="url(#lowerFlapShadowVideo)">
            <path
              d="M 0 560 L 194 398 Q 215 382 236 398 L 430 560 L 430 900 L 0 900 Z"
              fill={paperTextureUrl ? 'url(#pocketPaperPatternVideo)' : '#EFE6D8'}
            />
          </g>

          {/* Crisp Light Edge along Lower Flap Seam */}
          <path
            d="M 0 560 L 194 398 Q 215 382 236 398 L 430 560"
            fill="none"
            stroke="rgba(255,253,248,0.68)"
            strokeWidth="1.2"
          />
        </svg>

        {/* Minimalist Tap Hint */}
        <motion.div
          animate={{ opacity: isOpening ? 0 : [0.45, 0.85, 0.45] }}
          transition={
            isOpening
              ? { duration: 0.35 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1 text-center"
        >
          <span className="font-serif-editorial text-[10.5px] uppercase tracking-[0.28em] text-[#555248]">
            Tap to open
          </span>
        </motion.div>
      </motion.div>

      {/* 3. Top V-Flap WITH Blush-Pink Satin Ribbon Bow Attached (Hinges & glides slowly UPWARD!) */}
      <motion.div
        initial={{ rotateX: 0, y: '0%', opacity: 1 }}
        animate={
          isOpening
            ? { rotateX: 155, y: '-115%', opacity: 0 }
            : { rotateX: 0, y: '0%', opacity: 1 }
        }
        transition={{
          rotateX: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 1.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.9, delay: 1.1, ease: 'easeOut' },
        }}
        style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[52%]"
      >
        <svg
          viewBox="0 0 430 468"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <pattern
              id="topFlapPaperPatternVideo"
              patternUnits="userSpaceOnUse"
              width="340"
              height="340"
              patternTransform="translate(210, 40)"
            >
              {paperTextureUrl && (
                <image href={paperTextureUrl} width="340" height="340" />
              )}
            </pattern>
            <filter id="topFlapDropShadowVideo" x="-15%" y="-10%" width="130%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5.5" floodColor="#6E6352" floodOpacity="0.18" />
            </filter>
          </defs>

          <g filter="url(#topFlapDropShadowVideo)">
            <path
              d="M 0 0 L 430 0 L 430 226 L 238 380 Q 215 398 192 380 L 0 226 Z"
              fill={paperTextureUrl ? 'url(#topFlapPaperPatternVideo)' : '#EFE6D8'}
            />
          </g>

          <path
            d="M 0 226 L 192 380 Q 215 398 238 380 L 430 226"
            fill="none"
            stroke="rgba(255,253,248,0.72)"
            strokeWidth="1.4"
          />
        </svg>

        {/* Blush-Pink Satin Ribbon Bow Attached Directly to V-Flap Tip */}
        <div className="absolute inset-x-0 top-[82%] flex -translate-y-1/2 items-center justify-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 280 220"
            className="h-[154px] w-[196px] overflow-visible"
          >
            <defs>
              <pattern
                id="silkWeaveFine"
                width="3.5"
                height="3.5"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(24)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="3.5"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="0.9"
                />
                <line
                  x1="1.8"
                  y1="0"
                  x2="1.8"
                  y2="3.5"
                  stroke="rgba(162,108,105,0.08)"
                  strokeWidth="0.8"
                />
              </pattern>

              <linearGradient id="pinkLoopLeft" x1="12%" y1="10%" x2="92%" y2="82%">
                <stop offset="0%" stopColor="#F5CFCD" />
                <stop offset="28%" stopColor="#FCE7E5" />
                <stop offset="56%" stopColor="#F4C7C4" />
                <stop offset="82%" stopColor="#E1A6A3" />
                <stop offset="100%" stopColor="#C28480" />
              </linearGradient>
              <linearGradient id="pinkLoopLeftBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B87A77" />
                <stop offset="65%" stopColor="#D79E9B" />
                <stop offset="100%" stopColor="#9E6562" />
              </linearGradient>

              <linearGradient id="pinkLoopRight" x1="88%" y1="10%" x2="8%" y2="82%">
                <stop offset="0%" stopColor="#F2C9C7" />
                <stop offset="30%" stopColor="#FDEAE8" />
                <stop offset="58%" stopColor="#F1C3C0" />
                <stop offset="84%" stopColor="#DDA29F" />
                <stop offset="100%" stopColor="#BE807D" />
              </linearGradient>
              <linearGradient id="pinkLoopRightBack" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B87A77" />
                <stop offset="65%" stopColor="#D79E9B" />
                <stop offset="100%" stopColor="#9E6562" />
              </linearGradient>

              <linearGradient id="pinkTailLeft" x1="15%" y1="5%" x2="85%" y2="95%">
                <stop offset="0%" stopColor="#C88A87" />
                <stop offset="24%" stopColor="#F1C5C3" />
                <stop offset="52%" stopColor="#FDEBE9" />
                <stop offset="78%" stopColor="#ECC0BD" />
                <stop offset="100%" stopColor="#D99F9C" />
              </linearGradient>

              <linearGradient id="pinkTailRight" x1="85%" y1="5%" x2="15%" y2="95%">
                <stop offset="0%" stopColor="#C88A87" />
                <stop offset="24%" stopColor="#EFC3C0" />
                <stop offset="52%" stopColor="#FCEAE8" />
                <stop offset="78%" stopColor="#E9BBB8" />
                <stop offset="100%" stopColor="#D79D9A" />
              </linearGradient>

              <linearGradient id="pinkKnotCenter" x1="0%" y1="8%" x2="100%" y2="92%">
                <stop offset="0%" stopColor="#FCEAE8" />
                <stop offset="38%" stopColor="#F3C8C5" />
                <stop offset="76%" stopColor="#DC9F9C" />
                <stop offset="100%" stopColor="#B87D7A" />
              </linearGradient>

              <filter id="drapedBowShadow" x="-25%" y="-25%" width="150%" height="165%">
                <feDropShadow dx="1" dy="6" stdDeviation="5" floodColor="#5A483E" floodOpacity="0.24" />
              </filter>
              <filter id="knotDeepShadow" x="-35%" y="-35%" width="170%" height="170%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.8" floodColor="#694341" floodOpacity="0.34" />
              </filter>
              <filter id="silkFoldBlur">
                <feGaussianBlur stdDeviation="1.3" />
              </filter>
            </defs>

            {/* LEFT WIDE DRAPED RIBBON TAIL */}
            <g filter="url(#drapedBowShadow)">
              <path
                d="M 124 88 C 102 104, 64 128, 34 146 C 48 164, 68 182, 88 198 C 106 184, 120 165, 128 136 C 132 120, 132 102, 134 90 Z"
                fill="url(#pinkTailLeft)"
              />
              <path
                d="M 124 88 C 102 104, 64 128, 34 146 C 48 164, 68 182, 88 198 C 106 184, 120 165, 128 136 C 132 120, 132 102, 134 90 Z"
                fill="url(#silkWeaveFine)"
              />
              <path
                d="M 125 94 C 106 118, 86 148, 70 176"
                fill="none"
                stroke="rgba(168,104,101,0.34)"
                strokeWidth="4.5"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 122 96 C 100 120, 74 142, 54 158"
                fill="none"
                stroke="rgba(255,250,249,0.78)"
                strokeWidth="4.2"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 130 100 C 122 128, 110 156, 92 186"
                fill="none"
                stroke="rgba(255,246,245,0.52)"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
            </g>

            {/* RIGHT WIDE DRAPED RIBBON TAIL */}
            <g filter="url(#drapedBowShadow)">
              <path
                d="M 156 88 C 178 104, 212 128, 244 148 C 228 166, 208 182, 188 196 C 172 180, 160 158, 152 132 C 148 118, 148 102, 146 90 Z"
                fill="url(#pinkTailRight)"
              />
              <path
                d="M 156 88 C 178 104, 212 128, 244 148 C 228 166, 208 182, 188 196 C 172 180, 160 158, 152 132 C 148 118, 148 102, 146 90 Z"
                fill="url(#silkWeaveFine)"
              />
              <path
                d="M 155 94 C 172 118, 192 146, 206 172"
                fill="none"
                stroke="rgba(168,104,101,0.34)"
                strokeWidth="4.5"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 158 96 C 180 120, 206 142, 224 156"
                fill="none"
                stroke="rgba(255,250,249,0.74)"
                strokeWidth="4.2"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 150 100 C 158 126, 170 156, 186 184"
                fill="none"
                stroke="rgba(255,246,245,0.48)"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
            </g>

            {/* LEFT WIDE LUSH BOW EAR */}
            <g filter="url(#drapedBowShadow)">
              <path
                d="M 124 88 C 102 96, 68 108, 48 106 C 54 96, 78 86, 120 82 Z"
                fill="url(#pinkLoopLeftBack)"
              />
              <path
                d="M 126 74 C 110 54, 92 42, 74 34 C 66 56, 56 80, 48 104 C 68 106, 102 98, 124 88 Z"
                fill="url(#pinkLoopLeft)"
              />
              <path
                d="M 126 74 C 110 54, 92 42, 74 34 C 66 56, 56 80, 48 104 C 68 106, 102 98, 124 88 Z"
                fill="url(#silkWeaveFine)"
              />
              <path
                d="M 122 77 Q 98 66 76 54"
                fill="none"
                stroke="rgba(162,98,95,0.42)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 122 82 Q 92 84 62 86"
                fill="none"
                stroke="rgba(154,90,87,0.38)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 118 72 Q 96 54 78 44"
                fill="none"
                stroke="rgba(255,251,250,0.82)"
                strokeWidth="3.2"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 116 80 Q 88 74 64 72"
                fill="none"
                stroke="rgba(255,248,247,0.68)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
            </g>

            {/* RIGHT WIDE LUSH BOW EAR */}
            <g filter="url(#drapedBowShadow)">
              <path
                d="M 156 88 C 178 96, 210 108, 232 104 C 226 94, 202 86, 160 82 Z"
                fill="url(#pinkLoopRightBack)"
              />
              <path
                d="M 154 74 C 170 54, 188 42, 208 36 C 216 58, 224 80, 232 102 C 212 105, 178 98, 156 88 Z"
                fill="url(#pinkLoopRight)"
              />
              <path
                d="M 154 74 C 170 54, 188 42, 208 36 C 216 58, 224 80, 232 102 C 212 105, 178 98, 156 88 Z"
                fill="url(#silkWeaveFine)"
              />
              <path
                d="M 158 77 Q 182 66 204 54"
                fill="none"
                stroke="rgba(162,98,95,0.42)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 158 82 Q 188 84 218 86"
                fill="none"
                stroke="rgba(154,90,87,0.38)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 162 72 Q 184 54 202 45"
                fill="none"
                stroke="rgba(255,251,250,0.80)"
                strokeWidth="3.2"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 164 80 Q 192 74 216 72"
                fill="none"
                stroke="rgba(255,248,247,0.65)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
            </g>

            {/* ORGANIC HAND-TIED CENTER KNOT */}
            <g filter="url(#knotDeepShadow)">
              <path
                d="M 122 68 C 130 62, 148 62, 156 68 C 162 76, 161 88, 155 94 C 146 99, 131 99, 123 93 C 118 87, 117 75, 122 68 Z"
                fill="url(#pinkKnotCenter)"
              />
              <path
                d="M 122 68 C 130 62, 148 62, 156 68 C 162 76, 161 88, 155 94 C 146 99, 131 99, 123 93 C 118 87, 117 75, 122 68 Z"
                fill="url(#silkWeaveFine)"
              />
              <path
                d="M 126 67 C 133 76, 140 85, 148 94"
                fill="none"
                stroke="rgba(154,90,87,0.48)"
                strokeWidth="2.2"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 136 66 C 144 74, 150 82, 155 91"
                fill="none"
                stroke="rgba(168,104,101,0.34)"
                strokeWidth="1.6"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 126 70 Q 134 65 144 68"
                fill="none"
                stroke="rgba(255,252,251,0.85)"
                strokeWidth="2.4"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
              <path
                d="M 141 72 Q 149 76 153 84"
                fill="none"
                stroke="rgba(255,248,247,0.72)"
                strokeWidth="2.1"
                strokeLinecap="round"
                filter="url(#silkFoldBlur)"
              />
            </g>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
