import { BoardStore } from './BoardStore.js';
import { template } from './Template.js';
import { DashboardManager } from './DashboardManager.js';
import { WorkspaceManager } from './WorkspaceManager.js';
import { SelectionManager } from './SelectionManager.js';
import { ClipboardManager } from './ClipboardManager.js';
import { DrawingManager } from './DrawingManager.js';
import { ElementFactory } from './ElementFactory.js';

class MiroClone extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Elements
    this.dashboardEl = this.shadowRoot.getElementById('dashboard');
    this.boardsGridEl = this.shadowRoot.getElementById('boards-grid');
    this.newBoardBtn = this.shadowRoot.getElementById('new-board-btn');

    this.boardViewEl = this.shadowRoot.getElementById('board-view');
    this.backBtn = this.shadowRoot.getElementById('back-btn');
    this.boardTitleInput = this.shadowRoot.getElementById('board-title-input');
    this.workspaceEl = this.shadowRoot.getElementById('board-workspace');
    this.workspaceContentEl = this.shadowRoot.getElementById('workspace-content');
    this.drawingLayer = this.shadowRoot.getElementById('drawing-layer');
    this.toolBtns = this.shadowRoot.querySelectorAll('.toolbar .tool-btn');
    this.penOptionsEl = this.shadowRoot.getElementById('pen-options');
    this.penColorInput = this.shadowRoot.getElementById('pen-color');
    this.penThicknessInput = this.shadowRoot.getElementById('pen-thickness');
    this.lockBtn = this.shadowRoot.getElementById('lock-btn');
    this.undoBtn = this.shadowRoot.getElementById('undo-btn');
    this.redoBtn = this.shadowRoot.getElementById('redo-btn');

    // Unique ID for widget instance isolation
    this.instanceId = this.generateInstanceId();
    this.boardStore = new BoardStore(this.instanceId);

    // State
    this.currentBoardId = null;
    this.currentTool = 'select'; // select, pen, line, rect, circle, sticky, text
    this.workspaceEl.dataset.tool = 'select';

    // Pan & Zoom State
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.isSpaceDown = false;
    this.startX = 0;
    this.startY = 0;

    // Tools State
    this.isDrawing = false;
    this.currentPath = null;
    this.elements = [];

    // Selection state
    this.selectedElements = [];
    
    // History State
    this.undoStack = [];
    this.redoStack = [];
    this.isRestoringState = false;
    this.isDraggingElement = false;
    this.isResizingElement = false;
    this.elementDragStartX = 0;
    this.elementDragStartY = 0;
    this.elementStartWidth = 0;
    this.elementStartHeight = 0;

    // Multi-selection & Clipboard
    this.isDrawingSelection = false;
    this.selectionBoxStartX = 0;
    this.selectionBoxStartY = 0;
    this.selectionBoxEl = null;
    this.clipboard = [];

    // Initialize Managers
    this.dashboardManager = new DashboardManager(this);
    this.workspaceManager = new WorkspaceManager(this);
    this.selectionManager = new SelectionManager(this);
    this.clipboardManager = new ClipboardManager(this);
    this.drawingManager = new DrawingManager(this);
    this.elementFactory = new ElementFactory(this);
  }

  generateInstanceId() {
    let id = localStorage.getItem('miro_clone_instance_id');
    if (!id) {
      id = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('miro_clone_instance_id', id);
    }
    return id;
  }

  handleGlobalKeyDown = (e) => {
    if (e.code === 'Space' && !this.isSpaceDown && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.isContentEditable) {
      this.isSpaceDown = true;
      if (this.currentTool === 'select') {
        this.workspaceEl.style.cursor = 'grab';
      }
    }
    this.clipboardManager.handleGlobalKeyDown(e);
  };

  handleGlobalKeyUp = (e) => {
    if (e.code === 'Space') {
      this.isSpaceDown = false;
      this.workspaceManager.updateWorkspaceCursor();
    }
  };

  connectedCallback() {
    this.bindEvents();
    this.dashboardManager.renderDashboard();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  bindEvents() {
    this.newBoardBtn.addEventListener('click', () => this.dashboardManager.createNewBoard());
    this.backBtn.addEventListener('click', () => this.dashboardManager.showDashboard());
    this.undoBtn.addEventListener('click', () => this.undo());
    this.redoBtn.addEventListener('click', () => this.redo());
    this.lockBtn.addEventListener('click', () => this.toggleLock());

    this.boardTitleInput.addEventListener('change', (e) => {
      if (this.currentBoardId) {
        this.boardStore.updateBoard(this.currentBoardId, { title: e.target.value });
      }
    });

    this.toolBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toolBtns.forEach(b => b.classList.remove('active'));
        const targetBtn = e.currentTarget;
        targetBtn.classList.add('active');
        this.currentTool = targetBtn.dataset.tool;
        this.workspaceEl.dataset.tool = this.currentTool;
        this.workspaceManager.updateWorkspaceCursor();
        this.selectionManager.clearSelection();

        if (this.currentTool === 'pen' || this.currentTool === 'line') {
          this.penOptionsEl.classList.add('visible');
        } else {
          this.penOptionsEl.classList.remove('visible');
        }
      });
    });

    document.addEventListener('keydown', this.handleGlobalKeyDown);
    document.addEventListener('keyup', this.handleGlobalKeyUp);
    this.workspaceManager.bindEvents();
    this.bindWorkspacePointerEvents();
  }

  unbindEvents() {
    document.removeEventListener('keydown', this.handleGlobalKeyDown);
    document.removeEventListener('keyup', this.handleGlobalKeyUp);
    if (this.handlePointerMove) window.removeEventListener('pointermove', this.handlePointerMove);
    if (this.handlePointerUp) window.removeEventListener('pointerup', this.handlePointerUp);
  }

  bindWorkspacePointerEvents() {
    this.drawingLayer.addEventListener('pointerdown', (e) => {
        const board = this.boardStore.getBoard(this.currentBoardId);
        if (board && board.isLocked) return;
        if (this.currentTool !== 'select') return;
        const target = e.target;
        if (target.tagName.toLowerCase() === 'line' || target.tagName.toLowerCase() === 'path') {
            e.stopPropagation();
            
            if (e.shiftKey) {
                if (this.selectedElements.includes(target)) {
                    this.selectedElements = this.selectedElements.filter(s => s !== target);
                    target.classList.remove('selected');
                } else {
                    this.selectionManager.addToSelection(target);
                }
            } else {
                if (!this.selectedElements.includes(target)) {
                    this.selectionManager.selectElement(target, false);
                }
            }

            this.isDraggingElement = true;
            const wsCoords = this.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);
            this.elementDragStartX = wsCoords.x;
            this.elementDragStartY = wsCoords.y;
            target.setPointerCapture(e.pointerId);
        }
    });

    this.drawingLayer.addEventListener('pointerup', (e) => {
        const target = e.target;
        if (target.hasPointerCapture && target.hasPointerCapture(e.pointerId)) {
            target.releasePointerCapture(e.pointerId);
        }
    });

    this.workspaceEl.addEventListener('contextmenu', (e) => e.preventDefault());

    // Pointer Down
    this.workspaceEl.addEventListener('pointerdown', (e) => {
      const isDirectClick = e.target === this.workspaceEl || e.target === this.workspaceContentEl || e.target === this.drawingLayer;
      const board = this.boardStore.getBoard(this.currentBoardId);
      const isLocked = board ? board.isLocked : false;

      if (e.button === 1 || e.button === 2 || (e.button === 0 && (this.isSpaceDown || isLocked))) {
        this.isPanning = true;
        this.startX = e.clientX - this.panX;
        this.startY = e.clientY - this.panY;
        this.workspaceEl.style.cursor = 'grabbing';
        if (!isLocked) {
           this.selectionManager.clearSelection();
        }
      } else if (e.button === 0 && !isLocked) {
        const coords = this.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);

        if (this.currentTool === 'select' && isDirectClick) {
          if (this.selectedElements.length > 0) {
              this.isDraggingElement = true;
              this.didDragElement = false;
              this.draggedFromWorkspace = true;
              this.elementDragStartX = coords.x;
              this.elementDragStartY = coords.y;
          } else {
              this.isDrawingSelection = true;
              this.selectionBoxStartX = coords.x;
              this.selectionBoxStartY = coords.y;
              if (!e.shiftKey) {
                 this.selectionManager.clearSelection();
              }
              this.selectionBoxEl = document.createElement('div');
              this.selectionBoxEl.className = 'selection-box';
              this.workspaceContentEl.appendChild(this.selectionBoxEl);
              this.selectionManager.updateSelectionBox(coords.x, coords.y);
          }
        } else if (this.currentTool === 'pen' || this.currentTool === 'line') {
          this.isDrawing = true;
          this.drawingManager.startDrawing(coords);
        } else if (['rect', 'circle', 'sticky', 'text'].includes(this.currentTool) && isDirectClick) {
          this.elementFactory.createElement(this.currentTool, coords);
          this.toolBtns[0].click();
        }
      }
    });

    // Pointer Move
    this.handlePointerMove = (e) => {
      if (this.isPanning) {
        this.panX = e.clientX - this.startX;
        this.panY = e.clientY - this.startY;
        this.workspaceManager.updateWorkspaceTransform();
      } else if (this.isDrawing) {
        const coords = this.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);
        this.drawingManager.continueDrawing(coords);
      } else if (this.isDrawingSelection) {
        const coords = this.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);
        this.selectionManager.updateSelectionBox(coords.x, coords.y);
      } else if (this.isDraggingElement && this.selectedElements.length > 0) {
        const coords = this.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);
        const dx = coords.x - this.elementDragStartX;
        const dy = coords.y - this.elementDragStartY;

        if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
            this.didDragElement = true;
        }

        this.selectedElements.forEach(el => {
            if (el.tagName.toLowerCase() === 'line' || el.tagName.toLowerCase() === 'path') {
                const currentTransform = el.getAttribute('transform') || '';
                const match = currentTransform.match(/translate\(([^,]+),([^)]+)\)/);
                let currentTx = 0;
                let currentTy = 0;
                if (match) {
                    currentTx = parseFloat(match[1]);
                    currentTy = parseFloat(match[2]);
                }
                el.setAttribute('transform', `translate(${currentTx + dx}, ${currentTy + dy})`);
            } else {
                const currentLeft = parseFloat(el.style.left || 0);
                const currentTop = parseFloat(el.style.top || 0);
                el.style.left = (currentLeft + dx) + 'px';
                el.style.top = (currentTop + dy) + 'px';
            }
        });

        this.elementDragStartX = coords.x;
        this.elementDragStartY = coords.y;
      } else if (this.isResizingElement && this.selectedElements.length > 0) {
        const coords = this.workspaceManager.getWorkspaceCoords(e.clientX, e.clientY);
        const dx = coords.x - this.elementDragStartX;
        const dy = coords.y - this.elementDragStartY;

        let newWidth = Math.max(50, this.elementStartWidth + dx);
        let newHeight = Math.max(50, this.elementStartHeight + dy);

        const el = this.selectedElements[0];
        if (el.dataset.type === 'circle') {
            const maxDim = Math.max(newWidth, newHeight);
            newWidth = maxDim;
            newHeight = maxDim;
        }

        el.style.width = newWidth + 'px';
        el.style.height = newHeight + 'px';
      }
    };
    window.addEventListener('pointermove', this.handlePointerMove);

    // Pointer Up
    this.handlePointerUp = (e) => {
      if (this.isPanning) {
        this.isPanning = false;
        this.workspaceManager.updateWorkspaceCursor();
      }
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveBoardState();
      }
      if (this.isDrawingSelection) {
        this.isDrawingSelection = false;
        if (this.selectionBoxEl) {
           const boxRect = this.selectionBoxEl.getBoundingClientRect();
           const elements = this.workspaceContentEl.querySelectorAll('.board-element, path, line');
           elements.forEach(el => {
               const elRect = el.getBoundingClientRect();
               if (
                   elRect.left < boxRect.right &&
                   elRect.right > boxRect.left &&
                   elRect.top < boxRect.bottom &&
                   elRect.bottom > boxRect.top
               ) {
                   this.selectionManager.addToSelection(el);
               }
           });
           this.selectionBoxEl.remove();
           this.selectionBoxEl = null;
        }
      }
      if (this.isDraggingElement) {
        this.isDraggingElement = false;
        if (this.draggedFromWorkspace && !this.didDragElement && !e.shiftKey) {
            this.selectionManager.clearSelection();
        } else if (this.didDragElement) {
            this.saveBoardState();
        }
        this.didDragElement = false;
        this.draggedFromWorkspace = false;
      }
      if (this.isResizingElement) {
        this.isResizingElement = false;
        this.saveBoardState();
      }
    };
    window.addEventListener('pointerup', this.handlePointerUp);
  }

  // --- Persistence ---
  saveBoardState() {
    if (!this.currentBoardId) return;

    if (!this.isRestoringState) {
        const oldBoard = this.boardStore.getBoard(this.currentBoardId);
        if (oldBoard) {
            this.undoStack.push({
                elements: JSON.parse(JSON.stringify(oldBoard.elements || [])),
                drawings: JSON.parse(JSON.stringify(oldBoard.drawings || []))
            });
            this.redoStack = [];
            this.updateUndoRedoButtons();
        }
    }

    // Save elements
    const elementsData = [];
    const elementsNodes = this.workspaceContentEl.querySelectorAll('.board-element');
    elementsNodes.forEach(node => {
      const type = node.dataset.type;
      const data = {
        type,
        x: parseFloat(node.style.left || 0),
        y: parseFloat(node.style.top || 0),
      };

      if (type === 'rect' || type === 'circle' || type === 'sticky') {
        data.width = parseFloat(node.style.width || node.offsetWidth);
        data.height = parseFloat(node.style.height || node.offsetHeight);
      }

      if (type === 'sticky' || type === 'text') {
        data.content = node.querySelector('.editable-content').innerHTML;
      }
      elementsData.push(data);
    });

    // Save drawings
    const drawingsData = [];
    const paths = this.drawingLayer.querySelectorAll('path, line');
    paths.forEach(el => {
      const isLine = el.tagName.toLowerCase() === 'line';
      const drawData = {
          type: isLine ? 'line' : 'path',
          stroke: el.getAttribute('stroke'),
          strokeWidth: el.getAttribute('stroke-width')
      };

      if (isLine) {
          drawData.x1 = el.getAttribute('x1');
          drawData.y1 = el.getAttribute('y1');
          drawData.x2 = el.getAttribute('x2');
          drawData.y2 = el.getAttribute('y2');
      } else {
          drawData.d = el.getAttribute('d');
      }
      drawData.transform = el.getAttribute('transform') || '';

      drawingsData.push(drawData);
    });

    this.boardStore.updateBoard(this.currentBoardId, {
      elements: elementsData,
      drawings: drawingsData
    });
  }

  loadBoardState() {
    this.undoStack = [];
    this.redoStack = [];
    this.updateUndoRedoButtons();
    this.renderCurrentBoard();
  }

  undo() {
      const board = this.boardStore.getBoard(this.currentBoardId);
      if (board && board.isLocked) return;
      if (this.undoStack.length === 0) return;
      const currentState = board;
      this.redoStack.push({
          elements: JSON.parse(JSON.stringify(currentState.elements || [])),
          drawings: JSON.parse(JSON.stringify(currentState.drawings || []))
      });
      const previousState = this.undoStack.pop();
      
      this.isRestoringState = true;
      this.boardStore.updateBoard(this.currentBoardId, previousState);
      this.renderCurrentBoard();
      this.isRestoringState = false;
      this.updateUndoRedoButtons();
  }

  redo() {
      const board = this.boardStore.getBoard(this.currentBoardId);
      if (board && board.isLocked) return;
      if (this.redoStack.length === 0) return;
      const currentState = board;
      this.undoStack.push({
          elements: JSON.parse(JSON.stringify(currentState.elements || [])),
          drawings: JSON.parse(JSON.stringify(currentState.drawings || []))
      });
      const nextState = this.redoStack.pop();
      
      this.isRestoringState = true;
      this.boardStore.updateBoard(this.currentBoardId, nextState);
      this.renderCurrentBoard();
      this.isRestoringState = false;
      this.updateUndoRedoButtons();
  }

  updateUndoRedoButtons() {
      this.undoBtn.disabled = this.undoStack.length === 0;
      this.redoBtn.disabled = this.redoStack.length === 0;
  }

  toggleLock() {
      if (!this.currentBoardId) return;
      const board = this.boardStore.getBoard(this.currentBoardId);
      const newState = !board.isLocked;
      this.boardStore.updateBoard(this.currentBoardId, { isLocked: newState });
      this.applyLockState(newState);
  }

  applyLockState(isLocked) {
      if (isLocked) {
          this.lockBtn.textContent = '🔒';
          this.lockBtn.title = 'Desbloquear Quadro';
          this.boardViewEl.classList.add('locked');
          this.boardTitleInput.readOnly = true;
          this.selectionManager.clearSelection();
      } else {
          this.lockBtn.textContent = '🔓';
          this.lockBtn.title = 'Bloquear Quadro';
          this.boardViewEl.classList.remove('locked');
          this.boardTitleInput.readOnly = false;
      }
  }

  renderCurrentBoard() {
    const board = this.boardStore.getBoard(this.currentBoardId);
    if (!board) return;

    this.applyLockState(board.isLocked || false);

    // Clear current
    const elementsNodes = this.workspaceContentEl.querySelectorAll('.board-element');
    elementsNodes.forEach(node => node.remove());
    this.drawingLayer.innerHTML = '';

    // Reset pan/zoom
    this.panX = 0;
    this.panY = 0;
    this.scale = 1;
    this.workspaceManager.updateWorkspaceTransform();

    // Load drawings
    if (board.drawings) {
      board.drawings.forEach(draw => {
        // Skip corrupted data from previous template string error
        if (draw.d && draw.d.includes('${')) return;
        if (draw.x1 && typeof draw.x1 === 'string' && draw.x1.includes('${')) return;

        let el;
        if (draw.type === 'line') {
          el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          el.setAttribute('x1', draw.x1);
          el.setAttribute('y1', draw.y1);
          el.setAttribute('x2', draw.x2);
          el.setAttribute('y2', draw.y2);
        } else {
          el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          el.setAttribute('d', draw.d);
          el.setAttribute('fill', 'none');
          el.setAttribute('stroke-linejoin', 'round');
        }

        el.setAttribute('stroke', draw.stroke || '#050038');
        el.setAttribute('stroke-width', draw.strokeWidth || '4');
        el.setAttribute('stroke-linecap', 'round');
        if (draw.transform) {
            el.setAttribute('transform', draw.transform);
        }
        this.drawingLayer.appendChild(el);
      });
    }

    // Load elements
    if (board.elements) {
      board.elements.forEach(elData => {
        this.elementFactory.createElement(elData.type, null, elData);
      });
    }
  }
}

customElements.define('miro-clone', MiroClone);
export default MiroClone;
