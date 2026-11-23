import { useEffect, useState, FormEvent } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { WEDDING_INFO } from '../data/weddingData';

export interface RsvpSubmission {
  id: string;
  fullName: string;
  contact: string;
  attending: boolean;
  guestsCount: number;
  message: string;
  submittedAt: string;
}

const STORAGE_KEY = 'jaehyun_haeun_rsvp_v1';

export function RsvpSection() {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<RsvpSubmission | null>(null);
  const [savedList, setSavedList] = useState<RsvpSubmission[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RsvpSubmission[];
        if (Array.isArray(parsed)) {
          setSavedList(parsed);
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedContact = contact.trim();

    if (!trimmedName) {
      setErrorMsg('성함을 입력해 주세요.');
      return;
    }
    if (!trimmedContact) {
      setErrorMsg('연락처 또는 이메일을 입력해 주세요.');
      return;
    }

    setErrorMsg(null);
    const newEntry: RsvpSubmission = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: trimmedName,
      contact: trimmedContact,
      attending,
      guestsCount: attending ? guestsCount : 0,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    const nextList = [newEntry, ...savedList];
    setSavedList(nextList);
    setSubmittedRecord(newEntry);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      // Ignore storage write errors
    }

    setFullName('');
    setContact('');
    setAttending(true);
    setGuestsCount(1);
    setMessage('');
  };

  return (
    <section aria-labelledby="rsvp-heading" className="px-6 pt-12 pb-20">
      <div className="hairline-divider mx-auto mb-12 w-24" />

      <div className="text-center">
        <h2
          id="rsvp-heading"
          className="font-script text-[40px] leading-tight text-[#3D3C33]"
        >
          Confirm your presence
        </h2>
        <p className="mt-1 font-serif-editorial text-[14px] italic tracking-wide text-[#78756A]">
          {WEDDING_INFO.rsvpDeadlineEn}
        </p>
      </div>

      {submittedRecord ? (
        <div className="mt-9 rounded-2xl border border-[#5E644B]/25 bg-[#FAF7F2] p-6 text-center shadow-[0_8px_24px_rgba(61,60,51,0.06)]">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#5E644B]/12 text-[#5E644B]">
            <Check className="h-5 w-5" />
          </div>
          <h3 className="mt-3.5 font-kr text-[16px] font-bold text-[#3D3C33]">
            소중한 회신에 감사드립니다
          </h3>
          <p className="mt-2 font-kr text-[13px] leading-[1.75] text-[#5F5C52]">
            {submittedRecord.fullName}님의{' '}
            {submittedRecord.attending
              ? `참석 의사 (총 ${submittedRecord.guestsCount}명)`
              : '따뜻한 축하의 마음'}
            이 정상적으로 저장되었습니다.
          </p>
          {submittedRecord.message && (
            <p className="mt-3 border-t border-[#49483E]/10 pt-3 font-kr text-[12.5px] italic text-[#78756A]">
              “{submittedRecord.message}”
            </p>
          )}
          <button
            type="button"
            onClick={() => setSubmittedRecord(null)}
            className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[#49483E]/20 px-5 py-2 font-kr text-[12.5px] text-[#49483E] transition-colors hover:bg-[#EFEAE0]"
          >
            추가로 응답 작성하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-5" noValidate>
          {/* Full Name */}
          <div>
            <label
              htmlFor="rsvp-name"
              className="block font-kr text-[12.5px] font-bold text-[#49483E]"
            >
              성함 (Full Name) <span className="text-[#8C5E58]">*</span>
            </label>
            <input
              id="rsvp-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="예: 홍길동"
              className="mt-1.5 min-h-[46px] w-full rounded-xl border border-[#49483E]/18 bg-[#FAF7F2]/85 px-4 py-2.5 font-kr text-[14px] text-[#3D3C33] placeholder:text-[#A49F92] focus:border-[#5E644B] focus:outline-none focus:ring-1 focus:ring-[#5E644B]"
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="rsvp-contact"
              className="block font-kr text-[12.5px] font-bold text-[#49483E]"
            >
              연락처 또는 이메일 <span className="text-[#8C5E58]">*</span>
            </label>
            <input
              id="rsvp-contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="예: 010-1234-5678 또는 email@example.com"
              className="mt-1.5 min-h-[46px] w-full rounded-xl border border-[#49483E]/18 bg-[#FAF7F2]/85 px-4 py-2.5 font-kr text-[14px] text-[#3D3C33] placeholder:text-[#A49F92] focus:border-[#5E644B] focus:outline-none focus:ring-1 focus:ring-[#5E644B]"
            />
          </div>

          {/* Attendance Toggle */}
          <div>
            <span className="block font-kr text-[12.5px] font-bold text-[#49483E]">
              참석 여부
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`min-h-[46px] rounded-xl border px-3 py-2.5 font-kr text-[13px] transition-colors ${
                  attending
                    ? 'border-[#5E644B] bg-[#5E644B] text-[#FAF7F2]'
                    : 'border-[#49483E]/18 bg-[#FAF7F2]/75 text-[#5B584E] hover:bg-[#EFEAE0]'
                }`}
              >
                참석합니다
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`min-h-[46px] rounded-xl border px-3 py-2.5 font-kr text-[13px] transition-colors ${
                  !attending
                    ? 'border-[#5E644B] bg-[#5E644B] text-[#FAF7F2]'
                    : 'border-[#49483E]/18 bg-[#FAF7F2]/75 text-[#5B584E] hover:bg-[#EFEAE0]'
                }`}
              >
                마음으로 축하합니다
              </button>
            </div>
          </div>

          {/* Guests Count */}
          {attending && (
            <div className="flex items-center justify-between rounded-xl border border-[#49483E]/15 bg-[#FAF7F2]/75 px-4 py-2.5">
              <div>
                <span className="block font-kr text-[13px] font-bold text-[#49483E]">
                  동반 인원 수
                </span>
                <span className="font-kr text-[11.5px] text-[#78756A]">
                  본인 포함 총 인원
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuestsCount((c) => Math.max(1, c - 1))}
                  aria-label="인원 줄이기"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#49483E]/18 bg-[#F4EFE6] text-[#3D3C33] transition-colors hover:bg-[#EAE3D5]"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[36px] text-center font-serif-editorial text-[19px] text-[#3D3C33] tabular-nums">
                  {guestsCount}명
                </span>
                <button
                  type="button"
                  onClick={() => setGuestsCount((c) => Math.min(10, c + 1))}
                  aria-label="인원 늘리기"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#49483E]/18 bg-[#F4EFE6] text-[#3D3C33] transition-colors hover:bg-[#EAE3D5]"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Congratulatory Message */}
          <div>
            <label
              htmlFor="rsvp-message"
              className="block font-kr text-[12.5px] font-bold text-[#49483E]"
            >
              신랑·신부에게 남기는 축하 메시지
            </label>
            <textarea
              id="rsvp-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="따뜻한 축하의 한마디를 남겨주세요."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#49483E]/18 bg-[#FAF7F2]/85 px-4 py-3 font-kr text-[13.5px] leading-relaxed text-[#3D3C33] placeholder:text-[#A49F92] focus:border-[#5E644B] focus:outline-none focus:ring-1 focus:ring-[#5E644B]"
            />
          </div>

          {errorMsg && (
            <p role="alert" className="font-kr text-[12.5px] text-[#8C4A43]">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="mt-1 flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#5E644B] px-6 py-3.5 font-kr text-[14px] font-bold tracking-wide text-[#FAF7F2] transition-colors hover:bg-[#4F553F] active:scale-[0.99]"
          >
            참석 의사 전달하기
          </button>
        </form>
      )}

      {/* Saved Guest Responses / Messages Preview */}
      {savedList.length > 0 && (
        <div className="mt-10 border-t border-[#49483E]/12 pt-7">
          <div className="flex items-center justify-between text-[12px] text-[#78756A]">
            <span className="font-kr font-bold text-[#49483E]">남겨진 축하의 마음</span>
            <span className="font-serif-editorial tabular-nums">
              {savedList.length}건 저장됨
            </span>
          </div>
          <div className="mt-3.5 flex flex-col gap-2.5">
            {savedList.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-[#49483E]/10 bg-[#FAF7F2]/70 px-4 py-3 text-left"
              >
                <div className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="font-kr font-bold text-[#3D3C33]">
                    {entry.fullName}
                  </span>
                  <span className="font-kr text-[#6D6A5F]">
                    {entry.attending ? `참석 · ${entry.guestsCount}명` : '마음으로 축하'}
                  </span>
                </div>
                {entry.message && (
                  <p className="mt-1.5 font-kr text-[12.5px] leading-relaxed text-[#5F5C52]">
                    {entry.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Footer Signature */}
      <footer className="mt-14 text-center">
        <div className="hairline-divider mx-auto mb-8 w-16" />
        <p className="font-script text-[32px] text-[#49483E]">
          {WEDDING_INFO.coupleNameEn}
        </p>
        <p className="mt-1 font-serif-editorial text-[10px] uppercase tracking-[0.26em] text-[#8C887B]">
          {WEDDING_INFO.ceremonyDateEn} · SEOUL
        </p>
      </footer>
    </section>
  );
}
