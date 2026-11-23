/**
 * 외부 음원 파일 의존성 없이 브라우저 Web Audio API로
 * 잔잔하고 서정적인 피아노/오르골 풍의 로맨틱 선율을 연주하는 BGM 컨트롤러입니다.
 */

class RomanticBgmPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private step = 0;

  // F major / D minor 서정적인 아르페지오 시퀀스 (Hz)
  private readonly sequence: Array<{ freq: number; duration: number; delayMs: number }> = [
    { freq: 349.23, duration: 1.8, delayMs: 650 }, // F4
    { freq: 440.0, duration: 1.6, delayMs: 650 },  // A4
    { freq: 523.25, duration: 1.8, delayMs: 650 }, // C5
    { freq: 659.25, duration: 2.2, delayMs: 950 }, // E5
    { freq: 587.33, duration: 1.7, delayMs: 650 }, // D5
    { freq: 523.25, duration: 1.8, delayMs: 950 }, // C5

    { freq: 293.66, duration: 1.9, delayMs: 650 }, // D4
    { freq: 349.23, duration: 1.6, delayMs: 650 }, // F4
    { freq: 440.0, duration: 1.8, delayMs: 650 },  // A4
    { freq: 587.33, duration: 2.3, delayMs: 950 }, // D5
    { freq: 523.25, duration: 1.7, delayMs: 650 }, // C5
    { freq: 440.0, duration: 2.0, delayMs: 950 },  // A4

    { freq: 392.0, duration: 1.9, delayMs: 650 },  // G4
    { freq: 466.16, duration: 1.6, delayMs: 650 }, // Bb4
    { freq: 587.33, duration: 1.8, delayMs: 650 }, // D5
    { freq: 698.46, duration: 2.4, delayMs: 950 }, // F5
    { freq: 659.25, duration: 1.8, delayMs: 650 }, // E5
    { freq: 523.25, duration: 2.2, delayMs: 1100 }, // C5
  ];

  private ensureContext() {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return true;
  }

  private playNote(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    // Warm piano/harp harmonic blend (fundamental + soft 2nd harmonic)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.08, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.045);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(noteGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  private scheduleNext = () => {
    if (!this.isPlaying) return;
    const note = this.sequence[this.step % this.sequence.length];
    this.playNote(note.freq, note.duration);
    this.step += 1;
    this.timerId = window.setTimeout(this.scheduleNext, note.delayMs);
  };

  public start() {
    if (this.isPlaying) return true;
    if (!this.ensureContext() || !this.ctx || !this.masterGain) return false;

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.32, now + 0.8);

    this.scheduleNext();
    return true;
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    }
  }

  public getPlaying() {
    return this.isPlaying;
  }
}

export const bgmPlayer = new RomanticBgmPlayer();
