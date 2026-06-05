import { WIDGET_ID } from './constants.js';

export function saveState(key, value) {
  try {
    localStorage.setItem(`${WIDGET_ID}_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving state', e);
  }
}

export function loadState(key, defaultValue) {
  try {
    const value = localStorage.getItem(`${WIDGET_ID}_${key}`);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error('Error loading state', e);
    return defaultValue;
  }
}
