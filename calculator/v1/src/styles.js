export const styles = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --bg-color: #f3f4f6;
    --calc-bg: #ffffff;
    --text-main: #1f2937;
    --text-muted: #6b7280;
    --display-bg: #f9fafb;
    --btn-bg: #f3f4f6;
    --btn-bg-hover: #e5e7eb;
    --btn-bg-active: #d1d5db;
    --btn-op-bg: #f97316;
    --btn-op-bg-hover: #ea580c;
    --btn-op-bg-active: #c2410c;
    --btn-op-text: #ffffff;
    --btn-func-bg: #e5e7eb;
    --btn-func-bg-hover: #d1d5db;
    --btn-func-bg-active: #9ca3af;
    --border-radius: 12px;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --transition-speed: 0.15s;
  }

  .calculator-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: var(--calc-bg);
    box-sizing: border-box;
    overflow: hidden;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--calc-bg);
    border-bottom: 1px solid #e5e7eb;
  }

  .mode-toggle {
    display: flex;
    background-color: var(--btn-bg);
    border-radius: 20px;
    padding: 4px;
    position: relative;
  }

  .mode-btn {
    flex: 1;
    background: transparent;
    border: none;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--transition-speed);
    z-index: 1;
  }

  .mode-btn.active {
    color: var(--text-main);
  }

  .mode-indicator {
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: calc(50% - 4px);
    background-color: white;
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .mode-toggle.scientific .mode-indicator {
    transform: translateX(100%);
  }

  .display-section {
    flex: 0 0 auto;
    padding: 24px 16px;
    background-color: var(--display-bg);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    min-height: 100px;
    border-bottom: 1px solid #e5e7eb;
  }

  .history {
    font-size: 16px;
    color: var(--text-muted);
    min-height: 24px;
    margin-bottom: 8px;
    word-break: break-all;
    text-align: right;
  }

  .current-value {
    font-size: 48px;
    font-weight: 300;
    color: var(--text-main);
    word-break: break-all;
    line-height: 1.1;
    text-align: right;
    width: 100%;
  }

  .current-value.error {
    font-size: 36px;
    color: #ef4444;
  }

  .keypad {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 8px;
    padding: 16px;
    background-color: var(--calc-bg);
  }

  .keypad.scientific-mode {
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }

  .btn {
    border: none;
    border-radius: var(--border-radius);
    font-size: 20px;
    font-weight: 400;
    color: var(--text-main);
    background-color: var(--btn-bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-speed), transform 0.1s;
    user-select: none;
    box-shadow: var(--shadow-sm);
  }

  .btn:active {
    background-color: var(--btn-bg-active);
    transform: scale(0.96);
  }

  .btn:hover {
    background-color: var(--btn-bg-hover);
  }

  .btn.op {
    background-color: var(--btn-op-bg);
    color: var(--btn-op-text);
    font-size: 24px;
  }

  .btn.op:hover {
    background-color: var(--btn-op-bg-hover);
  }

  .btn.op:active {
    background-color: var(--btn-op-bg-active);
  }

  .btn.func {
    background-color: var(--btn-func-bg);
  }

  .btn.func:hover {
    background-color: var(--btn-func-bg-hover);
  }

  .btn.func:active {
    background-color: var(--btn-func-bg-active);
  }

  .btn.zero {
    grid-column: span 2;
  }

  .btn.sci-only {
    display: none;
    font-size: 16px;
  }

  .keypad.scientific-mode .btn.sci-only {
    display: flex;
  }

  .keypad.scientific-mode .btn.zero {
    grid-column: span 1;
  }

  /* Responsive adjustments for very small heights */
  @media (max-height: 400px) {
    .display-section {
      padding: 12px 16px;
      min-height: 80px;
    }
    .current-value {
      font-size: 32px;
    }
    .keypad {
      padding: 8px;
      gap: 4px;
    }
    .btn {
      font-size: 18px;
    }
  }
`;
