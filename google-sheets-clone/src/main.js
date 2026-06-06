import { SpreadsheetCore } from './core.js';

class GoogleSheetsClone extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.core = new SpreadsheetCore(100, 26);
    this.selectedCellId = 'A1';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.renderGrid();
    this.updateUI();
  }

  indexToColName(index) {
    let colName = '';
    let temp = index;
    while (temp >= 0) {
      colName = String.fromCharCode((temp % 26) + 65) + colName;
      temp = Math.floor(temp / 26) - 1;
    }
    return colName;
  }

  renderGrid() {
    const grid = this.shadowRoot.getElementById('grid');
    grid.innerHTML = '';

    // Header row
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th')); // Empty corner cell
    for (let c = 0; c < this.core.cols; c++) {
      const th = document.createElement('th');
      th.textContent = this.indexToColName(c);
      headerRow.appendChild(th);
    }
    grid.appendChild(headerRow);

    // Data rows
    for (let r = 1; r <= this.core.rows; r++) {
      const tr = document.createElement('tr');
      const rowHeader = document.createElement('th');
      rowHeader.textContent = r;
      tr.appendChild(rowHeader);

      for (let c = 0; c < this.core.cols; c++) {
        const colName = this.indexToColName(c);
        const cellId = `${colName}${r}`;
        const td = document.createElement('td');
        td.dataset.id = cellId;
        td.tabIndex = 0; // Make focusable

        const cellData = this.core.getCell(cellId);
        td.textContent = cellData.value;
        this.applyFormatToElement(td, cellData.format);

        tr.appendChild(td);
      }
      grid.appendChild(tr);
    }
  }

  applyFormatToElement(el, format) {
    if (!format) return;
    el.style.fontWeight = format.bold ? 'bold' : 'normal';
    el.style.fontStyle = format.italic ? 'italic' : 'normal';
    el.style.textDecoration = format.underline ? 'underline' : 'none';
  }

  setupEventListeners() {
    const grid = this.shadowRoot.getElementById('grid');
    const formulaInput = this.shadowRoot.getElementById('formula-input');

    // Cell Selection
    grid.addEventListener('click', (e) => {
      const td = e.target.closest('td');
      if (td && td.dataset.id) {
        this.selectCell(td.dataset.id);
      }
    });

    // Double click to edit inline
    grid.addEventListener('dblclick', (e) => {
        const td = e.target.closest('td');
        if (td && td.dataset.id) {
            this.makeCellEditable(td);
        }
    });

    // Formula Bar editing
    formulaInput.addEventListener('input', (e) => {
       const val = e.target.value;
       const td = this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);
       if (td) {
           td.textContent = val; // Preview while typing
       }
    });

    formulaInput.addEventListener('change', (e) => {
       this.commitCellChange(this.selectedCellId, e.target.value);
    });

    formulaInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            this.commitCellChange(this.selectedCellId, e.target.value);
            formulaInput.blur();
            const td = this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);
            if (td) td.focus();
        }
    });

    // Toolbar Formatting
    this.shadowRoot.getElementById('btn-bold').addEventListener('click', () => this.toggleFormat('bold'));
    this.shadowRoot.getElementById('btn-italic').addEventListener('click', () => this.toggleFormat('italic'));
    this.shadowRoot.getElementById('btn-underline').addEventListener('click', () => this.toggleFormat('underline'));

    // Keyboard navigation
    grid.addEventListener('keydown', (e) => {
        const td = e.target.closest('td');
        if (!td || !td.dataset.id || td.isContentEditable) return;

        const currentId = td.dataset.id;
        const match = currentId.match(/([A-Z]+)([0-9]+)/);
        if (!match) return;

        const colStr = match[1];
        let row = parseInt(match[2]);

        // Convert col string back to index
        let colIdx = 0;
        for (let i = 0; i < colStr.length; i++) {
            colIdx = colIdx * 26 + colStr.charCodeAt(i) - 64;
        }
        colIdx -= 1; // 0-based

        if (e.key === 'ArrowUp' && row > 1) { row--; e.preventDefault(); }
        else if (e.key === 'ArrowDown' && row < this.core.rows) { row++; e.preventDefault(); }
        else if (e.key === 'ArrowLeft' && colIdx > 0) { colIdx--; e.preventDefault(); }
        else if (e.key === 'ArrowRight' && colIdx < this.core.cols - 1) { colIdx++; e.preventDefault(); }
        else if (e.key === 'Enter') {
            e.preventDefault();
            this.makeCellEditable(td);
            return;
        }
        else if (e.key === 'Backspace' || e.key === 'Delete') {
            this.commitCellChange(currentId, '');
            return;
        }
        else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            // Start typing
            this.makeCellEditable(td, true);
            td.textContent = ''; // clear and let the character be typed
            return; // don't prevent default, let the char appear
        }

        const newColName = this.indexToColName(colIdx);
        const newId = `${newColName}${row}`;
        this.selectCell(newId);
    });
  }

  selectCell(cellId) {
    // Clear old selection
    const oldTd = this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);
    if (oldTd) oldTd.classList.remove('selected');

    this.selectedCellId = cellId;
    const newTd = this.shadowRoot.querySelector(`td[data-id="${this.selectedCellId}"]`);
    if (newTd) {
        newTd.classList.add('selected');
        newTd.focus();
    }

    this.updateUI();
  }

  makeCellEditable(td, clear = false) {
      const cellId = td.dataset.id;
      const cellData = this.core.getCell(cellId);

      td.contentEditable = true;
      if (!clear) {
        td.textContent = cellData.formula || cellData.value;
      }
      td.classList.add('editing');
      td.focus();

      // Move cursor to end
      if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
          const range = document.createRange();
          range.selectNodeContents(td);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
      }

      const finishEditing = () => {
          td.contentEditable = false;
          td.classList.remove('editing');
          this.commitCellChange(cellId, td.textContent);
      };

      td.onblur = finishEditing;
      td.onkeydown = (e) => {
          if (e.key === 'Enter') {
              e.preventDefault();
              td.blur();
              // Move down
               const match = cellId.match(/([A-Z]+)([0-9]+)/);
               if (match) {
                   const r = parseInt(match[2]);
                   if (r < this.core.rows) {
                       this.selectCell(`${match[1]}${r+1}`);
                   }
               }
          }
      };
  }

  commitCellChange(cellId, inputVal) {
      let formula = '';
      let value = inputVal;

      if (inputVal.startsWith('=')) {
          formula = inputVal;
          value = this.core.evaluateFormula(formula);
      }

      this.core.setCell(cellId, value, formula);

      // Re-evaluate whole sheet just in case (naive dependency graph)
      let needsUpdate = true;
      let iterations = 0;
      while(needsUpdate && iterations < 10) { // prevent infinite loops
         needsUpdate = this.core.recalculateAll();
         iterations++;
      }

      // Update Grid UI completely (naive but simple)
      // Force update the current cell too in case it's not in core.data yet
      const currentTd = this.shadowRoot.querySelector(`td[data-id="${cellId}"]`);
      if (currentTd) {
          const cellData = this.core.getCell(cellId);
          currentTd.textContent = cellData.value;
      }
      for (const [id, data] of Object.entries(this.core.data)) {
          const td = this.shadowRoot.querySelector(`td[data-id="${id}"]`);
          if (td && !td.isContentEditable) {
              td.textContent = data.value;
              this.applyFormatToElement(td, data.format);
          }
      }

      this.updateUI();
  }

  toggleFormat(formatType) {
     const cellId = this.selectedCellId;
     const currentCell = this.core.getCell(cellId);
     const currentFormat = currentCell.format || {};
     const newValue = !currentFormat[formatType];

     this.core.setCellFormat(cellId, formatType, newValue);

     const td = this.shadowRoot.querySelector(`td[data-id="${cellId}"]`);
     if (td) {
         this.applyFormatToElement(td, this.core.getCell(cellId).format);
     }
     this.updateUI();
  }

  updateUI() {
    const cellData = this.core.getCell(this.selectedCellId);

    // Update Formula bar
    const formulaInput = this.shadowRoot.getElementById('formula-input');
    formulaInput.value = cellData.formula || cellData.value || '';

    // Update Header
    const cellRefHeader = this.shadowRoot.getElementById('cell-ref');
    if (cellRefHeader) cellRefHeader.textContent = this.selectedCellId;

    // Update toolbar buttons visually
    const format = cellData.format || {};
    const toggleBtn = (id, active) => {
        const btn = this.shadowRoot.getElementById(id);
        if (active) btn.classList.add('active');
        else btn.classList.remove('active');
    };
    toggleBtn('btn-bold', format.bold);
    toggleBtn('btn-italic', format.italic);
    toggleBtn('btn-underline', format.underline);
  }

  render() {
    this.shadowRoot.innerHTML = `
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
    `;
  }
}

customElements.define('google-sheets-clone', GoogleSheetsClone);
