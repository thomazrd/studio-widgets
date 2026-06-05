(function(){"use strict";class n extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.storagePrefix="619ed276-ed29-41cc-96a2-2de21c24aa57_",this.modes={pomodoro:{time:25*60,label:"Pomodoro",color:"#ff4b4b"},shortBreak:{time:5*60,label:"Short Break",color:"#38a169"},longBreak:{time:15*60,label:"Long Break",color:"#3182ce"}},this.currentMode="pomodoro",this.isActive=!1,this.timerId=null,this.loadState(),this.timeLeft||(this.timeLeft=this.modes[this.currentMode].time)}saveState(){const t={currentMode:this.currentMode,timeLeft:this.timeLeft};localStorage.setItem(this.storagePrefix+"state",JSON.stringify(t))}loadState(){const t=localStorage.getItem(this.storagePrefix+"state");if(t)try{const e=JSON.parse(t);this.currentMode=e.currentMode||"pomodoro",this.timeLeft=e.timeLeft!==void 0?e.timeLeft:this.modes[this.currentMode].time}catch(e){console.error("Error parsing stored state",e)}}connectedCallback(){this.render(),this.setupEventListeners()}disconnectedCallback(){this.stopTimer()}startTimer(){this.isActive||(this.isActive=!0,this.timerId=setInterval(()=>{this.timeLeft>0?(this.timeLeft--,this.updateTimeDisplay(),this.saveState()):(this.stopTimer(),this.handleTimerComplete())},1e3),this.updateControls())}stopTimer(){this.isActive&&(this.isActive=!1,clearInterval(this.timerId),this.updateControls())}resetTimer(){this.stopTimer(),this.timeLeft=this.modes[this.currentMode].time,this.updateTimeDisplay(),this.saveState()}setMode(t){this.modes[t]&&(this.currentMode=t,this.resetTimer(),this.saveState(),this.render(),this.setupEventListeners())}handleTimerComplete(){this.resetTimer()}formatTime(t){const e=Math.floor(t/60),o=t%60;return`${e.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}updateTimeDisplay(){const t=this.shadowRoot.querySelector(".time-display");t&&(t.textContent=this.formatTime(this.timeLeft));const e=this.shadowRoot.querySelector(".progress");if(e){const o=this.modes[this.currentMode].time,s=(o-this.timeLeft)/o*100,i=2*Math.PI*120,r=i-s/100*i;e.style.strokeDashoffset=r}}updateControls(){const t=this.shadowRoot.querySelector("#play-btn");t&&(t.textContent=this.isActive?"Pause":"Start")}setupEventListeners(){const t=this.shadowRoot.querySelector("#play-btn");t&&t.addEventListener("click",()=>{this.isActive?this.stopTimer():this.startTimer()});const e=this.shadowRoot.querySelector("#reset-btn");e&&e.addEventListener("click",()=>this.resetTimer()),["pomodoro","shortBreak","longBreak"].forEach(o=>{const s=this.shadowRoot.querySelector(`#tab-${o}`);s&&s.addEventListener("click",()=>this.setMode(o))})}render(){const t=this.currentMode==="pomodoro",e=this.currentMode==="shortBreak",o=this.currentMode==="longBreak",s=this.modes[this.currentMode].time,a=(s-this.timeLeft)/s*100,r=2*Math.PI*120,c=r-a/100*r;this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          --pomodoro-bg: #E35E55;
          --short-break-bg: #4CA6A9;
          --long-break-bg: #498FC1;
          --transition-speed: 0.5s;
        }

        .container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--${this.currentMode==="pomodoro"?"pomodoro":this.currentMode==="shortBreak"?"short-break":"long-break"}-bg);
          color: white;
          transition: background-color var(--transition-speed) ease;
        }

        .tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 5px;
          margin-bottom: 40px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .tab {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 25px;
          transition: all 0.3s ease;
        }

        .tab.active {
          background: white;
          color: var(--${this.currentMode==="pomodoro"?"pomodoro":this.currentMode==="shortBreak"?"short-break":"long-break"}-bg);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .timer-ring {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timer-ring svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .timer-ring circle {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
        }

        .timer-ring .bg {
          stroke: rgba(255, 255, 255, 0.2);
        }

        .timer-ring .progress {
          stroke: white;
          stroke-dasharray: ${r};
          stroke-dashoffset: ${c};
          transition: stroke-dashoffset 1s linear;
        }

        .time-display {
          font-size: 5.5rem;
          font-weight: 700;
          letter-spacing: 2px;
          position: relative;
          z-index: 10;
        }

        .controls {
          margin-top: 40px;
          display: flex;
          gap: 20px;
        }

        .btn {
          border: none;
          padding: 15px 40px;
          font-size: 1.2rem;
          font-weight: 700;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.2s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .btn:active {
          transform: scale(0.95);
        }

        .btn-play {
          background-color: white;
          color: var(--${this.currentMode==="pomodoro"?"pomodoro":this.currentMode==="shortBreak"?"short-break":"long-break"}-bg);
        }

        .btn-reset {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }
      </style>
      <div class="container">
        <div class="tabs">
          <button id="tab-pomodoro" class="tab ${t?"active":""}">Pomodoro</button>
          <button id="tab-shortBreak" class="tab ${e?"active":""}">Short Break</button>
          <button id="tab-longBreak" class="tab ${o?"active":""}">Long Break</button>
        </div>

        <div class="timer-ring">
          <svg>
            <circle class="bg" cx="150" cy="150" r="120"></circle>
            <circle class="progress" cx="150" cy="150" r="120"></circle>
          </svg>
          <div class="time-display">${this.formatTime(this.timeLeft)}</div>
        </div>

        <div class="controls">
          <button id="play-btn" class="btn btn-play">${this.isActive?"Pause":"Start"}</button>
          <button id="reset-btn" class="btn btn-reset">Reset</button>
        </div>
      </div>
    `}}customElements.get("pomodoro-app")||customElements.define("pomodoro-app",n)})();
