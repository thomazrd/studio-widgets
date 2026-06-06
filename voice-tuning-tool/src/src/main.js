import { AudioEngine, TIMBRES } from './audioEngine.js';
import { saveToStorage, loadFromStorage } from './storage.js';
import { createPracticeView, createHistoryView } from './views.js';

const SCALES = [
  { name: 'C Major', notes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25] },
  { name: 'G Major', notes: [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 369.99, 392.00] },
  { name: 'A Minor', notes: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00] }
];

const STYLES = `
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    background: #f9f9fb;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* Static Header */
  .header {
    flex-shrink: 0;
    display: flex;
    border-bottom: 1px solid #e1e1e1;
    background: #fff;
    padding: 0;
  }
  .nav-btn {
    flex: 1;
    padding: 15px;
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    color: #666;
    transition: all 0.2s ease;
  }
  .nav-btn.active {
    color: #007aff;
    border-bottom: 3px solid #007aff;
  }
  .nav-btn:hover {
    background: #f0f0f0;
  }

  /* Main Container */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Flexible views */
  .view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 20px;
    gap: 20px;
  }
  .view.hidden {
    display: none;
  }

  /* Practice View Elements */
  .controls-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .control-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 150px;
  }
  .control-group label {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #555;
  }
  select, input[type="range"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    width: 100%;
  }

  /* Buttons */
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
  }
  .btn.primary {
    background: #007aff;
    color: #fff;
  }
  .btn.primary:hover { background: #005bb5; }
  .btn.secondary {
    background: #e5e5ea;
    color: #333;
  }
  .btn.secondary:hover { background: #d1d1d6; }
  .btn.danger {
    background: #ff3b30;
    color: #fff;
  }
  .btn.danger:hover { background: #cc2f26; }

  /* Pitch Visualizer */
  .visualizer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .target-note-display, .detected-pitch-display {
    font-size: 18px;
    margin: 10px 0;
  }
  .target-note-display strong { font-size: 24px; color: #007aff; }

  .pitch-visualizer {
    position: relative;
    width: 300px;
    height: 150px;
    margin: 20px 0;
    overflow: hidden;
  }
  .gauge {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top-left-radius: 150px;
    border-top-right-radius: 150px;
    border: 20px solid #eee;
    border-bottom: none;
    box-sizing: border-box;
  }
  .gauge-center {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 20px;
    background: #34c759;
    z-index: 2;
  }
  .needle {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 4px;
    height: 120px;
    background: #ff3b30;
    transform-origin: bottom center;
    transform: translateX(-50%) rotate(0deg);
    transition: transform 0.1s ease-out, background 0.2s ease;
    border-radius: 2px;
    z-index: 3;
  }
  .needle.in-tune {
    background: #34c759;
  }
  .cents-label {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    padding: 0 10px;
  }

  .action-panel {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  /* History View */
  .dashboard {
    display: flex;
    gap: 15px;
  }
  .stat-card {
    flex: 1;
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    text-align: center;
  }
  .stat-card h4 {
    margin: 0 0 10px 0;
    font-weight: 500;
    color: #666;
  }
  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #007aff;
  }

  .chart-container {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .progress-chart {
    width: 100%;
    max-height: 200px;
    display: block;
  }

  .history-list-container {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 200px;
  }
  .history-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .history-item {
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  .history-item-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .accuracy.good { color: #34c759; }
  .accuracy.needs-work { color: #ff9500; }
  .history-item-details {
    font-size: 13px;
    color: #666;
  }
`;

