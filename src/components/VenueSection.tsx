import { useState } from 'react';
import { CalendarPlus, Check, Copy, ExternalLink, MapPin, Navigation, Plus, Minus } from 'lucide-react';
import { WEDDING_INFO } from '../data/weddingData';

export function VenueSection() {
  const [showDirectionsDrawer, setShowDirectionsDrawer] = useState(false);
  const [zoom, setZoom] = useState<number>(1);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [calendarSaved, setCalendarSaved] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        `${WEDDING_INFO.venue.nameKr} (${WEDDING_INFO.venue.addressKr})`
      );
      setCopiedAddress(true);
      window.setTimeout(() => setCopiedAddress(false), 2400);
    } catch {
      // Fallback ignored in restricted clipboard environments
    }
  };

  const handleAddToCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jaehyun & Haeun Wedding//Invitation//KO',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:jaehyun-haeun-wedding-20270529@wedding-invite',
      'DTSTAMP:20261123T000000Z',
      'DTSTART;TZID=Asia/Seoul:20270529T140000',
      'DTEND;TZID=Asia/Seoul:20270529T160000',
      'SUMMARY:김재현 ♥ 정하은 결혼식 (Jaehyun & Haeun Wedding)',
      `LOCATION:${WEDDING_INFO.venue.nameKr} (${WEDDING_INFO.venue.addressKr})`,
      'DESCRIPTION:신랑 김재현 · 신부 정하은의 결혼식에 소중한 분들을 초대합니다. (오후 1시 30분 하객 맞이 / 오후 2시 본식)',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jaehyun_Haeun_Wedding_20270529.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCalendarSaved(true);
    window.setTimeout(() => setCalendarSaved(false), 3500);
  };

  const googleCalendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' +
    encodeURIComponent('김재현 ♥ 정하은 결혼식') +
    '&dates=20270529T050000Z/20270529T070000Z' +
    '&location=' +
    encodeURIComponent(`${WEDDING_INFO.venue.nameKr} (${WEDDING_INFO.venue.addressKr})`) +
    '&details=' +
    encodeURIComponent('신랑 김재현 · 신부 정하은의 결혼식에 초대합니다.');

  return (
    <section aria-labelledby="venue-heading" className="px-6 py-12 text-center">
      <div className="hairline-divider mx-auto mb-12 w-24" />

      <p
        id="venue-heading"
        className="font-serif-editorial text-[11px] font-medium uppercase tracking-[0.28em] text-[#6D6A5F]"
      >
        THE VENUE
      </p>

      <h2 className="mt-2.5 font-script text-[42px] leading-tight text-[#3D3C33]">
        {WEDDING_INFO.venue.titleEn}
      </h2>

      <p className="mt-2 font-kr text-[14px] font-normal text-[#3D3C33]">
        {WEDDING_INFO.venue.nameKr}
      </p>
      <p className="mt-0.5 font-kr text-[12.5px] text-[#78756A]">
        ({WEDDING_INFO.venue.addressKr}) · {WEDDING_INFO.venue.hallDetailKr}
      </p>

      {/* Rounded Architectural Mini Map View (영등포역 인근) */}
      <div className="relative mt-7 overflow-hidden rounded-2xl border border-[#49483E]/15 bg-[#EFEAE0] shadow-[0_6px_22px_rgba(61,60,51,0.06)]">
        {/* Interactive Zoom Controls */}
        <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-lg border border-[#49483E]/15 bg-[#FAF7F2]/90 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.2).toFixed(1))))}
            aria-label="지도 확대"
            className="flex h-9 w-9 items-center justify-center text-[#49483E] transition-colors hover:bg-[#EFEAE0]"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <div className="h-px bg-[#49483E]/12" />
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(1))))}
            aria-label="지도 축소"
            className="flex h-9 w-9 items-center justify-center text-[#49483E] transition-colors hover:bg-[#EFEAE0]"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* SVG Map Canvas */}
        <div className="h-[224px] w-full overflow-hidden">
          <svg
            viewBox="0 0 380 230"
            className="h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})`, transformOrigin: '52% 48%' }}
            role="img"
            aria-label="웨딩그룹위더스 영등포 약도 - 1호선 영등포역 및 5호선 영등포시장역 인근"
          >
            {/* Base parchment terrain */}
            <rect width="380" height="230" fill="#F2EDE4" />

            {/* City Blocks */}
            <rect x="22" y="18" width="94" height="58" rx="6" fill="#E9E2D4" />
            <rect x="134" y="18" width="110" height="58" rx="6" fill="#E9E2D4" />
            <rect x="262" y="18" width="96" height="58" rx="6" fill="#E5DEC9" />
            <rect x="22" y="96" width="94" height="64" rx="6" fill="#E9E2D4" />
            <rect x="134" y="96" width="110" height="64" rx="6" fill="#EAE3D6" />
            <rect x="262" y="96" width="96" height="64" rx="6" fill="#E9E2D4" />
            <rect x="22" y="176" width="336" height="40" rx="6" fill="#E4DDD0" />

            {/* Subtle Park Accent */}
            <rect x="272" y="106" width="76" height="44" rx="8" fill="#DCE0D0" />

            {/* Main Roads */}
            {/* 영등포로 (Horizontal main avenue) */}
            <path d="M 0 86 L 380 86" stroke="#FAF7F2" strokeWidth="14" />
            <path d="M 0 86 L 380 86" stroke="#D5CCBC" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />

            {/* 영중로 (Vertical avenue) */}
            <path d="M 125 0 L 125 230" stroke="#FAF7F2" strokeWidth="12" />
            {/* 경인로 (Lower horizontal avenue near Yeongdeungpo Station) */}
            <path d="M 0 168 L 380 168" stroke="#FAF7F2" strokeWidth="14" />
            {/* 국회대로 / 영신로 */}
            <path d="M 253 0 L 253 230" stroke="#FAF7F2" strokeWidth="10" />

            {/* Yeongdeungpo Rotary subtle circle */}
            <circle cx="253" cy="86" r="14" fill="#F2EDE4" stroke="#FAF7F2" strokeWidth="7" />

            {/* Road Labels */}
            <text
              x="64"
              y="89"
              textAnchor="middle"
              fontSize="8.5"
              fill="#7A766A"
              fontFamily="Gowun Batang, serif"
            >
              영등포로
            </text>
            <text
              x="125"
              y="132"
              textAnchor="middle"
              fontSize="8"
              fill="#8B877B"
              transform="rotate(-90 125 132)"
              fontFamily="Gowun Batang, serif"
            >
              영중로
            </text>
            <text
              x="310"
              y="171"
              textAnchor="middle"
              fontSize="8.5"
              fill="#7A766A"
              fontFamily="Gowun Batang, serif"
            >
              경인로
            </text>

            {/* Subway Station: 5호선 영등포시장역 */}
            <g transform="translate(132, 34)">
              <circle cx="0" cy="0" r="8" fill="#8B6FA8" />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#FFFFFF"
                fontFamily="sans-serif"
              >
                5
              </text>
              <text
                x="13"
                y="3"
                fontSize="9.5"
                fontWeight="600"
                fill="#49483E"
                fontFamily="Gowun Batang, serif"
              >
                영등포시장역
              </text>
              <text
                x="13"
                y="14"
                fontSize="7.5"
                fill="#78756A"
                fontFamily="Gowun Batang, serif"
              >
                3번 출구 도보 5분
              </text>
            </g>

            {/* Subway Station: 1호선 영등포역 */}
            <g transform="translate(154, 194)">
              <rect x="-32" y="-12" width="118" height="24" rx="5" fill="#F7F3EB" stroke="#49483E" strokeOpacity="0.18" />
              <circle cx="-18" cy="0" r="7.5" fill="#3B5B8C" />
              <text
                x="-18"
                y="3"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#FFFFFF"
                fontFamily="sans-serif"
              >
                1
              </text>
              <text
                x="-5"
                y="3.5"
                fontSize="10"
                fontWeight="700"
                fill="#3D3C33"
                fontFamily="Gowun Batang, serif"
              >
                영등포역 (5번 출구)
              </text>
            </g>

            {/* Walking Path Dotted Guide */}
            <path
              d="M 186 182 L 186 112"
              stroke="#6C7258"
              strokeWidth="1.6"
              strokeDasharray="3 3"
              opacity="0.7"
            />
            <path
              d="M 134 45 L 186 84"
              stroke="#6C7258"
              strokeWidth="1.6"
              strokeDasharray="3 3"
              opacity="0.7"
            />

            {/* Venue Pin: 웨딩그룹위더스 영등포 */}
            <g transform="translate(188, 92)">
              {/* Subtle outer halo */}
              <circle cx="0" cy="0" r="18" fill="#6C7258" opacity="0.14" />
              <circle cx="0" cy="0" r="10" fill="#6C7258" opacity="0.22" />
              {/* Pin Body */}
              <path
                d="M 0 -20 C -7.5 -20, -13 -14.2, -13 -7.2 C -13 1.5, 0 11, 0 11 C 0 11, 13 1.5, 13 -7.2 C 13 -14.2, 7.5 -20, 0 -20 Z"
                fill="#5E644B"
                stroke="#FAF7F2"
                strokeWidth="1.6"
              />
              <circle cx="0" cy="-7.5" r="4" fill="#FAF7F2" />

              {/* Venue Label Card */}
              <rect
                x="-64"
                y="16"
                width="128"
                height="24"
                rx="4"
                fill="#FAF7F2"
                stroke="#5E644B"
                strokeOpacity="0.35"
              />
              <text
                x="0"
                y="31.5"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#3D3C33"
                fontFamily="Gowun Batang, serif"
              >
                웨딩그룹위더스 영등포
              </text>
            </g>
          </svg>
        </div>

        {/* Clean Unboxed Transit Caption Strip */}
        <div className="border-t border-[#49483E]/10 bg-[#F7F3EB] px-4 py-2.5 text-[11.5px] text-[#6D6A5F]">
          <span>1호선 영등포역 5번 출구 5분</span>
          <span aria-hidden="true" className="mx-2 text-[#A59F90]">
            ·
          </span>
          <span>5호선 영등포시장역 3번 출구 5분</span>
        </div>
      </div>

      {/* 2 Full-Width Action Buttons */}
      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowDirectionsDrawer((prev) => !prev)}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#5E644B] px-5 py-3 text-[#FAF7F2] transition-colors hover:bg-[#4F553F] active:scale-[0.99]"
        >
          <Navigation className="h-4 w-4" />
          <span className="font-serif-editorial text-[12px] font-medium uppercase tracking-[0.2em]">
            GET DIRECTIONS
          </span>
          <span className="font-kr text-[12px] opacity-90">(길찾기)</span>
        </button>

        {/* Inline Expandable Map App Links */}
        {showDirectionsDrawer && (
          <div className="rounded-xl border border-[#49483E]/15 bg-[#FAF7F2] p-3 text-left shadow-sm">
            <div className="grid grid-cols-3 gap-2">
              <a
                href={WEDDING_INFO.venue.naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-1 rounded-lg border border-[#49483E]/12 bg-[#F4EFE6] px-2 py-2 font-kr text-[12px] text-[#3D3C33] transition-colors hover:bg-[#EAE3D5]"
              >
                <span>네이버 지도</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
              <a
                href={WEDDING_INFO.venue.kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-1 rounded-lg border border-[#49483E]/12 bg-[#F4EFE6] px-2 py-2 font-kr text-[12px] text-[#3D3C33] transition-colors hover:bg-[#EAE3D5]"
              >
                <span>카카오맵</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
              <a
                href={WEDDING_INFO.venue.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-1 rounded-lg border border-[#49483E]/12 bg-[#F4EFE6] px-2 py-2 font-kr text-[12px] text-[#3D3C33] transition-colors hover:bg-[#EAE3D5]"
              >
                <span>Google Map</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="mt-2 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-[#49483E]/12 px-3 py-2 font-kr text-[12px] text-[#5B584E] transition-colors hover:bg-[#F4EFE6]"
            >
              {copiedAddress ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#5E644B]" />
                  <span className="text-[#5E644B]">주소가 클립보드에 복사되었습니다</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{WEDDING_INFO.venue.addressKr} 주소 복사하기</span>
                </>
              )}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCalendar}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#5E644B]/45 bg-[#FAF7F2]/75 px-5 py-3 text-[#49483E] transition-colors hover:bg-[#EFEAE0] active:scale-[0.99]"
        >
          <CalendarPlus className="h-4 w-4 text-[#5E644B]" />
          <span className="font-serif-editorial text-[12px] font-medium uppercase tracking-[0.2em]">
            ADD TO CALENDAR
          </span>
          <span className="font-kr text-[12px] text-[#6D6A5F]">(캘린더에 추가)</span>
        </button>

        {calendarSaved && (
          <div className="flex flex-col items-center gap-1 pt-1 text-[12px] text-[#5E644B]">
            <div className="flex items-center gap-1.5 font-kr">
              <MapPin className="h-3.5 w-3.5" />
              <span>2027.05.29 14:00 일정 파일(.ics)이 저장되었습니다.</span>
            </div>
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-kr text-[11.5px] underline underline-offset-4 hover:text-[#3D3C33]"
            >
              Google 캘린더에 바로 등록하기
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
