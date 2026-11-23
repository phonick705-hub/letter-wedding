import { TIMELINE_ITEMS, WEDDING_INFO } from '../data/weddingData';

export function TimelineSection() {
  return (
    <section aria-labelledby="timeline-heading" className="px-6 py-12 text-center">
      <div className="hairline-divider mx-auto mb-12 w-24" />

      <h2
        id="timeline-heading"
        className="font-script text-[42px] leading-tight text-[#3D3C33]"
      >
        Wedding Day
      </h2>
      <p className="mt-1 font-serif-editorial text-[14px] italic tracking-wider text-[#78756A]">
        {WEDDING_INFO.ceremonyDateEn}
      </p>

      {/* Centered Vertical Timeline */}
      <div className="relative mx-auto mt-10 flex max-w-[300px] flex-col items-center">
        {/* Continuous Vertical Hairline Spine */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 top-3 left-1/2 w-px -translate-x-1/2 bg-[#49483E]/16"
        />

        <div className="flex w-full flex-col gap-9">
          {TIMELINE_ITEMS.map((item) => (
            <div
              key={item.time}
              className="relative z-10 flex flex-col items-center bg-[#F4EFE6] px-4 py-1.5"
            >
              {/* Small Minimalist Diamond Node */}
              <div
                aria-hidden="true"
                className="mb-2.5 h-2 w-2 rotate-45 border border-[#6C7258] bg-[#FAF7F2]"
              />
              <span className="font-serif-editorial text-[22px] font-medium tracking-[0.06em] text-[#3D3C33] tabular-nums">
                {item.time}
              </span>
              <span className="mt-1 font-serif-editorial text-[11px] font-medium uppercase tracking-[0.24em] text-[#6C7258]">
                {item.titleEn}
              </span>
              <span className="mt-1 font-kr text-[13px] text-[#6D6A5F]">
                {item.descriptionKr}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
