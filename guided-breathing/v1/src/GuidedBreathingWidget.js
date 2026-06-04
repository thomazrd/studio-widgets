import { widgetStyles } from './styles.js';
import { breathingTechniques } from './BreathingData.js';
import { AudioPlayer } from './AudioPlayer.js';
import { SettingsManager } from './SettingsManager.js';

export class GuidedBreathingWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.settingsManager = new SettingsManager();
    this.settings = this.settingsManager.loadSettings();
    this.audioPlayer = new AudioPlayer();
    this.audioPlayer.setEnabled(this.settings.soundEnabled);

    this.currentTechnique = null;
    this.animationTimer = null;
    this.phaseTimeout = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const soundIcon = this.settings.soundEnabled ? '🔊' : '🔇';
    const soundText = this.settings.soundEnabled ? 'Som Ativado' : 'Som Desativado';

    const techniquesHtml = breathingTechniques.map(tech => `
      <div class="technique-card">
        <h3>${tech.name}</h3>
        <p>${tech.description}</p>
        <button class="btn-start" data-id="${tech.id}">Iniciar Treino</button>
      </div>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>${widgetStyles}</style>
      <div class="container">

        <!-- View do Catálogo -->
        <div id="catalogView" class="catalog-view">
          <header>
            <h1>Respiração Guiada</h1>
            <button id="soundToggle" class="sound-toggle">
              <span id="soundIcon">${soundIcon}</span>
              <span id="soundText">${soundText}</span>
            </button>
          </header>

          <div class="catalog">
            ${techniquesHtml}
          </div>

          <div class="settings-section">
            <h3>Configurações de Tempo (Segundos)</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <label for="timeInhale">Inspirar</label>
                <input type="number" id="timeInhale" min="1" max="15" value="${this.settings.customTimes.inhale || 4}">
              </div>
              <div class="setting-item">
                <label for="timeHold1">Segurar (Cheio)</label>
                <input type="number" id="timeHold1" min="0" max="15" value="${this.settings.customTimes.hold1 || 4}">
              </div>
              <div class="setting-item">
                <label for="timeExhale">Expirar</label>
                <input type="number" id="timeExhale" min="1" max="15" value="${this.settings.customTimes.exhale || 4}">
              </div>
              <div class="setting-item">
                <label for="timeHold2">Segurar (Vazio)</label>
                <input type="number" id="timeHold2" min="0" max="15" value="${this.settings.customTimes.hold2 || 4}">
              </div>
            </div>
            <button id="btnSaveSettings" class="btn-save-settings">Salvar Tempos</button>
          </div>
        </div>

        <!-- Modo Foco -->
        <div id="focusView" class="focus-mode">
          <div class="focus-header">
            <button id="btnBack" class="btn-back">← Voltar</button>
          </div>
          <div class="breathing-area">
            <div id="breathingCircle" class="breathing-circle"></div>
            <div class="breathing-core"></div>
            <div id="phaseText" class="phase-text">Preparar</div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const soundToggle = this.shadowRoot.getElementById('soundToggle');
    soundToggle.addEventListener('click', () => {
      this.settings.soundEnabled = !this.settings.soundEnabled;
      this.settingsManager.saveSettings(this.settings);
      this.audioPlayer.setEnabled(this.settings.soundEnabled);

      const soundIcon = this.shadowRoot.getElementById('soundIcon');
      const soundText = this.shadowRoot.getElementById('soundText');
      soundIcon.textContent = this.settings.soundEnabled ? '🔊' : '🔇';
      soundText.textContent = this.settings.soundEnabled ? 'Som Ativado' : 'Som Desativado';

      // Initialize audio context on user interaction to comply with browser autoplay policies
      if (this.settings.soundEnabled) {
        this.audioPlayer.init();
      }
    });

    const startButtons = this.shadowRoot.querySelectorAll('.btn-start');
    startButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const techId = e.target.getAttribute('data-id');
        this.startTraining(techId);
      });
    });

    const btnBack = this.shadowRoot.getElementById('btnBack');
    btnBack.addEventListener('click', () => {
      this.stopTraining();
    });

    const btnSaveSettings = this.shadowRoot.getElementById('btnSaveSettings');
    btnSaveSettings.addEventListener('click', () => {
      this.settings.customTimes = {
        inhale: parseInt(this.shadowRoot.getElementById('timeInhale').value) || 4,
        hold1: parseInt(this.shadowRoot.getElementById('timeHold1').value) || 4,
        exhale: parseInt(this.shadowRoot.getElementById('timeExhale').value) || 4,
        hold2: parseInt(this.shadowRoot.getElementById('timeHold2').value) || 4,
      };
      this.settingsManager.saveSettings(this.settings);

      // Feedback visual simples
      const originalText = btnSaveSettings.textContent;
      btnSaveSettings.textContent = 'Salvo!';
      setTimeout(() => {
        btnSaveSettings.textContent = originalText;
      }, 1500);
    });
  }

  startTraining(techId) {
    this.currentTechnique = breathingTechniques.find(t => t.id === techId);

    // Switch Views
    this.shadowRoot.getElementById('catalogView').classList.add('hidden');
    this.shadowRoot.getElementById('focusView').classList.add('active');

    // Initialize Audio
    this.audioPlayer.init();

    this.currentPhaseIndex = 0;
    this.runPhase();
  }

  stopTraining() {
    clearTimeout(this.phaseTimeout);

    // Reset Views
    this.shadowRoot.getElementById('catalogView').classList.remove('hidden');
    this.shadowRoot.getElementById('focusView').classList.remove('active');

    // Reset Animation
    const circle = this.shadowRoot.getElementById('breathingCircle');
    circle.style.transition = 'none';
    circle.style.transform = 'scale(1)';
  }

  runPhase() {
    if (!this.currentTechnique) return;

    const originalPhase = this.currentTechnique.defaultPhases[this.currentPhaseIndex];

    // Clone phase to avoid modifying original data
    const phase = { ...originalPhase };

    // Apply custom times if enabled
    if (this.settings.customTimes) {
      if (phase.action === 'inhale' && this.settings.customTimes.inhale) {
        phase.duration = this.settings.customTimes.inhale * 1000;
      } else if (phase.action === 'exhale' && this.settings.customTimes.exhale) {
        phase.duration = this.settings.customTimes.exhale * 1000;
      } else if (phase.action === 'hold') {
        // Simple logic: if it's the first hold after inhale, use hold1. If after exhale, use hold2.
        const prevPhaseIndex = (this.currentPhaseIndex - 1 + this.currentTechnique.defaultPhases.length) % this.currentTechnique.defaultPhases.length;
        const prevAction = this.currentTechnique.defaultPhases[prevPhaseIndex].action;

        if (prevAction === 'inhale' && this.settings.customTimes.hold1 !== undefined) {
           phase.duration = this.settings.customTimes.hold1 * 1000;
        } else if (prevAction === 'exhale' && this.settings.customTimes.hold2 !== undefined) {
           phase.duration = this.settings.customTimes.hold2 * 1000;
        }
      }
    }

    // Skip phase if duration is 0
    if (phase.duration === 0) {
       this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.currentTechnique.defaultPhases.length;
       this.runPhase();
       return;
    }

    const circle = this.shadowRoot.getElementById('breathingCircle');
    const phaseText = this.shadowRoot.getElementById('phaseText');

    phaseText.textContent = phase.name;

    // Trigger animation based on phase action
    // small timeout to ensure transition takes effect if previous phase was skipped or stopped
    requestAnimationFrame(() => {
        circle.style.transition = `transform ${phase.duration}ms linear`;

        if (phase.action === 'inhale') {
          circle.style.transform = 'scale(2.5)';
        } else if (phase.action === 'exhale') {
          circle.style.transform = 'scale(1)';
        }
    });

    // 'hold' doesn't change scale, keeps current state

    this.audioPlayer.playPhaseTone(phase.action);

    this.phaseTimeout = setTimeout(() => {
      this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.currentTechnique.defaultPhases.length;
      this.runPhase();
    }, phase.duration);
  }
}
