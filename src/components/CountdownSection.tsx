import { useEffect, useState } from 'react';
import { WEDDING_INFO } from '../data/weddingData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(targetIso: string): TimeLeft {
  const targetMs = new Date(targetIso).getTime();
  const nowMs = Date.now();
  const diff = targetMs - nowMs;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: false };
}

function padTwo(value: number) {
  return String(value).padStart(2, '0');
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(WEDDING_INFO.ceremonyIsoDate)
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(WEDDING_INFO.ceremonyIsoDate));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const units = [
    { label: 'DAYS', value: String(timeLeft.days) },
    { label: 'HOURS', value: padTwo(timeLeft.hours) },
    { label: 'MINUTES', value: padTwo(timeLeft.minutes) },
    { label: 'SECONDS', value: padTwo(timeLeft.seconds) },
  ];

  return (
    <section
      aria-labelledby="countdown-heading"
      className="px-6 py-12 text-center"
    >
      <div className="hairline-divider mx-auto mb-12 w-24" />

      <h2
        id="countdown-heading"
        className="font-script text-[42px] leading-tight text-[#3D3C33]"
      >
        Countdown
      </h2>
      <p className="mt-1 font-serif-editorial text-[14px] italic tracking-wide text-[#78756A]">
        To the most special day of our lives
      </p>

      {/* 4-Column Countdown Grid with Vertical Hairline Dividers */}
      <div className="mt-9 grid grid-cols-4 items-center">
        {units.map((unit, idx) => (
          <div key={unit.label} className="relative flex flex-col items-center">
            {idx > 0 && (
              <div
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-[#49483E]/16"
              />
            )}
            <span className="font-serif-editorial text-[34px] font-normal leading-none tracking-tight text-[#3D3C33] tabular-nums">
              {unit.value}
            </span>
            <span className="mt-2.5 font-serif-editorial text-[9.5px] font-medium uppercase tracking-[0.22em] text-[#78756A]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {timeLeft.isPast && (
        <p className="mt-5 font-kr text-xs text-[#6C7258]">
          오늘, 두 사람의 새로운 시작을 축복해 주셔서 감사합니다.
        </p>
      )}
    </section>
  );
}
