(function(){var e=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.nodes=[],this.nextNodeId=1,this.widgetId=`64b54e3d-7a5f-4a0b-9c8f-1234567890ab`,this.storageKey=`${this.widgetId}_mindmap_data`,this.selectedNodeId=null,this.draggingNode=null,this.isPanning=!1,this.transform={x:0,y:0,scale:1},this.dragStart={x:0,y:0},this.panStart={x:0,y:0},this.shadowRoot.innerHTML=`
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
        `,this.workspace=this.shadowRoot.getElementById(`workspace`),this.nodesLayer=this.shadowRoot.getElementById(`nodes-layer`),this.svgContainer=this.shadowRoot.getElementById(`svg-container`),this.mapContainer=this.shadowRoot.getElementById(`map-container`),this.setupEventListeners()}connectedCallback(){this.loadFromStorage(),this.nodes.length===0&&this.addNode(`Central Idea`,window.innerWidth/2-60,window.innerHeight/2-20,null),this.renderAll()}saveToStorage(){let e={nodes:this.nodes,nextNodeId:this.nextNodeId,transform:this.transform};localStorage.setItem(this.storageKey,JSON.stringify(e));let t=this.shadowRoot.getElementById(`btn-save`),n=t.textContent;t.textContent=`Saved!`,t.style.background=`#34c759`,setTimeout(()=>{t.textContent=n,t.style.background=``},2e3)}loadFromStorage(){let e=localStorage.getItem(this.storageKey);if(e)try{let t=JSON.parse(e);this.nodes=t.nodes||[],this.nextNodeId=t.nextNodeId||1,this.transform=t.transform||{x:0,y:0,scale:1},this.updateTransform(),this.renderAll()}catch(e){console.error(`Failed to load mind map data`,e)}}setupEventListeners(){this.shadowRoot.getElementById(`btn-save`).addEventListener(`click`,()=>{this.saveToStorage()}),this.shadowRoot.getElementById(`btn-load`).addEventListener(`click`,()=>{this.loadFromStorage()}),this.shadowRoot.getElementById(`btn-add`).addEventListener(`click`,()=>{let e=this.transform.scale||1,t=(window.innerWidth/2-this.transform.x)/e-60,n=(window.innerHeight/2-this.transform.y)/e-20;this.addNode(`Root Node`,t,n,null)}),this.shadowRoot.getElementById(`btn-clear`).addEventListener(`click`,()=>{confirm(`Are you sure you want to clear the entire map?`)&&(this.nodes=[],this.nextNodeId=1,this.selectedNodeId=null,this.transform={x:0,y:0,scale:1},this.updateTransform(),this.renderAll())}),this.mapContainer.addEventListener(`mousedown`,this.onMouseDown.bind(this)),window.addEventListener(`mousemove`,this.onMouseMove.bind(this)),window.addEventListener(`mouseup`,this.onMouseUp.bind(this)),this.mapContainer.addEventListener(`wheel`,this.onWheel.bind(this),{passive:!1})}onMouseDown(e){let t=e.target.closest(`.node`);e.target.closest(`.toolbar`)||e.target.closest(`.node-controls`)||e.target.closest(`.node-text[contenteditable="true"]`)||(t?(this.selectedNodeId=parseInt(t.dataset.id),this.draggingNode=this.nodes.find(e=>e.id===this.selectedNodeId),this.dragStart={x:e.clientX/this.transform.scale-this.draggingNode.x,y:e.clientY/this.transform.scale-this.draggingNode.y},this.renderAll(),e.stopPropagation()):(this.isPanning=!0,this.selectedNodeId=null,this.workspace.style.transition=`none`,this.panStart={x:e.clientX-this.transform.x,y:e.clientY-this.transform.y},this.renderAll()))}onMouseMove(e){this.draggingNode?(this.draggingNode.x=e.clientX/this.transform.scale-this.dragStart.x,this.draggingNode.y=e.clientY/this.transform.scale-this.dragStart.y,this.renderAll()):this.isPanning&&(this.transform.x=e.clientX-this.panStart.x,this.transform.y=e.clientY-this.panStart.y,this.updateTransform())}onMouseUp(e){this.draggingNode=null,this.isPanning&&(this.workspace.style.transition=`transform 0.1s ease-out`),this.isPanning=!1}onWheel(e){e.preventDefault();let t=e.deltaY*-.001,n=this.transform.scale*(1+t);n=Math.max(.2,Math.min(n,4));let r=this.mapContainer.getBoundingClientRect(),i=e.clientX-r.left,a=e.clientY-r.top;this.transform.x=i-(i-this.transform.x)*(n/this.transform.scale),this.transform.y=a-(a-this.transform.y)*(n/this.transform.scale),this.transform.scale=n,this.updateTransform()}updateTransform(){this.workspace.style.transform=`translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.transform.scale})`}addNode(e,t,n,r){let i={id:this.nextNodeId++,text:e,x:t,y:n,parentId:r};return this.nodes.push(i),this.selectedNodeId=i.id,this.renderAll(),i}deleteNode(e){let t=new Set,n=[e];for(;n.length>0;){let e=n.pop();t.add(e);for(let r of this.nodes)r.parentId===e&&!t.has(r.id)&&n.push(r.id)}this.nodes=this.nodes.filter(e=>!t.has(e.id)),this.selectedNodeId&&t.has(this.selectedNodeId)&&(this.selectedNodeId=null),this.renderAll()}updateNodeText(e,t){let n=this.nodes.find(t=>t.id===e);n&&(n.text=t,this.renderAll())}renderAll(){this.renderNodes(),this.renderConnections()}renderNodes(){this.nodesLayer.innerHTML=``,this.nodes.forEach(e=>{let t=document.createElement(`div`);t.className=`node`,e.id===this.selectedNodeId&&t.classList.add(`selected`),t.style.left=e.x+`px`,t.style.top=e.y+`px`,t.dataset.id=e.id;let n=document.createElement(`div`);n.className=`node-text`,n.textContent=e.text,n.addEventListener(`dblclick`,e=>{e.stopPropagation(),n.contentEditable=!0,n.focus();let t=document.createRange();t.selectNodeContents(n);let r=window.getSelection();r.removeAllRanges(),r.addRange(t)}),n.addEventListener(`blur`,()=>{n.contentEditable=!1,this.updateNodeText(e.id,n.textContent)}),n.addEventListener(`keydown`,e=>{e.key===`Enter`&&(e.preventDefault(),n.blur())});let r=document.createElement(`div`);r.className=`node-controls`;let i=document.createElement(`button`);i.className=`node-btn`,i.textContent=`+ Child`,i.addEventListener(`click`,t=>{t.stopPropagation(),this.addNode(`New Idea`,e.x+150,e.y+50,e.id)});let a=document.createElement(`button`);a.className=`node-btn delete`,a.textContent=`Delete`,a.addEventListener(`click`,t=>{t.stopPropagation(),this.deleteNode(e.id)}),r.appendChild(i),r.appendChild(a),t.appendChild(n),t.appendChild(r),this.nodesLayer.appendChild(t)})}renderConnections(){this.svgContainer.innerHTML=``;let e={};this.nodesLayer.querySelectorAll(`.node`).forEach(t=>{let n=parseInt(t.dataset.id);e[n]={width:t.offsetWidth,height:t.offsetHeight}}),this.nodes.forEach(t=>{if(t.parentId!==null){let n=this.nodes.find(e=>e.id===t.parentId);if(n&&e[t.id]&&e[n.id]){let r=e[n.id].width,i=e[n.id].height,a=e[t.id].width,o=e[t.id].height,s=n.x,c=n.x+r,l=n.y,u=n.y+i,d=t.x,f=t.x+a,p=t.y,m=t.y+o,h,g,_,v;c<d?(h=c,g=l+i/2,_=d,v=p+o/2):s>f?(h=s,g=l+i/2,_=f,v=p+o/2):u<p?(h=s+r/2,g=u,_=d+a/2,v=p):(h=s+r/2,g=l,_=d+a/2,v=m);let y=_-h,b=v-g,x=``;if(Math.abs(y)>Math.abs(b)){let e=Math.abs(y)/2;x=`M ${h} ${g} C ${h+e} ${g}, ${_-e} ${v}, ${_} ${v}`}else{let e=Math.abs(b)/2;x=`M ${h} ${g} C ${h} ${g+e}, ${_} ${v-e}, ${_} ${v}`}let S=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);S.setAttribute(`d`,x),S.setAttribute(`class`,`connection ${t.id===this.selectedNodeId||n.id===this.selectedNodeId?`highlight`:``}`),this.svgContainer.appendChild(S)}}})}};customElements.define(`mind-map-widget`,e)})();