export class VoiceTuningWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.audioEngine = new AudioEngine();
    this.historyData = loadFromStorage('history') || [];

    // State
    this.currentScaleIndex = 0;
    this.currentTimbreIndex = 0;
    this.isTraining = false;
    this.trainingSession = null;
    this.currentTargetNoteIndex = 0;
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  disconnectedCallback() {
    this.audioEngine.stopMicrophone();
    this.audioEngine.stopMetronome();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <div class="header">
        <button class="nav-btn active" data-target="practice">Prática</button>
        <button class="nav-btn" data-target="history">Histórico</button>
      </div>
      <div class="main-content">
        <div id="practice-container">
          ${createPracticeView(TIMBRES, SCALES)}
        </div>
        <div id="history-container" style="display: none;">
          ${createHistoryView(this.historyData)}
        </div>
      </div>
    `;
  }

  setupListeners() {
    const sr = this.shadowRoot;

    // Navigation
    const navBtns = sr.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        navBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const target = e.target.getAttribute('data-target');

        if (target === 'practice') {
          sr.getElementById('practice-container').style.display = 'block';
          sr.getElementById('history-container').style.display = 'none';
        } else {
          sr.getElementById('practice-container').style.display = 'none';
          sr.getElementById('history-container').innerHTML = createHistoryView(this.historyData);
          sr.getElementById('history-container').style.display = 'block';
        }
      });
    });

    // Practice View Controls
    const toggleMetronomeBtn = sr.getElementById('toggle-metronome');
    if (toggleMetronomeBtn) {
      toggleMetronomeBtn.addEventListener('click', () => {
        if (this.audioEngine.isPlayingMetronome) {
          this.audioEngine.stopMetronome();
          toggleMetronomeBtn.textContent = 'Ligar Metrônomo';
          toggleMetronomeBtn.classList.remove('danger');
        } else {
          const bpm = parseInt(sr.getElementById('bpm-slider').value, 10);
          this.audioEngine.startMetronome(bpm, () => {});
          toggleMetronomeBtn.textContent = 'Desligar Metrônomo';
          toggleMetronomeBtn.classList.add('danger');
        }
      });
    }

    const bpmSlider = sr.getElementById('bpm-slider');
    if (bpmSlider) {
      bpmSlider.addEventListener('input', (e) => {
        sr.getElementById('bpm-display').textContent = e.target.value;
        if (this.audioEngine.isPlayingMetronome) {
          this.audioEngine.bpm = parseInt(e.target.value, 10);
        }
      });
    }

    const timbreSelect = sr.getElementById('timbre-select');
    if (timbreSelect) {
      timbreSelect.addEventListener('change', (e) => {
        this.currentTimbreIndex = parseInt(e.target.value, 10);
      });
    }

    const scaleSelect = sr.getElementById('scale-select');
    if (scaleSelect) {
      scaleSelect.addEventListener('change', (e) => {
        this.currentScaleIndex = parseInt(e.target.value, 10);
        this.updateTargetNoteDisplay();
      });
    }

    const playRefBtn = sr.getElementById('play-reference');
    if (playRefBtn) {
      playRefBtn.addEventListener('click', () => {
        const scale = SCALES[this.currentScaleIndex];
        const noteFreq = scale.notes[this.currentTargetNoteIndex || 0];
        this.audioEngine.playNote(noteFreq, this.currentTimbreIndex);
        setTimeout(() => {
          this.audioEngine.stopNote(noteFreq);
        }, 1000);
      });
    }

    const toggleTrainingBtn = sr.getElementById('toggle-training');
    if (toggleTrainingBtn) {
      toggleTrainingBtn.addEventListener('click', () => {
        if (this.isTraining) {
          this.stopTraining();
          toggleTrainingBtn.textContent = 'Iniciar Treino';
          toggleTrainingBtn.classList.remove('danger');
          toggleTrainingBtn.classList.add('primary');
        } else {
          this.startTraining();
          toggleTrainingBtn.textContent = 'Parar Treino';
          toggleTrainingBtn.classList.remove('primary');
          toggleTrainingBtn.classList.add('danger');
        }
      });
    }

    this.updateTargetNoteDisplay();
  }

  frequencyToNoteInfo(frequency) {
    const A4 = 440;
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    if (frequency === -1) return { name: '-', centsOff: 0, isPerfect: false };

    let halfStepsFromA4 = Math.round(12 * Math.log2(frequency / A4));
    let targetFreq = A4 * Math.pow(2, halfStepsFromA4 / 12);
    let centsOff = Math.round(1200 * Math.log2(frequency / targetFreq));

    let noteIndex = (halfStepsFromA4 + 9) % 12;
    if (noteIndex < 0) noteIndex += 12;

    let octave = 4 + Math.floor((halfStepsFromA4 + 9) / 12);

    return {
      name: `${notes[noteIndex]}${octave}`,
      centsOff: centsOff,
      targetFreq: targetFreq
    };
  }

  updateTargetNoteDisplay() {
    const scale = SCALES[this.currentScaleIndex];
    if (this.currentTargetNoteIndex >= scale.notes.length) {
      this.currentTargetNoteIndex = 0; // loop or end logic
    }
    const targetFreq = scale.notes[this.currentTargetNoteIndex];
    const noteInfo = this.frequencyToNoteInfo(targetFreq);
    const targetNoteEl = this.shadowRoot.getElementById('target-note-name');
    if (targetNoteEl) {
      targetNoteEl.textContent = noteInfo.name || '-';
    }
  }

  handlePitchDetected(pitchFreq) {
    const sr = this.shadowRoot;
    const needle = sr.getElementById('pitch-needle');
    const detectedNoteEl = sr.getElementById('detected-note-name');
    const centsOffEl = sr.getElementById('cents-off');

    if (pitchFreq === -1) {
      // No pitch
      if (needle) {
         needle.style.transform = 'translateX(-50%) rotate(0deg)';
         needle.classList.remove('in-tune');
      }
      if (detectedNoteEl) detectedNoteEl.textContent = '-';
      if (centsOffEl) centsOffEl.textContent = '0';
      return;
    }

    const scale = SCALES[this.currentScaleIndex];
    const targetFreq = scale.notes[this.currentTargetNoteIndex];
    const centsOffTarget = Math.round(1200 * Math.log2(pitchFreq / targetFreq));

    // Cap display between -50 and +50
    let displayCents = Math.max(-50, Math.min(50, centsOffTarget));
    // 50 cents = 90 degrees rotation
    let rotation = (displayCents / 50) * 90;

    if (needle) {
      needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
      if (Math.abs(displayCents) <= 10) {
        needle.classList.add('in-tune');
      } else {
        needle.classList.remove('in-tune');
      }
    }

    const detectedInfo = this.frequencyToNoteInfo(pitchFreq);
    if (detectedNoteEl) detectedNoteEl.textContent = detectedInfo.name;
    if (centsOffEl) centsOffEl.textContent = `${displayCents} cents`;

    if (this.isTraining && this.trainingSession) {
      const currentNoteName = this.frequencyToNoteInfo(targetFreq).name;
      if (!this.trainingSession.noteRecordings[currentNoteName]) {
        this.trainingSession.noteRecordings[currentNoteName] = [];
      }

      this.trainingSession.noteRecordings[currentNoteName].push(Math.abs(displayCents));

      // Simple logic to advance to next note if held accurately
      if (Math.abs(displayCents) <= 15) {
         this.trainingSession.goodFrames++;
         if (this.trainingSession.goodFrames > 30) { // Approx 1/2 second at 60fps
           this.currentTargetNoteIndex++;
           this.trainingSession.goodFrames = 0;
           if (this.currentTargetNoteIndex >= scale.notes.length) {
              this.stopTraining();
              const srToggle = this.shadowRoot.getElementById('toggle-training');
              if (srToggle) {
                srToggle.textContent = 'Iniciar Treino';
                srToggle.classList.remove('danger');
                srToggle.classList.add('primary');
              }
              alert("Treino concluído com sucesso!");
           } else {
             this.updateTargetNoteDisplay();
           }
         }
      } else {
         this.trainingSession.goodFrames = 0;
      }
    }
  }

  startTraining() {
    this.isTraining = true;
    this.currentTargetNoteIndex = 0;
    this.updateTargetNoteDisplay();
    this.trainingSession = {
      scaleName: SCALES[this.currentScaleIndex].name,
      noteRecordings: {},
      goodFrames: 0,
      date: new Date().toISOString()
    };
    this.audioEngine.startMicrophone((pitch) => this.handlePitchDetected(pitch));
  }

  stopTraining() {
    this.isTraining = false;
    this.audioEngine.stopMicrophone();

    if (this.trainingSession && Object.keys(this.trainingSession.noteRecordings).length > 0) {
      let totalCents = 0;
      let totalSamples = 0;
      const notesDetails = [];

      for (const [noteName, centsArray] of Object.entries(this.trainingSession.noteRecordings)) {
         if (centsArray.length === 0) continue;
         const avgNoteCents = centsArray.reduce((a,b) => a+b, 0) / centsArray.length;
         totalCents += avgNoteCents * centsArray.length;
         totalSamples += centsArray.length;

         let status = 'Boas';
         if (avgNoteCents > 25) status = 'Ruins';
         else if (avgNoteCents > 15) status = 'Precisa de mais afinação';

         notesDetails.push({ note: noteName, avgCents: Math.round(avgNoteCents), status });
      }

      const avgOff = totalSamples > 0 ? totalCents / totalSamples : 0;
      // Calculate accuracy (0 cents off = 100%, 50 cents off = 0%)
      const accuracy = Math.max(0, Math.round(100 - (avgOff / 50 * 100)));

      const sessionResult = {
        date: this.trainingSession.date,
        scaleName: this.trainingSession.scaleName,
        avgCentsOff: avgOff,
        accuracy: accuracy,
        notesDetails: notesDetails
      };

      this.historyData.push(sessionResult);
      saveToStorage('history', this.historyData);
    }

    // Reset visualizer
    this.handlePitchDetected(-1);
    this.currentTargetNoteIndex = 0;
    this.updateTargetNoteDisplay();
  }
}

customElements.define('voice-tuning-widget', VoiceTuningWidget);
