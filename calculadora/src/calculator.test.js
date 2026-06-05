import { Calculator } from './calculator.js';

describe('Calculator', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  test('should append numbers correctly', () => {
    calc.appendNumber('1');
    calc.appendNumber('2');
    expect(calc.currentOperand).toBe('12');
  });

  test('should handle decimal points correctly', () => {
    calc.appendNumber('1');
    calc.appendNumber('.');
    calc.appendNumber('5');
    expect(calc.currentOperand).toBe('1.5');

    // Should not append multiple decimals
    calc.appendNumber('.');
    expect(calc.currentOperand).toBe('1.5');
  });

  test('should compute addition correctly', () => {
    calc.appendNumber('5');
    calc.chooseOperation('+');
    calc.appendNumber('7');
    const result = calc.compute();
    expect(result.result).toBe('12');
    expect(calc.currentOperand).toBe('12');
  });

  test('should compute subtraction correctly', () => {
    calc.appendNumber('10');
    calc.chooseOperation('-');
    calc.appendNumber('4');
    calc.compute();
    expect(calc.currentOperand).toBe('6');
  });

  test('should compute multiplication correctly', () => {
    calc.appendNumber('3');
    calc.chooseOperation('×');
    calc.appendNumber('4');
    calc.compute();
    expect(calc.currentOperand).toBe('12');
  });

  test('should compute division correctly', () => {
    calc.appendNumber('15');
    calc.chooseOperation('÷');
    calc.appendNumber('3');
    calc.compute();
    expect(calc.currentOperand).toBe('5');
  });

  test('should handle division by zero', () => {
    calc.appendNumber('5');
    calc.chooseOperation('÷');
    calc.appendNumber('0');
    calc.compute();
    expect(calc.error).toBe(true);
    expect(calc.currentOperand).toBe('Erro');
  });

  test('should handle delete correctly', () => {
    calc.appendNumber('1');
    calc.appendNumber('2');
    calc.delete();
    expect(calc.currentOperand).toBe('1');
    calc.delete();
    expect(calc.currentOperand).toBe('0');
  });

  test('should handle clear correctly', () => {
    calc.appendNumber('1');
    calc.chooseOperation('+');
    calc.appendNumber('2');
    calc.clear();
    expect(calc.currentOperand).toBe('0');
    expect(calc.previousOperand).toBe('');
    expect(calc.operation).toBeUndefined();
  });
});
