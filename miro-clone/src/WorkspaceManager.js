export class WorkspaceManager {
  constructor(app) {
    this.app = app;
  }

  bindEvents() {
    this.app.workspaceEl.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
  }

  handleWheel(e) {
    e.preventDefault();

    const zoomSensitivity = 0.001;
    const delta = e.deltaY * -zoomSensitivity;

    const newScale = Math.min(Math.max(0.1, this.app.scale + delta), 5);

    const rect = this.app.workspaceEl.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    this.app.panX = mouseX - (mouseX - this.app.panX) * (newScale / this.app.scale);
    this.app.panY = mouseY - (mouseY - this.app.panY) * (newScale / this.app.scale);
    this.app.scale = newScale;

    this.updateWorkspaceTransform();
  }

  updateWorkspaceTransform() {
    this.app.workspaceContentEl.style.transform = `translate(${this.app.panX}px, ${this.app.panY}px) scale(${this.app.scale})`;
  }

  updateWorkspaceCursor() {
    switch (this.app.currentTool) {
      case 'select':
        this.app.workspaceEl.style.cursor = 'grab';
        break;
      case 'pen':
        this.app.workspaceEl.style.cursor = 'crosshair';
        break;
      default:
        this.app.workspaceEl.style.cursor = 'crosshair';
    }
  }

  getWorkspaceCoords(clientX, clientY) {
    const rect = this.app.workspaceEl.getBoundingClientRect();
    const x = (clientX - rect.left - this.app.panX) / this.app.scale;
    const y = (clientY - rect.top - this.app.panY) / this.app.scale;
    return { x, y };
  }
}
