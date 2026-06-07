import './style.css';

class MindMapCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.nodes = [];
    this.selectedNodeId = null;
    this.widgetId = 'f2f527a3-b632-4a74-af4e-39de288e951c';
    this.storageKey = `${this.widgetId}-nodes`;
  }

  connectedCallback() {
    this.render();
    this.initDOMReferences();
    this.loadNodes();
    if (this.nodes.length === 0) {
      this.createRootNode();
    }
    this.renderNodes();
    // Defer centering to ensure elements have layout size
    requestAnimationFrame(() => this.centerCanvas());
  }

  initDOMReferences() {
    this.nodesContainer = this.shadowRoot.getElementById('nodes-container');
    this.edgesSvg = this.shadowRoot.getElementById('edges-svg');
    this.contentArea = this.shadowRoot.querySelector('.content-area');
    this.canvasLayer = this.shadowRoot.getElementById('canvas-layer');
    this.isDragging = false;
    this.dragNode = null;
    this.dragOffset = { x: 0, y: 0 };

    this.bindEvents();
  }

  bindEvents() {
    this.nodesContainer.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.contentArea.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));

    // Double click to edit
    this.nodesContainer.addEventListener('dblclick', this.onDoubleClick.bind(this));

    // Global keyboard listeners
    this.shadowRoot.addEventListener('keydown', this.onKeyDown.bind(this));

    // Buttons
    this.shadowRoot.getElementById('add-node-btn').addEventListener('click', () => this.addChildNode());
    this.shadowRoot.getElementById('delete-node-btn').addEventListener('click', () => this.deleteSelectedNode());
    this.shadowRoot.getElementById('save-btn').addEventListener('click', () => this.saveNodes());

    // Make focusable to receive keyboard events
    this.setAttribute('tabindex', '0');
    this.addEventListener('focus', () => {
       // Keep focus inside widget
    });
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  addChildNode() {
    if (!this.selectedNodeId) return;

    const parentNode = this.nodes.find(n => n.id === this.selectedNodeId);
    if (!parentNode) return;

    // Determine position for new child (slightly offset from parent)
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 50;
    const childX = Math.max(0, Math.min(5000, parentNode.x + Math.cos(angle) * distance));
    const childY = Math.max(0, Math.min(5000, parentNode.y + Math.sin(angle) * distance));

    const newNode = {
      id: this.generateId(),
      text: 'Nova Ideia',
      parentId: parentNode.id,
      x: childX,
      y: childY
    };

    this.nodes.push(newNode);
    this.selectedNodeId = newNode.id;
    this.renderNodes();
    this.saveNodes();

    // Automatically enter edit mode for new node
    setTimeout(() => this.enableEditMode(newNode.id), 50);
  }

  deleteSelectedNode() {
    if (!this.selectedNodeId || this.selectedNodeId === 'root') return; // Cannot delete root

    // Find all descendants to delete
    const idsToDelete = new Set([this.selectedNodeId]);
    let added;
    do {
      added = false;
      this.nodes.forEach(node => {
        if (idsToDelete.has(node.parentId) && !idsToDelete.has(node.id)) {
          idsToDelete.add(node.id);
          added = true;
        }
      });
    } while (added);

    this.nodes = this.nodes.filter(node => !idsToDelete.has(node.id));
    this.selectedNodeId = null;
    this.renderNodes();
    this.saveNodes();
  }

  onKeyDown(e) {
    // If editing a node, don't trigger global shortcuts
    if (this.shadowRoot.activeElement && this.shadowRoot.activeElement.tagName === 'TEXTAREA') {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.shadowRoot.activeElement.blur();
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      this.addChildNode();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      this.deleteSelectedNode();
    }
  }

  onDoubleClick(e) {
    const nodeEl = e.target.closest('.node');
    if (nodeEl) {
      this.enableEditMode(nodeEl.dataset.id);
    }
  }

  enableEditMode(nodeId) {
    const nodeEl = this.nodesContainer.querySelector(`[data-id="${nodeId}"]`);
    if (!nodeEl) return;

    const textSpan = nodeEl.querySelector('.node-text');
    const inputEl = nodeEl.querySelector('.node-input');

    textSpan.classList.add('hidden');
    inputEl.classList.remove('hidden');

    // Auto-resize input
    const resizeInput = () => {
      inputEl.style.height = 'auto';
      inputEl.style.height = inputEl.scrollHeight + 'px';
    };

    inputEl.value = textSpan.textContent;
    resizeInput();
    inputEl.focus();
    inputEl.select();

    const finishEdit = () => {
      inputEl.removeEventListener('blur', finishEdit);
      inputEl.removeEventListener('input', resizeInput);

      const newText = inputEl.value.trim() || 'Vazio';
      textSpan.textContent = newText;

      const node = this.nodes.find(n => n.id === nodeId);
      if (node) {
        node.text = newText;
        this.saveNodes();
      }

      textSpan.classList.remove('hidden');
      inputEl.classList.add('hidden');
      this.renderNodes(); // Re-render to update sizing if needed
    };

    inputEl.addEventListener('blur', finishEdit);
    inputEl.addEventListener('input', resizeInput);
  }

  onPointerDown(e) {
    const nodeEl = e.target.closest('.node');
    if (nodeEl) {
      // Don't drag if clicking input
      if (e.target.tagName.toLowerCase() === 'textarea') return;

      const nodeId = nodeEl.dataset.id;
      this.selectedNodeId = nodeId;

      // Update styling without recreating DOM nodes
      this.updateSelectionStyling();

      this.isDragging = true;
      this.dragNode = this.nodes.find(n => n.id === nodeId);

      const rect = this.canvasLayer.getBoundingClientRect();
      // Calculate offset inside the node based on click position relative to center
      const nodeRect = nodeEl.getBoundingClientRect();
      const nodeCenterX = nodeRect.left + nodeRect.width / 2;
      const nodeCenterY = nodeRect.top + nodeRect.height / 2;

      this.dragOffset = {
        x: e.clientX - nodeCenterX,
        y: e.clientY - nodeCenterY
      };

      nodeEl.classList.add('dragging');
      // Capture pointer
      nodeEl.setPointerCapture(e.pointerId);
      e.stopPropagation();
    } else {
      // Clicked on empty canvas, deselect
      if (this.selectedNodeId) {
        this.selectedNodeId = null;
        this.updateSelectionStyling();
      }
    }
  }

  updateSelectionStyling() {
    const allNodes = this.nodesContainer.querySelectorAll('.node');
    allNodes.forEach(node => {
      if (node.dataset.id === this.selectedNodeId) {
        node.classList.add('selected');
      } else {
        node.classList.remove('selected');
      }
    });
  }

  onPointerMove(e) {
    if (!this.isDragging || !this.dragNode) return;

    const rect = this.canvasLayer.getBoundingClientRect();

    // Convert client coordinates to canvas coordinates
    let newX = e.clientX - rect.left - this.dragOffset.x;
    let newY = e.clientY - rect.top - this.dragOffset.y;

    // Bounds check
    newX = Math.max(0, Math.min(newX, 5000));
    newY = Math.max(0, Math.min(newY, 5000));

    this.dragNode.x = newX;
    this.dragNode.y = newY;

    // Fast update: just move the element and redraw edges instead of full re-render
    const nodeEl = this.nodesContainer.querySelector(`[data-id="${this.dragNode.id}"]`);
    if (nodeEl) {
      nodeEl.style.left = `${newX}px`;
      nodeEl.style.top = `${newY}px`;
    }
    this.drawEdges();
  }

  onPointerUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragNode = null;
      const draggingEl = this.nodesContainer.querySelector('.dragging');
      if (draggingEl) {
        draggingEl.classList.remove('dragging');
        draggingEl.releasePointerCapture(e.pointerId);
      }
      this.saveNodes();
    }
  }

  createRootNode() {
    this.nodes.push({
      id: 'root',
      text: 'Ideia Principal',
      parentId: null,
      x: 2500, // Center of 5000x5000 canvas
      y: 2500,
    });
    this.selectedNodeId = 'root';
  }

  loadNodes() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.nodes = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load mind map from localStorage', e);
    }
  }

  saveNodes() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.nodes));

      // Visual feedback for saving
      const saveBtnSpan = this.shadowRoot.querySelector('#save-btn span');
      if (saveBtnSpan) {
        const originalText = saveBtnSpan.textContent;
        saveBtnSpan.textContent = 'Saved!';
        setTimeout(() => {
          if (saveBtnSpan.textContent === 'Saved!') {
            saveBtnSpan.textContent = originalText;
          }
        }, 2000);
      }
    } catch (e) {
      console.error('Failed to save mind map to localStorage', e);
    }
  }

  renderNodes() {
    this.nodesContainer.innerHTML = '';
    this.nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.className = `node ${node.id === 'root' ? 'root-node' : ''} ${this.selectedNodeId === node.id ? 'selected' : ''}`;
      nodeEl.dataset.id = node.id;
      nodeEl.style.left = `${node.x}px`;
      nodeEl.style.top = `${node.y}px`;

      const textSpan = document.createElement('span');
      textSpan.className = 'node-text';
      textSpan.textContent = node.text;

      const inputEl = document.createElement('textarea');
      inputEl.className = 'node-input hidden';
      inputEl.value = node.text;
      inputEl.rows = 1;

      nodeEl.appendChild(textSpan);
      nodeEl.appendChild(inputEl);
      this.nodesContainer.appendChild(nodeEl);
    });

    this.drawEdges();
  }

  drawEdges() {
    this.edgesSvg.innerHTML = '';
    this.nodes.forEach(node => {
      if (node.parentId) {
        const parentNode = this.nodes.find(n => n.id === node.parentId);
        if (parentNode) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          // Draw bezier curve from parent to child
          const d = `M ${parentNode.x} ${parentNode.y} C ${parentNode.x} ${(parentNode.y + node.y) / 2}, ${node.x} ${(parentNode.y + node.y) / 2}, ${node.x} ${node.y}`;
          path.setAttribute('d', d);
          this.edgesSvg.appendChild(path);
        }
      }
    });
  }

  centerCanvas() {
    // Center the 5000x5000 canvas in the view
    if (this.contentArea && this.nodes.length > 0) {
      const rootNode = this.nodes.find(n => n.id === 'root') || this.nodes[0];
      const viewWidth = this.contentArea.clientWidth;
      const viewHeight = this.contentArea.clientHeight;
      this.contentArea.scrollLeft = rootNode.x - viewWidth / 2;
      this.contentArea.scrollTop = rootNode.y - viewHeight / 2;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="root">
        <header class="static-header">
          <div class="controls">
            <button id="add-node-btn" title="Add Child Node (Tab)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button id="delete-node-btn" title="Delete Node (Delete)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <div class="spacer"></div>
            <button id="save-btn" title="Save to Local Storage">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              <span>Save</span>
            </button>
          </div>
        </header>
        <div class="content-area">
          <div class="canvas-layer" id="canvas-layer">
            <svg id="edges-svg" width="100%" height="100%"></svg>
            <div id="nodes-container"></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('mind-map-canvas', MindMapCanvas);
