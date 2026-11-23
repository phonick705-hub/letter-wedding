import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Copy } from 'lucide-react';
import { QNA_ITEMS } from '../data/weddingData';

export function QnaSection() {
  const [openId, setOpenId] = useState<string | null>(QNA_ITEMS[0]?.id ?? null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleCopyAccount = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);
      window.setTimeout(() => setCopiedAccount(null), 2200);
    } catch {
      // Fallback ignored if clipboard permissions are blocked
    }
  };

  return (
    <section aria-labelledby="qna-heading" className="px-6 py-12">
      <div className="hairline-divider mx-auto mb-12 w-24" />

      <div className="text-center">
        <h2
          id="qna-heading"
          className="font-script text-[40px] leading-tight text-[#3D3C33]"
        >
          Questions &amp; Answers
        </h2>
        <p className="mt-1 font-serif-editorial text-[14px] italic tracking-wide text-[#78756A]">
          Good to know
        </p>
      </div>

      <div className="mt-9 divide-y divide-[#49483E]/12 border-y border-[#49483E]/12">
        {QNA_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="py-1">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`qna-panel-${item.id}`}
                className="flex min-h-[52px] w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-[#5E644B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#6C7258]"
              >
                <span className="font-kr text-[14.5px] font-bold text-[#3D3C33]">
                  {item.question}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 text-[#78756A] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#5E644B]' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`qna-panel-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5 pt-1 text-left">
                      <p className="font-kr text-[13px] leading-[1.8] text-[#5F5C52] break-keep">
                        {item.answer}
                      </p>

                      {item.subDetails && item.subDetails.length > 0 && (
                        <ul className="mt-2.5 flex flex-col gap-1.5 border-t border-[#49483E]/8 pt-2.5">
                          {item.subDetails.map((detail) => (
                            <li
                              key={detail}
                              className="font-kr text-[12px] leading-[1.7] text-[#78756A] break-keep"
                            >
                              · {detail}
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.accounts && item.accounts.length > 0 && (
                        <div className="mt-3.5 flex flex-col gap-2">
                          {item.accounts.map((acc) => {
                            const isCopied = copiedAccount === acc.number;
                            return (
                              <div
                                key={acc.number}
                                className="flex items-center justify-between gap-3 rounded-lg border border-[#49483E]/12 bg-[#FAF7F2]/80 px-3.5 py-2.5"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 font-kr text-[12px] text-[#78756A]">
                                    <span>{acc.role}</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-bold text-[#3D3C33]">
                                      {acc.holder}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 font-kr text-[12.5px] text-[#49483E] tabular-nums">
                                    {acc.bank} {acc.number}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyAccount(acc.number)}
                                  className="flex min-h-[36px] shrink-0 items-center gap-1 rounded-md border border-[#49483E]/15 bg-[#F4EFE6] px-2.5 py-1.5 font-kr text-[11px] text-[#49483E] transition-colors hover:bg-[#EAE3D5]"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="h-3 w-3 text-[#5E644B]" />
                                      <span className="text-[#5E644B]">복사됨</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>복사</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
