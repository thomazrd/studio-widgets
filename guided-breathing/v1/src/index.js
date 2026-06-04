import { GuidedBreathingWidget } from './GuidedBreathingWidget.js';

if (!customElements.get('guided-breathing')) {
  customElements.define('guided-breathing', GuidedBreathingWidget);
}
