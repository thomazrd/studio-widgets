const WIDGET_ID = 'c7f2de43-63d4-4862-b9a2-50b65d372935';

export function saveState(key, value) {
  try {
    localStorage.setItem(`${WIDGET_ID}_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function loadState(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(`${WIDGET_ID}_${key}`);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage', e);
    return defaultValue;
  }
}

export function saveHistory(entry) {
  const history = loadState('history', []);
  history.unshift(entry);
  if (history.length > 50) history.pop();
  saveState('history', history);
}

export function loadHistory() {
  return loadState('history', []);
}

export function clearHistory() {
  saveState('history', []);
}
