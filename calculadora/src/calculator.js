export class Calculator {
  constructor() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.error = false;
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.error = false;
  }

  delete() {
    if (this.error) {
      this.clear();
      return;
    }
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.error) this.clear();

    if (number === '.' && this.currentOperand.includes('.')) return;

    if (this.shouldResetScreen) {
      this.currentOperand = number;
      this.shouldResetScreen = false;
    } else {
      if (this.currentOperand === '0' && number !== '.') {
        this.currentOperand = number;
      } else {
        this.currentOperand = this.currentOperand.toString() + number.toString();
      }
    }
  }

  chooseOperation(operation) {
    if (this.error) this.clear();

    if (this.currentOperand === '') return;

    if (this.previousOperand !== '') {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return null;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          this.error = true;
          this.currentOperand = 'Erro';
          this.previousOperand = '';
          this.operation = undefined;
          return { expression: `${prev} ÷ 0`, result: 'Erro' };
        }
        computation = prev / current;
        break;
      default:
        return null;
    }

    // Fix floating point errors
    computation = Math.round(computation * 100000000) / 100000000;

    const expression = `${prev} ${this.operation} ${current}`;

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;

    return { expression, result: this.currentOperand };
  }
}
