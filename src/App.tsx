import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { PaperTextureOverlay } from './components/PaperTextureOverlay';
import { PolaroidHero } from './components/PolaroidHero';
import { CountdownSection } from './components/CountdownSection';
import { VenueSection } from './components/VenueSection';
import { TimelineSection } from './components/TimelineSection';
import { LoveStorySection } from './components/LoveStorySection';
import { QnaSection } from './components/QnaSection';
import { RsvpSection } from './components/RsvpSection';
import { AudioToggle } from './components/AudioToggle';
import { bgmPlayer } from './utils/bgmPlayer';

export default function App() {
  const [openingStarted, setOpeningStarted] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [polaroidRevealed, setPolaroidRevealed] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Stop BGM cleanly on unmount
  useEffect(() => {
    return () => {
      bgmPlayer.stop();
    };
  }, []);

  const handleOpenStart = () => {
    setOpeningStarted(true);
    const started = bgmPlayer.start();
    if (started) {
      setIsAudioPlaying(true);
    }
  };

  const handleOpenComplete = () => {
    setEnvelopeOpened(true);
    window.requestAnimationFrame(() => {
      setPolaroidRevealed(true);
    });
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      bgmPlayer.stop();
      setIsAudioPlaying(false);
    } else {
      const started = bgmPlayer.start();
      if (started) {
        setIsAudioPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#E4DDD1] sm:py-6">
      {/* 430px Mobile Stationery Frame */}
      <main
        className={`relative mx-auto w-full max-w-[430px] paper-emboss shadow-[0_24px_80px_rgba(45,42,35,0.14)] sm:rounded-[28px] sm:border sm:border-[#49483E]/10 ${
          envelopeOpened
            ? 'min-h-dvh overflow-x-hidden'
            : 'h-dvh overflow-hidden sm:h-[calc(100dvh-3rem)]'
        }`}
      >
        {/* Subtle Embossed Cotton Paper Grain */}
        <PaperTextureOverlay opacity={0.22} />

        {/* Fixed-coordinate invitation layer: stays at exact (0,0) and fades in smoothly as envelope parts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: openingStarted ? 1 : 0 }}
          transition={{ duration: 1.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <PolaroidHero isRevealed={polaroidRevealed} />
          <CountdownSection />
          <VenueSection />
          <TimelineSection />
          <LoveStorySection />
          <QnaSection />
          <RsvpSection />
        </motion.div>

        {/* Floating BGM Mute / Play Toggle */}
        {envelopeOpened && (
          <AudioToggle isPlaying={isAudioPlaying} onToggle={handleToggleAudio} />
        )}

        {/* Envelope Overlay sitting cleanly above the invitation */}
        {!envelopeOpened && (
          <EnvelopeIntro
            onOpenStart={handleOpenStart}
            onOpenComplete={handleOpenComplete}
          />
        )}
      </main>
    </div>
  );
}
