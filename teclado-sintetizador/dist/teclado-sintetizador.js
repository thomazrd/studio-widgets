(function(){var e={C3:130.81,"C#3":138.59,D3:146.83,"D#3":155.56,E3:164.81,F3:174.61,"F#3":185,G3:196,"G#3":207.65,A3:220,"A#3":233.08,B3:246.94,C4:261.63,"C#4":277.18,D4:293.66,"D#4":311.13,E4:329.63,F4:349.23,"F#4":369.99,G4:392,"G#4":415.3,A4:440,"A#4":466.16,B4:493.88,C5:523.25,"C#5":554.37,D5:587.33,"D#5":622.25,E5:659.25,F5:698.46,"F#5":739.99,G5:783.99,"G#5":830.61,A5:880,"A#5":932.33,B5:987.77,C6:1046.5},t=[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`],n=class{constructor(){this.audioContext=null,this.activeOscillators=new Map}init(){this.audioContext||=new(window.AudioContext||window.webkitAudioContext),this.audioContext.state===`suspended`&&this.audioContext.resume()}playNote(e,t=`piano`){this.init(),this.activeOscillators.has(e)&&this.stopNote(e);let n=this.audioContext.createOscillator(),r=this.audioContext.createGain(),i=this.audioContext.createBiquadFilter();n.connect(i),i.connect(r),r.connect(this.audioContext.destination);let a=this.audioContext.currentTime;t===`piano`?(n.type=`sine`,r.gain.setValueAtTime(0,a),r.gain.linearRampToValueAtTime(1,a+.05),r.gain.exponentialRampToValueAtTime(.2,a+.3),i.type=`lowpass`,i.frequency.setValueAtTime(3e3,a)):t===`organ`&&(n.type=`square`,r.gain.setValueAtTime(0,a),r.gain.linearRampToValueAtTime(.5,a+.1),i.type=`lowpass`,i.frequency.setValueAtTime(1200,a)),n.frequency.setValueAtTime(e,a),n.start(a),this.activeOscillators.set(e,{osc:n,gainNode:r,instrument:t,startTime:a})}stopNote(e){if(!this.audioContext)return;let t=this.activeOscillators.get(e);if(t){let n=this.audioContext.currentTime,{osc:r,gainNode:i,instrument:a}=t;i.gain.cancelScheduledValues(n),i.gain.setValueAtTime(i.gain.value,n),a===`piano`?(i.gain.exponentialRampToValueAtTime(.01,n+.5),r.stop(n+.5)):a===`organ`&&(i.gain.linearRampToValueAtTime(0,n+.2),r.stop(n+.2)),this.activeOscillators.delete(e)}}},r={C:`Dó`,"C#":`Dó#`,D:`Ré`,"D#":`Ré#`,E:`Mi`,F:`Fá`,"F#":`Fá#`,G:`Sol`,"G#":`Sol#`,A:`Lá`,"A#":`Lá#`,B:`Si`},i=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.audioSynth=new n,this.startOctave=3;let e=localStorage.getItem(`teclado_sintetizador_octaves`),t=localStorage.getItem(`teclado_sintetizador_instrument`);this.octaves=e?parseInt(e):2,this.instrument=t||`piano`}connectedCallback(){this.render(),this.renderKeyboard(),this.attachEventListeners()}getStyles(){return`
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
        }

        .widget-container {
          background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: #fff;
          max-width: 100%;
          overflow-x: auto;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 0 10px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #bbb;
        }

        select, input[type="range"] {
          background: #333;
          border: 1px solid #444;
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        select:focus {
          border-color: #66b3ff;
        }

        .keyboard-container {
          display: flex;
          position: relative;
          height: 200px;
          margin: 0 auto;
          width: fit-content;
          border-radius: 8px 8px 12px 12px;
          padding: 10px 10px 15px 10px;
          background: #111;
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
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          pointer-events: none;
        }

        .key.black .note-label {
          font-size: 9px;
          color: #aaa;
        }

        .key.white .note-label {
          color: #555;
        }

        /* Adjust positions for black keys */
        .key-wrapper {
          position: relative;
        }
      </style>
    `}render(){this.shadowRoot.innerHTML=`
      ${this.getStyles()}
      <div class="widget-container">
        <div class="controls">
          <div class="control-group">
            <label for="instrument-select">Timbre:</label>
            <select id="instrument-select">
              <option value="piano">Piano</option>
              <option value="organ">Órgão</option>
            </select>
          </div>
          <div class="control-group">
            <label for="octave-select">Oitavas:</label>
            <select id="octave-select">
              <option value="1">1 Oitava</option>
              <option value="2">2 Oitavas</option>
              <option value="3">3 Oitavas</option>
            </select>
          </div>
        </div>
        <div class="keyboard-container" id="keyboard">
          <!-- Keys will be generated here -->
        </div>
      </div>
    `}renderKeyboard(){let n=this.shadowRoot.getElementById(`keyboard`);if(!n)return;n.innerHTML=``;let i=[],a=[],o=0;for(let n=0;n<this.octaves;n++){let s=this.startOctave+n;t.forEach(t=>{let n=`${t}${s}`,c=t.includes(`#`),l=e[n];if(!l)return;let u=document.createElement(`div`);u.className=`key ${c?`black`:`white`}`,u.dataset.note=n,u.dataset.freq=l;let d=document.createElement(`div`);d.className=`note-label`,t.replace(`#`,``),d.innerHTML=`${r[t]}<br>${t}`,u.appendChild(d),c?(u.style.left=`${o*50}px`,a.push(u)):(i.push(u),o++)})}let s=`C${this.startOctave+parseInt(this.octaves)}`,c=e[s];if(c){let e=document.createElement(`div`);e.className=`key white`,e.dataset.note=s,e.dataset.freq=c;let t=document.createElement(`div`);t.className=`note-label`,t.innerHTML=`${r.C}<br>C`,e.appendChild(t),i.push(e)}i.forEach(e=>n.appendChild(e)),a.forEach(e=>n.appendChild(e))}attachEventListeners(){let e=this.shadowRoot.getElementById(`keyboard`),t=e=>{let t=e.target.closest(`.key`);if(!t)return;let n=parseFloat(t.dataset.freq);if(n){this.audioSynth.playNote(n,this.instrument),t.classList.add(`active`);let e=()=>{this.audioSynth.stopNote(n),t.classList.remove(`active`),document.removeEventListener(`mouseup`,e),document.removeEventListener(`touchend`,e)};document.addEventListener(`mouseup`,e),document.addEventListener(`touchend`,e)}};e.addEventListener(`mousedown`,e=>{e.preventDefault(),t(e)}),e.addEventListener(`touchstart`,e=>{e.preventDefault();for(let n=0;n<e.changedTouches.length;n++){let r=e.changedTouches[n],i=document.elementFromPoint(r.clientX,r.clientY);if(i){let e=i;if(i===this){let t=this.shadowRoot.elementFromPoint(r.clientX,r.clientY);t&&(e=t)}t({target:e})}}});let n=this.shadowRoot.getElementById(`instrument-select`),r=this.shadowRoot.getElementById(`octave-select`);n.value=this.instrument,r.value=this.octaves,n.addEventListener(`change`,e=>{this.instrument=e.target.value,localStorage.setItem(`teclado_sintetizador_instrument`,this.instrument)}),r.addEventListener(`change`,e=>{this.octaves=parseInt(e.target.value),localStorage.setItem(`teclado_sintetizador_octaves`,this.octaves),this.renderKeyboard()})}};customElements.define(`teclado-sintetizador`,i)})();