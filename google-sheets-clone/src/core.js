const WIDGET_ID = '3a40acd5-9947-47c0-aaf4-9614cda5d3fa'; // Hardcoded from widget-id.md for build simplicity

export class SpreadsheetCore {
  constructor(rows = 100, cols = 26) {
    this.rows = rows;
    this.cols = cols;
    this.data = {}; // { 'A1': { value: '10', formula: '=A2+1', format: { bold: true } } }
    this.loadFromStorage();
  }

  getStorageKey() {
    return `${WIDGET_ID}-spreadsheet-data`;
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
      this.data = {};
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  }

  getCell(cellId) {
    return this.data[cellId] || { value: '', formula: '', format: {} };
  }

  setCell(cellId, value, formula = '', format = null) {
    const current = this.getCell(cellId);
    this.data[cellId] = {
      value: value,
      formula: formula,
      format: format || current.format
    };
    this.saveToStorage();
  }

  setCellFormat(cellId, formatKey, formatValue) {
    const cell = this.getCell(cellId);
    if (!cell.format) cell.format = {};
    cell.format[formatKey] = formatValue;
    this.data[cellId] = cell;
    this.saveToStorage();
  }

  evaluateFormula(formula) {
    if (!formula.startsWith('=')) return formula;

    let expr = formula.substring(1).toUpperCase();

    // Replace cell references with values
    expr = expr.replace(/[A-Z]+[0-9]+/g, (match) => {
      const cell = this.getCell(match);
      // Prevent simple circular ref by just returning its raw evaluated value if it exists, or 0
      const val = parseFloat(cell.value);
      return isNaN(val) ? 0 : val;
    });

    // Simple SUM
    if (expr.startsWith('SUM(') && expr.endsWith(')')) {
        const args = expr.substring(4, expr.length - 1).split(',');
        let sum = 0;
        for (const arg of args) {
             const val = parseFloat(arg.trim());
             if (!isNaN(val)) sum += val;
        }
        return sum.toString();
    }

    // Simple AVERAGE
    if (expr.startsWith('AVERAGE(') && expr.endsWith(')')) {
        const args = expr.substring(8, expr.length - 1).split(',');
        let sum = 0;
        let count = 0;
        for (const arg of args) {
             const val = parseFloat(arg.trim());
             if (!isNaN(val)) {
                 sum += val;
                 count++;
             }
        }
        return count === 0 ? '0' : (sum / count).toString();
    }

    try {
      // Very basic math evaluator using Function constructor (safer than eval if restricted, but kept simple here)
      // Only allow math chars
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) return '#ERROR!';
      // eslint-disable-next-line no-new-func
      return new Function('return ' + expr)().toString();
    } catch (e) {
      return '#ERROR!';
    }
  }

  recalculateAll() {
    let changed = false;
    for (const [cellId, cell] of Object.entries(this.data)) {
      if (cell.formula && cell.formula.startsWith('=')) {
        const newValue = this.evaluateFormula(cell.formula);
        if (newValue !== cell.value) {
          cell.value = newValue;
          changed = true;
        }
      }
    }
    if (changed) {
      this.saveToStorage();
    }
    return changed;
  }
}
