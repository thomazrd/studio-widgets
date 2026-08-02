export class SelectionManager {
  constructor(app) {
    this.app = app;
  }

  selectElement(el, multi = false) {
    if (!multi) {
      this.clearSelection();
    }
    if (!this.app.selectedElements.includes(el)) {
        this.app.selectedElements.push(el);
        el.classList.add('selected');
    }
  }

  addToSelection(el) {
    this.selectElement(el, true);
  }

  clearSelection() {
    this.app.selectedElements.forEach(el => el.classList.remove('selected'));
    this.app.selectedElements = [];
  }

  updateSelectionBox(currentX, currentY) {
    if (!this.app.selectionBoxEl) return;
    const x = Math.min(this.app.selectionBoxStartX, currentX);
    const y = Math.min(this.app.selectionBoxStartY, currentY);
    const w = Math.abs(currentX - this.app.selectionBoxStartX);
    const h = Math.abs(currentY - this.app.selectionBoxStartY);
    this.app.selectionBoxEl.style.left = x + 'px';
    this.app.selectionBoxEl.style.top = y + 'px';
    this.app.selectionBoxEl.style.width = w + 'px';
    this.app.selectionBoxEl.style.height = h + 'px';
  }
}
