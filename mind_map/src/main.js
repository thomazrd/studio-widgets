class MindMapWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.nodes = [];
        this.nextNodeId = 1;
        this.widgetId = '64b54e3d-7a5f-4a0b-9c8f-1234567890ab';
        this.storageKey = `${this.widgetId}_mindmap_data`;

        // Interaction state
        this.selectedNodeId = null;
        this.draggingNode = null;
        this.isPanning = false;
        this.transform = { x: 0, y: 0, scale: 1 };

        this.dragStart = { x: 0, y: 0 };
        this.panStart = { x: 0, y: 0 };

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f5f5f7;
                    position: relative;
                }

                .toolbar {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    display: flex;
                    gap: 10px;
                    z-index: 10;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    padding: 10px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                button {
                    background: #ffffff;
                    border: 1px solid #d2d2d7;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1d1d1f;
                    transition: all 0.2s ease;
                }

                button:hover {
                    background: #f5f5f7;
                    border-color: #86868b;
                }

                button:active {
                    transform: scale(0.98);
                }

                .btn-primary {
                    background: #007aff;
                    color: white;
                    border: none;
                }

                .btn-primary:hover {
                    background: #005bb5;
                    border-color: transparent;
                }

                .map-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    cursor: grab;
                    overflow: hidden;
                }

                .map-container:active {
                    cursor: grabbing;
                }

                .workspace {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transform-origin: 0 0;
                    transition: transform 0.1s ease-out; /* smooth zooming */
                }

                .svg-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: visible;
                }

                .nodes-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .node {
                    position: absolute;
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 12px 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    cursor: move;
                    user-select: none;
                    min-width: 100px;
                    text-align: center;
                    border: 2px solid transparent;
                    transition: box-shadow 0.2s, border-color 0.2s;
                }

                .node:hover {
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                }

                .node.selected {
                    border-color: #007aff;
                    box-shadow: 0 0 0 4px rgba(0,122,255,0.2), 0 8px 24px rgba(0,0,0,0.15);
                }

                .node-text {
                    outline: none;
                    font-size: 16px;
                    font-weight: 500;
                    color: #1d1d1f;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .node-text[contenteditable="true"] {
                    cursor: text;
                    border-bottom: 2px solid #007aff;
                    padding-bottom: 2px;
                    margin-bottom: -4px;
                }

                .node-controls {
                    position: absolute;
                    bottom: -40px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: none;
                    gap: 5px;
                    background: #fff;
                    padding: 6px;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 100;
                }

                .node.selected .node-controls {
                    display: flex;
                    animation: fadeIn 0.2s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }

                .node-btn {
                    padding: 6px 10px;
                    font-size: 13px;
                    border: none;
                    background: #f0f0f5;
                    border-radius: 6px;
                    cursor: pointer;
                    color: #1d1d1f;
                    font-weight: 500;
                }

                .node-btn:hover {
                    background: #e5e5ea;
                }

                .node-btn.delete {
                    color: #ff3b30;
                }
                .node-btn.delete:hover {
                    background: #ff3b30;
                    color: white;
                }

                path.connection {
                    fill: none;
                    stroke: #c7c7cc;
                    stroke-width: 3px;
                    stroke-linecap: round;
                    transition: stroke 0.2s;
                }

                path.connection.highlight {
                    stroke: #007aff;
                    stroke-width: 4px;
                }
            </style>

            <div class="toolbar">
                <button id="btn-save" class="btn-primary">Save Map</button>
                <button id="btn-load">Load Map</button>
                <button id="btn-clear">Clear All</button>
                <button id="btn-add">Add Root</button>
            </div>

            <div class="map-container" id="map-container">
                <div class="workspace" id="workspace">
                    <svg class="svg-container" id="svg-container"></svg>
                    <div class="nodes-layer" id="nodes-layer"></div>
                </div>
            </div>
        `;

        this.workspace = this.shadowRoot.getElementById('workspace');
        this.nodesLayer = this.shadowRoot.getElementById('nodes-layer');
        this.svgContainer = this.shadowRoot.getElementById('svg-container');
        this.mapContainer = this.shadowRoot.getElementById('map-container');

        this.setupEventListeners();
    }

    connectedCallback() {
        this.loadFromStorage();
        if (this.nodes.length === 0) {
            this.addNode('Central Idea', window.innerWidth / 2 - 60, window.innerHeight / 2 - 20, null);
        }
        this.renderAll();
    }

    saveToStorage() {
        const data = {
            nodes: this.nodes,
            nextNodeId: this.nextNodeId,
            transform: this.transform
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));

        const btn = this.shadowRoot.getElementById('btn-save');
        const oldText = btn.textContent;
        btn.textContent = 'Saved!';
        btn.style.background = '#34c759';
        setTimeout(() => {
            btn.textContent = oldText;
            btn.style.background = '';
        }, 2000);
    }

    loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.nodes = parsed.nodes || [];
                this.nextNodeId = parsed.nextNodeId || 1;
                this.transform = parsed.transform || { x: 0, y: 0, scale: 1 };
                this.updateTransform();
                this.renderAll();
            } catch (e) {
                console.error("Failed to load mind map data", e);
            }
        }
    }

    setupEventListeners() {
        // Toolbar
        this.shadowRoot.getElementById('btn-save').addEventListener('click', () => {
            this.saveToStorage();
        });

        this.shadowRoot.getElementById('btn-load').addEventListener('click', () => {
            this.loadFromStorage();
        });

        this.shadowRoot.getElementById('btn-add').addEventListener('click', () => {
            const scale = this.transform.scale || 1;
            const x = (window.innerWidth / 2 - this.transform.x) / scale - 60;
            const y = (window.innerHeight / 2 - this.transform.y) / scale - 20;
            this.addNode('Root Node', x, y, null);
        });

        this.shadowRoot.getElementById('btn-clear').addEventListener('click', () => {
            if (confirm("Are you sure you want to clear the entire map?")) {
                this.nodes = [];
                this.nextNodeId = 1;
                this.selectedNodeId = null;
                this.transform = { x: 0, y: 0, scale: 1 };
                this.updateTransform();
                this.renderAll();
            }
        });

        // Panning and Dragging
        this.mapContainer.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Zooming
        this.mapContainer.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    }

    onMouseDown(e) {
        const nodeEl = e.target.closest('.node');

        if (e.target.closest('.toolbar') || e.target.closest('.node-controls') || e.target.closest('.node-text[contenteditable="true"]')) {
            return;
        }

        if (nodeEl) {
            // Drag node
            this.selectedNodeId = parseInt(nodeEl.dataset.id);
            this.draggingNode = this.nodes.find(n => n.id === this.selectedNodeId);
            this.dragStart = {
                x: e.clientX / this.transform.scale - this.draggingNode.x,
                y: e.clientY / this.transform.scale - this.draggingNode.y
            };
            this.renderAll();
            e.stopPropagation();
        } else {
            // Pan map
            this.isPanning = true;
            this.selectedNodeId = null;
            this.workspace.style.transition = 'none'; // disable smooth transition while panning
            this.panStart = {
                x: e.clientX - this.transform.x,
                y: e.clientY - this.transform.y
            };
            this.renderAll();
        }
    }

    onMouseMove(e) {
        if (this.draggingNode) {
            this.draggingNode.x = e.clientX / this.transform.scale - this.dragStart.x;
            this.draggingNode.y = e.clientY / this.transform.scale - this.dragStart.y;
            this.renderAll();
        } else if (this.isPanning) {
            this.transform.x = e.clientX - this.panStart.x;
            this.transform.y = e.clientY - this.panStart.y;
            this.updateTransform();
        }
    }

    onMouseUp(e) {
        this.draggingNode = null;
        if (this.isPanning) {
            this.workspace.style.transition = 'transform 0.1s ease-out'; // re-enable
        }
        this.isPanning = false;
    }

    onWheel(e) {
        e.preventDefault();

        const zoomSensitivity = 0.001;
        const delta = e.deltaY * -zoomSensitivity;
        let newScale = this.transform.scale * (1 + delta);

        newScale = Math.max(0.2, Math.min(newScale, 4));

        const rect = this.mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.transform.x = mouseX - (mouseX - this.transform.x) * (newScale / this.transform.scale);
        this.transform.y = mouseY - (mouseY - this.transform.y) * (newScale / this.transform.scale);
        this.transform.scale = newScale;

        this.updateTransform();
    }

    updateTransform() {
        this.workspace.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.transform.scale})`;
    }

    addNode(text, x, y, parentId) {
        const node = {
            id: this.nextNodeId++,
            text: text,
            x: x,
            y: y,
            parentId: parentId
        };
        this.nodes.push(node);
        this.selectedNodeId = node.id;
        this.renderAll();
        return node;
    }

    deleteNode(id) {
        const deleteIds = new Set();
        const stack = [id];

        while (stack.length > 0) {
            const currentId = stack.pop();
            deleteIds.add(currentId);

            for (const node of this.nodes) {
                if (node.parentId === currentId && !deleteIds.has(node.id)) {
                    stack.push(node.id);
                }
            }
        }

        this.nodes = this.nodes.filter(n => !deleteIds.has(n.id));
        if (this.selectedNodeId && deleteIds.has(this.selectedNodeId)) {
            this.selectedNodeId = null;
        }
        this.renderAll();
    }

    updateNodeText(id, newText) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            node.text = newText;
            this.renderAll();
        }
    }

    renderAll() {
        this.renderNodes();
        this.renderConnections();
    }

    renderNodes() {
        this.nodesLayer.innerHTML = '';

        this.nodes.forEach(node => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'node';
            if (node.id === this.selectedNodeId) {
                nodeEl.classList.add('selected');
            }
            nodeEl.style.left = node.x + 'px';
            nodeEl.style.top = node.y + 'px';
            nodeEl.dataset.id = node.id;

            const textEl = document.createElement('div');
            textEl.className = 'node-text';
            textEl.textContent = node.text;

            textEl.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                textEl.contentEditable = true;
                textEl.focus();

                // Select all text
                const range = document.createRange();
                range.selectNodeContents(textEl);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            });

            textEl.addEventListener('blur', () => {
                textEl.contentEditable = false;
                this.updateNodeText(node.id, textEl.textContent);
            });

            textEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    textEl.blur();
                }
            });

            const controlsEl = document.createElement('div');
            controlsEl.className = 'node-controls';

            const addBtn = document.createElement('button');
            addBtn.className = 'node-btn';
            addBtn.textContent = '+ Child';
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addNode('New Idea', node.x + 150, node.y + 50, node.id);
            });

            const delBtn = document.createElement('button');
            delBtn.className = 'node-btn delete';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteNode(node.id);
            });

            controlsEl.appendChild(addBtn);
            controlsEl.appendChild(delBtn);

            nodeEl.appendChild(textEl);
            nodeEl.appendChild(controlsEl);

            this.nodesLayer.appendChild(nodeEl);
        });
    }

    renderConnections() {
        this.svgContainer.innerHTML = '';
        const namespaceURI = "http://www.w3.org/2000/svg";

        const nodeDimensions = {};
        const nodeElements = this.nodesLayer.querySelectorAll('.node');
        nodeElements.forEach(el => {
            const id = parseInt(el.dataset.id);
            nodeDimensions[id] = {
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        });

        this.nodes.forEach(node => {
            if (node.parentId !== null) {
                const parentNode = this.nodes.find(n => n.id === node.parentId);
                if (parentNode && nodeDimensions[node.id] && nodeDimensions[parentNode.id]) {

                    const parentW = nodeDimensions[parentNode.id].width;
                    const parentH = nodeDimensions[parentNode.id].height;
                    const childW = nodeDimensions[node.id].width;
                    const childH = nodeDimensions[node.id].height;

                    // Calculate bounding boxes
                    const pLeft = parentNode.x;
                    const pRight = parentNode.x + parentW;
                    const pTop = parentNode.y;
                    const pBottom = parentNode.y + parentH;

                    const cLeft = node.x;
                    const cRight = node.x + childW;
                    const cTop = node.y;
                    const cBottom = node.y + childH;

                    // Find nearest edges
                    let startX, startY, endX, endY;

                    if (pRight < cLeft) {
                        startX = pRight;
                        startY = pTop + parentH / 2;
                        endX = cLeft;
                        endY = cTop + childH / 2;
                    } else if (pLeft > cRight) {
                        startX = pLeft;
                        startY = pTop + parentH / 2;
                        endX = cRight;
                        endY = cTop + childH / 2;
                    } else if (pBottom < cTop) {
                        startX = pLeft + parentW / 2;
                        startY = pBottom;
                        endX = cLeft + childW / 2;
                        endY = cTop;
                    } else {
                        startX = pLeft + parentW / 2;
                        startY = pTop;
                        endX = cLeft + childW / 2;
                        endY = cBottom;
                    }

                    const dx = endX - startX;
                    const dy = endY - startY;

                    // Calculate curved path based on orientation
                    let pathString = '';
                    if (Math.abs(dx) > Math.abs(dy)) {
                        const controlOffset = Math.abs(dx) / 2;
                        pathString = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
                    } else {
                        const controlOffset = Math.abs(dy) / 2;
                        pathString = `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`;
                    }

                    const path = document.createElementNS(namespaceURI, 'path');
                    path.setAttribute('d', pathString);
                    path.setAttribute('class', `connection ${node.id === this.selectedNodeId || parentNode.id === this.selectedNodeId ? 'highlight' : ''}`);
                    this.svgContainer.appendChild(path);
                }
            }
        });
    }
}

customElements.define('mind-map-widget', MindMapWidget);
