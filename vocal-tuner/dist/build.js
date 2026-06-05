(function(){var e={C3:130.81,"C#3":138.59,D3:146.83,"D#3":155.56,E3:164.81,F3:174.61,"F#3":185,G3:196,"G#3":207.65,A3:220,"A#3":233.08,B3:246.94,C4:261.63,"C#4":277.18,D4:293.66,"D#4":311.13,E4:329.63,F4:349.23,"F#4":369.99,G4:392,"G#4":415.3,A4:440,"A#4":466.16,B4:493.88,C5:523.25,"C#5":554.37,D5:587.33,"D#5":622.25,E5:659.25,F5:698.46,"F#5":739.99,G5:783.99,"G#5":830.61,A5:880,"A#5":932.33,B5:987.77,C6:1046.5},t=[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`],n=class{constructor(){this.audioContext=null,this.activeOscillators=new Map}init(){this.audioContext||=new(window.AudioContext||window.webkitAudioContext),this.audioContext.state===`suspended`&&this.audioContext.resume()}playNote(e,t=`piano`){this.init(),this.activeOscillators.has(e)&&this.stopNote(e);let n=this.audioContext.createOscillator(),r=this.audioContext.createGain(),i=this.audioContext.createBiquadFilter();n.connect(i),i.connect(r),r.connect(this.audioContext.destination);let a=this.audioContext.currentTime;t===`piano`?(n.type=`sine`,r.gain.setValueAtTime(0,a),r.gain.linearRampToValueAtTime(1,a+.05),r.gain.exponentialRampToValueAtTime(.2,a+.3),i.type=`lowpass`,i.frequency.setValueAtTime(3e3,a)):t===`organ`?(n.type=`square`,r.gain.setValueAtTime(0,a),r.gain.linearRampToValueAtTime(.5,a+.1),i.type=`lowpass`,i.frequency.setValueAtTime(1200,a)):t===`synthesizer`?(n.type=`sawtooth`,r.gain.setValueAtTime(0,a),r.gain.linearRampToValueAtTime(.4,a+.02),r.gain.linearRampToValueAtTime(.2,a+.1),i.type=`lowpass`,i.frequency.setValueAtTime(8e3,a),i.frequency.exponentialRampToValueAtTime(1e3,a+.5)):t===`flute`?(n.type=`sine`,r.gain.setValueAtTime(0,a),r.gain.linearRampToValueAtTime(.8,a+.1),i.type=`lowpass`,i.frequency.setValueAtTime(1500,a)):t===`strings`&&(n.type=`sawtooth`,r.gain.setValueAtTime(0,a),r.gain.linearRampToValueAtTime(.3,a+.3),i.type=`lowpass`,i.frequency.setValueAtTime(3e3,a)),n.frequency.setValueAtTime(e,a),n.start(a),this.activeOscillators.set(e,{osc:n,gainNode:r,instrument:t,startTime:a})}stopNote(e){if(!this.audioContext)return;let t=this.activeOscillators.get(e);if(t){let n=this.audioContext.currentTime,{osc:r,gainNode:i,instrument:a}=t;i.gain.cancelScheduledValues(n),i.gain.setValueAtTime(i.gain.value,n),a===`piano`?(i.gain.exponentialRampToValueAtTime(.01,n+.5),r.stop(n+.5)):a===`organ`?(i.gain.linearRampToValueAtTime(.01,n+.2),r.stop(n+.2)):a===`synthesizer`?(i.gain.exponentialRampToValueAtTime(.01,n+.1),r.stop(n+.1)):a===`flute`?(i.gain.linearRampToValueAtTime(.01,n+.1),r.stop(n+.1)):a===`strings`&&(i.gain.linearRampToValueAtTime(.01,n+.5),r.stop(n+.5)),this.activeOscillators.delete(e)}}},r=class{constructor(){this.audioContext=null,this.analyser=null,this.mediaStreamSource=null,this.buffer=new Float32Array(2048),this.stream=null,this.isRecording=!1,this.noteList=[];for(let[t,n]of Object.entries(e))this.noteList.push({note:t,freq:n});this.noteList.sort((e,t)=>e.freq-t.freq)}async start(){if(!this.isRecording)try{this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,autoGainControl:!1,noiseSuppression:!1}}),this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.analyser=this.audioContext.createAnalyser(),this.analyser.fftSize=2048,this.mediaStreamSource=this.audioContext.createMediaStreamSource(this.stream),this.mediaStreamSource.connect(this.analyser),this.isRecording=!0}catch(e){throw console.error(`Error accessing microphone:`,e),e}}stop(){this.isRecording&&=(this.stream&&this.stream.getTracks().forEach(e=>e.stop()),this.audioContext&&this.audioContext.state!==`closed`&&this.audioContext.close(),!1)}getPitch(){if(!this.isRecording)return null;this.analyser.getFloatTimeDomainData(this.buffer);let e=this.autoCorrelate(this.buffer,this.audioContext.sampleRate);return e===-1?null:{frequency:e,...this.getNearestNoteDetails(e)}}autoCorrelate(e,t){let n=e.length,r=0;for(let t=0;t<n;t++){let n=e[t];r+=n*n}if(r=Math.sqrt(r/n),r<.01)return-1;let i=0,a=n-1,o=.2;for(let t=0;t<n/2;t++)if(Math.abs(e[t])<o){i=t;break}for(let t=1;t<n/2;t++)if(Math.abs(e[n-t])<o){a=n-t;break}e=e.slice(i,a),n=e.length;let s=Array(n).fill(0);for(let t=0;t<n;t++)for(let r=0;r<n-t;r++)s[t]=s[t]+e[r]*e[r+t];let c=0;for(;s[c]>s[c+1];)c++;let l=-1,u=-1;for(let e=c;e<n;e++)s[e]>l&&(l=s[e],u=e);let d=u,f=s[d-1],p=s[d],m=s[d+1],h=(f+m-2*p)/2,g=(m-f)/2;return h&&(d-=g/(2*h)),t/d}getNearestNoteDetails(e){if(e<=this.noteList[0].freq)return{note:this.noteList[0].note,targetFreq:this.noteList[0].freq,cents:this.getCents(e,this.noteList[0].freq)};if(e>=this.noteList[this.noteList.length-1].freq)return{note:this.noteList[this.noteList.length-1].note,targetFreq:this.noteList[this.noteList.length-1].freq,cents:this.getCents(e,this.noteList[this.noteList.length-1].freq)};let t=this.noteList[0],n=Math.abs(e-this.noteList[0].freq);for(let r=1;r<this.noteList.length;r++){let i=Math.abs(e-this.noteList[r].freq);i<n&&(n=i,t=this.noteList[r])}let r=this.getCents(e,t.freq);return{note:t.note,targetFreq:t.freq,cents:r}}getCents(e,t){return Math.floor(1200*Math.log2(e/t))}},i=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.audioSynth=new n,this.pitchDetector=new r,this.startOctave=3,this.octaves=3,this.instrument=`piano`,this.isMicActive=!1,this.animationFrameId=null,this.inTuneThreshold=10,this.widgetId=this.getAttribute(`widget-id`),this.widgetId||(this.widgetId=`vocal-tuner-${Math.random().toString(36).substr(2,9)}`,this.setAttribute(`widget-id`,this.widgetId))}connectedCallback(){this.loadStorage(),this.render(),this.renderKeyboard(),this.attachEventListeners()}disconnectedCallback(){this.stopPitchDetection()}loadStorage(){let e=localStorage.getItem(`${this.widgetId}-instrument`);e&&(this.instrument=e)}getStyles(){return`
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
          box-sizing: border-box;
        }

        .widget-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
          color: #fff;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* TUNER SECTION */
        .tuner-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .tuner-display {
          width: 250px;
          height: 125px;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .tuner-arc {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          border: 10px solid #444;
          border-bottom-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          transform: rotate(45deg);
        }

        .tuner-needle {
          width: 4px;
          height: 110px;
          background-color: #fff;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform-origin: bottom center;
          transform: translateX(-50%) rotate(0deg);
          transition: transform 0.1s ease-out, background-color 0.2s;
          border-radius: 2px;
          z-index: 2;
        }

        .tuner-needle::after {
          content: '';
          width: 12px;
          height: 12px;
          background-color: inherit;
          border-radius: 50%;
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .tuner-center-mark {
          position: absolute;
          top: 5px;
          left: 50%;
          width: 4px;
          height: 15px;
          background-color: #666;
          transform: translateX(-50%);
        }

        .note-display {
          font-size: 48px;
          font-weight: bold;
          text-align: center;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .cents-display {
          font-size: 16px;
          color: #aaa;
          margin-top: 5px;
          height: 20px;
        }

        /* CONTROLS SECTION */
        .controls-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 20px;
          gap: 20px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #ccc;
        }

        select, button {
          background: #333;
          border: 1px solid #555;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        select:focus, button:focus {
          border-color: #66b3ff;
          box-shadow: 0 0 0 2px rgba(102, 179, 255, 0.3);
        }

        button:hover {
          background: #444;
        }

        button.active {
          background: #d32f2f;
          border-color: #ff5252;
          color: white;
          box-shadow: 0 0 10px rgba(211, 47, 47, 0.5);
        }

        /* KEYBOARD SECTION */
        .keyboard-wrapper {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          background: #111;
          padding-top: 20px;
        }

        .keyboard-container {
          display: flex;
          position: relative;
          height: 200px;
          margin: 0 auto;
          width: fit-content;
          border-radius: 8px 8px 0 0;
          padding: 10px 10px 0 10px;
          box-shadow: inset 0 5px 10px rgba(0,0,0,0.8);
        }

        .key {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 15px;
          border-radius: 0 0 6px 6px;
          cursor: pointer;
          transition: background-color 0.1s, transform 0.1s;
          box-sizing: border-box;
        }

        .key.white {
          width: 50px;
          height: 100%;
          background: linear-gradient(to bottom, #fff 0%, #f0f0f0 100%);
          border: 1px solid #ccc;
          border-top: none;
          z-index: 1;
          box-shadow: inset 0 -2px 5px rgba(0,0,0,0.2), 0 2px 3px rgba(0,0,0,0.1);
          color: #333;
        }

        .key.white.active {
          background: #e0e0e0;
          transform: translateY(2px);
          box-shadow: inset 0 -1px 2px rgba(0,0,0,0.3);
        }

        .key.black {
          width: 30px;
          height: 60%;
          background: linear-gradient(to bottom, #333 0%, #000 100%);
          border: 1px solid #000;
          border-radius: 0 0 4px 4px;
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          z-index: 2;
          box-shadow: inset 0 -2px 3px rgba(255,255,255,0.2), 0 3px 5px rgba(0,0,0,0.5);
          color: #fff;
          padding-bottom: 10px;
        }

        .key.black.active {
          background: linear-gradient(to bottom, #222 0%, #000 100%);
          transform: translateX(-50%) translateY(2px);
          box-shadow: inset 0 -1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.5);
        }

        .note-label {
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          pointer-events: none;
        }

        .key.black .note-label {
          font-size: 10px;
          color: #aaa;
        }

        .key.white .note-label {
          color: #555;
        }

        /* Color States */
        .color-match {
          color: #4caf50 !important;
        }
        .bg-match {
          background-color: #4caf50 !important;
        }
        .color-flat {
          color: #f44336 !important;
        }
        .bg-flat {
          background-color: #f44336 !important;
        }
        .color-sharp {
          color: #f44336 !important;
        }
        .bg-sharp {
          background-color: #f44336 !important;
        }
      </style>
    `}render(){this.shadowRoot.innerHTML=`
      ${this.getStyles()}
      <div class="widget-container">

        <div class="tuner-section">
          <div class="tuner-display">
            <div class="tuner-arc"></div>
            <div class="tuner-center-mark"></div>
            <div class="tuner-needle" id="tuner-needle"></div>
          </div>
          <div class="note-display" id="note-display">--</div>
          <div class="cents-display" id="cents-display">Tuner Inativo</div>
        </div>

        <div class="controls-section">
          <div class="control-group">
            <button id="mic-btn">🎤 Ativar Afinador</button>
          </div>
          <div class="control-group">
            <label for="instrument-select">Timbre do Teclado:</label>
            <select id="instrument-select">
              <option value="piano">Piano</option>
              <option value="synthesizer">Sintetizador</option>
              <option value="organ">Órgão</option>
              <option value="flute">Flauta</option>
              <option value="strings">Cordas</option>
            </select>
          </div>
        </div>

        <div class="keyboard-wrapper">
          <div class="keyboard-container" id="keyboard">
            <!-- Keys generated by JS -->
          </div>
        </div>

      </div>
    `}renderKeyboard(){let n=this.shadowRoot.getElementById(`keyboard`);if(!n)return;n.innerHTML=``;let r=[],i=[],a=0;for(let n=0;n<this.octaves;n++){let o=this.startOctave+n;t.forEach(t=>{let n=`${t}${o}`,s=t.includes(`#`),c=e[n];if(!c)return;let l=document.createElement(`div`);l.className=`key ${s?`black`:`white`}`,l.dataset.note=n,l.dataset.freq=c;let u=document.createElement(`div`);u.className=`note-label`,u.innerHTML=n,l.appendChild(u),s?(l.style.left=`${a*50+10}px`,i.push(l)):(r.push(l),a++)})}let o=`C${this.startOctave+parseInt(this.octaves)}`,s=e[o];if(s){let e=document.createElement(`div`);e.className=`key white`,e.dataset.note=o,e.dataset.freq=s;let t=document.createElement(`div`);t.className=`note-label`,t.innerHTML=o,e.appendChild(t),r.push(e)}r.forEach(e=>n.appendChild(e)),i.forEach(e=>n.appendChild(e))}attachEventListeners(){let e=this.shadowRoot.getElementById(`instrument-select`);e.value=this.instrument,e.addEventListener(`change`,e=>{this.instrument=e.target.value,localStorage.setItem(`${this.widgetId}-instrument`,this.instrument)});let t=this.shadowRoot.getElementById(`mic-btn`);t.addEventListener(`click`,async()=>{if(this.isMicActive)this.stopPitchDetection(),t.textContent=`🎤 Ativar Afinador`,t.classList.remove(`active`);else try{await this.pitchDetector.start(),this.isMicActive=!0,t.textContent=`⏹ Parar Afinador`,t.classList.add(`active`),this.startPitchDetectionLoop()}catch{alert(`Não foi possível acessar o microfone.`)}});let n=this.shadowRoot.getElementById(`keyboard`),r=e=>{let t=e.target.closest(`.key`);if(!t)return;let n=parseFloat(t.dataset.freq);if(n){this.audioSynth.playNote(n,this.instrument),t.classList.add(`active`);let e=()=>{this.audioSynth.stopNote(n),t.classList.remove(`active`),document.removeEventListener(`mouseup`,e),document.removeEventListener(`touchend`,e)};document.addEventListener(`mouseup`,e),document.addEventListener(`touchend`,e)}};n.addEventListener(`mousedown`,e=>{e.preventDefault(),r(e)}),n.addEventListener(`touchstart`,e=>{e.preventDefault();for(let t=0;t<e.changedTouches.length;t++){let n=e.changedTouches[t],i=document.elementFromPoint(n.clientX,n.clientY);i===this&&(i=this.shadowRoot.elementFromPoint(n.clientX,n.clientY)),i&&r({target:i})}})}startPitchDetectionLoop(){let e=()=>{if(!this.isMicActive)return;let t=this.pitchDetector.getPitch();this.updateTunerUI(t),this.animationFrameId=requestAnimationFrame(e)};e()}stopPitchDetection(){this.isMicActive=!1,this.pitchDetector.stop(),this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.updateTunerUI(null)}updateTunerUI(e){let t=this.shadowRoot.getElementById(`tuner-needle`),n=this.shadowRoot.getElementById(`note-display`),r=this.shadowRoot.getElementById(`cents-display`);if(!e){t.style.transform=`translateX(-50%) rotate(0deg)`,t.className=`tuner-needle`,n.textContent=`--`,n.className=`note-display`,r.textContent=this.isMicActive?`Aguardando som...`:`Tuner Inativo`;return}let i=e.cents;i>50&&(i=50),i<-50&&(i=-50);let a=i/50*45;t.style.transform=`translateX(-50%) rotate(${a}deg)`,n.textContent=e.note;let o=`${Math.abs(e.cents)} cents `;t.classList.remove(`bg-match`,`bg-flat`,`bg-sharp`),n.classList.remove(`color-match`,`color-flat`,`color-sharp`),Math.abs(e.cents)<=this.inTuneThreshold?(t.classList.add(`bg-match`),n.classList.add(`color-match`),o+=`(Afinado)`):e.cents<0?(t.classList.add(`bg-flat`),n.classList.add(`color-flat`),o+=`baixo (Flat)`):(t.classList.add(`bg-sharp`),n.classList.add(`color-sharp`),o+=`alto (Sharp)`),r.textContent=o}};customElements.define(`vocal-tuner`,i)})();