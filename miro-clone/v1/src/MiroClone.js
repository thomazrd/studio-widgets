import { BoardStore } from './BoardStore.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
    background-color: #f4f5f7;
    --primary-color: #4262ff;
    --danger-color: #f24726;
  }

  * {
    box-sizing: border-box;
  }

  .app-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  /* Dashboard View */
  .dashboard {
    width: 100%;
    height: 100%;
    padding: 40px;
    background: #f4f5f7;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .dashboard-header h1 {
    margin: 0;
    color: #050038;
    font-size: 28px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }

  .btn-primary:hover {
    background-color: #314de0;
  }

  .btn-danger {
    background-color: var(--danger-color);
    color: white;
  }

  .boards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .board-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #e0e0e0;
  }

  .board-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  .board-title {
    font-size: 16px;
    font-weight: 600;
    color: #050038;
    margin-bottom: 8px;
  }

  .board-date {
    font-size: 12px;
    color: #8c8c8c;
    margin-bottom: 16px;
  }

  .board-actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }

  .board-actions button {
    padding: 6px 12px;
    font-size: 12px;
  }

  /* Board View Skeleton */
  .board-view {
    display: none;
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #e5e5e5;
    animation: fadeIn 0.3s ease;
  }

  .board-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: white;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-shadow: 0 1px 8px rgba(0,0,0,0.08);
    z-index: 10;
  }

  .board-header .back-btn {
    margin-right: 20px;
    background: #f4f5f7;
    border: none;
    border-radius: 4px;
    color: #050038;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 16px;
    transition: background-color 0.2s;
  }

  .board-header .back-btn:hover {
    background: #e0e2e8;
  }

  .board-header input.board-title-input {
    border: 1px solid transparent;
    font-size: 18px;
    font-weight: 600;
    color: #050038;
    background: transparent;
    outline: none;
    padding: 4px 8px;
    border-radius: 4px;
    transition: border-color 0.2s;
  }

  .board-header input.board-title-input:hover,
  .board-header input.board-title-input:focus {
    border-color: #cacedb;
  }

  /* Toolbar */
  .toolbar {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    padding: 8px;
    gap: 8px;
    z-index: 10;
  }

  .tool-btn {
    width: 44px;
    height: 44px;
    border: none;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    font-size: 20px;
    color: #050038;
  }

  .tool-btn:hover {
    background-color: #f4f5f7;
  }

  .tool-btn.active {
    background-color: #e5e9ff;
    color: var(--primary-color);
  }

  .tool-options {
    position: absolute;
    left: 80px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none; /* hidden by default */
    flex-direction: column;
    padding: 12px;
    gap: 8px;
    z-index: 10;
  }

  .tool-options.visible {
    display: flex;
  }

  .color-picker {
    width: 30px;
    height: 30px;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: 4px;
  }

  .thickness-picker {
    width: 100%;
  }

  /* Workspace */
  .board-workspace {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden; /* Important for pan/zoom */
    background-image: radial-gradient(#d1d1d1 1px, transparent 1px);
    background-size: 20px 20px;
    cursor: grab;
  }

  .board-workspace:active {
    cursor: grabbing;
  }

  .workspace-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
  }

  .drawing-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Let clicks pass through if not drawing */
    overflow: visible;
  }

  .board-element {
    position: absolute;
    cursor: move;
    user-select: none;
    box-sizing: border-box;
  }

  .board-element.selected {
    outline: 2px solid var(--primary-color);
  }

  .resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border: 2px solid var(--primary-color);
    bottom: -6px;
    right: -6px;
    cursor: se-resize;
    display: none;
    z-index: 10;
  }

  .board-element.selected .resize-handle {
    display: block;
  }

  .shape-rect {
    background: transparent;
    border: 2px solid #050038;
    border-radius: 4px;
  }

  .shape-circle {
    background: transparent;
    border: 2px solid #050038;
    border-radius: 50%;
  }

  .sticky-note {
    background: #fff9b1;
    padding: 10px;
    box-shadow: 2px 4px 8px rgba(0,0,0,0.15);
    font-size: 16px;
    min-width: 150px;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    word-break: break-word;
  }

  .text-note {
    font-size: 20px;
    color: #050038;
    min-width: 100px;
    padding: 5px;
  }

  .editable-content {
    width: 100%;
    height: 100%;
    outline: none;
    cursor: text;
  }

