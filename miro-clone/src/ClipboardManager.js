export class ClipboardManager {
  constructor(app) {
    this.app = app;
  }

  handleGlobalKeyDown(e) {
    if (this.app.boardViewEl.style.display !== 'block') return;
    if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.app.selectedElements.length > 0) {
            this.app.selectedElements.forEach(el => el.remove());
            this.app.selectionManager.clearSelection();
            this.app.saveBoardState();
        }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
            this.app.redo();
        } else {
            this.app.undo();
        }
        e.preventDefault();
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        this.app.redo();
        e.preventDefault();
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
       if (this.app.selectedElements.length > 0) {
           this.app.clipboard = this.app.selectedElements.map(el => {
               const data = {
                   type: el.dataset.type || el.tagName.toLowerCase(),
                   x: parseFloat(el.style.left || 0),
                   y: parseFloat(el.style.top || 0)
               };
               
               if (data.type === 'line' || data.type === 'path') {
                   if (data.type === 'line') {
                       data.x1 = el.getAttribute('x1');
                       data.y1 = el.getAttribute('y1');
                       data.x2 = el.getAttribute('x2');
                       data.y2 = el.getAttribute('y2');
                   } else {
                       data.d = el.getAttribute('d');
                   }
                   data.stroke = el.getAttribute('stroke');
                   data.strokeWidth = el.getAttribute('stroke-width');
                   data.transform = el.getAttribute('transform') || '';
               } else {
                   if (data.type === 'rect' || data.type === 'circle' || data.type === 'sticky') {
                       data.width = parseFloat(el.style.width || el.offsetWidth);
                       data.height = parseFloat(el.style.height || el.offsetHeight);
                   }
                   if (data.type === 'sticky' || data.type === 'text') {
                       data.content = el.querySelector('.editable-content').innerHTML;
                   }
               }
               return data;
           });
       }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
       if (this.app.clipboard && this.app.clipboard.length > 0) {
           this.app.selectionManager.clearSelection();
           const pastedElements = [];
           this.app.clipboard.forEach(data => {
               if (data.type === 'line' || data.type === 'path') {
                   let el;
                   if (data.type === 'line') {
                       el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                       el.setAttribute('x1', data.x1);
                       el.setAttribute('y1', data.y1);
                       el.setAttribute('x2', data.x2);
                       el.setAttribute('y2', data.y2);
                   } else {
                       el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                       el.setAttribute('d', data.d);
                       el.setAttribute('fill', 'none');
                       el.setAttribute('stroke-linejoin', 'round');
                   }
                   el.setAttribute('stroke', data.stroke || '#050038');
                   el.setAttribute('stroke-width', data.strokeWidth || '4');
                   el.setAttribute('stroke-linecap', 'round');
                   
                   const match = (data.transform || '').match(/translate\(([^,]+),([^)]+)\)/);
                   let currentTx = 0, currentTy = 0;
                   if (match) {
                       currentTx = parseFloat(match[1]);
                       currentTy = parseFloat(match[2]);
                   }
                   
                   data.transform = `translate(${currentTx + 20}, ${currentTy + 20})`;
                   el.setAttribute('transform', data.transform);
                   
                   this.app.drawingLayer.appendChild(el);
                   pastedElements.push(el);
               } else {
                   const offsetData = { ...data, x: data.x + 20, y: data.y + 20 };
                   const el = this.app.elementFactory.createElement(data.type, null, offsetData);
                   pastedElements.push(el);
                   data.x += 20;
                   data.y += 20;
               }
           });
           pastedElements.forEach(el => this.app.selectionManager.addToSelection(el));
           this.app.saveBoardState();
       }
    }
  }
}
