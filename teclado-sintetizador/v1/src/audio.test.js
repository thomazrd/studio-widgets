import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioSynthesizer, NOTE_FREQUENCIES, NOTES } from './audio.js';

describe('Audio Logic', () => {
  it('should have correct frequencies for Middle C octave (Octave 4)', () => {
    expect(NOTE_FREQUENCIES['C4']).toBeCloseTo(261.63);
    expect(NOTE_FREQUENCIES['A4']).toBeCloseTo(440.00);
  });

  it('should have 12 notes defined', () => {
    expect(NOTES.length).toBe(12);
    expect(NOTES).toContain('C');
    expect(NOTES).toContain('C#');
  });

  describe('AudioSynthesizer', () => {
    let synth;

    beforeEach(() => {
      // Mock AudioContext for testing environment since it's not available in jsdom natively without setup
      global.window = global.window || {};
      global.window.AudioContext = vi.fn().mockImplementation(function() {
        return {
          state: 'running',
          currentTime: 0,
          resume: vi.fn(),
          createOscillator: vi.fn().mockReturnValue({
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            frequency: { setValueAtTime: vi.fn() },
            type: 'sine'
          }),
          createGain: vi.fn().mockReturnValue({
            connect: vi.fn(),
            gain: {
              setValueAtTime: vi.fn(),
              linearRampToValueAtTime: vi.fn(),
              exponentialRampToValueAtTime: vi.fn(),
              cancelScheduledValues: vi.fn(),
              value: 0
            }
          }),
          createBiquadFilter: vi.fn().mockReturnValue({
            connect: vi.fn(),
            frequency: { setValueAtTime: vi.fn() },
            type: 'lowpass'
          }),
          destination: {}
        };
      });

      synth = new AudioSynthesizer();
    });

    it('should initialize AudioContext on playNote', () => {
      synth.playNote(440);
      expect(synth.audioContext).toBeDefined();
      expect(global.window.AudioContext).toHaveBeenCalled();
    });

    it('should add oscillator to active map when playing a note', () => {
      synth.playNote(440, 'piano');
      expect(synth.activeOscillators.has(440)).toBe(true);
      expect(synth.activeOscillators.get(440).instrument).toBe('piano');
    });

    it('should remove oscillator from active map when stopping a note', () => {
      synth.playNote(440);
      synth.stopNote(440);
      expect(synth.activeOscillators.has(440)).toBe(false);
    });
  });
});
