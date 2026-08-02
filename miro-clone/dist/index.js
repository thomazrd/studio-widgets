(function(){var e=class{constructor(e){this.prefix=`miro_clone_v1_${e}_`}generateId(){return Math.random().toString(36).substr(2,9)}getBoards(){let e=localStorage.getItem(this.prefix+`boards`);if(!e)return[];try{return JSON.parse(e)}catch{return[]}}saveBoards(e){localStorage.setItem(this.prefix+`boards`,JSON.stringify(e))}createBoard(e){let t=this.getBoards(),n={id:this.generateId(),title:e||`Novo Quadro`,updatedAt:new Date().toISOString(),elements:[]};return t.push(n),this.saveBoards(t),n}updateBoard(e,t){let n=this.getBoards(),r=n.findIndex(t=>t.id===e);return r===-1?null:(n[r]={...n[r],...t,updatedAt:new Date().toISOString()},this.saveBoards(n),n[r])}deleteBoard(e){let t=this.getBoards();t=t.filter(t=>t.id!==e),this.saveBoards(t)}getBoard(e){return this.getBoards().find(t=>t.id===e)||null}},t=document.createElement(`template`);t.innerHTML=`
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

  .history-actions {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  .history-actions .tool-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .history-actions .tool-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
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

  .board-workspace[data-tool="select"] .drawing-layer path,
  .board-workspace[data-tool="select"] .drawing-layer line {
    pointer-events: auto; /* allow clicking on strokes when selecting */
    cursor: default;
  }

  .drawing-layer path.selected,
  .drawing-layer line.selected {
    filter: drop-shadow(0px 0px 4px var(--primary-color));
    stroke: var(--primary-color);
    cursor: move !important;
  }

  .board-element {
    position: absolute;
    cursor: default;
    user-select: none;
    box-sizing: border-box;
  }

  .board-element.selected {
    outline: 2px solid var(--primary-color);
    cursor: move;
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
    color: #000000;
    font-weight: 500;
  }

  .selection-box {
    position: absolute;
    background: rgba(66, 98, 255, 0.1);
    border: 1px solid var(--primary-color);
    pointer-events: none;
    z-index: 100;
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
      <div class="history-actions">
        <button class="tool-btn" id="undo-btn" title="Desfazer (Ctrl+Z)" disabled>↩️</button>
        <button class="tool-btn" id="redo-btn" title="Refazer (Ctrl+Y)" disabled>↪️</button>
      </div>
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
`;var n=class{constructor(e){this.app=e}renderDashboard(){this.app.dashboardEl.style.display=`flex`,this.app.boardViewEl.style.display=`none`,this.app.currentBoardId=null;let e=this.app.boardStore.getBoards();this.app.boardsGridEl.innerHTML=``,e.forEach(e=>{let t=document.createElement(`div`);t.className=`board-card`,t.addEventListener(`click`,t=>{t.target.classList.contains(`delete-btn`)||this.openBoard(e.id)});let n=new Date(e.updatedAt).toLocaleString(`pt-BR`);t.innerHTML=`
        <div class="board-title">${e.title}</div>
        <div class="board-date">Atualizado em: ${n}</div>
        <div class="board-actions">
          <button class="btn btn-danger delete-btn" data-id="${e.id}">Excluir</button>
        </div>
      `,t.querySelector(`.delete-btn`).addEventListener(`click`,t=>{t.stopPropagation(),confirm(`Tem certeza que deseja excluir este quadro?`)&&(this.app.boardStore.deleteBoard(e.id),this.renderDashboard())}),this.app.boardsGridEl.appendChild(t)})}createNewBoard(){let e=this.app.boardStore.createBoard(`Quadro sem título`);this.openBoard(e.id)}openBoard(e){let t=this.app.boardStore.getBoard(e);t&&(this.app.currentBoardId=e,this.app.dashboardEl.style.display=`none`,this.app.boardViewEl.style.display=`block`,this.app.boardTitleInput.value=t.title,this.app.loadBoardState())}showDashboard(){this.renderDashboard()}},r=class{constructor(e){this.app=e}bindEvents(){this.app.workspaceEl.addEventListener(`wheel`,e=>this.handleWheel(e),{passive:!1})}handleWheel(e){e.preventDefault();let t=e.deltaY*-.001,n=Math.min(Math.max(.1,this.app.scale+t),5),r=this.app.workspaceEl.getBoundingClientRect(),i=e.clientX-r.left,a=e.clientY-r.top;this.app.panX=i-(i-this.app.panX)*(n/this.app.scale),this.app.panY=a-(a-this.app.panY)*(n/this.app.scale),this.app.scale=n,this.updateWorkspaceTransform()}updateWorkspaceTransform(){this.app.workspaceContentEl.style.transform=`translate(${this.app.panX}px, ${this.app.panY}px) scale(${this.app.scale})`}updateWorkspaceCursor(){switch(this.app.currentTool){case`select`:this.app.workspaceEl.style.cursor=`grab`;break;case`pen`:this.app.workspaceEl.style.cursor=`crosshair`;break;default:this.app.workspaceEl.style.cursor=`crosshair`}}getWorkspaceCoords(e,t){let n=this.app.workspaceEl.getBoundingClientRect();return{x:(e-n.left-this.app.panX)/this.app.scale,y:(t-n.top-this.app.panY)/this.app.scale}}},i=class{constructor(e){this.app=e}selectElement(e,t=!1){t||this.clearSelection(),this.app.selectedElements.includes(e)||(this.app.selectedElements.push(e),e.classList.add(`selected`))}addToSelection(e){this.selectElement(e,!0)}clearSelection(){this.app.selectedElements.forEach(e=>e.classList.remove(`selected`)),this.app.selectedElements=[]}updateSelectionBox(e,t){if(!this.app.selectionBoxEl)return;let n=Math.min(this.app.selectionBoxStartX,e),r=Math.min(this.app.selectionBoxStartY,t),i=Math.abs(e-this.app.selectionBoxStartX),a=Math.abs(t-this.app.selectionBoxStartY);this.app.selectionBoxEl.style.left=n+`px`,this.app.selectionBoxEl.style.top=r+`px`,this.app.selectionBoxEl.style.width=i+`px`,this.app.selectionBoxEl.style.height=a+`px`}},a=class{constructor(e){this.app=e}handleGlobalKeyDown(e){if(this.app.boardViewEl.style.display===`block`&&!(e.target.isContentEditable||e.target.tagName===`INPUT`||e.target.tagName===`TEXTAREA`)&&((e.key===`Delete`||e.key===`Backspace`)&&this.app.selectedElements.length>0&&(this.app.selectedElements.forEach(e=>e.remove()),this.app.selectionManager.clearSelection(),this.app.saveBoardState()),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`z`&&(e.shiftKey?this.app.redo():this.app.undo(),e.preventDefault()),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`y`&&(this.app.redo(),e.preventDefault()),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`c`&&this.app.selectedElements.length>0&&(this.app.clipboard=this.app.selectedElements.map(e=>{let t={type:e.dataset.type||e.tagName.toLowerCase(),x:parseFloat(e.style.left||0),y:parseFloat(e.style.top||0)};return t.type===`line`||t.type===`path`?(t.type===`line`?(t.x1=e.getAttribute(`x1`),t.y1=e.getAttribute(`y1`),t.x2=e.getAttribute(`x2`),t.y2=e.getAttribute(`y2`)):t.d=e.getAttribute(`d`),t.stroke=e.getAttribute(`stroke`),t.strokeWidth=e.getAttribute(`stroke-width`),t.transform=e.getAttribute(`transform`)||``):((t.type===`rect`||t.type===`circle`||t.type===`sticky`)&&(t.width=parseFloat(e.style.width||e.offsetWidth),t.height=parseFloat(e.style.height||e.offsetHeight)),(t.type===`sticky`||t.type===`text`)&&(t.content=e.querySelector(`.editable-content`).innerHTML)),t})),(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`v`&&this.app.clipboard&&this.app.clipboard.length>0)){this.app.selectionManager.clearSelection();let e=[];this.app.clipboard.forEach(t=>{if(t.type===`line`||t.type===`path`){let n;t.type===`line`?(n=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),n.setAttribute(`x1`,t.x1),n.setAttribute(`y1`,t.y1),n.setAttribute(`x2`,t.x2),n.setAttribute(`y2`,t.y2)):(n=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),n.setAttribute(`d`,t.d),n.setAttribute(`fill`,`none`),n.setAttribute(`stroke-linejoin`,`round`)),n.setAttribute(`stroke`,t.stroke||`#050038`),n.setAttribute(`stroke-width`,t.strokeWidth||`4`),n.setAttribute(`stroke-linecap`,`round`);let r=(t.transform||``).match(/translate\(([^,]+),([^)]+)\)/),i=0,a=0;r&&(i=parseFloat(r[1]),a=parseFloat(r[2])),t.transform=`translate(${i+20}, ${a+20})`,n.setAttribute(`transform`,t.transform),this.app.drawingLayer.appendChild(n),e.push(n)}else{let n={...t,x:t.x+20,y:t.y+20},r=this.app.elementFactory.createElement(t.type,null,n);e.push(r),t.x+=20,t.y+=20}}),e.forEach(e=>this.app.selectionManager.addToSelection(e)),this.app.saveBoardState()}}},o=class{constructor(e){this.app=e}startDrawing(e){this.app.currentTool===`line`?(this.app.currentPath=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),this.app.currentPath.setAttribute(`x1`,e.x),this.app.currentPath.setAttribute(`y1`,e.y),this.app.currentPath.setAttribute(`x2`,e.x),this.app.currentPath.setAttribute(`y2`,e.y)):(this.app.currentPath=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),this.app.currentPath.setAttribute(`d`,`M ${e.x} ${e.y}`),this.app.currentPath.setAttribute(`fill`,`none`),this.app.currentPath.setAttribute(`stroke-linejoin`,`round`)),this.app.currentPath.setAttribute(`stroke`,this.app.penColorInput.value),this.app.currentPath.setAttribute(`stroke-width`,this.app.penThicknessInput.value),this.app.currentPath.setAttribute(`stroke-linecap`,`round`),this.app.drawingLayer.appendChild(this.app.currentPath)}continueDrawing(e){if(this.app.currentPath)if(this.app.currentTool===`line`)this.app.currentPath.setAttribute(`x2`,e.x),this.app.currentPath.setAttribute(`y2`,e.y);else{let t=this.app.currentPath.getAttribute(`d`);this.app.currentPath.setAttribute(`d`,`${t} L ${e.x} ${e.y}`)}}},s=class{constructor(e){this.app=e}createElement(e,t,n=null){let r=document.createElement(`div`);if(r.classList.add(`board-element`),r.style.left=(n?n.x:t.x)+`px`,r.style.top=(n?n.y:t.y)+`px`,e===`rect`||e===`circle`||e===`sticky`){let e=document.createElement(`div`);e.classList.add(`resize-handle`),e.addEventListener(`pointerdown`,t=>{if(this.app.currentTool!==`select`)return;t.stopPropagation(),this.app.selectionManager.selectElement(r,!1),this.app.isResizingElement=!0;let n=this.app.workspaceManager.getWorkspaceCoords(t.clientX,t.clientY);this.app.elementDragStartX=n.x,this.app.elementDragStartY=n.y,this.app.elementStartWidth=parseFloat(r.style.width||0),this.app.elementStartHeight=parseFloat(r.style.height||0),e.setPointerCapture(t.pointerId)}),e.addEventListener(`pointerup`,t=>{e.hasPointerCapture(t.pointerId)&&e.releasePointerCapture(t.pointerId)}),r.appendChild(e)}if(e===`rect`)r.classList.add(`shape-rect`),r.style.width=(n?n.width:200)+`px`,r.style.height=(n?n.height:100)+`px`;else if(e===`circle`)r.classList.add(`shape-circle`),r.style.width=(n?n.width:150)+`px`,r.style.height=(n?n.height:150)+`px`;else if(e===`sticky`){r.classList.add(`sticky-note`);let e=document.createElement(`div`);e.classList.add(`editable-content`),e.contentEditable=`true`,e.innerHTML=n?n.content:`Nota...`,r.style.width=n&&n.width?n.width+`px`:``,r.style.height=n&&n.height?n.height+`px`:``,r.appendChild(e),e.addEventListener(`input`,()=>this.app.saveBoardState()),e.addEventListener(`pointerdown`,e=>e.stopPropagation()),e.addEventListener(`keydown`,e=>e.stopPropagation())}else if(e===`text`){r.classList.add(`text-note`);let e=document.createElement(`div`);e.classList.add(`editable-content`),e.contentEditable=`true`,e.innerHTML=n?n.content:`Texto`,r.appendChild(e),e.addEventListener(`input`,()=>this.app.saveBoardState()),e.addEventListener(`pointerdown`,e=>e.stopPropagation()),e.addEventListener(`keydown`,e=>e.stopPropagation())}return r.dataset.type=e,r.addEventListener(`pointerdown`,t=>{if(this.app.currentTool!==`select`)return;if(e===`rect`||e===`circle`){let n=r.getBoundingClientRect(),i=t.clientX-n.left,a=t.clientY-n.top,o=n.width,s=n.height;if(e===`rect`){if(i>15&&i<o-15&&a>15&&a<s-15){r.style.pointerEvents=`none`;let e=this.app.shadowRoot.elementFromPoint(t.clientX,t.clientY);r.style.pointerEvents=``,t.stopPropagation(),e&&e!==r&&(e.dispatchEvent(new PointerEvent(t.type,t)),e.dispatchEvent(new MouseEvent(`mousedown`,t)),e.isContentEditable&&e.focus());return}}else if(e===`circle`){let e=o/2,n=s/2,c=o/2,l=i-e,u=a-n;if(Math.sqrt(l*l+u*u)<c-15){r.style.pointerEvents=`none`;let e=this.app.shadowRoot.elementFromPoint(t.clientX,t.clientY);r.style.pointerEvents=``,t.stopPropagation(),e&&e!==r&&(e.dispatchEvent(new PointerEvent(t.type,t)),e.dispatchEvent(new MouseEvent(`mousedown`,t)),e.isContentEditable&&e.focus());return}}}t.stopPropagation(),t.shiftKey?this.app.selectedElements.includes(r)?(this.app.selectedElements=this.app.selectedElements.filter(e=>e!==r),r.classList.remove(`selected`)):this.app.selectionManager.addToSelection(r):this.app.selectedElements.includes(r)||this.app.selectionManager.selectElement(r,!1),this.app.isDraggingElement=!0;let n=this.app.workspaceManager.getWorkspaceCoords(t.clientX,t.clientY);this.app.elementDragStartX=n.x,this.app.elementDragStartY=n.y,r.setPointerCapture(t.pointerId)}),r.addEventListener(`pointerup`,e=>{r.hasPointerCapture(e.pointerId)&&r.releasePointerCapture(e.pointerId)}),this.app.workspaceContentEl.appendChild(r),n||this.app.saveBoardState(),r}},c=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.shadowRoot.appendChild(t.content.cloneNode(!0)),this.dashboardEl=this.shadowRoot.getElementById(`dashboard`),this.boardsGridEl=this.shadowRoot.getElementById(`boards-grid`),this.newBoardBtn=this.shadowRoot.getElementById(`new-board-btn`),this.boardViewEl=this.shadowRoot.getElementById(`board-view`),this.backBtn=this.shadowRoot.getElementById(`back-btn`),this.boardTitleInput=this.shadowRoot.getElementById(`board-title-input`),this.workspaceEl=this.shadowRoot.getElementById(`board-workspace`),this.workspaceContentEl=this.shadowRoot.getElementById(`workspace-content`),this.drawingLayer=this.shadowRoot.getElementById(`drawing-layer`),this.toolBtns=this.shadowRoot.querySelectorAll(`.toolbar .tool-btn`),this.penOptionsEl=this.shadowRoot.getElementById(`pen-options`),this.penColorInput=this.shadowRoot.getElementById(`pen-color`),this.penThicknessInput=this.shadowRoot.getElementById(`pen-thickness`),this.undoBtn=this.shadowRoot.getElementById(`undo-btn`),this.redoBtn=this.shadowRoot.getElementById(`redo-btn`),this.instanceId=this.generateInstanceId(),this.boardStore=new e(this.instanceId),this.currentBoardId=null,this.currentTool=`select`,this.workspaceEl.dataset.tool=`select`,this.scale=1,this.panX=0,this.panY=0,this.isPanning=!1,this.startX=0,this.startY=0,this.isDrawing=!1,this.currentPath=null,this.elements=[],this.selectedElements=[],this.undoStack=[],this.redoStack=[],this.isRestoringState=!1,this.isDraggingElement=!1,this.isResizingElement=!1,this.elementDragStartX=0,this.elementDragStartY=0,this.elementStartWidth=0,this.elementStartHeight=0,this.isDrawingSelection=!1,this.selectionBoxStartX=0,this.selectionBoxStartY=0,this.selectionBoxEl=null,this.clipboard=[],this.dashboardManager=new n(this),this.workspaceManager=new r(this),this.selectionManager=new i(this),this.clipboardManager=new a(this),this.drawingManager=new o(this),this.elementFactory=new s(this)}generateInstanceId(){let e=localStorage.getItem(`miro_clone_instance_id`);return e||(e=Math.random().toString(36).substr(2,9),localStorage.setItem(`miro_clone_instance_id`,e)),e}connectedCallback(){this.bindEvents(),this.dashboardManager.renderDashboard()}bindEvents(){this.newBoardBtn.addEventListener(`click`,()=>this.dashboardManager.createNewBoard()),this.backBtn.addEventListener(`click`,()=>this.dashboardManager.showDashboard()),this.undoBtn.addEventListener(`click`,()=>this.undo()),this.redoBtn.addEventListener(`click`,()=>this.redo()),this.boardTitleInput.addEventListener(`change`,e=>{this.currentBoardId&&this.boardStore.updateBoard(this.currentBoardId,{title:e.target.value})}),this.toolBtns.forEach(e=>{e.addEventListener(`click`,e=>{this.toolBtns.forEach(e=>e.classList.remove(`active`));let t=e.currentTarget;t.classList.add(`active`),this.currentTool=t.dataset.tool,this.workspaceEl.dataset.tool=this.currentTool,this.workspaceManager.updateWorkspaceCursor(),this.selectionManager.clearSelection(),this.currentTool===`pen`||this.currentTool===`line`?this.penOptionsEl.classList.add(`visible`):this.penOptionsEl.classList.remove(`visible`)})}),document.addEventListener(`keydown`,e=>this.clipboardManager.handleGlobalKeyDown(e)),this.workspaceManager.bindEvents(),this.bindWorkspacePointerEvents()}bindWorkspacePointerEvents(){this.drawingLayer.addEventListener(`pointerdown`,e=>{if(this.currentTool!==`select`)return;let t=e.target;if(t.tagName.toLowerCase()===`line`||t.tagName.toLowerCase()===`path`){e.stopPropagation(),e.shiftKey?this.selectedElements.includes(t)?(this.selectedElements=this.selectedElements.filter(e=>e!==t),t.classList.remove(`selected`)):this.selectionManager.addToSelection(t):this.selectedElements.includes(t)||this.selectionManager.selectElement(t,!1),this.isDraggingElement=!0;let n=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.elementDragStartX=n.x,this.elementDragStartY=n.y,t.setPointerCapture(e.pointerId)}}),this.drawingLayer.addEventListener(`pointerup`,e=>{let t=e.target;t.hasPointerCapture&&t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId)}),this.workspaceEl.addEventListener(`contextmenu`,e=>e.preventDefault()),this.workspaceEl.addEventListener(`pointerdown`,e=>{let t=e.target===this.workspaceEl||e.target===this.workspaceContentEl||e.target===this.drawingLayer;if(e.button===1||e.button===2)this.isPanning=!0,this.startX=e.clientX-this.panX,this.startY=e.clientY-this.panY,this.workspaceEl.style.cursor=`grabbing`,this.selectionManager.clearSelection();else if(e.button===0){let n=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.currentTool===`select`&&t?(this.isDrawingSelection=!0,this.selectionBoxStartX=n.x,this.selectionBoxStartY=n.y,e.shiftKey||this.selectionManager.clearSelection(),this.selectionBoxEl=document.createElement(`div`),this.selectionBoxEl.className=`selection-box`,this.workspaceContentEl.appendChild(this.selectionBoxEl),this.selectionManager.updateSelectionBox(n.x,n.y)):this.currentTool===`pen`||this.currentTool===`line`?(this.isDrawing=!0,this.drawingManager.startDrawing(n)):[`rect`,`circle`,`sticky`,`text`].includes(this.currentTool)&&t&&(this.elementFactory.createElement(this.currentTool,n),this.toolBtns[0].click())}}),window.addEventListener(`pointermove`,e=>{if(this.isPanning)this.panX=e.clientX-this.startX,this.panY=e.clientY-this.startY,this.workspaceManager.updateWorkspaceTransform();else if(this.isDrawing){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.drawingManager.continueDrawing(t)}else if(this.isDrawingSelection){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY);this.selectionManager.updateSelectionBox(t.x,t.y)}else if(this.isDraggingElement&&this.selectedElements.length>0){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY),n=t.x-this.elementDragStartX,r=t.y-this.elementDragStartY;this.selectedElements.forEach(e=>{if(e.tagName.toLowerCase()===`line`||e.tagName.toLowerCase()===`path`){let t=(e.getAttribute(`transform`)||``).match(/translate\(([^,]+),([^)]+)\)/),i=0,a=0;t&&(i=parseFloat(t[1]),a=parseFloat(t[2])),e.setAttribute(`transform`,`translate(${i+n}, ${a+r})`)}else{let t=parseFloat(e.style.left||0),i=parseFloat(e.style.top||0);e.style.left=t+n+`px`,e.style.top=i+r+`px`}}),this.elementDragStartX=t.x,this.elementDragStartY=t.y}else if(this.isResizingElement&&this.selectedElements.length>0){let t=this.workspaceManager.getWorkspaceCoords(e.clientX,e.clientY),n=t.x-this.elementDragStartX,r=t.y-this.elementDragStartY,i=Math.max(50,this.elementStartWidth+n),a=Math.max(50,this.elementStartHeight+r),o=this.selectedElements[0];if(o.dataset.type===`circle`){let e=Math.max(i,a);i=e,a=e}o.style.width=i+`px`,o.style.height=a+`px`}}),window.addEventListener(`pointerup`,()=>{if(this.isPanning&&(this.isPanning=!1,this.workspaceManager.updateWorkspaceCursor()),this.isDrawing&&(this.isDrawing=!1,this.saveBoardState()),this.isDrawingSelection&&(this.isDrawingSelection=!1,this.selectionBoxEl)){let e=this.selectionBoxEl.getBoundingClientRect();this.workspaceContentEl.querySelectorAll(`.board-element, path, line`).forEach(t=>{let n=t.getBoundingClientRect();n.left<e.right&&n.right>e.left&&n.top<e.bottom&&n.bottom>e.top&&this.selectionManager.addToSelection(t)}),this.selectionBoxEl.remove(),this.selectionBoxEl=null}this.isDraggingElement&&(this.isDraggingElement=!1,this.saveBoardState()),this.isResizingElement&&(this.isResizingElement=!1,this.saveBoardState())})}saveBoardState(){if(!this.currentBoardId)return;if(!this.isRestoringState){let e=this.boardStore.getBoard(this.currentBoardId);e&&(this.undoStack.push({elements:JSON.parse(JSON.stringify(e.elements||[])),drawings:JSON.parse(JSON.stringify(e.drawings||[]))}),this.redoStack=[],this.updateUndoRedoButtons())}let e=[];this.workspaceContentEl.querySelectorAll(`.board-element`).forEach(t=>{let n=t.dataset.type,r={type:n,x:parseFloat(t.style.left||0),y:parseFloat(t.style.top||0)};(n===`rect`||n===`circle`||n===`sticky`)&&(r.width=parseFloat(t.style.width||t.offsetWidth),r.height=parseFloat(t.style.height||t.offsetHeight)),(n===`sticky`||n===`text`)&&(r.content=t.querySelector(`.editable-content`).innerHTML),e.push(r)});let t=[];this.drawingLayer.querySelectorAll(`path, line`).forEach(e=>{let n=e.tagName.toLowerCase()===`line`,r={type:n?`line`:`path`,stroke:e.getAttribute(`stroke`),strokeWidth:e.getAttribute(`stroke-width`)};n?(r.x1=e.getAttribute(`x1`),r.y1=e.getAttribute(`y1`),r.x2=e.getAttribute(`x2`),r.y2=e.getAttribute(`y2`)):r.d=e.getAttribute(`d`),r.transform=e.getAttribute(`transform`)||``,t.push(r)}),this.boardStore.updateBoard(this.currentBoardId,{elements:e,drawings:t})}loadBoardState(){this.undoStack=[],this.redoStack=[],this.updateUndoRedoButtons(),this.renderCurrentBoard()}undo(){if(this.undoStack.length===0)return;let e=this.boardStore.getBoard(this.currentBoardId);this.redoStack.push({elements:JSON.parse(JSON.stringify(e.elements||[])),drawings:JSON.parse(JSON.stringify(e.drawings||[]))});let t=this.undoStack.pop();this.isRestoringState=!0,this.boardStore.updateBoard(this.currentBoardId,t),this.renderCurrentBoard(),this.isRestoringState=!1,this.updateUndoRedoButtons()}redo(){if(this.redoStack.length===0)return;let e=this.boardStore.getBoard(this.currentBoardId);this.undoStack.push({elements:JSON.parse(JSON.stringify(e.elements||[])),drawings:JSON.parse(JSON.stringify(e.drawings||[]))});let t=this.redoStack.pop();this.isRestoringState=!0,this.boardStore.updateBoard(this.currentBoardId,t),this.renderCurrentBoard(),this.isRestoringState=!1,this.updateUndoRedoButtons()}updateUndoRedoButtons(){this.undoBtn.disabled=this.undoStack.length===0,this.redoBtn.disabled=this.redoStack.length===0}renderCurrentBoard(){let e=this.boardStore.getBoard(this.currentBoardId);e&&(this.workspaceContentEl.querySelectorAll(`.board-element`).forEach(e=>e.remove()),this.drawingLayer.innerHTML=``,this.panX=0,this.panY=0,this.scale=1,this.workspaceManager.updateWorkspaceTransform(),e.drawings&&e.drawings.forEach(e=>{if(e.d&&e.d.includes("${")||e.x1&&typeof e.x1==`string`&&e.x1.includes("${"))return;let t;e.type===`line`?(t=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),t.setAttribute(`x1`,e.x1),t.setAttribute(`y1`,e.y1),t.setAttribute(`x2`,e.x2),t.setAttribute(`y2`,e.y2)):(t=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),t.setAttribute(`d`,e.d),t.setAttribute(`fill`,`none`),t.setAttribute(`stroke-linejoin`,`round`)),t.setAttribute(`stroke`,e.stroke||`#050038`),t.setAttribute(`stroke-width`,e.strokeWidth||`4`),t.setAttribute(`stroke-linecap`,`round`),e.transform&&t.setAttribute(`transform`,e.transform),this.drawingLayer.appendChild(t)}),e.elements&&e.elements.forEach(e=>{this.elementFactory.createElement(e.type,null,e)}))}};customElements.define(`miro-clone`,c)})();