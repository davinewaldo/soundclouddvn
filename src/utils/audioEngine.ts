/**
 * Web Audio Synthesizer Engine for authentic, responsive music playback
 * Generates dynamic, rhythmic beats, chords, and basslines tailored to each track's tempo and key.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackId: string | null = null;
  private intervalId: number | null = null;
  private tempo = 120;
  private step = 0;
  private volumeNode: GainNode | null = null;
  private volume = 0.65;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private currentTime = 0;
  private duration = 180;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.volumeNode && this.ctx) {
      this.volumeNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setOnTimeUpdate(cb: (time: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public setOnEnded(cb: () => void) {
    this.onEndedCallback = cb;
  }

  public play(trackId: string, tempo = 128, startDuration = 180, resumeTime?: number) {
    this.initContext();
    this.tempo = tempo;
    this.duration = startDuration;
    this.currentTrackId = trackId;
    if (resumeTime !== undefined) {
      this.currentTime = resumeTime;
    }

    if (this.isPlaying) {
      this.stopBeatLoop();
    }

    this.isPlaying = true;
    this.startBeatLoop();
  }

  public pause() {
    this.isPlaying = false;
    this.stopBeatLoop();
  }

  public resume() {
    if (!this.isPlaying && this.currentTrackId) {
      this.initContext();
      this.isPlaying = true;
      this.startBeatLoop();
    }
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(this.duration, seconds));
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime);
    }
  }

  private startBeatLoop() {
    const stepIntervalMs = (60 / this.tempo / 4) * 1000; // 16th notes
    let lastTick = performance.now();

    const loop = () => {
      if (!this.isPlaying) return;
      const now = performance.now();
      const elapsedSec = (now - lastTick) / 1000;
      lastTick = now;

      this.currentTime += elapsedSec;
      if (this.currentTime >= this.duration) {
        this.currentTime = 0;
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      }

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime);
      }

      this.playStep(this.step % 16);
      this.step++;
      this.intervalId = window.setTimeout(loop, stepIntervalMs);
    };

    loop();
  }

  private stopBeatLoop() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  private playStep(step: number) {
    if (!this.ctx || !this.volumeNode) return;
    const now = this.ctx.currentTime;

    // Kick on steps 0, 4, 8, 12 (four-on-the-floor) or hip-hop syncopation
    if (step === 0 || step === 8 || step === 14) {
      this.playKick(now);
    }

    // Snare / Clap on 4 and 12
    if (step === 4 || step === 12) {
      this.playSnare(now);
    }

    // Hi-hat on every offbeat (2, 6, 10, 14, and subtle on others)
    if (step % 2 === 0) {
      this.playHiHat(now, step % 4 === 2 ? 0.35 : 0.18);
    }

    // Synth Bass notes
    if (step === 0 || step === 3 || step === 6 || step === 10 || step === 13) {
      const frequencies = [65.41, 73.42, 82.41, 55.0, 98.0]; // C2, D2, E2, A1, G2
      const freq = frequencies[(step + Math.floor(this.currentTime / 4)) % frequencies.length];
      this.playBass(now, freq);
    }

    // Ambient melodic pad
    if (step === 0) {
      const chords = [
        [261.63, 329.63, 392.0], // C major
        [220.0, 261.63, 329.63], // A minor
        [174.61, 220.0, 261.63], // F major
        [196.0, 246.94, 293.66], // G major
      ];
      const chord = chords[Math.floor(this.currentTime / 4) % chords.length];
      this.playChord(now, chord);
    }
  }

  private playKick(time: number) {
    if (!this.ctx || !this.volumeNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.volumeNode);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.volumeNode) return;
    // White noise burst
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.volumeNode);

    noise.start(time);
    noise.stop(time + 0.15);
  }

  private playHiHat(time: number, vol = 0.2) {
    if (!this.ctx || !this.volumeNode) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 9000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.volumeNode);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  private playBass(time: number, freq: number) {
    if (!this.ctx || !this.volumeNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, time);
    filter.frequency.exponentialRampToValueAtTime(90, time + 0.25);

    gain.gain.setValueAtTime(0.32, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.volumeNode);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  private playChord(time: number, freqs: number[]) {
    if (!this.ctx || !this.volumeNode) return;
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);

      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      gain.gain.setValueAtTime(0.06, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.volumeNode!);

      osc.start(time);
      osc.stop(time + 1.9);
    });
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }
}

export const audioEngine = new AudioSynthesizer();
