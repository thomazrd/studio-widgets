export const NOTE_FREQUENCIES = {
  // Octave 3 (default for some contexts)
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  // Octave 4 (Middle C)
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  // Octave 6
  'C6': 1046.50
};

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export class AudioSynthesizer {
  constructor() {
    this.audioContext = null;
    this.activeOscillators = new Map();
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playNote(frequency, instrument = 'piano') {
    this.init();

    if (this.activeOscillators.has(frequency)) {
      this.stopNote(frequency);
    }

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;

    if (instrument === 'piano') {
      osc.type = 'sine';

      // Simple piano envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(1, now + 0.05); // Fast attack
      gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.3); // Decay
      // Sustain is held at 0.2

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);

    } else if (instrument === 'organ') {
      osc.type = 'square';

      // Organ envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.5, now + 0.1); // attack
      // Sustain is held at 0.5

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now); // More mellow
    }

    osc.frequency.setValueAtTime(frequency, now);
    osc.start(now);

    this.activeOscillators.set(frequency, { osc, gainNode, instrument, startTime: now });
  }

  stopNote(frequency) {
    if (!this.audioContext) return;

    const active = this.activeOscillators.get(frequency);
    if (active) {
      const now = this.audioContext.currentTime;
      const { osc, gainNode, instrument } = active;

      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);

      if (instrument === 'piano') {
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5); // Release
        osc.stop(now + 0.5);
      } else if (instrument === 'organ') {
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2); // Faster release for organ
        osc.stop(now + 0.2);
      }

      this.activeOscillators.delete(frequency);
    }
  }
}
