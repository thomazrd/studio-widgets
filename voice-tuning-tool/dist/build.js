var VoiceTuningWidget=(function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=[`Sine`,`Square`,`Sawtooth`,`Triangle`,`Organ`,`Strings`,`Brass`,`Flute`,`Clarinet`,`Synth Bass`,`E-Piano`,`Plucked`,`Choir`,`Lead`,`Pad`],n=class{constructor(){this.audioCtx=null,this.currentOscillators=new Map,this.analyser=null,this.micStream=null,this.pitchDetectInterval=null,this.onPitchDetected=null,this.isPlayingMetronome=!1,this.bpm=120,this.nextNoteTime=0,this.current16thNote=0,this.metronomeTimerID=null,this.lookahead=25,this.scheduleAheadTime=.1,this.onBeat=null}init(){this.audioCtx||=new(window.AudioContext||window.webkitAudioContext),this.audioCtx.state===`suspended`&&this.audioCtx.resume()}playNote(e,t=0){this.init(),this.currentOscillators.has(e)&&this.stopNote(e);let n=this.audioCtx.createOscillator(),r=this.audioCtx.createGain(),i=this.audioCtx.createBiquadFilter();n.connect(i),i.connect(r),r.connect(this.audioCtx.destination),this.configureTimbre(n,r,i,t),n.frequency.setValueAtTime(e,this.audioCtx.currentTime),n.start(),this.currentOscillators.set(e,{osc:n,gainNode:r,filterNode:i})}stopNote(e){if(!this.currentOscillators.has(e))return;let{osc:t,gainNode:n}=this.currentOscillators.get(e),r=this.audioCtx.currentTime;n.gain.cancelScheduledValues(r),n.gain.setValueAtTime(n.gain.value,r),n.gain.exponentialRampToValueAtTime(.001,r+.1),t.stop(r+.1),setTimeout(()=>{t.disconnect(),n.disconnect()},150),this.currentOscillators.delete(e)}configureTimbre(e,t,n,r){let i=this.audioCtx.currentTime;switch(n.type=`lowpass`,n.frequency.value=2e4,r){case 0:e.type=`sine`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.5,i+.05);break;case 1:e.type=`square`,n.frequency.value=3e3,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.2,i+.05);break;case 2:e.type=`sawtooth`,n.frequency.value=4e3,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.2,i+.05);break;case 3:e.type=`triangle`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.4,i+.05);break;case 4:e.type=`sine`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.4,i+.02);break;case 5:e.type=`sawtooth`,n.frequency.value=2500,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.3,i+.2);break;case 6:e.type=`sawtooth`,n.frequency.setValueAtTime(500,i),n.frequency.linearRampToValueAtTime(3e3,i+.1),t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.3,i+.05);break;case 7:e.type=`sine`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.4,i+.1);break;case 8:e.type=`square`,n.frequency.value=1500,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.3,i+.05);break;case 9:e.type=`sawtooth`,n.frequency.setValueAtTime(2e3,i),n.frequency.exponentialRampToValueAtTime(200,i+.2),t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.4,i+.02),t.gain.exponentialRampToValueAtTime(.1,i+.3);break;case 10:e.type=`sine`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.5,i+.01),t.gain.exponentialRampToValueAtTime(.01,i+1.5);break;case 11:e.type=`triangle`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.5,i+.01),t.gain.exponentialRampToValueAtTime(.001,i+.5);break;case 12:e.type=`sine`,n.frequency.value=1e3,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.3,i+.3);break;case 13:e.type=`square`,n.frequency.value=5e3,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.3,i+.05);break;case 14:e.type=`sine`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.3,i+.5);break;default:e.type=`sine`,t.gain.setValueAtTime(0,i),t.gain.linearRampToValueAtTime(.5,i+.05);break}}async startMicrophone(e){this.init(),this.onPitchDetected=e;try{this.micStream=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});let e=this.audioCtx.createMediaStreamSource(this.micStream);this.analyser=this.audioCtx.createAnalyser(),this.analyser.fftSize=2048,e.connect(this.analyser),this.detectPitchLoop()}catch(e){console.error(`Error accessing microphone`,e)}}stopMicrophone(){this.micStream&&=(this.micStream.getTracks().forEach(e=>e.stop()),null),this.pitchDetectInterval&&=(cancelAnimationFrame(this.pitchDetectInterval),null)}detectPitchLoop(){if(!this.analyser)return;let e=this.analyser.fftSize,t=new Float32Array(e);this.analyser.getFloatTimeDomainData(t);let n=this.autoCorrelate(t,this.audioCtx.sampleRate);this.onPitchDetected&&this.onPitchDetected(n),this.pitchDetectInterval=requestAnimationFrame(()=>this.detectPitchLoop())}autoCorrelate(e,t){let n=e.length,r=0;for(let t=0;t<n;t++){let n=e[t];r+=n*n}if(r=Math.sqrt(r/n),r<.01)return-1;let i=0,a=n-1,o=.2;for(let t=0;t<n/2;t++)if(Math.abs(e[t])<o){i=t;break}for(let t=1;t<n/2;t++)if(Math.abs(e[n-t])<o){a=n-t;break}e=e.slice(i,a),n=e.length;let s=Array(n).fill(0);for(let t=0;t<n;t++)for(let r=0;r<n-t;r++)s[t]=s[t]+e[r]*e[r+t];let c=0;for(;s[c]>s[c+1];)c++;let l=-1,u=-1;for(let e=c;e<n;e++)s[e]>l&&(l=s[e],u=e);let d=u,f=s[d-1],p=s[d],m=s[d+1],h=(f+m-2*p)/2,g=(m-f)/2;return h&&(d-=g/(2*h)),t/d}nextNote(){let e=60/this.bpm;this.nextNoteTime+=.25*e,this.current16thNote++,this.current16thNote===16&&(this.current16thNote=0)}scheduleNote(e,t){if(e%4==0){let n=this.audioCtx.createOscillator(),r=this.audioCtx.createGain();n.connect(r),r.connect(this.audioCtx.destination),e===0?n.frequency.value=880:n.frequency.value=440,n.start(t),n.stop(t+.05),r.gain.setValueAtTime(0,t),r.gain.linearRampToValueAtTime(1,t+.001),r.gain.exponentialRampToValueAtTime(.001,t+.05),this.onBeat&&setTimeout(()=>this.onBeat(e/4),(t-this.audioCtx.currentTime)*1e3)}}scheduler(){for(;this.nextNoteTime<this.audioCtx.currentTime+this.scheduleAheadTime;)this.scheduleNote(this.current16thNote,this.nextNoteTime),this.nextNote();this.metronomeTimerID=setTimeout(()=>this.scheduler(),this.lookahead)}startMetronome(e,t){this.init(),!this.isPlayingMetronome&&(this.bpm=e,this.onBeat=t,this.isPlayingMetronome=!0,this.current16thNote=0,this.nextNoteTime=this.audioCtx.currentTime+.05,this.scheduler())}stopMetronome(){this.isPlayingMetronome=!1,clearTimeout(this.metronomeTimerID)}},r=`e9bbdd3a-4774-4e74-8601-c1647cb3324c_`;function i(e,t){try{localStorage.setItem(`${r}${e}`,JSON.stringify(t))}catch(e){console.error(`Error saving to storage`,e)}}function a(e){try{let t=localStorage.getItem(`${r}${e}`);return t?JSON.parse(t):null}catch(e){return console.error(`Error loading from storage`,e),null}}function o(e,t){return`
    <div class="view practice-view">
      <div class="controls-panel">
        <div class="control-group">
          <label>Timbre Synth</label>
          <select id="timbre-select">${e.map((e,t)=>`<option value="${t}">${e}</option>`).join(``)}</select>
        </div>
        <div class="control-group">
          <label>Treino de Escala</label>
          <select id="scale-select">${t.map((e,t)=>`<option value="${t}">${e.name}</option>`).join(``)}</select>
        </div>
        <div class="control-group metronome-controls">
          <label>Metrônomo (<span id="bpm-display">120</span> BPM)</label>
          <input type="range" id="bpm-slider" min="60" max="200" value="120">
          <button id="toggle-metronome" class="btn">Ligar Metrônomo</button>
        </div>
      </div>

      <div class="visualizer-container">
        <div class="target-note-display">
          Nota Alvo: <strong id="target-note-name">-</strong>
        </div>
        <div class="pitch-visualizer">
          <div class="gauge">
            <div class="gauge-center"></div>
            <div class="needle" id="pitch-needle"></div>
          </div>
          <div class="cents-label">
            <span class="flat">-50 Cents (Subir)</span>
            <span class="sharp">+50 Cents (Descer)</span>
          </div>
        </div>
        <div class="detected-pitch-display">
          Detectado: <strong id="detected-note-name">-</strong> (<span id="cents-off">0</span>)
        </div>
      </div>

      <div class="action-panel">
         <button id="toggle-training" class="btn primary">Iniciar Treino</button>
         <button id="play-reference" class="btn secondary">Ouvir Referência</button>
      </div>
    </div>
  `}function s(e){if(!e||e.length===0)return`
      <div class="view history-view empty">
        <p>Nenhum treino registrado ainda. Inicie um treino na aba 'Prática'!</p>
      </div>
    `;let t=e.length,n=Math.round(e.reduce((e,t)=>e+t.accuracy,0)/t),r=``;if(t>1){let n=560/(t-1);r=e.map((e,t)=>`${20+t*n},${180-e.accuracy/100*160}`).join(` `)}else r=`20,${200/2} 580,${200/2}`;return`
    <div class="view history-view">
      <div class="dashboard">
        <div class="stat-card">
          <h4>Média de Acertos</h4>
          <div class="stat-value">${n}%</div>
        </div>
        <div class="stat-card">
          <h4>Sessões Concluídas</h4>
          <div class="stat-value">${t}</div>
        </div>
      </div>

      <div class="chart-container">
        <h3>Evolução de Afinação</h3>
        ${`
    <svg viewBox="0 0 600 200" class="progress-chart">
      <!-- Grid lines -->
      <line x1="20" y1="20" x2="580" y2="20" stroke="#eee" />
      <line x1="20" y1="${200/2}" x2="580" y2="${200/2}" stroke="#eee" />
      <line x1="20" y1="180" x2="580" y2="180" stroke="#eee" />

      <!-- Data line -->
      <polyline fill="none" stroke="#007aff" stroke-width="3" points="${r}" />

      <!-- Data points -->
      ${e.map((e,n)=>{let r=t>1?560/(t-1):560/2;return`<circle cx="${t>1?20+n*r:600/2}" cy="${180-e.accuracy/100*160}" r="4" fill="#007aff" />
                <title>${new Date(e.date).toLocaleDateString()}: ${e.accuracy}%</title>`}).join(``)}
    </svg>
  `}
      </div>

      <div class="history-list-container">
        <h3>Relatórios Detalhados</h3>
        <div class="history-list">
          ${e.reverse().map(e=>{let t=``;return e.notesDetails&&e.notesDetails.length>0&&(t=`<ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 12px; color: #555;">`+e.notesDetails.map(e=>`<li><strong>${e.note}</strong>: ${e.status} (${e.avgCents} cents)</li>`).join(``)+`</ul>`),`
      <div class="history-item">
        <div class="history-item-header">
          <span class="date">${new Date(e.date).toLocaleString()}</span>
          <span class="accuracy ${e.accuracy>=80?`good`:`needs-work`}">${e.accuracy}%</span>
        </div>
        <div class="history-item-details">
          Escala: ${e.scaleName} | Desvio Médio: ${Math.round(e.avgCentsOff)} cents
          ${t}
        </div>
      </div>
    `}).join(``)}
        </div>
      </div>
    </div>
  `}var c=[{name:`C Major`,notes:[261.63,293.66,329.63,349.23,392,440,493.88,523.25]},{name:`G Major`,notes:[196,220,246.94,261.63,293.66,329.63,369.99,392]},{name:`A Minor`,notes:[220,246.94,261.63,293.66,329.63,349.23,392,440]}],l=`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    background: #f9f9fb;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* Static Header */
  .header {
    flex-shrink: 0;
    display: flex;
    border-bottom: 1px solid #e1e1e1;
    background: #fff;
    padding: 0;
  }
  .nav-btn {
    flex: 1;
    padding: 15px;
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    color: #666;
    transition: all 0.2s ease;
  }
  .nav-btn.active {
    color: #007aff;
    border-bottom: 3px solid #007aff;
  }
  .nav-btn:hover {
    background: #f0f0f0;
  }

  /* Main Container */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Flexible views */
  .view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 20px;
    gap: 20px;
  }
  .view.hidden {
    display: none;
  }

  /* Practice View Elements */
  .controls-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .control-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 150px;
  }
  .control-group label {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #555;
  }
  select, input[type="range"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    width: 100%;
  }

  /* Buttons */
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
  }
  .btn.primary {
    background: #007aff;
    color: #fff;
  }
  .btn.primary:hover { background: #005bb5; }
  .btn.secondary {
    background: #e5e5ea;
    color: #333;
  }
  .btn.secondary:hover { background: #d1d1d6; }
  .btn.danger {
    background: #ff3b30;
    color: #fff;
  }
  .btn.danger:hover { background: #cc2f26; }

  /* Pitch Visualizer */
  .visualizer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .target-note-display, .detected-pitch-display {
    font-size: 18px;
    margin: 10px 0;
  }
  .target-note-display strong { font-size: 24px; color: #007aff; }

  .pitch-visualizer {
    position: relative;
    width: 300px;
    height: 150px;
    margin: 20px 0;
    overflow: hidden;
  }
  .gauge {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top-left-radius: 150px;
    border-top-right-radius: 150px;
    border: 20px solid #eee;
    border-bottom: none;
    box-sizing: border-box;
  }
  .gauge-center {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 20px;
    background: #34c759;
    z-index: 2;
  }
  .needle {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 4px;
    height: 120px;
    background: #ff3b30;
    transform-origin: bottom center;
    transform: translateX(-50%) rotate(0deg);
    transition: transform 0.1s ease-out, background 0.2s ease;
    border-radius: 2px;
    z-index: 3;
  }
  .needle.in-tune {
    background: #34c759;
  }
  .cents-label {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    padding: 0 10px;
  }

  .action-panel {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  /* History View */
  .dashboard {
    display: flex;
    gap: 15px;
  }
  .stat-card {
    flex: 1;
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    text-align: center;
  }
  .stat-card h4 {
    margin: 0 0 10px 0;
    font-weight: 500;
    color: #666;
  }
  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #007aff;
  }

  .chart-container {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .progress-chart {
    width: 100%;
    max-height: 200px;
    display: block;
  }

  .history-list-container {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 200px;
  }
  .history-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .history-item {
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  .history-item-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .accuracy.good { color: #34c759; }
  .accuracy.needs-work { color: #ff9500; }
  .history-item-details {
    font-size: 13px;
    color: #666;
  }
`,u=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.audioEngine=new n,this.historyData=a(`history`)||[],this.currentScaleIndex=0,this.currentTimbreIndex=0,this.isTraining=!1,this.trainingSession=null,this.currentTargetNoteIndex=0}connectedCallback(){this.render(),this.setupListeners()}disconnectedCallback(){this.audioEngine.stopMicrophone(),this.audioEngine.stopMetronome()}render(){this.shadowRoot.innerHTML=`
      <style>${l}</style>
      <div class="header">
        <button class="nav-btn active" data-target="practice">Prática</button>
        <button class="nav-btn" data-target="history">Histórico</button>
      </div>
      <div class="main-content">
        <div id="practice-container">
          ${o(t,c)}
        </div>
        <div id="history-container" style="display: none;">
          ${s(this.historyData)}
        </div>
      </div>
    `}setupListeners(){let e=this.shadowRoot,t=e.querySelectorAll(`.nav-btn`);t.forEach(n=>{n.addEventListener(`click`,n=>{t.forEach(e=>e.classList.remove(`active`)),n.target.classList.add(`active`),n.target.getAttribute(`data-target`)===`practice`?(e.getElementById(`practice-container`).style.display=`block`,e.getElementById(`history-container`).style.display=`none`):(e.getElementById(`practice-container`).style.display=`none`,e.getElementById(`history-container`).innerHTML=s(this.historyData),e.getElementById(`history-container`).style.display=`block`)})});let n=e.getElementById(`toggle-metronome`);n&&n.addEventListener(`click`,()=>{if(this.audioEngine.isPlayingMetronome)this.audioEngine.stopMetronome(),n.textContent=`Ligar Metrônomo`,n.classList.remove(`danger`);else{let t=parseInt(e.getElementById(`bpm-slider`).value,10);this.audioEngine.startMetronome(t,()=>{}),n.textContent=`Desligar Metrônomo`,n.classList.add(`danger`)}});let r=e.getElementById(`bpm-slider`);r&&r.addEventListener(`input`,t=>{e.getElementById(`bpm-display`).textContent=t.target.value,this.audioEngine.isPlayingMetronome&&(this.audioEngine.bpm=parseInt(t.target.value,10))});let i=e.getElementById(`timbre-select`);i&&i.addEventListener(`change`,e=>{this.currentTimbreIndex=parseInt(e.target.value,10)});let a=e.getElementById(`scale-select`);a&&a.addEventListener(`change`,e=>{this.currentScaleIndex=parseInt(e.target.value,10),this.updateTargetNoteDisplay()});let o=e.getElementById(`play-reference`);o&&o.addEventListener(`click`,()=>{let e=c[this.currentScaleIndex].notes[this.currentTargetNoteIndex||0];this.audioEngine.playNote(e,this.currentTimbreIndex),setTimeout(()=>{this.audioEngine.stopNote(e)},1e3)});let l=e.getElementById(`toggle-training`);l&&l.addEventListener(`click`,()=>{this.isTraining?(this.stopTraining(),l.textContent=`Iniciar Treino`,l.classList.remove(`danger`),l.classList.add(`primary`)):(this.startTraining(),l.textContent=`Parar Treino`,l.classList.remove(`primary`),l.classList.add(`danger`))}),this.updateTargetNoteDisplay()}frequencyToNoteInfo(e){let t=[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`];if(e===-1)return{name:`-`,centsOff:0,isPerfect:!1};let n=Math.round(12*Math.log2(e/440)),r=440*2**(n/12),i=Math.round(1200*Math.log2(e/r)),a=(n+9)%12;a<0&&(a+=12);let o=4+Math.floor((n+9)/12);return{name:`${t[a]}${o}`,centsOff:i,targetFreq:r}}updateTargetNoteDisplay(){let e=c[this.currentScaleIndex];this.currentTargetNoteIndex>=e.notes.length&&(this.currentTargetNoteIndex=0);let t=e.notes[this.currentTargetNoteIndex],n=this.frequencyToNoteInfo(t),r=this.shadowRoot.getElementById(`target-note-name`);r&&(r.textContent=n.name||`-`)}handlePitchDetected(e){let t=this.shadowRoot,n=t.getElementById(`pitch-needle`),r=t.getElementById(`detected-note-name`),i=t.getElementById(`cents-off`);if(e===-1){n&&(n.style.transform=`translateX(-50%) rotate(0deg)`,n.classList.remove(`in-tune`)),r&&(r.textContent=`-`),i&&(i.textContent=`0`);return}let a=c[this.currentScaleIndex],o=a.notes[this.currentTargetNoteIndex],s=Math.round(1200*Math.log2(e/o)),l=Math.max(-50,Math.min(50,s)),u=l/50*90;n&&(n.style.transform=`translateX(-50%) rotate(${u}deg)`,Math.abs(l)<=10?n.classList.add(`in-tune`):n.classList.remove(`in-tune`));let d=this.frequencyToNoteInfo(e);if(r&&(r.textContent=d.name),i&&(i.textContent=`${l} cents`),this.isTraining&&this.trainingSession){let e=this.frequencyToNoteInfo(o).name;if(this.trainingSession.noteRecordings[e]||(this.trainingSession.noteRecordings[e]=[]),this.trainingSession.noteRecordings[e].push(Math.abs(l)),Math.abs(l)<=15){if(this.trainingSession.goodFrames++,this.trainingSession.goodFrames>30)if(this.currentTargetNoteIndex++,this.trainingSession.goodFrames=0,this.currentTargetNoteIndex>=a.notes.length){this.stopTraining();let e=this.shadowRoot.getElementById(`toggle-training`);e&&(e.textContent=`Iniciar Treino`,e.classList.remove(`danger`),e.classList.add(`primary`)),alert(`Treino concluído com sucesso!`)}else this.updateTargetNoteDisplay()}else this.trainingSession.goodFrames=0}}startTraining(){this.isTraining=!0,this.currentTargetNoteIndex=0,this.updateTargetNoteDisplay(),this.trainingSession={scaleName:c[this.currentScaleIndex].name,noteRecordings:{},goodFrames:0,date:new Date().toISOString()},this.audioEngine.startMicrophone(e=>this.handlePitchDetected(e))}stopTraining(){if(this.isTraining=!1,this.audioEngine.stopMicrophone(),this.trainingSession&&Object.keys(this.trainingSession.noteRecordings).length>0){let e=0,t=0,n=[];for(let[r,i]of Object.entries(this.trainingSession.noteRecordings)){if(i.length===0)continue;let a=i.reduce((e,t)=>e+t,0)/i.length;e+=a*i.length,t+=i.length;let o=`Boas`;a>25?o=`Ruins`:a>15&&(o=`Precisa de mais afinação`),n.push({note:r,avgCents:Math.round(a),status:o})}let r=t>0?e/t:0,a=Math.max(0,Math.round(100-r/50*100)),o={date:this.trainingSession.date,scaleName:this.trainingSession.scaleName,avgCentsOff:r,accuracy:a,notesDetails:n};this.historyData.push(o),i(`history`,this.historyData)}this.handlePitchDetected(-1),this.currentTargetNoteIndex=0,this.updateTargetNoteDisplay()}};return customElements.define(`voice-tuning-widget`,u),e.VoiceTuningWidget=u,e})({});