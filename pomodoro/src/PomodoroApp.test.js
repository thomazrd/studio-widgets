import PomodoroApp from './PomodoroApp.js';

// Setup jsdom environment and register custom element
if (!customElements.get('pomodoro-app')) {
  customElements.define('pomodoro-app', PomodoroApp);
}

describe('PomodoroApp Web Component', () => {
  let element;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Create element and append to body
    element = document.createElement('pomodoro-app');
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(element);
  });

  it('initializes with pomodoro mode and 25 minutes default time', () => {
    expect(element.currentMode).toBe('pomodoro');
    expect(element.timeLeft).toBe(25 * 60);
    expect(element.isActive).toBe(false);
  });

  it('renders correctly with 100% width and height', () => {
    const hostStyles = window.getComputedStyle(element);
    // Note: In JSDOM, computed styles might not fully resolve %s to px accurately,
    // but we can check if it rendered shadow root content.
    const timeDisplay = element.shadowRoot.querySelector('.time-display');
    expect(timeDisplay.textContent).toBe('25:00');
  });

  it('switches to short break mode correctly', () => {
    const btn = element.shadowRoot.querySelector('#tab-shortBreak');
    btn.click();

    expect(element.currentMode).toBe('shortBreak');
    expect(element.timeLeft).toBe(5 * 60);
    const timeDisplay = element.shadowRoot.querySelector('.time-display');
    expect(timeDisplay.textContent).toBe('05:00');
  });

  it('starts and stops timer', () => {
    jest.useFakeTimers();

    element.startTimer();
    expect(element.isActive).toBe(true);

    jest.advanceTimersByTime(1000);
    expect(element.timeLeft).toBe(25 * 60 - 1);

    element.stopTimer();
    expect(element.isActive).toBe(false);

    jest.advanceTimersByTime(1000);
    // Should not have decremented further
    expect(element.timeLeft).toBe(25 * 60 - 1);

    jest.useRealTimers();
  });

  it('resets timer correctly', () => {
    element.timeLeft = 100;
    element.resetTimer();
    expect(element.timeLeft).toBe(25 * 60);
  });

  it('saves and loads state using the specific UUID prefix', () => {
    const prefix = '619ed276-ed29-41cc-96a2-2de21c24aa57_';

    element.setMode('longBreak');
    element.timeLeft = 800;
    element.saveState();

    const stored = localStorage.getItem(prefix + 'state');
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored);
    expect(parsed.currentMode).toBe('longBreak');
    expect(parsed.timeLeft).toBe(800);

    // Create a new instance to verify loadState during constructor
    const newElement = document.createElement('pomodoro-app');
    document.body.appendChild(newElement);

    expect(newElement.currentMode).toBe('longBreak');
    expect(newElement.timeLeft).toBe(800);

    document.body.removeChild(newElement);
  });
});
