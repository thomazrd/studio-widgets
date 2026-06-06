const PREFIX = 'e9bbdd3a-4774-4e74-8601-c1647cb3324c_';

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage', error);
  }
}

export function loadFromStorage(key) {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from storage', error);
    return null;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch (error) {
    console.error('Error removing from storage', error);
  }
}
