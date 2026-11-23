import { LOVE_STORY_ITEMS } from '../data/weddingData';

export function LoveStorySection() {
  return (
    <section aria-labelledby="love-story-heading" className="px-7 py-12 text-center">
      <div className="hairline-divider mx-auto mb-12 w-24" />

      <p
        id="love-story-heading"
        className="font-serif-editorial text-[11px] font-medium uppercase tracking-[0.28em] text-[#6D6A5F]"
      >
        OUR LOVE STORY
      </p>
      <h2 className="mt-2 font-script text-[40px] leading-tight text-[#3D3C33]">
        How it all began
      </h2>

      <div className="mt-10 flex flex-col gap-10">
        {LOVE_STORY_ITEMS.map((chapter, index) => (
          <article key={chapter.id} className="flex flex-col items-center">
            {index > 0 && (
              <div
                aria-hidden="true"
                className="mb-8 h-5 w-px bg-[#49483E]/16"
              />
            )}

            <span className="font-script text-[30px] leading-none text-[#6C7258]">
              {chapter.dateLabel}
            </span>

            <h3 className="mt-2.5 font-kr text-[14.5px] font-bold tracking-wide text-[#3D3C33]">
              {chapter.titleKr}
            </h3>

            <p className="mt-2.5 max-w-[330px] font-kr text-[13.5px] leading-[1.85] text-[#5F5C52] break-keep">
              {chapter.storyKr}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
