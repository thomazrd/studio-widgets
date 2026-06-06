export const TIMBRES = [
  'Sine', 'Square', 'Sawtooth', 'Triangle', 'Organ',
  'Strings', 'Brass', 'Flute', 'Clarinet', 'Synth Bass',
  'E-Piano', 'Plucked', 'Choir', 'Lead', 'Pad'
];

export class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.currentOscillators = new Map(); // frequency -> oscillator config

    // Pitch detection
    this.analyser = null;
    this.micStream = null;
    this.pitchDetectInterval = null;
    this.onPitchDetected = null;

    // Metronome
    this.isPlayingMetronome = false;
    this.bpm = 120;
    this.nextNoteTime = 0;
    this.current16thNote = 0;
    this.metronomeTimerID = null;
    this.lookahead = 25.0; // ms
    this.scheduleAheadTime = 0.1; // s
    this.onBeat = null; // Callback for UI
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playNote(frequency, timbreIndex = 0) {
    this.init();

    if (this.currentOscillators.has(frequency)) {
      this.stopNote(frequency);
    }

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    const filterNode = this.audioCtx.createBiquadFilter();

    osc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    this.configureTimbre(osc, gainNode, filterNode, timbreIndex);

    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    osc.start();

    this.currentOscillators.set(frequency, { osc, gainNode, filterNode });
  }

  stopNote(frequency) {
    if (!this.currentOscillators.has(frequency)) return;

    const { osc, gainNode } = this.currentOscillators.get(frequency);
    const now = this.audioCtx.currentTime;

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.stop(now + 0.1);

    setTimeout(() => {
      osc.disconnect();
      gainNode.disconnect();
    }, 150);

    this.currentOscillators.delete(frequency);
  }

  configureTimbre(osc, gainNode, filterNode, index) {
    const now = this.audioCtx.currentTime;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 20000;

    switch(index) {
      case 0: // Sine
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
        break;
      case 1: // Square
        osc.type = 'square';
        filterNode.frequency.value = 3000;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
        break;
      case 2: // Sawtooth
        osc.type = 'sawtooth';
        filterNode.frequency.value = 4000;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05);
        break;
      case 3: // Triangle
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
        break;
      case 4: // Organ
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
        break;
      case 5: // Strings
        osc.type = 'sawtooth';
        filterNode.frequency.value = 2500;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.2); // Slow attack
        break;
      case 6: // Brass
        osc.type = 'sawtooth';
        filterNode.frequency.setValueAtTime(500, now);
        filterNode.frequency.linearRampToValueAtTime(3000, now + 0.1);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        break;
      case 7: // Flute
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.1);
        break;
      case 8: // Clarinet
        osc.type = 'square';
        filterNode.frequency.value = 1500;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        break;
      case 9: // Synth Bass
        osc.type = 'sawtooth';
        filterNode.frequency.setValueAtTime(2000, now);
        filterNode.frequency.exponentialRampToValueAtTime(200, now + 0.2);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.1, now + 0.3);
        break;
      case 10: // E-Piano
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        break;
      case 11: // Plucked
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        break;
      case 12: // Choir
        osc.type = 'sine';
        filterNode.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.3);
        break;
      case 13: // Lead
        osc.type = 'square';
        filterNode.frequency.value = 5000;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        break;
      case 14: // Pad
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.5);
        break;
      default:
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
        break;
    }
  }

  // --- Pitch Detection Logic ---

  async startMicrophone(onPitchDetectedCallback) {
    this.init();
    this.onPitchDetected = onPitchDetectedCallback;

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const source = this.audioCtx.createMediaStreamSource(this.micStream);

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      this.detectPitchLoop();
    } catch (err) {
      console.error('Error accessing microphone', err);
    }
  }

  stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.pitchDetectInterval) {
      cancelAnimationFrame(this.pitchDetectInterval);
      this.pitchDetectInterval = null;
    }
  }

  detectPitchLoop() {
    if (!this.analyser) return;

    const bufferLength = this.analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(buffer);

    const pitch = this.autoCorrelate(buffer, this.audioCtx.sampleRate);
    if (this.onPitchDetected) {
      this.onPitchDetected(pitch);
    }

    this.pitchDetectInterval = requestAnimationFrame(() => this.detectPitchLoop());
  }

  // Auto-correlation algorithm for pitch detection
  autoCorrelate(buffer, sampleRate) {
    // Perform a quick root-mean-square to see if we have enough signal
    let SIZE = buffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      let val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) // Not enough signal
      return -1;

    // Find a range in the buffer where the values are below a given threshold.
    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length;

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    // From the original algorithm: interpolation
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  // --- Metronome Logic ---

  nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += 0.25 * secondsPerBeat; // Add quarter of a quarter-note beat length to time
    this.current16thNote++;
    if (this.current16thNote === 16) {
      this.current16thNote = 0;
    }
  }

  scheduleNote(beatNumber, time) {
    // Play on quarter notes
    if (beatNumber % 4 === 0) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (beatNumber === 0) {
        osc.frequency.value = 880.0; // High click for first beat
      } else {
        osc.frequency.value = 440.0; // Low click for others
      }

      osc.start(time);
      osc.stop(time + 0.05);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1, time + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      if (this.onBeat) {
        // Schedule UI update slightly before the audio plays to account for latency
        setTimeout(() => this.onBeat(beatNumber / 4), (time - this.audioCtx.currentTime) * 1000);
      }
    }
  }

  scheduler() {
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
    this.metronomeTimerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  startMetronome(bpm, onBeatCallback) {
    this.init();
    if (this.isPlayingMetronome) return;

    this.bpm = bpm;
    this.onBeat = onBeatCallback;
    this.isPlayingMetronome = true;
    this.current16thNote = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.scheduler();
  }

  stopMetronome() {
    this.isPlayingMetronome = false;
    clearTimeout(this.metronomeTimerID);
  }
}
