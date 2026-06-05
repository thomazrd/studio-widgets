import { styles } from './styles.js';
import { Calculator } from './calculator.js';
import { saveState, loadState, saveHistory, loadHistory, clearHistory } from './storage.js';

class CalculadoraWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.calculator = new Calculator();
    this.themes = ['light', 'dark', 'neon'];
    this.currentThemeIndex = this.themes.indexOf(loadState('theme', 'light'));
    if (this.currentThemeIndex === -1) this.currentThemeIndex = 0;
  }

  connectedCallback() {
    this.render();
    this.setTheme(this.themes[this.currentThemeIndex]);
    this.setupEventListeners();
    this.updateDisplay();
  }

  setTheme(theme) {
    this.setAttribute('theme', theme);
    saveState('theme', theme);
  }

  toggleTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    this.setTheme(this.themes[this.currentThemeIndex]);
    const themeBtn = this.shadowRoot.querySelector('.theme-toggle');
    themeBtn.textContent = `Tema: ${this.themes[this.currentThemeIndex].toUpperCase()}`;
  }

  setupEventListeners() {
    const root = this.shadowRoot;

    // Numbers
    root.querySelectorAll('[data-number]').forEach(button => {
      button.addEventListener('click', () => {
        this.calculator.appendNumber(button.innerText);
        this.updateDisplay();
      });
    });

    // Operators
    root.querySelectorAll('[data-operation]').forEach(button => {
      button.addEventListener('click', () => {
        this.calculator.chooseOperation(button.innerText);
        this.updateDisplay();
      });
    });

    // Equals
    root.querySelector('[data-equals]').addEventListener('click', () => {
      const result = this.calculator.compute();
      if (result) {
        saveHistory(result);
        this.renderHistory();
      }
      this.updateDisplay();
    });

    // Clear All
    root.querySelector('[data-all-clear]').addEventListener('click', () => {
      this.calculator.clear();
      this.updateDisplay();
    });

    // Delete
    root.querySelector('[data-delete]').addEventListener('click', () => {
      this.calculator.delete();
      this.updateDisplay();
    });

    // Theme Toggle
    root.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());

    // History Toggle
    const historyBtn = root.querySelector('.history-btn');
    const historyPanel = root.querySelector('.history-panel');
    historyBtn.addEventListener('click', () => {
      historyPanel.classList.toggle('open');
      this.renderHistory();
    });

    root.querySelector('.close-history').addEventListener('click', () => {
      historyPanel.classList.remove('open');
    });

    root.querySelector('.clear-history').addEventListener('click', () => {
      clearHistory();
      this.renderHistory();
    });
  }

  updateDisplay() {
    const root = this.shadowRoot;
    root.querySelector('[data-current-operand]').innerText = this.calculator.currentOperand;
    if (this.calculator.operation != null) {
      root.querySelector('[data-previous-operand]').innerText =
        `${this.calculator.previousOperand} ${this.calculator.operation}`;
    } else {
      root.querySelector('[data-previous-operand]').innerText = '';
    }
  }

  renderHistory() {
    const historyList = this.shadowRoot.querySelector('.history-list');
    const history = loadHistory();

    if (history.length === 0) {
      historyList.innerHTML = '<li class="history-item"><div class="history-expr">Nenhum histórico</div></li>';
      return;
    }

    historyList.innerHTML = history.map(item => `
      <li class="history-item">
        <div class="history-expr">${item.expression}</div>
        <div class="history-res">=${item.result}</div>
      </li>
    `).join('');
  }

  render() {
    const template = document.createElement('template');
    const currentThemeName = this.themes[this.currentThemeIndex].toUpperCase();
    template.innerHTML = `
      <style>${styles}</style>
      <div class="container">
        <div class="calculator">

          <div class="header">
            <button class="theme-toggle">Tema: ${currentThemeName}</button>
            <button class="history-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </button>
          </div>

          <div class="history-panel">
            <div class="history-header">
              <span>Histórico</span>
              <div>
                <button class="history-btn clear-history" title="Limpar Histórico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
                <button class="history-btn close-history">✕</button>
              </div>
            </div>
            <ul class="history-list"></ul>
          </div>

          <div class="display">
            <div data-previous-operand class="previous-operand"></div>
            <div data-current-operand class="current-operand">0</div>
          </div>

          <div class="keypad">
            <button data-all-clear class="danger span-2">AC</button>
            <button data-delete>DEL</button>
            <button data-operation class="operator">÷</button>

            <button data-number>7</button>
            <button data-number>8</button>
            <button data-number>9</button>
            <button data-operation class="operator">×</button>

            <button data-number>4</button>
            <button data-number>5</button>
            <button data-number>6</button>
            <button data-operation class="operator">-</button>

            <button data-number>1</button>
            <button data-number>2</button>
            <button data-number>3</button>
            <button data-operation class="operator">+</button>

            <button data-number class="span-2">0</button>
            <button data-number>.</button>
            <button data-equals class="operator">=</button>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('calculadora-widget', CalculadoraWidget);
