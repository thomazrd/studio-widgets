export class ElementFactory {
  constructor(app) {
    this.app = app;
  }

  createElement(type, coords, existingData = null) {
    const el = document.createElement('div');
    el.classList.add('board-element');

    // Position
    el.style.left = (existingData ? existingData.x : coords.x) + 'px';
    el.style.top = (existingData ? existingData.y : coords.y) + 'px';

    // Size & specific classes
    if (type === 'rect' || type === 'circle' || type === 'sticky') {
      const resizeHandle = document.createElement('div');
      resizeHandle.classList.add('resize-handle');
      resizeHandle.addEventListener('pointerdown', (e) => {
        if (this.app.currentTool !== 'select') return;
        e.stopPropagation();
        this.app.selectionManager.selectElement(el, false);
        this.app.isResizingElement = true;

        const wsCoords = this.app.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);
        this.app.elementDragStartX = wsCoords.x;
        this.app.elementDragStartY = wsCoords.y;
        this.app.elementStartWidth = parseFloat(el.style.width || 0);
        this.app.elementStartHeight = parseFloat(el.style.height || 0);
        resizeHandle.setPointerCapture(e.pointerId);
      });
      
      resizeHandle.addEventListener('pointerup', (e) => {
          if (resizeHandle.hasPointerCapture(e.pointerId)) {
              resizeHandle.releasePointerCapture(e.pointerId);
          }
      });
      el.appendChild(resizeHandle);
    }

    if (type === 'rect') {
      el.classList.add('shape-rect');
      el.style.width = (existingData ? existingData.width : 200) + 'px';
      el.style.height = (existingData ? existingData.height : 100) + 'px';
    } else if (type === 'circle') {
      el.classList.add('shape-circle');
      el.style.width = (existingData ? existingData.width : 150) + 'px';
      el.style.height = (existingData ? existingData.height : 150) + 'px';
    } else if (type === 'sticky') {
      el.classList.add('sticky-note');
      const content = document.createElement('div');
      content.classList.add('editable-content');
      content.contentEditable = 'true';
      content.innerHTML = existingData ? existingData.content : 'Nota...';
      el.style.width = (existingData && existingData.width) ? existingData.width + 'px' : '';
      el.style.height = (existingData && existingData.height) ? existingData.height + 'px' : '';
      el.appendChild(content);

      content.addEventListener('input', () => this.app.saveBoardState());
      content.addEventListener('pointerdown', (e) => e.stopPropagation());
      content.addEventListener('keydown', (e) => e.stopPropagation());
    } else if (type === 'text') {
      el.classList.add('text-note');
      const content = document.createElement('div');
      content.classList.add('editable-content');
      content.contentEditable = 'true';
      content.innerHTML = existingData ? existingData.content : 'Texto';
      el.appendChild(content);

      content.addEventListener('input', () => this.app.saveBoardState());
      content.addEventListener('pointerdown', (e) => e.stopPropagation());
      content.addEventListener('keydown', (e) => e.stopPropagation());
    }

    el.dataset.type = type;

    // Selection & Dragging Events
    el.addEventListener('pointerdown', (e) => {
      if (this.app.currentTool !== 'select') return;

      if (type === 'rect' || type === 'circle') {
          const rect = el.getBoundingClientRect();
          const borderWidth = 15;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const w = rect.width;
          const h = rect.height;

          if (type === 'rect') {
              if (x > borderWidth && x < w - borderWidth && y > borderWidth && y < h - borderWidth) {
                  el.style.pointerEvents = 'none';
                  const target = this.app.shadowRoot.elementFromPoint(e.clientX, e.clientY);
                  el.style.pointerEvents = '';
                  e.stopPropagation();
                  if (target && target !== el) {
                      target.dispatchEvent(new PointerEvent(e.type, e));
                      target.dispatchEvent(new MouseEvent('mousedown', e));
                      if (target.isContentEditable) target.focus();
                  }
                  return;
              }
          } else if (type === 'circle') {
              const cx = w / 2;
              const cy = h / 2;
              const r = w / 2;
              const dx = x - cx;
              const dy = y - cy;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < r - borderWidth) {
                  el.style.pointerEvents = 'none';
                  const target = this.app.shadowRoot.elementFromPoint(e.clientX, e.clientY);
                  el.style.pointerEvents = '';
                  e.stopPropagation();
                  if (target && target !== el) {
                      target.dispatchEvent(new PointerEvent(e.type, e));
                      target.dispatchEvent(new MouseEvent('mousedown', e));
                      if (target.isContentEditable) target.focus();
                  }
                  return;
              }
          }
      }

      e.stopPropagation();
      
      if (e.shiftKey) {
          if (this.app.selectedElements.includes(el)) {
              this.app.selectedElements = this.app.selectedElements.filter(s => s !== el);
              el.classList.remove('selected');
          } else {
              this.app.selectionManager.addToSelection(el);
          }
      } else {
          if (!this.app.selectedElements.includes(el)) {
              this.app.selectionManager.selectElement(el, false);
          }
      }

      this.app.isDraggingElement = true;
      const wsCoords = this.app.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);
      this.app.elementDragStartX = wsCoords.x;
      this.app.elementDragStartY = wsCoords.y;
      
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointerup', (e) => {
        if (el.hasPointerCapture(e.pointerId)) {
            el.releasePointerCapture(e.pointerId);
        }
    });

    this.app.workspaceContentEl.appendChild(el);
    if (!existingData) {
      this.app.saveBoardState();
    }
    return el;
  }
}
