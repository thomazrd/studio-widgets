export default class PomodoroApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.storagePrefix = '619ed276-ed29-41cc-96a2-2de21c24aa57_';

    // Default Configurations
    this.modes = {
      pomodoro: { time: 25 * 60, label: 'Pomodoro', color: '#ff4b4b' },
      shortBreak: { time: 5 * 60, label: 'Short Break', color: '#38a169' },
      longBreak: { time: 15 * 60, label: 'Long Break', color: '#3182ce' }
    };

    // State
    this.currentMode = 'pomodoro';
    this.isActive = false;
    this.timerId = null;

    this.loadState();
    if (!this.timeLeft) {
      this.timeLeft = this.modes[this.currentMode].time;
    }
  }

  saveState() {
    const state = {
      currentMode: this.currentMode,
      timeLeft: this.timeLeft
    };
    localStorage.setItem(this.storagePrefix + 'state', JSON.stringify(state));
  }

  loadState() {
    const saved = localStorage.getItem(this.storagePrefix + 'state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.currentMode = state.currentMode || 'pomodoro';
        this.timeLeft = state.timeLeft !== undefined ? state.timeLeft : this.modes[this.currentMode].time;
      } catch (e) {
        console.error('Error parsing stored state', e);
      }
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.stopTimer();
  }

  startTimer() {
    if (this.isActive) return;
    this.isActive = true;
    this.timerId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimeDisplay();
        this.saveState();
      } else {
        this.stopTimer();
        this.handleTimerComplete();
      }
    }, 1000);
    this.updateControls();
  }

  stopTimer() {
    if (!this.isActive) return;
    this.isActive = false;
    clearInterval(this.timerId);
    this.updateControls();
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = this.modes[this.currentMode].time;
    this.updateTimeDisplay();
    this.saveState();
  }

  setMode(mode) {
    if (this.modes[mode]) {
      this.currentMode = mode;
      this.resetTimer();
      this.saveState();
      // We will re-render later to update colors/active tabs
      this.render();
      this.setupEventListeners();
    }
  }

  handleTimerComplete() {
    // Notify or auto-switch logic could go here
    // For now, we just reset the current timer visually
    this.resetTimer();
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  updateTimeDisplay() {
    const timeEl = this.shadowRoot.querySelector('.time-display');
    if (timeEl) {
      timeEl.textContent = this.formatTime(this.timeLeft);
    }

    // Update SVG progress ring
    const progressCircle = this.shadowRoot.querySelector('.progress');
    if (progressCircle) {
      const totalTime = this.modes[this.currentMode].time;
      const progressPercent = ((totalTime - this.timeLeft) / totalTime) * 100;
      const radius = 120;
      const circumference = 2 * Math.PI * radius;
      const dashoffset = circumference - (progressPercent / 100) * circumference;
      progressCircle.style.strokeDashoffset = dashoffset;
    }
  }

  updateControls() {
    const playBtn = this.shadowRoot.querySelector('#play-btn');
    if (playBtn) {
      playBtn.textContent = this.isActive ? 'Pause' : 'Start';
    }
  }

  setupEventListeners() {
    const playBtn = this.shadowRoot.querySelector('#play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.isActive) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
      });
    }

    const resetBtn = this.shadowRoot.querySelector('#reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetTimer());
    }

    ['pomodoro', 'shortBreak', 'longBreak'].forEach(mode => {
      const btn = this.shadowRoot.querySelector(`#tab-${mode}`);
      if (btn) {
        btn.addEventListener('click', () => this.setMode(mode));
      }
    });
  }

  render() {
    const isPomodoro = this.currentMode === 'pomodoro';
    const isShortBreak = this.currentMode === 'shortBreak';
    const isLongBreak = this.currentMode === 'longBreak';
    const totalTime = this.modes[this.currentMode].time;
    const progressPercent = ((totalTime - this.timeLeft) / totalTime) * 100;

    // SVG Circle parameters
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (progressPercent / 100) * circumference;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          --pomodoro-bg: #E35E55;
          --short-break-bg: #4CA6A9;
          --long-break-bg: #498FC1;
          --transition-speed: 0.5s;
        }

        .container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--${this.currentMode === 'pomodoro' ? 'pomodoro' : this.currentMode === 'shortBreak' ? 'short-break' : 'long-break'}-bg);
          color: white;
          transition: background-color var(--transition-speed) ease;
        }

        .tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 5px;
          margin-bottom: 40px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .tab {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 25px;
          transition: all 0.3s ease;
        }

        .tab.active {
          background: white;
          color: var(--${this.currentMode === 'pomodoro' ? 'pomodoro' : this.currentMode === 'shortBreak' ? 'short-break' : 'long-break'}-bg);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .timer-ring {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timer-ring svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .timer-ring circle {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
        }

        .timer-ring .bg {
          stroke: rgba(255, 255, 255, 0.2);
        }

        .timer-ring .progress {
          stroke: white;
          stroke-dasharray: ${circumference};
          stroke-dashoffset: ${dashoffset};
          transition: stroke-dashoffset 1s linear;
        }

        .time-display {
          font-size: 5.5rem;
          font-weight: 700;
          letter-spacing: 2px;
          position: relative;
          z-index: 10;
        }

        .controls {
          margin-top: 40px;
          display: flex;
          gap: 20px;
        }

        .btn {
          border: none;
          padding: 15px 40px;
          font-size: 1.2rem;
          font-weight: 700;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.2s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .btn:active {
          transform: scale(0.95);
        }

        .btn-play {
          background-color: white;
          color: var(--${this.currentMode === 'pomodoro' ? 'pomodoro' : this.currentMode === 'shortBreak' ? 'short-break' : 'long-break'}-bg);
        }

        .btn-reset {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }
      </style>
      <div class="container">
        <div class="tabs">
          <button id="tab-pomodoro" class="tab ${isPomodoro ? 'active' : ''}">Pomodoro</button>
          <button id="tab-shortBreak" class="tab ${isShortBreak ? 'active' : ''}">Short Break</button>
          <button id="tab-longBreak" class="tab ${isLongBreak ? 'active' : ''}">Long Break</button>
        </div>

        <div class="timer-ring">
          <svg>
            <circle class="bg" cx="150" cy="150" r="120"></circle>
            <circle class="progress" cx="150" cy="150" r="120"></circle>
          </svg>
          <div class="time-display">${this.formatTime(this.timeLeft)}</div>
        </div>

        <div class="controls">
          <button id="play-btn" class="btn btn-play">${this.isActive ? 'Pause' : 'Start'}</button>
          <button id="reset-btn" class="btn btn-reset">Reset</button>
        </div>
      </div>
    `;
  }
}
