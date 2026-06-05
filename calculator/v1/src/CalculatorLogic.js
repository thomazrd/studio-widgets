export class CalculatorLogic {
  constructor() {
    this.reset();
  }

  reset() {
    this.currentValue = '0';
    this.expression = [];
    this.isError = false;
    this.newInputExpected = true;
  }

  handleInput(input) {
    if (this.isError) {
      if (input === 'C') {
        this.reset();
      }
      return;
    }

    if (input === 'C') {
      this.reset();
      return;
    }

    if (input === 'CE') {
      this.currentValue = '0';
      this.newInputExpected = true;
      return;
    }

    if (/[0-9]/.test(input)) {
      this.handleNumber(input);
    } else if (input === '.') {
      this.handleDecimal();
    } else if (['+', '-', '*', '/'].includes(input)) {
      this.handleOperator(input);
    } else if (input === '=') {
      this.calculate();
    } else if (input === '+/-') {
      this.toggleSign();
    } else if (input === '%') {
      this.handlePercentage();
    } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', '^', '(', ')'].includes(input)) {
      this.handleScientific(input);
    }
  }

  handleNumber(num) {
    if (this.newInputExpected) {
      this.currentValue = num;
      this.newInputExpected = false;
    } else {
      if (this.currentValue === '0') {
         this.currentValue = num;
      } else {
         this.currentValue += num;
      }
    }
  }

  handleDecimal() {
    if (this.newInputExpected) {
      this.currentValue = '0.';
      this.newInputExpected = false;
    } else if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
  }

  handleOperator(op) {
    if (!this.newInputExpected || this.expression.length === 0 || this.expression[this.expression.length -1] === ')') {
       if (!this.newInputExpected) {
           this.expression.push(this.currentValue);
       }
       this.expression.push(op);
       this.newInputExpected = true;
    } else if (['+', '-', '*', '/'].includes(this.expression[this.expression.length - 1])) {
       this.expression[this.expression.length - 1] = op;
    }
  }

  handleScientific(func) {
     if (func === '(') {
         if (!this.newInputExpected && this.currentValue !== '0') {
             this.expression.push(this.currentValue);
             this.expression.push('*');
         }
         this.expression.push('(');
         this.newInputExpected = true;
     } else if (func === ')') {
         if (!this.newInputExpected) {
             this.expression.push(this.currentValue);
         }
         this.expression.push(')');
         this.newInputExpected = true;
     } else if (func === '^') {
         this.handleOperator('^');
     } else {
         // Immediate functions
         let val = parseFloat(this.currentValue);
         let res;
         try {
             switch (func) {
                 case 'sin': res = Math.sin(val); break;
                 case 'cos': res = Math.cos(val); break;
                 case 'tan': res = Math.tan(val); break;
                 case 'log':
                     if (val <= 0) throw new Error('Invalid');
                     res = Math.log10(val); break;
                 case 'ln':
                     if (val <= 0) throw new Error('Invalid');
                     res = Math.log(val); break;
                 case 'sqrt':
                     if (val < 0) throw new Error('Invalid');
                     res = Math.sqrt(val); break;
             }
             if (!isFinite(res) || isNaN(res)) throw new Error('Invalid');
             this.currentValue = this.formatResult(res);
             this.newInputExpected = true;
         } catch(e) {
             this.setError();
         }
     }
  }

  toggleSign() {
    if (this.currentValue !== '0') {
      if (this.currentValue.startsWith('-')) {
        this.currentValue = this.currentValue.substring(1);
      } else {
        this.currentValue = '-' + this.currentValue;
      }
    }
  }

  handlePercentage() {
    const val = parseFloat(this.currentValue);
    this.currentValue = this.formatResult(val / 100);
    this.newInputExpected = true;
  }

  calculate() {
    if (!this.newInputExpected) {
      this.expression.push(this.currentValue);
    }

    if (this.expression.length === 0) return;

    try {
      const result = this.evaluateExpression(this.expression);
      if (!isFinite(result) || isNaN(result)) {
        this.setError();
      } else {
        this.currentValue = this.formatResult(result);
        this.expression = [];
        this.newInputExpected = true;
      }
    } catch (e) {
      this.setError();
    }
  }

  setError() {
    this.isError = true;
    this.currentValue = 'Erro';
    this.expression = [];
  }

  formatResult(res) {
    // Prevent extremely long decimals, but keep high precision
    let str = res.toString();
    if (str.length > 12) {
        str = res.toPrecision(10);
    }
    // Remove trailing zeros in decimal
    return parseFloat(str).toString();
  }

  // A basic shunting yard / recursive descent evaluator for expression array
  evaluateExpression(exprArray) {
    // Replace ^ with ** for JS eval
    let exprStr = exprArray.map(token => {
        if (token === '^') return '**';
        return token;
    }).join(' ');

    // Security check: only allow numbers, math operators, and parentheses
    if (/[^0-9\+\-\*\/\.\(\)\s\*\*]/.test(exprStr)) {
        throw new Error('Invalid tokens');
    }

    // Checking division by zero explicitly
    if (/\/\s*0(?!\.)/.test(exprStr)) {
        throw new Error('Division by zero');
    }

    // Using Function to safely evaluate math expression
    try {
        const result = new Function('return ' + exprStr)();
        return result;
    } catch(e) {
        throw new Error('Eval error');
    }
  }

  getState() {
    return {
      currentValue: this.currentValue,
      history: this.expression.join(' '),
      isError: this.isError
    };
  }
}
