export const styles = `
:host {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  box-sizing: border-box;
  --primary-color: #2c3e50;
  --accent-color: #3498db;
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --header-height: 60px;
}

:host(.dark-theme) {
  --primary-color: #1a1a2e;
  --accent-color: #0f3460;
  --bg-color: #16213e;
  --text-color: #e94560;
  --border-color: #2c3e50;
  color: #e0e0e0;
  background-color: #1a1a1d;
}

*, *::before, *::after {
  box-sizing: inherit;
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 20px;
  background-color: var(--primary-color);
  color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.header h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.header-controls {
  display: flex;
  gap: 10px;
}

select, button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

button {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  transition: background-color 0.2s;
}

button:hover {
  opacity: 0.9;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 250px;
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
  background-color: rgba(0,0,0,0.02);
  position: sticky;
  top: 0;
  z-index: 5;
}

.book-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.book-item {
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.book-item:hover, .book-item.active {
  background-color: rgba(0,0,0,0.05);
  font-weight: 500;
}

:host(.dark-theme) .book-item:hover, :host(.dark-theme) .book-item.active {
  background-color: rgba(255,255,255,0.05);
}

.reader-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.chapter-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.chapter-select {
  padding: 8px;
  font-size: 1rem;
}

.verse {
  display: flex;
  margin-bottom: 12px;
  line-height: 1.6;
  font-size: 1.1rem;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.verse:hover {
  background-color: rgba(0,0,0,0.02);
}

:host(.dark-theme) .verse:hover {
  background-color: rgba(255,255,255,0.02);
}

.verse-num {
  font-size: 0.8em;
  font-weight: bold;
  color: var(--accent-color);
  margin-right: 10px;
  min-width: 25px;
  text-align: right;
  user-select: none;
}

.verse-text {
  flex: 1;
}

.verse-actions {
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  gap: 5px;
}

.verse:hover .verse-actions {
  opacity: 1;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 2px 5px;
  font-size: 1.2rem;
  opacity: 0.6;
}

.icon-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.icon-btn.active {
  color: #f1c40f;
  opacity: 1;
}

.favorites-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background-color: var(--bg-color);
  border-left: 1px solid var(--border-color);
  box-shadow: -2px 0 5px rgba(0,0,0,0.05);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.favorites-panel.open {
  transform: translateX(0);
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  padding: 0;
}

.favorites-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  list-style: none;
  margin: 0;
}

.favorite-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.favorite-ref {
  font-weight: bold;
  font-size: 0.9em;
  color: var(--accent-color);
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.favorite-text {
  font-size: 0.9em;
  font-style: italic;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-style: italic;
  color: var(--text-color);
  opacity: 0.7;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .menu-toggle {
    display: block !important;
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  margin-right: 10px;
}

.overlay {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 15;
}

.overlay.active {
  display: block;
}
`;
