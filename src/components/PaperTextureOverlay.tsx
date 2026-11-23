/**
 * 실제 엠보싱 코튼 종이 질감을 표현하기 위한 SVG 필터 오버레이.
 * pointer-events-none으로 인터랙션에 영향을 주지 않습니다.
 */
export function PaperTextureOverlay({ opacity = 0.22 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full select-none mix-blend-multiply"
      style={{ opacity }}
    >
      <filter id="cotton-paper-emboss">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="4"
          seed="7"
          result="noise"
        />
        <feDiffuseLighting
          in="noise"
          lightingColor="#fffdf7"
          surfaceScale="1.35"
          result="light"
        >
          <feDistantLight azimuth="48" elevation="62" />
        </feDiffuseLighting>
      </filter>
      <rect width="100%" height="100%" filter="url(#cotton-paper-emboss)" />
    </svg>
  );
}
