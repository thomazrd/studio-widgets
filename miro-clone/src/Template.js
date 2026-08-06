export const template = document.createElement('template');
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

  .context-toolbar {
    position: absolute;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none;
    padding: 4px;
    gap: 4px;
    z-index: 20;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .context-toolbar.visible {
    display: flex;
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

  .palette-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-top: 8px;
  }

  .palette-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 20px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .palette-btn:hover {
    background: #f4f5f7;
  }

  .palette-btn.selected {
    background: #e5e9ff;
    outline: 1px solid var(--primary-color);
  }

  .palette-btn svg,
  .palette-btn i {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }

  .icon-search-container {
    padding: 8px 0;
  }

  .icon-search-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #cacedb;
    border-radius: 4px;
    outline: none;
    font-size: 14px;
  }
  
  .icon-search-input:focus {
    border-color: var(--primary-color);
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    max-height: 250px;
    overflow-y: auto;
    padding-right: 4px;
  }

  /* Customizing emoji-picker-element */
  emoji-picker {
    --num-columns: 8;
    --emoji-size: 1.5rem;
    --background: white;
    width: 320px;
    height: 350px;
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
  
  .shape-image {
    background: transparent;
  }
  
  .shape-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 4px;
    pointer-events: none; /* so drag events fall to the parent div */
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
    overflow-y: auto;
  }

  .board-view.locked .toolbar {
    pointer-events: none;
  }

  .board-view.locked .board-element {
    pointer-events: none;
  }

  .board-view.locked .drawing-layer path,
  .board-view.locked .drawing-layer line {
    pointer-events: none;
  }

  /* Modals */
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(5, 0, 56, 0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-overlay.visible { display: flex; }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    width: 600px;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    overflow: hidden;
  }
  
  .modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #e0e2e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-header h3 { margin: 0; color: #050038; }
  .close-modal { cursor: pointer; font-size: 20px; font-weight: bold; color: #8c8c8c; border: none; background: transparent; }
  .close-modal:hover { color: #f24726; }
  
  .modal-tabs {
    display: flex;
    border-bottom: 1px solid #e0e2e8;
  }
  .modal-tab {
    flex: 1;
    padding: 12px;
    text-align: center;
    cursor: pointer;
    background: #f4f5f7;
    font-weight: 600;
    color: #050038;
    border-bottom: 2px solid transparent;
  }
  .modal-tab.active { background: white; border-bottom-color: var(--primary-color); color: var(--primary-color); }
  
  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .tab-pane { display: none; flex-direction: column; height: 100%; }
  .tab-pane.active { display: flex; }
  
  /* Pexels Search */
  .search-bar { display: flex; gap: 8px; margin-bottom: 16px; }
  .search-bar input { flex: 1; padding: 10px; border: 1px solid #cacedb; border-radius: 6px; outline: none; font-size: 14px; }
  .search-bar input:focus { border-color: var(--primary-color); }
  
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    overflow-y: auto;
  }
  .image-grid img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .image-grid img:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  
  /* Upload Area */
  .upload-area {
    border: 2px dashed #cacedb;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .upload-area:hover, .upload-area.dragover { border-color: var(--primary-color); background-color: #f4f5f7; }
  .upload-area input[type="file"] { display: none; }
  .upload-icon { font-size: 40px; color: #8c8c8c; }
  
  /* Cropper Modal */
  .cropper-container-wrapper { width: 100%; height: 400px; background: #e5e5e5; }
  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e0e2e8;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .hidden { display: none !important; }

</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
        <button class="tool-btn" id="lock-btn" title="Bloquear/Desbloquear">🔓</button>
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
      <button class="tool-btn" data-tool="image" title="Imagem">🖼️</button>
    </div>
    <div class="tool-options" id="pen-options">
      <label>Cor: <input type="color" class="color-picker" id="pen-color" value="#050038"></label>
      <label>Espessura: <input type="range" class="thickness-picker" id="pen-thickness" min="1" max="20" value="4"></label>
    </div>
    <div class="tool-options" id="emoji-options" style="padding: 0;">
      <emoji-picker id="emoji-picker"></emoji-picker>
    </div>
    <div class="tool-options" id="icon-options" style="width: 260px;">
      <label style="display:flex; align-items:center; gap: 8px; font-weight: 500;">
        Cor: <input type="color" class="color-picker" id="icon-color" value="#050038">
      </label>
      <div class="icon-search-container">
        <input type="search" class="icon-search-input" id="icon-search" placeholder="Buscar ícones...">
      </div>
      <div class="icon-grid" id="icon-grid">
        <!-- Ícones inseridos dinamicamente -->
      </div>
    </div>
    <div class="board-workspace" id="board-workspace">
      <div class="workspace-content" id="workspace-content">
        <svg class="drawing-layer" id="drawing-layer"></svg>
      </div>
      <div class="context-toolbar" id="context-toolbar">
         <button class="tool-btn" id="crop-btn" title="Cortar Imagem">✂️</button>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <div class="modal-overlay" id="image-modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Adicionar Imagem</h3>
        <button class="close-modal" id="close-image-modal">&times;</button>
      </div>
      <div class="modal-tabs">
        <div class="modal-tab active" data-target="pexels-pane">Pexels</div>
        <div class="modal-tab" data-target="upload-pane">Meu Computador</div>
      </div>
      <div class="modal-body">
        <div class="tab-pane active" id="pexels-pane">
          <div class="search-bar">
            <input type="text" id="pexels-search-input" placeholder="Buscar imagens gratuitas..." value="nature">
            <button class="btn btn-primary" id="pexels-search-btn">Buscar</button>
          </div>
          <div id="pexels-loading" class="loading-spinner hidden"></div>
          <div class="image-grid" id="pexels-grid"></div>
        </div>
        <div class="tab-pane" id="upload-pane">
           <div class="upload-area" id="upload-area">
              <span class="upload-icon">📁</span>
              <div>Arraste e solte ou clique para enviar uma imagem</div>
              <small>Envio direto seguro via UploadThing</small>
              <input type="file" id="upload-file-input" accept="image/*">
           </div>
           <div id="upload-loading" class="loading-spinner hidden"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="crop-modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Cortar Imagem</h3>
        <button class="close-modal" id="close-crop-modal">&times;</button>
      </div>
      <div class="modal-body" style="padding:0">
        <div class="cropper-container-wrapper">
           <img id="cropper-image-target" src="" style="max-width: 100%; display:block;">
        </div>
      </div>
      <div class="modal-footer">
        <div id="crop-loading" class="loading-spinner hidden" style="margin:0 10px; width:20px; height:20px;"></div>
        <button class="btn" id="cancel-crop-btn">Cancelar</button>
        <button class="btn btn-primary" id="confirm-crop-btn">Aplicar Corte</button>
      </div>
    </div>
  </div>
</div>
`;
