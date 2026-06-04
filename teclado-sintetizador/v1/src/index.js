import { AudioSynthesizer, NOTES, NOTE_FREQUENCIES } from './audio.js';

const BRAZILIAN_NOTES = {
  'C': 'Dó', 'C#': 'Dó#', 'D': 'Ré', 'D#': 'Ré#',
  'E': 'Mi', 'F': 'Fá', 'F#': 'Fá#', 'G': 'Sol',
  'G#': 'Sol#', 'A': 'Lá', 'A#': 'Lá#', 'B': 'Si'
};

class TecladoSintetizador extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.audioSynth = new AudioSynthesizer();
    this.startOctave = 3; // Start from Octave 3

    // Load from localStorage or set defaults
    const savedOctaves = localStorage.getItem('teclado_sintetizador_octaves');
    const savedInstrument = localStorage.getItem('teclado_sintetizador_instrument');

    this.octaves = savedOctaves ? parseInt(savedOctaves) : 2;
    this.instrument = savedInstrument ? savedInstrument : 'piano';
  }

  connectedCallback() {
    this.render();
    this.renderKeyboard();
    this.attachEventListeners();
  }

  getStyles() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
        }

        .widget-container {
          background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: #fff;
          max-width: 100%;
          overflow-x: auto;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 0 10px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #bbb;
        }

        select, input[type="range"] {
          background: #333;
          border: 1px solid #444;
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        select:focus {
          border-color: #66b3ff;
        }

        .keyboard-container {
          display: flex;
          position: relative;
          height: 200px;
          margin: 0 auto;
          width: fit-content;
          border-radius: 8px 8px 12px 12px;
          padding: 10px 10px 15px 10px;
          background: #111;
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
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          pointer-events: none;
        }

        .key.black .note-label {
          font-size: 9px;
          color: #aaa;
        }

        .key.white .note-label {
          color: #555;
        }

        /* Adjust positions for black keys */
        .key-wrapper {
          position: relative;
        }
      </style>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="widget-container">
        <div class="controls">
          <div class="control-group">
            <label for="instrument-select">Timbre:</label>
            <select id="instrument-select">
              <option value="piano">Piano</option>
              <option value="organ">Órgão</option>
            </select>
          </div>
          <div class="control-group">
            <label for="octave-select">Oitavas:</label>
            <select id="octave-select">
              <option value="1">1 Oitava</option>
              <option value="2">2 Oitavas</option>
              <option value="3">3 Oitavas</option>
            </select>
          </div>
        </div>
        <div class="keyboard-container" id="keyboard">
          <!-- Keys will be generated here -->
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

        // Sometimes we might not have a frequency for a note if it's out of bounds of our mapping
        if (!freq) return;

        const keyDiv = document.createElement('div');
        keyDiv.className = `key ${isBlack ? 'black' : 'white'}`;
        keyDiv.dataset.note = fullNoteName;
        keyDiv.dataset.freq = freq;

        const label = document.createElement('div');
        label.className = 'note-label';
        const displayNote = note.replace('#', ''); // Removing # for the display to make it cleaner, or keep it. Let's keep it but formatted.
        const brNote = BRAZILIAN_NOTES[note];
        label.innerHTML = `${brNote}<br>${note}`;
        keyDiv.appendChild(label);

        if (isBlack) {
          // Calculate left position based on previous white key
          // 50px is white key width
          keyDiv.style.left = `${whiteKeyCount * 50}px`;
          blackKeys.push(keyDiv);
        } else {
          whiteKeys.push(keyDiv);
          whiteKeyCount++;
        }
      });
    }

    // Add final C note to finish the keyboard properly
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
      label.innerHTML = `${BRAZILIAN_NOTES['C']}<br>C`;
      keyDiv.appendChild(label);

      whiteKeys.push(keyDiv);
    }

    // Append white keys first
    whiteKeys.forEach(k => keyboardContainer.appendChild(k));
    // Append black keys so they are on top
    blackKeys.forEach(k => keyboardContainer.appendChild(k));
  }

  attachEventListeners() {
    const keyboardContainer = this.shadowRoot.getElementById('keyboard');

    const playNoteFromEvent = (e) => {
      const key = e.target.closest('.key');
      if (!key) return;

      const freq = parseFloat(key.dataset.freq);
      if (freq) {
        this.audioSynth.playNote(freq, this.instrument);
        key.classList.add('active');

        // Ensure note stops when interaction ends
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
      // Handle multi-touch by using changedTouches
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);

        if (target) {
            // Because target could be inside shadowRoot, we check if it is part of our component
            // But since the event listener is on keyboardContainer, it's safer to just simulate event
            const customEvent = { target: target };
            // Need to dive into shadow dom if elementFromPoint returns the host
            let realTarget = target;
            if(target === this) {
                const shadowTarget = this.shadowRoot.elementFromPoint(touch.clientX, touch.clientY);
                if(shadowTarget) realTarget = shadowTarget;
            }
            playNoteFromEvent({target: realTarget});
        }
      }
    });

    const instrumentSelect = this.shadowRoot.getElementById('instrument-select');
    const octaveSelect = this.shadowRoot.getElementById('octave-select');

    instrumentSelect.value = this.instrument;
    octaveSelect.value = this.octaves;

    instrumentSelect.addEventListener('change', (e) => {
      this.instrument = e.target.value;
      localStorage.setItem('teclado_sintetizador_instrument', this.instrument);
    });

    octaveSelect.addEventListener('change', (e) => {
      this.octaves = parseInt(e.target.value);
      localStorage.setItem('teclado_sintetizador_octaves', this.octaves);
      this.renderKeyboard();
    });
  }
}

customElements.define('teclado-sintetizador', TecladoSintetizador);
