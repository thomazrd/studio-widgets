import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import styles from './index.css?inline';

class ChecklistWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Inject styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    this.shadowRoot.appendChild(styleElement);

    // Create root container
    const mountPoint = document.createElement('div');
    mountPoint.style.width = '100%';
    mountPoint.style.height = '100%';
    this.shadowRoot.appendChild(mountPoint);

    // Render React App
    this.root = createRoot(mountPoint);
    this.root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    }
  }
}

// Register the custom element if it hasn't been registered yet
if (!customElements.get('checklist-widget')) {
  customElements.define('checklist-widget', ChecklistWidget);
}
