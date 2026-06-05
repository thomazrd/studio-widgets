# Calculator Widget

A robust, feature-rich web component calculator designed for seamless integration.

## Features
- **Standard Mode:** Basic operations (+, -, *, /), percentage, sign inversion, and clear.
- **Scientific Mode:** Advanced functions including powers, square root, sine, cosine, tangent, logarithms, and parentheses.
- **Responsive & Liquid Layout:** Occupies 100% of the host container width and height with zero margins and borders.
- **Keyboard Support:** Full physical keyboard support (numpad and standard number keys).
- **Persistent State:** Saves the last used mode (Standard/Scientific) using native `localStorage` with a unique ID prefix.
- **Error Handling:** Graceful error messages for invalid operations (e.g., division by zero).

## Integration
The widget is built as a pure, independent Web Component encapsulating all its HTML, CSS, and JS. Import the `dist/index.js` file and embed the `<calculator-widget></calculator-widget>` tag into your page.
