// Web Audio API authentic supercar engine sound synthesizer
class EngineSoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private oscSub: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private distortion: WaveShaperNode | null = null;
  private currentRpm: number = 900;
  private targetRpm: number = 900;
  private animFrameId: number | null = null;

  private makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(4, this.ctx.currentTime);

    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(18);
    this.distortion.oversample = '4x';

    this.filter.connect(this.distortion);
    this.distortion.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  public start(type: 'v8' | 'v12' | 'flat6' | 'i6' = 'flat6') {
    this.init();
    if (!this.ctx || !this.masterGain || !this.filter) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isRunning) return;
    this.isRunning = true;

    // Harmonic base frequencies based on cylinder count
    const mult = type === 'v12' ? 1.6 : type === 'v8' ? 1.3 : 1.0;

    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(32 * mult, this.ctx.currentTime);

    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(48 * mult, this.ctx.currentTime);

    this.oscSub = this.ctx.createOscillator();
    this.oscSub.type = 'sine';
    this.oscSub.frequency.setValueAtTime(16 * mult, this.ctx.currentTime);

    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);
    this.oscSub.connect(this.filter);

    this.osc1.start();
    this.osc2.start();
    this.oscSub.start();

    // Fade in
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.35);

    this.currentRpm = 900;
    this.targetRpm = 950;
    this.updateLoop(type);
  }

  public rev(intensity: number = 1.0) {
    // Rev up to 6,000 - 8,500 RPM
    this.targetRpm = 1200 + intensity * 6800;
  }

  public idle() {
    this.targetRpm = 900 + Math.random() * 80;
  }

  private updateLoop = (type: 'v8' | 'v12' | 'flat6' | 'i6') => {
    if (!this.isRunning || !this.ctx || !this.osc1 || !this.osc2 || !this.oscSub || !this.filter) return;

    // Smooth RPM inertia
    const smoothing = this.targetRpm > this.currentRpm ? 0.14 : 0.06;
    this.currentRpm += (this.targetRpm - this.currentRpm) * smoothing;

    const baseFreq = (this.currentRpm / 60) * (type === 'v12' ? 3.0 : type === 'v8' ? 2.0 : 1.5);
    const now = this.ctx.currentTime;

    this.osc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.osc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.05);
    this.oscSub.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.05);

    // Filter opens up as RPM climbs
    const filterFreq = Math.min(6500, 300 + (this.currentRpm / 8500) * 4500);
    this.filter.frequency.setTargetAtTime(filterFreq, now, 0.08);

    this.animFrameId = requestAnimationFrame(() => this.updateLoop(type));
  };

  public stop() {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;
    this.isRunning = false;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);

    setTimeout(() => {
      try {
        this.osc1?.stop();
        this.osc2?.stop();
        this.oscSub?.stop();
        this.osc1?.disconnect();
        this.osc2?.disconnect();
        this.oscSub?.disconnect();
      } catch {
        // Safe ignore
      }
      this.osc1 = null;
      this.osc2 = null;
      this.oscSub = null;
    }, 350);
  }

  public getIsRunning() {
    return this.isRunning;
  }
}

export const engineSound = new EngineSoundEngine();
