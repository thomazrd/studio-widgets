(function(){var e=`3a40acd5-9947-47c0-aaf4-9614cda5d3fa`,t=class{constructor(e=100,t=26){this.rows=e,this.cols=t,this.data={},this.loadFromStorage()}getStorageKey(){return`${e}-spreadsheet-data`}loadFromStorage(){try{let e=localStorage.getItem(this.getStorageKey());e&&(this.data=JSON.parse(e))}catch(e){console.error(`Error loading data from localStorage`,e),this.data={}}}saveToStorage(){try{localStorage.setItem(this.getStorageKey(),JSON.stringify(this.data))}catch(e){console.error(`Error saving data to localStorage`,e)}}getCell(e){return this.data[e]||{value:``,formula:``,format:{}}}setCell(e,t,n=``,r=null){let i=this.getCell(e);this.data[e]={value:t,formula:n,format:r||i.format},this.saveToStorage()}setCellFormat(e,t,n){let r=this.getCell(e);r.format||={},r.format[t]=n,this.data[e]=r,this.saveToStorage()}evaluateFormula(e){if(!e.startsWith(`=`))return e;let t=e.substring(1).toUpperCase();if(t=t.replace(/[A-Z]+[0-9]+/g,e=>{let t=this.getCell(e),n=parseFloat(t.value);return isNaN(n)?0:n}),t.startsWith(`SUM(`)&&t.endsWith(`)`)){let e=t.substring(4,t.length-1).split(`,`),n=0;for(let t of e){let e=parseFloat(t.trim());isNaN(e)||(n+=e)}return n.toString()}if(t.startsWith(`AVERAGE(`)&&t.endsWith(`)`)){let e=t.substring(8,t.length-1).split(`,`),n=0,r=0;for(let t of e){let e=parseFloat(t.trim());isNaN(e)||(n+=e,r++)}return r===0?`0`:(n/r).toString()}try{return/^[0-9+\-*/().\s]+$/.test(t)?Function(`return `+t)().toString():`#ERROR!`}catch{return`#ERROR!`}}recalculateAll(){let e=!1;for(let[t,n]of Object.entries(this.data))if(n.formula&&n.formula.startsWith(`=`)){let t=this.evaluateFormula(n.formula);t!==n.value&&(n.value=t,e=!0)}return e&&this.saveToStorage(),e}},n=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.core=new t(100,26),this.selectedCellId=`A1`}connectedCallback(){this.render(),this.setupEventListeners(),this.renderGrid(),this.updateUI()}indexToColName(e){let t=``,n=e;for(;n>=0;)t=String.fromCharCode(n%26+65)+t,n=Math.floor(n/26)-1;return t}renderGrid(){let e=this.shadowRoot.getElementById(`grid`);e.innerHTML=``;let t=document.createElement(`tr`);t.appendChild(document.createElement(`th`));for(let e=0;e<this.core.cols;e++){let n=document.createElement(`th`);n.textContent=this.indexToColName(e),t.appendChild(n)}e.appendChild(t);for(let t=1;t<=this.core.rows;t++){let n=document.createElement(`tr`),r=document.createElement(`th`);r.textContent=t,n.appendChild(r);for(let e=0;e<this.core.cols;e++){let r=`${this.indexToColName(e)}${t}`,i=document.createElement(`td`);i.dataset.id=r,i.tabIndex=0;let a=this.core.getCell(r);i.textContent=a.value,this.applyFormatToElement(i,a.format),n.appendChild(i)}e.appendChild(n)}}applyFormatToElement(e,t){t&&(e.style.fontWeight=t.bold?`bold`:`normal`,e.style.fontStyle=t.italic?`italic`:`normal`,e.style.textDecoration=t.underline?`underline`:`none`)}setupEventListeners(){let e=this.shadowRoot.getElementById(`grid`),t=this.shadowRoot.getElementById(`formula-input`);e.addEventListener(`click`,e=>{let t=e.target.closest(`td`);t&&t.dataset.id&&this.selectCell(t.dataset.id)}),e.addEventListener(`dblclick`,e=>{let t=e.target.closest(`td`);t&&t.dataset.id&&this.makeCellEditable(t)}),t.addEventListener(`input`,e=>{let t=e.target.value,n=this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);n&&(n.textContent=t)}),t.addEventListener(`change`,e=>{this.commitCellChange(this.selectedCellId,e.target.value)}),t.addEventListener(`keydown`,e=>{if(e.key===`Enter`){this.commitCellChange(this.selectedCellId,e.target.value),t.blur();let n=this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);n&&n.focus()}}),this.shadowRoot.getElementById(`btn-bold`).addEventListener(`click`,()=>this.toggleFormat(`bold`)),this.shadowRoot.getElementById(`btn-italic`).addEventListener(`click`,()=>this.toggleFormat(`italic`)),this.shadowRoot.getElementById(`btn-underline`).addEventListener(`click`,()=>this.toggleFormat(`underline`)),e.addEventListener(`keydown`,e=>{let t=e.target.closest(`td`);if(!t||!t.dataset.id||t.isContentEditable)return;let n=t.dataset.id,r=n.match(/([A-Z]+)([0-9]+)/);if(!r)return;let i=r[1],a=parseInt(r[2]),o=0;for(let e=0;e<i.length;e++)o=o*26+i.charCodeAt(e)-64;if(--o,e.key===`ArrowUp`&&a>1)a--,e.preventDefault();else if(e.key===`ArrowDown`&&a<this.core.rows)a++,e.preventDefault();else if(e.key===`ArrowLeft`&&o>0)o--,e.preventDefault();else if(e.key===`ArrowRight`&&o<this.core.cols-1)o++,e.preventDefault();else if(e.key===`Enter`){e.preventDefault(),this.makeCellEditable(t);return}else if(e.key===`Backspace`||e.key===`Delete`){this.commitCellChange(n,``);return}else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){this.makeCellEditable(t,!0),t.textContent=``;return}let s=`${this.indexToColName(o)}${a}`;this.selectCell(s)})}selectCell(e){let t=this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);t&&t.classList.remove(`selected`),this.selectedCellId=e;let n=this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);n&&(n.classList.add(`selected`),n.focus()),this.updateUI()}makeCellEditable(e,t=!1){let n=e.dataset.id,r=this.core.getCell(n);if(e.contentEditable=!0,t||(e.textContent=r.formula||r.value),e.classList.add(`editing`),e.focus(),window.getSelection!==void 0&&document.createRange!==void 0){let t=document.createRange();t.selectNodeContents(e),t.collapse(!1);let n=window.getSelection();n.removeAllRanges(),n.addRange(t)}e.onblur=()=>{e.contentEditable=!1,e.classList.remove(`editing`),this.commitCellChange(n,e.textContent)},e.onkeydown=t=>{if(t.key===`Enter`){t.preventDefault(),e.blur();let r=n.match(/([A-Z]+)([0-9]+)/);if(r){let e=parseInt(r[2]);e<this.core.rows&&this.selectCell(`${r[1]}${e+1}`)}}}}commitCellChange(e,t){let n=``,r=t;t.startsWith(`=`)&&(n=t,r=this.core.evaluateFormula(n)),this.core.setCell(e,r,n);let i=!0,a=0;for(;i&&a<10;)i=this.core.recalculateAll(),a++;let o=this.shadowRoot.querySelector(`td[data-id="${e}"]`);o&&(o.textContent=this.core.getCell(e).value);for(let[e,t]of Object.entries(this.core.data)){let n=this.shadowRoot.querySelector(`td[data-id="${e}"]`);n&&!n.isContentEditable&&(n.textContent=t.value,this.applyFormatToElement(n,t.format))}this.updateUI()}toggleFormat(e){let t=this.selectedCellId,n=!(this.core.getCell(t).format||{})[e];this.core.setCellFormat(t,e,n);let r=this.shadowRoot.querySelector(`td[data-id="${t}"]`);r&&this.applyFormatToElement(r,this.core.getCell(t).format),this.updateUI()}updateUI(){let e=this.core.getCell(this.selectedCellId),t=this.shadowRoot.getElementById(`formula-input`);t.value=e.formula||e.value||``;let n=this.shadowRoot.getElementById(`cell-ref`);n&&(n.textContent=this.selectedCellId);let r=e.format||{},i=(e,t)=>{let n=this.shadowRoot.getElementById(e);t?n.classList.add(`active`):n.classList.remove(`active`)};i(`btn-bold`,r.bold),i(`btn-italic`,r.italic),i(`btn-underline`,r.underline)}render(){this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        .container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8f9fa;
          color: #333;
        }
        .header {
          flex: 0 0 auto;
          background-color: #f1f3f4;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #e0e0e0;
        }
        .header-title {
          font-size: 18px;
          font-weight: 500;
          color: #202124;
        }
        .toolbar {
          flex: 0 0 auto;
          background-color: #fff;
          border-bottom: 1px solid #e0e0e0;
          padding: 6px 16px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .toolbar button {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          color: #444;
          transition: background-color 0.2s;
        }
        .toolbar button:hover {
          background-color: #f1f3f4;
        }
        .toolbar button.active {
          background-color: #e8eaed;
          border-color: #dadce0;
        }
        #btn-italic { font-style: italic; font-weight: normal; }
        #btn-underline { text-decoration: underline; font-weight: normal; }

        .formula-bar {
          flex: 0 0 auto;
          background-color: #fff;
          border-bottom: 1px solid #e0e0e0;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        #cell-ref {
            font-size: 13px;
            color: #5f6368;
            font-weight: 500;
            width: 40px;
            text-align: center;
        }
        .fx-icon {
            font-style: italic;
            color: #5f6368;
            font-weight: bold;
        }
        .formula-bar input {
          flex: 1;
          padding: 4px 8px;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 13px;
          font-family: inherit;
        }
        .formula-bar input:focus {
            outline: none;
            border-color: #1a73e8;
        }

        .grid-container {
          flex: 1;
          overflow: auto;
          background-color: #fff;
          position: relative;
        }
        .grid {
          border-collapse: collapse;
          table-layout: fixed;
        }
        .grid th, .grid td {
          border: 1px solid #e0e0e0;
          padding: 4px 6px;
          min-width: 90px;
          max-width: 90px;
          height: 24px;
          font-size: 13px;
          box-sizing: border-box;
          overflow: hidden;
          white-space: nowrap;
        }
        .grid th {
          background-color: #f8f9fa;
          text-align: center;
          font-weight: normal;
          color: #5f6368;
          user-select: none;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .grid tr th:first-child {
            position: sticky;
            left: 0;
            z-index: 2;
            min-width: 40px;
            max-width: 40px;
            background-color: #f8f9fa;
        }
        .grid th:first-child:first-child {
            z-index: 3;
        }
        .grid td {
            text-align: left;
            cursor: cell;
            outline: none;
        }
        .grid td.selected {
            border: 2px solid #1a73e8;
            padding: 3px 5px; /* adjust for border */
        }
        .grid td.editing {
            outline: none;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 10;
            position: relative;
            overflow: visible;
        }
      </style>
      <div class="container">
        <div class="header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0f9d58"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
          <div class="header-title">Untitled spreadsheet</div>
        </div>
        <div class="toolbar">
          <button id="btn-bold" title="Bold">B</button>
          <button id="btn-italic" title="Italic">I</button>
          <button id="btn-underline" title="Underline">U</button>
        </div>
        <div class="formula-bar">
          <div id="cell-ref">A1</div>
          <span class="fx-icon">fx</span>
          <input type="text" id="formula-input" spellcheck="false" />
        </div>
        <div class="grid-container">
          <table class="grid" id="grid">
            <!-- Grid will be rendered here -->
          </table>
        </div>
      </div>
    `}};customElements.define(`google-sheets-clone`,n)})();