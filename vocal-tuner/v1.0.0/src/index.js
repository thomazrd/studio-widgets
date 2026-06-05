import { AudioSynthesizer, NOTE_FREQUENCIES, NOTES } from './audio.js';
import { PitchDetector } from './pitch.js';

class VocalTuner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.audioSynth = new AudioSynthesizer();
    this.pitchDetector = new PitchDetector();

    // Default config
    this.startOctave = 3;
    this.octaves = 3;
    this.instrument = 'piano';
    this.isMicActive = false;
    this.animationFrameId = null;

    // Cents tolerance for "in tune"
    this.inTuneThreshold = 10;

    // Unique ID for widget
    this.widgetId = this.getAttribute('widget-id');
    if (!this.widgetId) {
      this.widgetId = `vocal-tuner-${Math.random().toString(36).substr(2, 9)}`;
      this.setAttribute('widget-id', this.widgetId);
    }
  }

  connectedCallback() {
    this.loadStorage();
    this.render();
    this.renderKeyboard();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.stopPitchDetection();
  }

  loadStorage() {
    const savedInstrument = localStorage.getItem(`${this.widgetId}-instrument`);
    if (savedInstrument) {
      this.instrument = savedInstrument;
    }
  }

  getStyles() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
          box-sizing: border-box;
        }

        .widget-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
          color: #fff;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* TUNER SECTION */
        .tuner-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .tuner-display {
          width: 250px;
          height: 125px;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .tuner-arc {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          border: 10px solid #444;
          border-bottom-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          transform: rotate(45deg);
        }

        .tuner-needle {
          width: 4px;
          height: 110px;
          background-color: #fff;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform-origin: bottom center;
          transform: translateX(-50%) rotate(0deg);
          transition: transform 0.1s ease-out, background-color 0.2s;
          border-radius: 2px;
          z-index: 2;
        }

        .tuner-needle::after {
          content: '';
          width: 12px;
          height: 12px;
          background-color: inherit;
          border-radius: 50%;
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .tuner-center-mark {
          position: absolute;
          top: 5px;
          left: 50%;
          width: 4px;
          height: 15px;
          background-color: #666;
          transform: translateX(-50%);
        }

        .note-display {
          font-size: 48px;
          font-weight: bold;
          text-align: center;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .cents-display {
          font-size: 16px;
          color: #aaa;
          margin-top: 5px;
          height: 20px;
        }

        /* CONTROLS SECTION */
        .controls-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
          gap: 20px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #ccc;
        }

        select, button {
          background: #333;
          border: 1px solid #555;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        select:focus, button:focus {
          border-color: #66b3ff;
          box-shadow: 0 0 0 2px rgba(102, 179, 255, 0.3);
        }

        button:hover {
          background: #444;
        }

        button.active {
          background: #d32f2f;
          border-color: #ff5252;
          color: white;
          box-shadow: 0 0 10px rgba(211, 47, 47, 0.5);
        }

        /* KEYBOARD SECTION */
        .keyboard-wrapper {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          background: #111;
          padding-top: 20px;
        }

        .keyboard-container {
          display: flex;
          position: relative;
          height: 200px;
          margin: 0 auto;
          width: fit-content;
          border-radius: 8px 8px 0 0;
          padding: 10px 10px 0 10px;
          box-shadow: inset 0 5px 10px rgba(0,0,0,0.8);
        }

        .key {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 15px;
          border-radius: 0 0 6px 6px;
          cursor: pointer;
          transition: background-color 0.1s, transform 0.1s;
          box-sizing: border-box;
        }

        .key.white {
          width: 50px;
          height: 100%;
          background: linear-gradient(to bottom, #fff 0%, #f0f0f0 100%);
          border: 1px solid #ccc;
          border-top: none;
          z-index: 1;
          box-shadow: inset 0 -2px 5px rgba(0,0,0,0.2), 0 2px 3px rgba(0,0,0,0.1);
          color: #333;
        }

        .key.white.active {
          background: #e0e0e0;
          transform: translateY(2px);
          box-shadow: inset 0 -1px 2px rgba(0,0,0,0.3);
        }

        .key.black {
          width: 30px;
          height: 60%;
          background: linear-gradient(to bottom, #333 0%, #000 100%);
          border: 1px solid #000;
          border-radius: 0 0 4px 4px;
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          z-index: 2;
          box-shadow: inset 0 -2px 3px rgba(255,255,255,0.2), 0 3px 5px rgba(0,0,0,0.5);
          color: #fff;
          padding-bottom: 10px;
        }

        .key.black.active {
          background: linear-gradient(to bottom, #222 0%, #000 100%);
          transform: translateX(-50%) translateY(2px);
          box-shadow: inset 0 -1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.5);
        }

        .note-label {
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          pointer-events: none;
        }

        .key.black .note-label {
          font-size: 10px;
          color: #aaa;
        }

        .key.white .note-label {
          color: #555;
        }

        /* Color States */
        .color-match {
          color: #4caf50 !important;
        }
        .bg-match {
          background-color: #4caf50 !important;
        }
        .color-flat {
          color: #f44336 !important;
        }
        .bg-flat {
          background-color: #f44336 !important;
        }
        .color-sharp {
          color: #f44336 !important;
        }
        .bg-sharp {
          background-color: #f44336 !important;
        }
      </style>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="widget-container">

        <div class="tuner-section">
          <div class="tuner-display">
            <div class="tuner-arc"></div>
            <div class="tuner-center-mark"></div>
            <div class="tuner-needle" id="tuner-needle"></div>
          </div>
          <div class="note-display" id="note-display">--</div>
          <div class="cents-display" id="cents-display">Tuner Inativo</div>
        </div>

        <div class="controls-section">
          <div class="control-group">
            <button id="mic-btn">🎤 Ativar Afinador</button>
          </div>
          <div class="control-group">
            <label for="instrument-select">Timbre do Teclado:</label>
            <select id="instrument-select">
              <option value="piano">Piano</option>
              <option value="synthesizer">Sintetizador</option>
              <option value="organ">Órgão</option>
              <option value="flute">Flauta</option>
              <option value="strings">Cordas</option>
            </select>
          </div>
        </div>

        <div class="keyboard-wrapper">
          <div class="keyboard-container" id="keyboard">
            <!-- Keys generated by JS -->
          </div>
        </div>

      </div>
    `;
  }

  renderKeyboard() {
    const keyboardContainer = this.shadowRoot.getElementById('keyboard');
    if (!keyboardContainer) return;

    keyboardContainer.innerHTML = '';

    const whiteKeys = [];
    const blackKeys = [];
    let whiteKeyCount = 0;

    for (let o = 0; o < this.octaves; o++) {
      const currentOctave = this.startOctave + o;

      NOTES.forEach((note) => {
        const fullNoteName = `${note}${currentOctave}`;
        const isBlack = note.includes('#');
        const freq = NOTE_FREQUENCIES[fullNoteName];

        if (!freq) return;

        const keyDiv = document.createElement('div');
        keyDiv.className = `key ${isBlack ? 'black' : 'white'}`;
        keyDiv.dataset.note = fullNoteName;
        keyDiv.dataset.freq = freq;

        const label = document.createElement('div');
        label.className = 'note-label';
        label.innerHTML = fullNoteName;
        keyDiv.appendChild(label);

        if (isBlack) {
          // 50px is white key width. The container has 10px padding on the left, so we add 10px offset.
          keyDiv.style.left = `${(whiteKeyCount * 50) + 10}px`;
          blackKeys.push(keyDiv);
        } else {
          whiteKeys.push(keyDiv);
          whiteKeyCount++;
        }
      });
    }

    // Append final C note to finish the 3rd octave
    const finalOctave = this.startOctave + parseInt(this.octaves);
    const finalNote = `C${finalOctave}`;
    const finalFreq = NOTE_FREQUENCIES[finalNote];

    if (finalFreq) {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'key white';
      keyDiv.dataset.note = finalNote;
      keyDiv.dataset.freq = finalFreq;

      const label = document.createElement('div');
      label.className = 'note-label';
      label.innerHTML = finalNote;
      keyDiv.appendChild(label);

      whiteKeys.push(keyDiv);
    }

    whiteKeys.forEach(k => keyboardContainer.appendChild(k));
    blackKeys.forEach(k => keyboardContainer.appendChild(k));
  }

  attachEventListeners() {
    // Controls
    const instrumentSelect = this.shadowRoot.getElementById('instrument-select');
    instrumentSelect.value = this.instrument;
    instrumentSelect.addEventListener('change', (e) => {
      this.instrument = e.target.value;
      localStorage.setItem(`${this.widgetId}-instrument`, this.instrument);
    });

    const micBtn = this.shadowRoot.getElementById('mic-btn');
    micBtn.addEventListener('click', async () => {
      if (this.isMicActive) {
        this.stopPitchDetection();
        micBtn.textContent = '🎤 Ativar Afinador';
        micBtn.classList.remove('active');
      } else {
        try {
          await this.pitchDetector.start();
          this.isMicActive = true;
          micBtn.textContent = '⏹ Parar Afinador';
          micBtn.classList.add('active');
          this.startPitchDetectionLoop();
        } catch (err) {
          alert('Não foi possível acessar o microfone.');
        }
      }
    });

    // Keyboard
    const keyboardContainer = this.shadowRoot.getElementById('keyboard');

    const playNoteFromEvent = (e) => {
      const key = e.target.closest('.key');
      if (!key) return;

      const freq = parseFloat(key.dataset.freq);
      if (freq) {
        this.audioSynth.playNote(freq, this.instrument);
        key.classList.add('active');

        const stopNote = () => {
          this.audioSynth.stopNote(freq);
          key.classList.remove('active');
          document.removeEventListener('mouseup', stopNote);
          document.removeEventListener('touchend', stopNote);
        };

        document.addEventListener('mouseup', stopNote);
        document.addEventListener('touchend', stopNote);
      }
    };

    keyboardContainer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      playNoteFromEvent(e);
    });

    keyboardContainer.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        let target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target === this) {
          target = this.shadowRoot.elementFromPoint(touch.clientX, touch.clientY);
        }
        if (target) {
          playNoteFromEvent({ target });
        }
      }
    });
  }

  startPitchDetectionLoop() {
    const updateTuner = () => {
      if (!this.isMicActive) return;

      const pitchData = this.pitchDetector.getPitch();
      this.updateTunerUI(pitchData);

      this.animationFrameId = requestAnimationFrame(updateTuner);
    };

    updateTuner();
  }

  stopPitchDetection() {
    this.isMicActive = false;
    this.pitchDetector.stop();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.updateTunerUI(null);
  }

  updateTunerUI(pitchData) {
    const needle = this.shadowRoot.getElementById('tuner-needle');
    const noteDisplay = this.shadowRoot.getElementById('note-display');
    const centsDisplay = this.shadowRoot.getElementById('cents-display');

    if (!pitchData) {
      needle.style.transform = 'translateX(-50%) rotate(0deg)';
      needle.className = 'tuner-needle';
      noteDisplay.textContent = '--';
      noteDisplay.className = 'note-display';
      centsDisplay.textContent = this.isMicActive ? 'Aguardando som...' : 'Tuner Inativo';
      return;
    }

    // Limit cents visually to +/- 50 for the analog display
    let visualCents = pitchData.cents;
    if (visualCents > 50) visualCents = 50;
    if (visualCents < -50) visualCents = -50;

    // Rotate needle: -50 cents = -45 deg, +50 cents = +45 deg (approx)
    const angle = (visualCents / 50) * 45;
    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    noteDisplay.textContent = pitchData.note;

    let centsText = `${Math.abs(pitchData.cents)} cents `;

    needle.classList.remove('bg-match', 'bg-flat', 'bg-sharp');
    noteDisplay.classList.remove('color-match', 'color-flat', 'color-sharp');

    if (Math.abs(pitchData.cents) <= this.inTuneThreshold) {
      needle.classList.add('bg-match');
      noteDisplay.classList.add('color-match');
      centsText += '(Afinado)';
    } else if (pitchData.cents < 0) {
      needle.classList.add('bg-flat');
      noteDisplay.classList.add('color-flat');
      centsText += 'baixo (Flat)';
    } else {
      needle.classList.add('bg-sharp');
      noteDisplay.classList.add('color-sharp');
      centsText += 'alto (Sharp)';
    }

    centsDisplay.textContent = centsText;
  }
}

customElements.define('vocal-tuner', VocalTuner);
