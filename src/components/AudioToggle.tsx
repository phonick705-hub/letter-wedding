import { Volume2, VolumeX } from 'lucide-react';

interface AudioToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function AudioToggle({ isPlaying, onToggle }: AudioToggleProps) {
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 justify-end px-5 sm:bottom-10">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? '배경음악 음소거' : '배경음악 재생'}
        aria-pressed={isPlaying}
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#49483E]/20 bg-[#EAE3D5]/80 text-[#49483E] shadow-[0_4px_16px_rgba(61,60,51,0.12)] backdrop-blur-md transition-colors hover:bg-[#E2D9C8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E644B]"
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4 text-[#4F553F]" />
        ) : (
          <VolumeX className="h-4 w-4 text-[#78756A]" />
        )}
      </button>
    </div>
  );
}
