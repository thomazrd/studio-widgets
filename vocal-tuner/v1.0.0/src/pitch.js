import { NOTE_FREQUENCIES, NOTES } from './audio.js';

export class PitchDetector {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.mediaStreamSource = null;
    this.buffer = new Float32Array(2048);
    this.stream = null;
    this.isRecording = false;

    // Build a sorted array of frequencies and corresponding notes for quick lookup
    this.noteList = [];
    for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
        this.noteList.push({ note, freq });
    }
    this.noteList.sort((a, b) => a.freq - b.freq);
  }

  async start() {
    if (this.isRecording) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          autoGainControl: false,
          noiseSuppression: false,
        }
      });

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;

      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.stream);
      this.mediaStreamSource.connect(this.analyser);

      this.isRecording = true;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      throw err;
    }
  }

  stop() {
    if (!this.isRecording) return;

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    this.isRecording = false;
  }

  getPitch() {
    if (!this.isRecording) return null;

    this.analyser.getFloatTimeDomainData(this.buffer);
    const frequency = this.autoCorrelate(this.buffer, this.audioContext.sampleRate);

    if (frequency === -1) {
      return null;
    }

    const noteDetails = this.getNearestNoteDetails(frequency);
    return {
      frequency,
      ...noteDetails
    };
  }

  // Standard autocorrelation algorithm
  autoCorrelate(buf, sampleRate) {
    let size = buf.length;
    let rms = 0;

    for (let i = 0; i < size; i++) {
      let val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) // Not enough signal
      return -1;

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++)
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < size / 2; i++)
      if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; }

    buf = buf.slice(r1, r2);
    size = buf.length;

    let c = new Array(size).fill(0);
    for (let i = 0; i < size; i++)
      for (let j = 0; j < size - i; j++)
        c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    // Parabolic interpolation for fine tuning
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  getNearestNoteDetails(frequency) {
    if (frequency <= this.noteList[0].freq) {
        return { note: this.noteList[0].note, targetFreq: this.noteList[0].freq, cents: this.getCents(frequency, this.noteList[0].freq) };
    }

    if (frequency >= this.noteList[this.noteList.length - 1].freq) {
        return { note: this.noteList[this.noteList.length - 1].note, targetFreq: this.noteList[this.noteList.length - 1].freq, cents: this.getCents(frequency, this.noteList[this.noteList.length - 1].freq) };
    }

    // Binary search could be used, but array is small enough for linear/simple scan
    let nearestNote = this.noteList[0];
    let minDiff = Math.abs(frequency - this.noteList[0].freq);

    for (let i = 1; i < this.noteList.length; i++) {
        const diff = Math.abs(frequency - this.noteList[i].freq);
        if (diff < minDiff) {
            minDiff = diff;
            nearestNote = this.noteList[i];
        }
    }

    const cents = this.getCents(frequency, nearestNote.freq);

    return {
        note: nearestNote.note,
        targetFreq: nearestNote.freq,
        cents: cents
    };
  }

  getCents(frequency, targetFrequency) {
    return Math.floor(1200 * Math.log2(frequency / targetFrequency));
  }
}
