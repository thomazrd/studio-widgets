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
`;var n=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.shadowRoot.appendChild(t.content.cloneNode(!0)),this.dashboardEl=this.shadowRoot.getElementById(`dashboard`),this.boardsGridEl=this.shadowRoot.getElementById(`boards-grid`),this.newBoardBtn=this.shadowRoot.getElementById(`new-board-btn`),this.boardViewEl=this.shadowRoot.getElementById(`board-view`),this.backBtn=this.shadowRoot.getElementById(`back-btn`),this.boardTitleInput=this.shadowRoot.getElementById(`board-title-input`),this.workspaceEl=this.shadowRoot.getElementById(`board-workspace`),this.workspaceContentEl=this.shadowRoot.getElementById(`workspace-content`),this.drawingLayer=this.shadowRoot.getElementById(`drawing-layer`),this.toolBtns=this.shadowRoot.querySelectorAll(`.tool-btn`),this.penOptionsEl=this.shadowRoot.getElementById(`pen-options`),this.penColorInput=this.shadowRoot.getElementById(`pen-color`),this.penThicknessInput=this.shadowRoot.getElementById(`pen-thickness`),this.instanceId=this.generateInstanceId(),this.boardStore=new e(this.instanceId),this.currentBoardId=null,this.currentTool=`select`,this.scale=1,this.panX=0,this.panY=0,this.isPanning=!1,this.startX=0,this.startY=0,this.isDrawing=!1,this.currentPath=null,this.elements=[],this.selectedElement=null,this.isDraggingElement=!1,this.isResizingElement=!1,this.elementDragStartX=0,this.elementDragStartY=0,this.elementStartWidth=0,this.elementStartHeight=0}generateInstanceId(){let e=localStorage.getItem(`miro_clone_instance_id`);return e||(e=Math.random().toString(36).substr(2,9),localStorage.setItem(`miro_clone_instance_id`,e)),e}connectedCallback(){this.bindEvents(),this.renderDashboard()}bindEvents(){this.newBoardBtn.addEventListener(`click`,()=>this.createNewBoard()),this.backBtn.addEventListener(`click`,()=>this.showDashboard()),this.boardTitleInput.addEventListener(`change`,e=>{this.currentBoardId&&this.boardStore.updateBoard(this.currentBoardId,{title:e.target.value})}),this.toolBtns.forEach(e=>{e.addEventListener(`click`,e=>{this.toolBtns.forEach(e=>e.classList.remove(`active`));let t=e.currentTarget;t.classList.add(`active`),this.currentTool=t.dataset.tool,this.updateWorkspaceCursor(),this.currentTool===`pen`||this.currentTool===`line`?this.penOptionsEl.classList.add(`visible`):this.penOptionsEl.classList.remove(`visible`)})}),this.bindWorkspaceEvents()}bindWorkspaceEvents(){this.workspaceEl.addEventListener(`wheel`,e=>{e.preventDefault();let t=e.deltaY*-.001,n=Math.min(Math.max(.1,this.scale+t),5),r=this.workspaceEl.getBoundingClientRect(),i=e.clientX-r.left,a=e.clientY-r.top;this.panX=i-(i-this.panX)*(n/this.scale),this.panY=a-(a-this.panY)*(n/this.scale),this.scale=n,this.updateWorkspaceTransform()},{passive:!1}),this.workspaceEl.addEventListener(`pointerdown`,e=>{let t=e.target===this.workspaceEl||e.target===this.workspaceContentEl||e.target===this.drawingLayer;if(e.button===1||this.currentTool===`select`&&t)this.isPanning=!0,this.startX=e.clientX-this.panX,this.startY=e.clientY-this.panY,this.workspaceEl.style.cursor=`grabbing`,this.clearSelection();else if(e.button===0){let n=this.getWorkspaceCoords(e.clientX,e.clientY);this.currentTool===`pen`||this.currentTool===`line`?(this.isDrawing=!0,this.startDrawing(n)):[`rect`,`circle`,`sticky`,`text`].includes(this.currentTool)&&t&&(this.createElement(this.currentTool,n),this.toolBtns[0].click())}}),window.addEventListener(`pointermove`,e=>{if(this.isPanning)this.panX=e.clientX-this.startX,this.panY=e.clientY-this.startY,this.updateWorkspaceTransform();else if(this.isDrawing){let t=this.getWorkspaceCoords(e.clientX,e.clientY);this.continueDrawing(t)}else if(this.isDraggingElement&&this.selectedElement){let t=this.getWorkspaceCoords(e.clientX,e.clientY),n=t.x-this.elementDragStartX,r=t.y-this.elementDragStartY,i=parseFloat(this.selectedElement.style.left||0),a=parseFloat(this.selectedElement.style.top||0);this.selectedElement.style.left=i+n+`px`,this.selectedElement.style.top=a+r+`px`,this.elementDragStartX=t.x,this.elementDragStartY=t.y}else if(this.isResizingElement&&this.selectedElement){let t=this.getWorkspaceCoords(e.clientX,e.clientY),n=t.x-this.elementDragStartX,r=t.y-this.elementDragStartY,i=Math.max(50,this.elementStartWidth+n),a=Math.max(50,this.elementStartHeight+r);if(this.selectedElement.dataset.type===`circle`){let e=Math.max(i,a);i=e,a=e}this.selectedElement.style.width=i+`px`,this.selectedElement.style.height=a+`px`}}),window.addEventListener(`pointerup`,()=>{this.isPanning&&(this.isPanning=!1,this.updateWorkspaceCursor()),this.isDrawing&&(this.isDrawing=!1,this.saveBoardState()),this.isDraggingElement&&(this.isDraggingElement=!1,this.saveBoardState()),this.isResizingElement&&(this.isResizingElement=!1,this.saveBoardState())})}startDrawing(e){this.currentTool===`line`?(this.currentPath=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),this.currentPath.setAttribute(`x1`,e.x),this.currentPath.setAttribute(`y1`,e.y),this.currentPath.setAttribute(`x2`,e.x),this.currentPath.setAttribute(`y2`,e.y)):(this.currentPath=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),this.currentPath.setAttribute(`d`,`M ${e.x} ${e.y}`),this.currentPath.setAttribute(`fill`,`none`),this.currentPath.setAttribute(`stroke-linejoin`,`round`)),this.currentPath.setAttribute(`stroke`,this.penColorInput.value),this.currentPath.setAttribute(`stroke-width`,this.penThicknessInput.value),this.currentPath.setAttribute(`stroke-linecap`,`round`),this.drawingLayer.appendChild(this.currentPath)}continueDrawing(e){if(this.currentPath)if(this.currentTool===`line`)this.currentPath.setAttribute(`x2`,e.x),this.currentPath.setAttribute(`y2`,e.y);else{let t=this.currentPath.getAttribute(`d`);this.currentPath.setAttribute(`d`,`${t} L ${e.x} ${e.y}`)}}createElement(e,t,n=null){let r=document.createElement(`div`);if(r.classList.add(`board-element`),r.style.left=(n?n.x:t.x)+`px`,r.style.top=(n?n.y:t.y)+`px`,e===`rect`||e===`circle`||e===`sticky`){let e=document.createElement(`div`);e.classList.add(`resize-handle`),e.addEventListener(`pointerdown`,e=>{if(this.currentTool!==`select`)return;e.stopPropagation(),this.selectElement(r),this.isResizingElement=!0;let t=this.getWorkspaceCoords(e.clientX,e.clientY);this.elementDragStartX=t.x,this.elementDragStartY=t.y,this.elementStartWidth=parseFloat(r.style.width||0),this.elementStartHeight=parseFloat(r.style.height||0)}),r.appendChild(e)}if(e===`rect`)r.classList.add(`shape-rect`),r.style.width=(n?n.width:200)+`px`,r.style.height=(n?n.height:100)+`px`;else if(e===`circle`)r.classList.add(`shape-circle`),r.style.width=(n?n.width:150)+`px`,r.style.height=(n?n.height:150)+`px`;else if(e===`sticky`){r.classList.add(`sticky-note`);let e=document.createElement(`div`);e.classList.add(`editable-content`),e.contentEditable=`true`,e.innerHTML=n?n.content:`Nota...`,r.style.width=n&&n.width?n.width+`px`:``,r.style.height=n&&n.height?n.height+`px`:``,r.appendChild(e),e.addEventListener(`input`,()=>this.saveBoardState()),e.addEventListener(`pointerdown`,e=>e.stopPropagation())}else if(e===`text`){r.classList.add(`text-note`);let e=document.createElement(`div`);e.classList.add(`editable-content`),e.contentEditable=`true`,e.innerHTML=n?n.content:`Texto`,r.appendChild(e),e.addEventListener(`input`,()=>this.saveBoardState()),e.addEventListener(`pointerdown`,e=>e.stopPropagation())}return r.dataset.type=e,r.addEventListener(`pointerdown`,e=>{if(this.currentTool!==`select`)return;e.stopPropagation(),this.selectElement(r),this.isDraggingElement=!0;let t=this.getWorkspaceCoords(e.clientX,e.clientY);this.elementDragStartX=t.x,this.elementDragStartY=t.y}),this.workspaceContentEl.appendChild(r),n||this.saveBoardState(),r}selectElement(e){this.clearSelection(),this.selectedElement=e,e.classList.add(`selected`)}clearSelection(){this.selectedElement&&=(this.selectedElement.classList.remove(`selected`),null)}saveBoardState(){if(!this.currentBoardId)return;let e=[];this.workspaceContentEl.querySelectorAll(`.board-element`).forEach(t=>{let n=t.dataset.type,r={type:n,x:parseFloat(t.style.left||0),y:parseFloat(t.style.top||0)};(n===`rect`||n===`circle`||n===`sticky`)&&(r.width=parseFloat(t.style.width||t.offsetWidth),r.height=parseFloat(t.style.height||t.offsetHeight)),(n===`sticky`||n===`text`)&&(r.content=t.querySelector(`.editable-content`).innerHTML),e.push(r)});let t=[];this.drawingLayer.querySelectorAll(`path, line`).forEach(e=>{let n=e.tagName.toLowerCase()===`line`,r={type:n?`line`:`path`,stroke:e.getAttribute(`stroke`),strokeWidth:e.getAttribute(`stroke-width`)};n?(r.x1=e.getAttribute(`x1`),r.y1=e.getAttribute(`y1`),r.x2=e.getAttribute(`x2`),r.y2=e.getAttribute(`y2`)):r.d=e.getAttribute(`d`),t.push(r)}),this.boardStore.updateBoard(this.currentBoardId,{elements:e,drawings:t})}loadBoardState(){let e=this.boardStore.getBoard(this.currentBoardId);e&&(this.workspaceContentEl.querySelectorAll(`.board-element`).forEach(e=>e.remove()),this.drawingLayer.innerHTML=``,this.panX=0,this.panY=0,this.scale=1,this.updateWorkspaceTransform(),e.drawings&&e.drawings.forEach(e=>{let t;e.type===`line`?(t=document.createElementNS(`http://www.w3.org/2000/svg`,`line`),t.setAttribute(`x1`,e.x1),t.setAttribute(`y1`,e.y1),t.setAttribute(`x2`,e.x2),t.setAttribute(`y2`,e.y2)):(t=document.createElementNS(`http://www.w3.org/2000/svg`,`path`),t.setAttribute(`d`,e.d),t.setAttribute(`fill`,`none`),t.setAttribute(`stroke-linejoin`,`round`)),t.setAttribute(`stroke`,e.stroke||`#050038`),t.setAttribute(`stroke-width`,e.strokeWidth||`4`),t.setAttribute(`stroke-linecap`,`round`),this.drawingLayer.appendChild(t)}),e.elements&&e.elements.forEach(e=>{this.createElement(e.type,null,e)}))}updateWorkspaceTransform(){this.workspaceContentEl.style.transform=`translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`}updateWorkspaceCursor(){switch(this.currentTool){case`select`:this.workspaceEl.style.cursor=`grab`;break;case`pen`:this.workspaceEl.style.cursor=`crosshair`;break;default:this.workspaceEl.style.cursor=`crosshair`}}getWorkspaceCoords(e,t){let n=this.workspaceEl.getBoundingClientRect();return{x:(e-n.left-this.panX)/this.scale,y:(t-n.top-this.panY)/this.scale}}renderDashboard(){this.dashboardEl.style.display=`flex`,this.boardViewEl.style.display=`none`,this.currentBoardId=null;let e=this.boardStore.getBoards();this.boardsGridEl.innerHTML=``,e.forEach(e=>{let t=document.createElement(`div`);t.className=`board-card`,t.addEventListener(`click`,t=>{t.target.classList.contains(`delete-btn`)||this.openBoard(e.id)});let n=new Date(e.updatedAt).toLocaleString(`pt-BR`);t.innerHTML=`
        <div class="board-title">${e.title}</div>
        <div class="board-date">Atualizado em: ${n}</div>
        <div class="board-actions">
          <button class="btn btn-danger delete-btn" data-id="${e.id}">Excluir</button>
        </div>
      `,t.querySelector(`.delete-btn`).addEventListener(`click`,t=>{t.stopPropagation(),confirm(`Tem certeza que deseja excluir este quadro?`)&&(this.boardStore.deleteBoard(e.id),this.renderDashboard())}),this.boardsGridEl.appendChild(t)})}createNewBoard(){let e=this.boardStore.createBoard(`Quadro sem título`);this.openBoard(e.id)}openBoard(e){let t=this.boardStore.getBoard(e);t&&(this.currentBoardId=e,this.dashboardEl.style.display=`none`,this.boardViewEl.style.display=`block`,this.boardTitleInput.value=t.title,this.loadBoardState())}showDashboard(){this.renderDashboard()}};customElements.define(`miro-clone`,n)})();