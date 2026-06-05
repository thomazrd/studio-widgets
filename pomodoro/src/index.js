import PomodoroApp from './PomodoroApp.js';

if (!customElements.get('pomodoro-app')) {
  customElements.define('pomodoro-app', PomodoroApp);
}
