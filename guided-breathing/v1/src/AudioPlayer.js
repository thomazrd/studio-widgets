export class AudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  playPhaseTone(phaseAction) {
    if (!this.enabled) return;
    this.init();

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    // Diferentes sons para diferentes fases
    let freq = 200;
    if (phaseAction === 'inhale') freq = 329.63; // E4
    if (phaseAction === 'hold') freq = 392.00;   // G4
    if (phaseAction === 'exhale') freq = 261.63; // C4

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // Envelope suave
    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.0);

    osc.start(this.audioCtx.currentTime);
    osc.stop(this.audioCtx.currentTime + 1.0);
  }
}
