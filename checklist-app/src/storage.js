const getWidgetId = () => {
  return "6fef6f3b-32be-4994-8f7c-091874a67f75"; // Extracted from widget-id.md
};

const getPrefix = () => `${getWidgetId()}_`;

export const storage = {
  getItem: (key) => {
    const value = localStorage.getItem(`${getPrefix()}${key}`);
    try {
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Error parsing storage item', e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(`${getPrefix()}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving storage item', e);
    }
  },
  removeItem: (key) => {
    localStorage.removeItem(`${getPrefix()}${key}`);
  },
  clear: () => {
    const prefix = getPrefix();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
};
