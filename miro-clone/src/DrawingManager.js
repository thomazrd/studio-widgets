export class DrawingManager {
  constructor(app) {
    this.app = app;
  }

  startDrawing(coords) {
    if (this.app.currentTool === 'line') {
      this.app.currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      this.app.currentPath.setAttribute('x1', coords.x);
      this.app.currentPath.setAttribute('y1', coords.y);
      this.app.currentPath.setAttribute('x2', coords.x);
      this.app.currentPath.setAttribute('y2', coords.y);
    } else {
      this.app.currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.app.currentPath.setAttribute('d', `M ${coords.x} ${coords.y}`);
      this.app.currentPath.setAttribute('fill', 'none');
      this.app.currentPath.setAttribute('stroke-linejoin', 'round');
    }

    this.app.currentPath.setAttribute('stroke', this.app.penColorInput.value);
    this.app.currentPath.setAttribute('stroke-width', this.app.penThicknessInput.value);
    this.app.currentPath.setAttribute('stroke-linecap', 'round');
    this.app.drawingLayer.appendChild(this.app.currentPath);
  }

  continueDrawing(coords) {
    if (!this.app.currentPath) return;

    if (this.app.currentTool === 'line') {
       this.app.currentPath.setAttribute('x2', coords.x);
       this.app.currentPath.setAttribute('y2', coords.y);
    } else {
       const d = this.app.currentPath.getAttribute('d');
       this.app.currentPath.setAttribute('d', `${d} L ${coords.x} ${coords.y}`);
    }
  }
}