</style>
<div class="app-container">
  <!-- Dashboard -->
  <div class="dashboard" id="dashboard">
    <div class="dashboard-header">
      <h1>Meus Quadros</h1>
      <button class="btn btn-primary" id="new-board-btn">+ Novo Quadro</button>
    </div>
    <div class="boards-grid" id="boards-grid">
      <!-- Board cards will be injected here -->
    </div>
  </div>

  <!-- Board View -->
  <div class="board-view" id="board-view">
    <div class="board-header">
      <button class="back-btn" id="back-btn">← Voltar</button>
      <input type="text" class="board-title-input" id="board-title-input" value="Novo Quadro">
    </div>
    <div class="toolbar">
      <button class="tool-btn active" data-tool="select" title="Selecionar">👆</button>
      <button class="tool-btn" data-tool="pen" title="Caneta">✏️</button>
      <button class="tool-btn" data-tool="line" title="Linha">📏</button>
      <button class="tool-btn" data-tool="rect" title="Retângulo">⬜</button>
      <button class="tool-btn" data-tool="circle" title="Círculo">⭕</button>
      <button class="tool-btn" data-tool="sticky" title="Post-it">📝</button>
      <button class="tool-btn" data-tool="text" title="Texto">T</button>
    </div>
    <div class="tool-options" id="pen-options">
      <label>Cor: <input type="color" class="color-picker" id="pen-color" value="#050038"></label>
      <label>Espessura: <input type="range" class="thickness-picker" id="pen-thickness" min="1" max="20" value="4"></label>
    </div>
    <div class="board-workspace" id="board-workspace">
      <div class="workspace-content" id="workspace-content">
        <svg class="drawing-layer" id="drawing-layer"></svg>
      </div>
    </div>
  </div>
