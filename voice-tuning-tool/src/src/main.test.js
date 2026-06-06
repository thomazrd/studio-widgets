import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VoiceTuningWidget } from './main.js';

describe('VoiceTuningWidget', () => {
  let widget;

  beforeEach(() => {
    // Mock AudioContext and navigator
    global.window.AudioContext = vi.fn().mockImplementation(() => ({
      state: 'running',
      resume: vi.fn(),
      createOscillator: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        frequency: { setValueAtTime: vi.fn(), value: 440 }
      })),
      createGain: vi.fn(() => ({
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
          cancelScheduledValues: vi.fn(),
          value: 1
        }
      })),
      createBiquadFilter: vi.fn(() => ({
        connect: vi.fn(),
        type: 'lowpass',
        frequency: { value: 20000, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
      })),
      currentTime: 0,
      destination: {},
      createMediaStreamSource: vi.fn(),
      createAnalyser: vi.fn(() => ({
        fftSize: 2048,
        getFloatTimeDomainData: vi.fn()
      }))
    }));

    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [] })
    };

    widget = new VoiceTuningWidget();
    document.body.appendChild(widget);
  });

  it('should render the shadow DOM and practice view by default', () => {
    expect(widget.shadowRoot).toBeDefined();
    const practiceView = widget.shadowRoot.getElementById('practice-container');
    expect(practiceView.style.display).not.toBe('none');

    const needle = widget.shadowRoot.getElementById('pitch-needle');
    expect(needle).toBeDefined();
  });

  it('should switch to history view when nav button is clicked', () => {
    const historyBtn = widget.shadowRoot.querySelector('button[data-target="history"]');
    historyBtn.click();

    const historyView = widget.shadowRoot.getElementById('history-container');
    expect(historyView.style.display).toBe('block');
    const practiceView = widget.shadowRoot.getElementById('practice-container');
    expect(practiceView.style.display).toBe('none');
  });

  it('frequencyToNoteInfo should calculate correct note and cents', () => {
    const infoA4 = widget.frequencyToNoteInfo(440);
    expect(infoA4.name).toBe('A4');
    expect(infoA4.centsOff).toBe(0);

    const infoA4Sharp = widget.frequencyToNoteInfo(466.16); // True A#4 is ~466.16Hz
    expect(infoA4Sharp.name).toBe('A#4');
  });
});
