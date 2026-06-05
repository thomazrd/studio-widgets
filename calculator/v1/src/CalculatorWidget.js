import { styles } from './styles.js';
import { CalculatorLogic } from './CalculatorLogic.js';

export class CalculatorWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.logic = new CalculatorLogic();
    this.mode = 'standard'; // 'standard' | 'scientific'
    this.uniqueId = 'calc_widget_v1_';

    // Load saved mode from localStorage
    try {
        const savedMode = localStorage.getItem(`${this.uniqueId}mode`);
        if (savedMode === 'scientific') {
            this.mode = 'scientific';
        }
    } catch (e) {
        // localStorage might be blocked or unavailable
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateDisplay();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="calculator-container">
        <div class="header">
          <div class="mode-toggle ${this.mode === 'scientific' ? 'scientific' : ''}" id="mode-toggle">
            <div class="mode-indicator"></div>
            <button class="mode-btn ${this.mode === 'standard' ? 'active' : ''}" data-mode="standard">Padrão</button>
            <button class="mode-btn ${this.mode === 'scientific' ? 'active' : ''}" data-mode="scientific">Científico</button>
          </div>
        </div>

        <div class="display-section">
          <div class="history" id="history"></div>
          <div class="current-value" id="display">0</div>
        </div>

        <div class="keypad ${this.mode === 'scientific' ? 'scientific-mode' : ''}" id="keypad">
          <!-- Scientific Extra Keys -->
          <button class="btn func sci-only" data-val="sin">sin</button>
          <button class="btn func sci-only" data-val="cos">cos</button>
          <button class="btn func sci-only" data-val="tan">tan</button>
          <button class="btn func sci-only" data-val="log">log</button>
          <button class="btn func sci-only" data-val="ln">ln</button>

          <button class="btn func sci-only" data-val="(">(</button>
          <button class="btn func sci-only" data-val=")">)</button>
          <button class="btn func sci-only" data-val="^">x^y</button>
          <button class="btn func sci-only" data-val="sqrt">√x</button>
          <button class="btn func sci-only" data-val="C">C</button>

          <!-- Standard Row 1 -->
          <button class="btn func" data-val="C">C</button>
          <button class="btn func" data-val="CE">CE</button>
          <button class="btn func" data-val="%">%</button>
          <button class="btn op" data-val="/">÷</button>

          <!-- Standard Row 2 -->
          <button class="btn" data-val="7">7</button>
          <button class="btn" data-val="8">8</button>
          <button class="btn" data-val="9">9</button>
          <button class="btn op" data-val="*">×</button>

          <!-- Standard Row 3 -->
          <button class="btn" data-val="4">4</button>
          <button class="btn" data-val="5">5</button>
          <button class="btn" data-val="6">6</button>
          <button class="btn op" data-val="-">−</button>

          <!-- Standard Row 4 -->
          <button class="btn" data-val="1">1</button>
          <button class="btn" data-val="2">2</button>
          <button class="btn" data-val="3">3</button>
          <button class="btn op" data-val="+">+</button>

          <!-- Standard Row 5 -->
          <button class="btn func" data-val="+/-">+/-</button>
          <button class="btn zero" data-val="0">0</button>
          <button class="btn" data-val=".">,</button>
          <button class="btn op" data-val="=">=</button>
        </div>
      </div>
    `;

    this.displayEl = this.shadowRoot.getElementById('display');
    this.historyEl = this.shadowRoot.getElementById('history');
    this.keypadEl = this.shadowRoot.getElementById('keypad');
    this.modeToggleEl = this.shadowRoot.getElementById('mode-toggle');
  }

  setupEventListeners() {
    // Keypad clicks
    this.shadowRoot.querySelectorAll('.keypad .btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.target.dataset.val;
        this.processInput(val);
      });
    });

    // Mode Toggle
    this.shadowRoot.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedMode = e.target.dataset.mode;
        this.setMode(selectedMode);
      });
    });

    // Keyboard support
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    // Only handle if it looks like standard calculator input to avoid conflicts
    const keyMap = {
      'Enter': '=',
      'Escape': 'C',
      'Backspace': 'CE',
      ',': '.',
    };

    let key = keyMap[e.key] || e.key;

    const validKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','=','C','CE','(',')','^','%'];

    if (validKeys.includes(key)) {
      e.preventDefault();
      this.processInput(key);
      this.visualizeKeyPress(key);
    }
  }

  visualizeKeyPress(key) {
      // Find button and add active class briefly
      const btn = this.shadowRoot.querySelector(`.btn[data-val="${key}"]`);
      if (btn) {
          btn.style.transform = 'scale(0.96)';
          btn.style.backgroundColor = 'var(--btn-bg-active)';
          setTimeout(() => {
              btn.style.transform = '';
              btn.style.backgroundColor = '';
          }, 100);
      }
  }

  processInput(val) {
    this.logic.handleInput(val);
    this.updateDisplay();
  }

  updateDisplay() {
    const state = this.logic.getState();

    if (state.isError) {
        this.displayEl.textContent = state.currentValue;
        this.displayEl.classList.add('error');
        this.historyEl.textContent = '';
    } else {
        this.displayEl.classList.remove('error');
        // Replace dot with comma for locale display, except if it's 'Erro'
        let displayVal = state.currentValue.replace('.', ',');
        this.displayEl.textContent = displayVal;

        let historyStr = state.history.replace(/\*/g, '×').replace(/\//g, '÷').replace(/\./g, ',');
        this.historyEl.textContent = historyStr;
    }

    // Scale down text if too long
    if (this.displayEl.textContent.length > 10) {
        this.displayEl.style.fontSize = '32px';
    } else if (this.displayEl.textContent.length > 14) {
        this.displayEl.style.fontSize = '24px';
    } else {
        this.displayEl.style.fontSize = '48px';
    }
  }

  setMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;

    // Update UI toggle
    this.modeToggleEl.className = `mode-toggle ${this.mode === 'scientific' ? 'scientific' : ''}`;

    this.shadowRoot.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.dataset.mode === this.mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update keypad
    if (this.mode === 'scientific') {
        this.keypadEl.classList.add('scientific-mode');
    } else {
        this.keypadEl.classList.remove('scientific-mode');
    }

    // Save to localStorage
    try {
        localStorage.setItem(`${this.uniqueId}mode`, this.mode);
    } catch (e) {
        // Ignored
    }
  }
}
