export const widgetStyles = `
:host {
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  color: #333;
  --bg-color: #f7f9fa;
  --card-bg: #ffffff;
  --primary: #4A90E2;
  --primary-hover: #357ABD;
  --text-main: #2c3e50;
  --text-muted: #7f8c8d;
  --border: #e1e8ed;
  box-sizing: border-box;
}

* {
  box-sizing: inherit;
}

.container {
  background: var(--bg-color);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1, h2, h3 {
  margin: 0;
  color: var(--text-main);
}

header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.sound-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sound-toggle:hover {
  background: #eef2f5;
}

/* Catalog View */
.catalog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.technique-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.technique-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.05);
}

.technique-card h3 {
  font-size: 1.25rem;
}

.technique-card p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.5;
  font-size: 0.95rem;
}

.btn-start {
  align-self: flex-start;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-start:hover {
  background: var(--primary-hover);
}

/* Focus Mode */
.focus-mode {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.focus-mode.active {
  display: flex;
}

.focus-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: auto;
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
}
.btn-back:hover {
  color: var(--text-main);
}

.breathing-area {
  position: relative;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0 auto 0;
}

.breathing-circle {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(74, 144, 226, 0.2);
  border-radius: 50%;
  transition: transform linear; /* Will be controlled by JS for smooth animation */
}

.breathing-core {
  position: absolute;
  width: 100px;
  height: 100px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(74, 144, 226, 0.4);
  z-index: 2;
}

.phase-text {
  position: absolute;
  z-index: 3;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  text-align: center;
}

/* Settings section */
.settings-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.settings-section h3 {
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.setting-item input {
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
}

.btn-save-settings {
  margin-top: 16px;
  background: #eef2f5;
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save-settings:hover {
  background: #e1e8ed;
}

/* Hidden Utility */
.hidden {
  display: none !important;
}
`;
