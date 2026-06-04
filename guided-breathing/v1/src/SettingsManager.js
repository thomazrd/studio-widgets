export class SettingsManager {
  constructor() {
    this.storageKey = 'guidedBreathingSettings';
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load settings', e);
    }
    return { soundEnabled: true, customTimes: {} };
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings', e);
    }
  }
}
