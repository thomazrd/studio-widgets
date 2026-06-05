export const styles = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    box-sizing: border-box;
    --bg-color: #f3f4f6;
    --calc-bg: #ffffff;
    --text-main: #1f2937;
    --text-sec: #6b7280;
    --btn-bg: #f9fafb;
    --btn-hover: #e5e7eb;
    --btn-active: #d1d5db;
    --btn-op-bg: #3b82f6;
    --btn-op-text: #ffffff;
    --btn-op-hover: #2563eb;
    --btn-danger-bg: #ef4444;
    --btn-danger-text: #ffffff;
    --btn-danger-hover: #dc2626;
    --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    --border-radius: 24px;
    --btn-radius: 16px;
  }

  :host([theme="dark"]) {
    --bg-color: #111827;
    --calc-bg: #1f2937;
    --text-main: #f9fafb;
    --text-sec: #9ca3af;
    --btn-bg: #374151;
    --btn-hover: #4b5563;
    --btn-active: #6b7280;
    --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }

  :host([theme="neon"]) {
    --bg-color: #050505;
    --calc-bg: #111;
    --text-main: #0f0;
    --text-sec: #080;
    --btn-bg: #222;
    --btn-hover: #333;
    --btn-active: #444;
    --btn-op-bg: #0f0;
    --btn-op-text: #000;
    --btn-op-hover: #0c0;
    --btn-danger-bg: #f00;
    --btn-danger-text: #fff;
    --btn-danger-hover: #c00;
    --shadow: 0 0 20px rgba(0, 255, 0, 0.2);
    --border-radius: 0px;
    --btn-radius: 0px;
  }

  * {
    box-sizing: inherit;
  }

  .container {
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    transition: background-color 0.3s ease;
  }

  .calculator {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 100%;
    max-height: 750px;
    background-color: var(--calc-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
  }

  .theme-toggle {
    background: transparent;
    border: none;
    color: var(--text-sec);
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .theme-toggle:hover {
    background-color: var(--btn-hover);
    color: var(--text-main);
  }

  .history-btn {
    background: transparent;
    border: none;
    color: var(--text-sec);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
  }

  .history-btn:hover {
    background-color: var(--btn-hover);
    color: var(--text-main);
  }

  .history-panel {
    position: absolute;
    top: 60px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    background-color: var(--calc-bg);
    z-index: 10;
    border-radius: 16px;
    padding: 20px;
    box-shadow: var(--shadow);
    display: none;
    flex-direction: column;
  }

  .history-panel.open {
    display: flex;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    color: var(--text-main);
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .history-item {
    padding: 10px 0;
    border-bottom: 1px solid var(--btn-hover);
    text-align: right;
  }

  .history-expr {
    color: var(--text-sec);
    font-size: 14px;
  }

  .history-res {
    color: var(--text-main);
    font-size: 20px;
    font-weight: 500;
  }

  .display {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 20px 30px;
    word-wrap: break-word;
    word-break: break-all;
  }

  .previous-operand {
    color: var(--text-sec);
    font-size: 1.5rem;
    min-height: 2rem;
  }

  .current-operand {
    color: var(--text-main);
    font-size: 4rem;
    font-weight: 300;
    line-height: 1.1;
    margin-top: 5px;
  }

  .keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 12px;
    padding: 25px;
    background-color: var(--calc-bg);
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background-color: var(--btn-bg);
    color: var(--text-main);
    font-size: 1.5rem;
    padding: 18px 0;
    border-radius: var(--btn-radius);
    transition: all 0.1s ease;
    user-select: none;
    font-weight: 500;
  }

  button:active {
    background-color: var(--btn-active);
    transform: scale(0.95);
  }

  button.operator {
    background-color: var(--btn-op-bg);
    color: var(--btn-op-text);
  }

  button.operator:hover {
    background-color: var(--btn-op-hover);
  }

  button.operator:active {
    filter: brightness(0.9);
  }

  button.danger {
    background-color: var(--btn-danger-bg);
    color: var(--btn-danger-text);
  }

  button.danger:hover {
    background-color: var(--btn-danger-hover);
  }

  .span-2 {
    grid-column: span 2;
  }
`;