</div>
`;

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
    this.toolBtns = this.shadowRoot.querySelectorAll('.tool-btn');
    this.penOptionsEl = this.shadowRoot.getElementById('pen-options');
    this.penColorInput = this.shadowRoot.getElementById('pen-color');
    this.penThicknessInput = this.shadowRoot.getElementById('pen-thickness');

    // Unique ID for widget instance isolation
    this.instanceId = this.generateInstanceId();
    this.boardStore = new BoardStore(this.instanceId);

    // State
    this.currentBoardId = null;
    this.currentTool = 'select'; // select, pen, line, rect, circle, sticky, text

    // Pan & Zoom State
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;

    // Tools State
    this.isDrawing = false;
    this.currentPath = null;
    this.elements = [];

    // Selection state
    this.selectedElement = null;
    this.isDraggingElement = false;
    this.isResizingElement = false;
    this.elementDragStartX = 0;
    this.elementDragStartY = 0;
    this.elementStartWidth = 0;
    this.elementStartHeight = 0;
  }

  generateInstanceId() {
    let id = localStorage.getItem('miro_clone_instance_id');
    if (!id) {
      id = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('miro_clone_instance_id', id);
    }
    return id;
  }

  connectedCallback() {
    this.bindEvents();
    this.renderDashboard();
  }

  bindEvents() {
    this.newBoardBtn.addEventListener('click', () => this.createNewBoard());
    this.backBtn.addEventListener('click', () => this.showDashboard());

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
        this.updateWorkspaceCursor();

        if (this.currentTool === 'pen' || this.currentTool === 'line') {
          this.penOptionsEl.classList.add('visible');
        } else {
          this.penOptionsEl.classList.remove('visible');
        }
      });
    });

    this.bindWorkspaceEvents();
  }

  bindWorkspaceEvents() {
    // Zoom
    this.workspaceEl.addEventListener('wheel', (e) => {
      e.preventDefault();

      const zoomSensitivity = 0.001;
      const delta = e.deltaY * -zoomSensitivity;

      const newScale = Math.min(Math.max(0.1, this.scale + delta), 5); // limit zoom 0.1x to 5x

      // Calculate zoom relative to pointer position
      const rect = this.workspaceEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
      this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
      this.scale = newScale;

      this.updateWorkspaceTransform();
    }, { passive: false });

    // Pointer Down
    this.workspaceEl.addEventListener('pointerdown', (e) => {
      const isDirectClick = e.target === this.workspaceEl || e.target === this.workspaceContentEl || e.target === this.drawingLayer;

      if (e.button === 1 || (this.currentTool === 'select' && isDirectClick)) {
        this.isPanning = true;
        this.startX = e.clientX - this.panX;
        this.startY = e.clientY - this.panY;
        this.workspaceEl.style.cursor = 'grabbing';
        this.clearSelection();
      } else if (e.button === 0) {
        const coords = this.getWorkspaceCoords(e.clientX, e.clientY);

        if (this.currentTool === 'pen' || this.currentTool === 'line') {
          this.isDrawing = true;
          this.startDrawing(coords);
        } else if (['rect', 'circle', 'sticky', 'text'].includes(this.currentTool) && isDirectClick) {
          this.createElement(this.currentTool, coords);
          // reset tool to select
          this.toolBtns[0].click();
        }
      }
    });

    // Pointer Move
    window.addEventListener('pointermove', (e) => {
      if (this.isPanning) {
        this.panX = e.clientX - this.startX;
        this.panY = e.clientY - this.startY;
        this.updateWorkspaceTransform();
      } else if (this.isDrawing) {
        const coords = this.getWorkspaceCoords(e.clientX, e.clientY);
        this.continueDrawing(coords);
      } else if (this.isDraggingElement && this.selectedElement) {
        const coords = this.getWorkspaceCoords(e.clientX, e.clientY);
        const dx = coords.x - this.elementDragStartX;
        const dy = coords.y - this.elementDragStartY;

        const currentLeft = parseFloat(this.selectedElement.style.left || 0);
        const currentTop = parseFloat(this.selectedElement.style.top || 0);

        this.selectedElement.style.left = (currentLeft + dx) + 'px';
        this.selectedElement.style.top = (currentTop + dy) + 'px';

        this.elementDragStartX = coords.x;
        this.elementDragStartY = coords.y;
      } else if (this.isResizingElement && this.selectedElement) {
        const coords = this.getWorkspaceCoords(e.clientX, e.clientY);
        const dx = coords.x - this.elementDragStartX;
        const dy = coords.y - this.elementDragStartY;

        let newWidth = Math.max(50, this.elementStartWidth + dx);
        let newHeight = Math.max(50, this.elementStartHeight + dy);

        // Lock aspect ratio for circle
        if (this.selectedElement.dataset.type === 'circle') {
            const maxDim = Math.max(newWidth, newHeight);
            newWidth = maxDim;
            newHeight = maxDim;
        }

        this.selectedElement.style.width = newWidth + 'px';
        this.selectedElement.style.height = newHeight + 'px';
      }
    });

    // Pointer Up
    window.addEventListener('pointerup', () => {
      if (this.isPanning) {
        this.isPanning = false;
        this.updateWorkspaceCursor();
      }
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveBoardState();
      }
      if (this.isDraggingElement) {
        this.isDraggingElement = false;
        this.saveBoardState();
      }
      if (this.isResizingElement) {
        this.isResizingElement = false;
        this.saveBoardState();
      }
    });
  }

  // --- Drawing ---
  startDrawing(coords) {
    if (this.currentTool === 'line') {
      this.currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      this.currentPath.setAttribute('x1', coords.x);
      this.currentPath.setAttribute('y1', coords.y);
      this.currentPath.setAttribute('x2', coords.x);
      this.currentPath.setAttribute('y2', coords.y);
    } else {
      this.currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.currentPath.setAttribute('d', `M ${coords.x} ${coords.y}`);
      this.currentPath.setAttribute('fill', 'none');
      this.currentPath.setAttribute('stroke-linejoin', 'round');
    }

    this.currentPath.setAttribute('stroke', this.penColorInput.value);
    this.currentPath.setAttribute('stroke-width', this.penThicknessInput.value);
    this.currentPath.setAttribute('stroke-linecap', 'round');
    this.drawingLayer.appendChild(this.currentPath);
  }

  continueDrawing(coords) {
    if (!this.currentPath) return;

    if (this.currentTool === 'line') {
       this.currentPath.setAttribute('x2', coords.x);
       this.currentPath.setAttribute('y2', coords.y);
    } else {
       const d = this.currentPath.getAttribute('d');
       this.currentPath.setAttribute('d', `${d} L ${coords.x} ${coords.y}`);
    }
  }

  // --- Elements ---
  createElement(type, coords, existingData = null) {
    const el = document.createElement('div');
    el.classList.add('board-element');

    // Position
    el.style.left = (existingData ? existingData.x : coords.x) + 'px';
    el.style.top = (existingData ? existingData.y : coords.y) + 'px';

    // Size & specific classes
    if (type === 'rect' || type === 'circle' || type === 'sticky') {
      // Add resize handle for shapes and stickies
      const resizeHandle = document.createElement('div');
      resizeHandle.classList.add('resize-handle');
      resizeHandle.addEventListener('pointerdown', (e) => {
        if (this.currentTool !== 'select') return;
        e.stopPropagation();
        this.selectElement(el);
        this.isResizingElement = true;

        const wsCoords = this.getWorkspaceCoords(e.clientX, e.clientY);
        this.elementDragStartX = wsCoords.x;
        this.elementDragStartY = wsCoords.y;
        this.elementStartWidth = parseFloat(el.style.width || 0);
        this.elementStartHeight = parseFloat(el.style.height || 0);
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

      content.addEventListener('input', () => this.saveBoardState());
      content.addEventListener('pointerdown', (e) => e.stopPropagation()); // prevent drag when selecting text
    } else if (type === 'text') {
      el.classList.add('text-note');
      const content = document.createElement('div');
      content.classList.add('editable-content');
      content.contentEditable = 'true';
      content.innerHTML = existingData ? existingData.content : 'Texto';
      el.appendChild(content);

      content.addEventListener('input', () => this.saveBoardState());
      content.addEventListener('pointerdown', (e) => e.stopPropagation());
    }

    el.dataset.type = type;

    // Selection & Dragging Events
    el.addEventListener('pointerdown', (e) => {
      if (this.currentTool !== 'select') return;
      e.stopPropagation();
      this.selectElement(el);

      this.isDraggingElement = true;
      const wsCoords = this.getWorkspaceCoords(e.clientX, e.clientY);
      this.elementDragStartX = wsCoords.x;
      this.elementDragStartY = wsCoords.y;
    });

    this.workspaceContentEl.appendChild(el);
    if (!existingData) {
      this.saveBoardState();
    }
    return el;
  }

  selectElement(el) {
    this.clearSelection();
    this.selectedElement = el;
    el.classList.add('selected');
  }

  clearSelection() {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
      this.selectedElement = null;
    }
  }

  // --- Persistence ---
  saveBoardState() {
    if (!this.currentBoardId) return;

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

      drawingsData.push(drawData);
    });

    this.boardStore.updateBoard(this.currentBoardId, {
      elements: elementsData,
      drawings: drawingsData
    });
  }

  loadBoardState() {
    const board = this.boardStore.getBoard(this.currentBoardId);
    if (!board) return;

    // Clear current
    const elementsNodes = this.workspaceContentEl.querySelectorAll('.board-element');
    elementsNodes.forEach(node => node.remove());
    this.drawingLayer.innerHTML = '';

    // Reset pan/zoom
    this.panX = 0;
    this.panY = 0;
    this.scale = 1;
    this.updateWorkspaceTransform();

    // Load drawings
    if (board.drawings) {
      board.drawings.forEach(draw => {
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
        this.drawingLayer.appendChild(el);
      });
    }

    // Load elements
    if (board.elements) {
      board.elements.forEach(elData => {
        this.createElement(elData.type, null, elData);
      });
    }
  }

  updateWorkspaceTransform() {
    this.workspaceContentEl.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
  }

  updateWorkspaceCursor() {
    switch (this.currentTool) {
      case 'select':
        this.workspaceEl.style.cursor = 'grab';
        break;
      case 'pen':
        this.workspaceEl.style.cursor = 'crosshair';
        break;
      default:
        this.workspaceEl.style.cursor = 'crosshair';
    }
  }

  // Gets absolute x/y inside the workspace content given clientX/Y
  getWorkspaceCoords(clientX, clientY) {
    const rect = this.workspaceEl.getBoundingClientRect();
    const x = (clientX - rect.left - this.panX) / this.scale;
    const y = (clientY - rect.top - this.panY) / this.scale;
    return { x, y };
  }

  renderDashboard() {
    this.dashboardEl.style.display = 'flex';
    this.boardViewEl.style.display = 'none';
    this.currentBoardId = null;

    const boards = this.boardStore.getBoards();
    this.boardsGridEl.innerHTML = '';

    boards.forEach(board => {
      const card = document.createElement('div');
      card.className = 'board-card';
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-btn')) {
          this.openBoard(board.id);
        }
      });

      const dateStr = new Date(board.updatedAt).toLocaleString('pt-BR');

      card.innerHTML = `
        <div class="board-title">${board.title}</div>
        <div class="board-date">Atualizado em: ${dateStr}</div>
        <div class="board-actions">
          <button class="btn btn-danger delete-btn" data-id="${board.id}">Excluir</button>
        </div>
      `;

      const deleteBtn = card.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este quadro?')) {
          this.boardStore.deleteBoard(board.id);
          this.renderDashboard();
        }
      });

      this.boardsGridEl.appendChild(card);
    });
  }

  createNewBoard() {
    const newBoard = this.boardStore.createBoard('Quadro sem título');
    this.openBoard(newBoard.id);
  }

  openBoard(id) {
    const board = this.boardStore.getBoard(id);
    if (!board) return;

    this.currentBoardId = id;
    this.dashboardEl.style.display = 'none';
    this.boardViewEl.style.display = 'block';
    this.boardTitleInput.value = board.title;

    this.loadBoardState();
  }

  showDashboard() {
    this.renderDashboard();
  }
}

customElements.define('miro-clone', MiroClone);
export default MiroClone;
