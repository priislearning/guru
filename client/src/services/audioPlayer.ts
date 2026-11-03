/**
 * AudioPlayer: Web Audio API engine with AnalyserNode for real-time lip-sync
 */
export class AudioPlayer {
  private ctx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: any = null;
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private duration: number = 0;
  private animFrameId: number | null = null;
  private currentAmplitude: number = 0;

  constructor() {
    // Unblock browser Web Audio autoplay policy on first user interaction
    if (typeof window !== "undefined") {
      const unlock = () => {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener("click", unlock, { passive: true });
      window.addEventListener("keydown", unlock, { passive: true });
      window.addEventListener("touchstart", unlock, { passive: true });
    }
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Play base64 WAV or MP3 audio through Web Audio API
   * Returns duration in seconds
   */
  async playAudio(
    base64Audio: string,
    onEnded?: () => void,
    onTimeUpdate?: (currentTime: number, progress: number) => void
  ): Promise<number> {
    this.stop();

    try {
      const ctx = this.initContext();

      // Convert base64 to binary ArrayBuffer
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBuffer = await ctx.decodeAudioData(bytes.buffer);

      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.75;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.analyser);
      this.analyser.connect(ctx.destination);

      this.currentSource = source;
      this.duration = audioBuffer.duration;
      this.startTime = ctx.currentTime;
      this.isPlaying = true;

      source.onended = () => {
        this.isPlaying = false;
        this.currentAmplitude = 0;
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
          this.animFrameId = null;
        }
        if (onEnded) onEnded();
      };

      source.start(0);
      return audioBuffer.duration;

      // Animation tick to sample amplitude and update time
      const tick = () => {
        if (!this.isPlaying || !this.analyser || !this.dataArray) {
          this.currentAmplitude = 0;
          return;
        }

        this.analyser.getByteFrequencyData(this.dataArray);

        // Vocal frequencies (roughly bins 2 to 40 in 256 FFT at 24/44.1kHz)
        let sum = 0;
        const count = Math.min(this.dataArray.length, 36);
        for (let i = 2; i < count; i++) {
          sum += this.dataArray[i];
        }
        const avg = count > 2 ? sum / (count - 2) : 0;
        // Normalize: typical vocal range is 20..160
        const rawAmp = Math.max(0, (avg - 15) / 110);
        // Exponential smoothing for natural mouth articulation
        this.currentAmplitude = this.currentAmplitude * 0.4 + Math.min(1.0, rawAmp) * 0.6;

        if (onTimeUpdate && this.ctx) {
          const elapsed = this.ctx.currentTime - this.startTime;
          const progress = Math.min(1.0, elapsed / (this.duration || 1));
          onTimeUpdate(elapsed, progress);
        }

        this.animFrameId = requestAnimationFrame(tick);
      };

      this.animFrameId = requestAnimationFrame(tick);
    } catch (err: any) {
      console.warn("Web Audio decode/play error:", err);
      // Fallback: simulate lip movement for estimated duration if decode failed
      const fallbackDuration = Math.max(3, base64Audio.length * 0.00008);
      this.simulateSpeechLipSync(fallbackDuration, onEnded, onTimeUpdate);
      return fallbackDuration;
    }
  }

  /**
   * Returns instantaneous mouth openness amplitude (0.0 = closed, 1.0 = wide open)
   */
  getAmplitude(): number {
    return this.currentAmplitude;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // ignore already stopped
      }
      this.currentSource = null;
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.isPlaying = false;
    this.currentAmplitude = 0;
  }

  /**
   * Fallback simulator if browser audio decoder encounters unsupported format
   */
  private simulateSpeechLipSync(
    durationSec: number = 3.0,
    onEnded?: () => void,
    onTimeUpdate?: (currentTime: number, progress: number) => void
  ) {
    this.isPlaying = true;
    const start = performance.now();
    const durationMs = Math.max(2000, durationSec * 1000);

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1.0, elapsed / durationMs);

      if (elapsed >= durationMs) {
        this.isPlaying = false;
        this.currentAmplitude = 0;
        if (onEnded) onEnded();
        return;
      }

      // Syllable rhythm oscillation: ~4.5 Hz with randomness
      const osc = Math.sin(elapsed * 0.028) * Math.sin(elapsed * 0.012);
      this.currentAmplitude = Math.max(0, osc * 0.8 + 0.2);

      if (onTimeUpdate) {
        onTimeUpdate(elapsed / 1000, progress);
      }

      this.animFrameId = requestAnimationFrame(step);
    };

    this.animFrameId = requestAnimationFrame(step);
  }
}

export const audioPlayer = new AudioPlayer();
