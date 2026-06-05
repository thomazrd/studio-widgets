(function(){var e=`
:host {
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  color: #333;
  --bg-color: #f7f9fa;
  --card-bg: #ffffff;
  --primary: #4A90E2;
  --primary-hover: #357ABD;
  --text-main: #2c3e50;
  --text-muted: #7f8c8d;
  --border: #e1e8ed;
  box-sizing: border-box;
}

* {
  box-sizing: inherit;
}

.container {
  background: var(--bg-color);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1, h2, h3 {
  margin: 0;
  color: var(--text-main);
}

header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.sound-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sound-toggle:hover {
  background: #eef2f5;
}

/* Catalog View */
.catalog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.technique-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.technique-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.05);
}

.technique-card h3 {
  font-size: 1.25rem;
}

.technique-card p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.5;
  font-size: 0.95rem;
}

.btn-start {
  align-self: flex-start;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-start:hover {
  background: var(--primary-hover);
}

/* Focus Mode */
.focus-mode {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.focus-mode.active {
  display: flex;
}

.focus-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: auto;
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 0;
}
.btn-back:hover {
  color: var(--text-main);
}

.breathing-area {
  position: relative;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0 auto 0;
}

.breathing-circle {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(74, 144, 226, 0.2);
  border-radius: 50%;
  transition: transform linear; /* Will be controlled by JS for smooth animation */
}

.breathing-core {
  position: absolute;
  width: 100px;
  height: 100px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(74, 144, 226, 0.4);
  z-index: 2;
}

.phase-text {
  position: absolute;
  z-index: 3;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  text-align: center;
}

/* Settings section */
.settings-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.settings-section h3 {
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.setting-item input {
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
}

.btn-save-settings {
  margin-top: 16px;
  background: #eef2f5;
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save-settings:hover {
  background: #e1e8ed;
}

/* Hidden Utility */
.hidden {
  display: none !important;
}
`,t=[{id:`square`,name:`Respiração Quadrada`,description:`Técnica de relaxamento que equilibra o sistema nervoso. Consiste em inspirar, reter com ar, expirar e reter sem ar, todos pelo mesmo tempo.`,defaultPhases:[{name:`Inspirar`,duration:4e3,action:`inhale`},{name:`Segurar`,duration:4e3,action:`hold`},{name:`Expirar`,duration:4e3,action:`exhale`},{name:`Segurar`,duration:4e3,action:`hold`}]},{id:`478`,name:`Respiração 4-7-8`,description:`Técnica tranquilizante que ajuda a adormecer e a reduzir a ansiedade. Inspira por 4, segura por 7, expira por 8.`,defaultPhases:[{name:`Inspirar`,duration:4e3,action:`inhale`},{name:`Segurar`,duration:7e3,action:`hold`},{name:`Expirar`,duration:8e3,action:`exhale`}]},{id:`diaphragmatic`,name:`Respiração Diafragmática`,description:`Respiração profunda pelo abdômen que reduz o estresse e melhora a oxigenação. Ritmo suave e contínuo.`,defaultPhases:[{name:`Inspirar`,duration:5e3,action:`inhale`},{name:`Expirar`,duration:5e3,action:`exhale`}]}],n=class{constructor(){this.audioCtx=null,this.enabled=!0}init(){this.audioCtx||=new(window.AudioContext||window.webkitAudioContext),this.audioCtx.state===`suspended`&&this.audioCtx.resume()}setEnabled(e){this.enabled=e}playPhaseTone(e){if(!this.enabled)return;this.init();let t=this.audioCtx.createOscillator(),n=this.audioCtx.createGain();t.connect(n),n.connect(this.audioCtx.destination);let r=200;e===`inhale`&&(r=329.63),e===`hold`&&(r=392),e===`exhale`&&(r=261.63),t.type=`sine`,t.frequency.setValueAtTime(r,this.audioCtx.currentTime),n.gain.setValueAtTime(0,this.audioCtx.currentTime),n.gain.linearRampToValueAtTime(.3,this.audioCtx.currentTime+.1),n.gain.exponentialRampToValueAtTime(.01,this.audioCtx.currentTime+1),t.start(this.audioCtx.currentTime),t.stop(this.audioCtx.currentTime+1)}},r=class{constructor(){this.storageKey=`guidedBreathingSettings`}loadSettings(){try{let e=localStorage.getItem(this.storageKey);if(e)return JSON.parse(e)}catch(e){console.warn(`Could not load settings`,e)}return{soundEnabled:!0,customTimes:{}}}saveSettings(e){try{localStorage.setItem(this.storageKey,JSON.stringify(e))}catch(e){console.warn(`Could not save settings`,e)}}},i=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.settingsManager=new r,this.settings=this.settingsManager.loadSettings(),this.audioPlayer=new n,this.audioPlayer.setEnabled(this.settings.soundEnabled),this.currentTechnique=null,this.animationTimer=null,this.phaseTimeout=null}connectedCallback(){this.render(),this.setupEventListeners()}render(){let n=this.settings.soundEnabled?`🔊`:`🔇`,r=this.settings.soundEnabled?`Som Ativado`:`Som Desativado`,i=t.map(e=>`
      <div class="technique-card">
        <h3>${e.name}</h3>
        <p>${e.description}</p>
        <button class="btn-start" data-id="${e.id}">Iniciar Treino</button>
      </div>
    `).join(``);this.shadowRoot.innerHTML=`
      <style>${e}</style>
      <div class="container">

        <!-- View do Catálogo -->
        <div id="catalogView" class="catalog-view">
          <header>
            <h1>Respiração Guiada</h1>
            <button id="soundToggle" class="sound-toggle">
              <span id="soundIcon">${n}</span>
              <span id="soundText">${r}</span>
            </button>
          </header>

          <div class="catalog">
            ${i}
          </div>

          <div class="settings-section">
            <h3>Configurações de Tempo (Segundos)</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <label for="timeInhale">Inspirar</label>
                <input type="number" id="timeInhale" min="1" max="15" value="${this.settings.customTimes.inhale||4}">
              </div>
              <div class="setting-item">
                <label for="timeHold1">Segurar (Cheio)</label>
                <input type="number" id="timeHold1" min="0" max="15" value="${this.settings.customTimes.hold1||4}">
              </div>
              <div class="setting-item">
                <label for="timeExhale">Expirar</label>
                <input type="number" id="timeExhale" min="1" max="15" value="${this.settings.customTimes.exhale||4}">
              </div>
              <div class="setting-item">
                <label for="timeHold2">Segurar (Vazio)</label>
                <input type="number" id="timeHold2" min="0" max="15" value="${this.settings.customTimes.hold2||4}">
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
    `}setupEventListeners(){this.shadowRoot.getElementById(`soundToggle`).addEventListener(`click`,()=>{this.settings.soundEnabled=!this.settings.soundEnabled,this.settingsManager.saveSettings(this.settings),this.audioPlayer.setEnabled(this.settings.soundEnabled);let e=this.shadowRoot.getElementById(`soundIcon`),t=this.shadowRoot.getElementById(`soundText`);e.textContent=this.settings.soundEnabled?`🔊`:`🔇`,t.textContent=this.settings.soundEnabled?`Som Ativado`:`Som Desativado`,this.settings.soundEnabled&&this.audioPlayer.init()}),this.shadowRoot.querySelectorAll(`.btn-start`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.getAttribute(`data-id`);this.startTraining(t)})}),this.shadowRoot.getElementById(`btnBack`).addEventListener(`click`,()=>{this.stopTraining()});let e=this.shadowRoot.getElementById(`btnSaveSettings`);e.addEventListener(`click`,()=>{this.settings.customTimes={inhale:parseInt(this.shadowRoot.getElementById(`timeInhale`).value)||4,hold1:parseInt(this.shadowRoot.getElementById(`timeHold1`).value)||4,exhale:parseInt(this.shadowRoot.getElementById(`timeExhale`).value)||4,hold2:parseInt(this.shadowRoot.getElementById(`timeHold2`).value)||4},this.settingsManager.saveSettings(this.settings);let t=e.textContent;e.textContent=`Salvo!`,setTimeout(()=>{e.textContent=t},1500)})}startTraining(e){this.currentTechnique=t.find(t=>t.id===e),this.shadowRoot.getElementById(`catalogView`).classList.add(`hidden`),this.shadowRoot.getElementById(`focusView`).classList.add(`active`),this.audioPlayer.init(),this.currentPhaseIndex=0,this.runPhase()}stopTraining(){clearTimeout(this.phaseTimeout),this.shadowRoot.getElementById(`catalogView`).classList.remove(`hidden`),this.shadowRoot.getElementById(`focusView`).classList.remove(`active`);let e=this.shadowRoot.getElementById(`breathingCircle`);e.style.transition=`none`,e.style.transform=`scale(1)`}runPhase(){if(!this.currentTechnique)return;let e={...this.currentTechnique.defaultPhases[this.currentPhaseIndex]};if(this.settings.customTimes){if(e.action===`inhale`&&this.settings.customTimes.inhale)e.duration=this.settings.customTimes.inhale*1e3;else if(e.action===`exhale`&&this.settings.customTimes.exhale)e.duration=this.settings.customTimes.exhale*1e3;else if(e.action===`hold`){let t=(this.currentPhaseIndex-1+this.currentTechnique.defaultPhases.length)%this.currentTechnique.defaultPhases.length,n=this.currentTechnique.defaultPhases[t].action;n===`inhale`&&this.settings.customTimes.hold1!==void 0?e.duration=this.settings.customTimes.hold1*1e3:n===`exhale`&&this.settings.customTimes.hold2!==void 0&&(e.duration=this.settings.customTimes.hold2*1e3)}}if(e.duration===0){this.currentPhaseIndex=(this.currentPhaseIndex+1)%this.currentTechnique.defaultPhases.length,this.runPhase();return}let t=this.shadowRoot.getElementById(`breathingCircle`),n=this.shadowRoot.getElementById(`phaseText`);n.textContent=e.name,requestAnimationFrame(()=>{t.style.transition=`transform ${e.duration}ms linear`,e.action===`inhale`?t.style.transform=`scale(2.5)`:e.action===`exhale`&&(t.style.transform=`scale(1)`)}),this.audioPlayer.playPhaseTone(e.action),this.phaseTimeout=setTimeout(()=>{this.currentPhaseIndex=(this.currentPhaseIndex+1)%this.currentTechnique.defaultPhases.length,this.runPhase()},e.duration)}};customElements.get(`guided-breathing`)||customElements.define(`guided-breathing`,i)})();