import { CalculatorWidget } from './CalculatorWidget.js';

if (!customElements.get('calculator-widget')) {
  customElements.define('calculator-widget', CalculatorWidget);
}
