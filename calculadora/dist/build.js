(function(){"use strict";const c=`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    box-sizing: border-box;
    --bg-color: #f3f4f6;
    --calc-bg: #ffffff;
    --text-main: #1f2937;
    --text-sec: #6b7280;
    --btn-bg: #f9fafb;
    --btn-hover: #e5e7eb;
    --btn-active: #d1d5db;
    --btn-op-bg: #3b82f6;
    --btn-op-text: #ffffff;
    --btn-op-hover: #2563eb;
    --btn-danger-bg: #ef4444;
    --btn-danger-text: #ffffff;
    --btn-danger-hover: #dc2626;
    --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    --border-radius: 24px;
    --btn-radius: 16px;
  }

  :host([theme="dark"]) {
    --bg-color: #111827;
    --calc-bg: #1f2937;
    --text-main: #f9fafb;
    --text-sec: #9ca3af;
    --btn-bg: #374151;
    --btn-hover: #4b5563;
    --btn-active: #6b7280;
    --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }

  :host([theme="neon"]) {
    --bg-color: #050505;
    --calc-bg: #111;
    --text-main: #0f0;
    --text-sec: #080;
    --btn-bg: #222;
    --btn-hover: #333;
    --btn-active: #444;
    --btn-op-bg: #0f0;
    --btn-op-text: #000;
    --btn-op-hover: #0c0;
    --btn-danger-bg: #f00;
    --btn-danger-text: #fff;
    --btn-danger-hover: #c00;
    --shadow: 0 0 20px rgba(0, 255, 0, 0.2);
    --border-radius: 0px;
    --btn-radius: 0px;
  }

  * {
    box-sizing: inherit;
  }

  .container {
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    transition: background-color 0.3s ease;
  }

  .calculator {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 100%;
    max-height: 750px;
    background-color: var(--calc-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
  }

  .theme-toggle {
    background: transparent;
    border: none;
    color: var(--text-sec);
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .theme-toggle:hover {
    background-color: var(--btn-hover);
    color: var(--text-main);
  }

  .history-btn {
    background: transparent;
    border: none;
    color: var(--text-sec);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
  }

  .history-btn:hover {
    background-color: var(--btn-hover);
    color: var(--text-main);
  }

  .history-panel {
    position: absolute;
    top: 60px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    background-color: var(--calc-bg);
    z-index: 10;
    border-radius: 16px;
    padding: 20px;
    box-shadow: var(--shadow);
    display: none;
    flex-direction: column;
  }

  .history-panel.open {
    display: flex;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    color: var(--text-main);
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .history-item {
    padding: 10px 0;
    border-bottom: 1px solid var(--btn-hover);
    text-align: right;
  }

  .history-expr {
    color: var(--text-sec);
    font-size: 14px;
  }

  .history-res {
    color: var(--text-main);
    font-size: 20px;
    font-weight: 500;
  }

  .display {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 20px 30px;
    word-wrap: break-word;
    word-break: break-all;
  }

  .previous-operand {
    color: var(--text-sec);
    font-size: 1.5rem;
    min-height: 2rem;
  }

  .current-operand {
    color: var(--text-main);
    font-size: 4rem;
    font-weight: 300;
    line-height: 1.1;
    margin-top: 5px;
  }

  .keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 12px;
    padding: 25px;
    background-color: var(--calc-bg);
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background-color: var(--btn-bg);
    color: var(--text-main);
    font-size: 1.5rem;
    padding: 18px 0;
    border-radius: var(--btn-radius);
    transition: all 0.1s ease;
    user-select: none;
    font-weight: 500;
  }

  button:active {
    background-color: var(--btn-active);
    transform: scale(0.95);
  }

  button.operator {
    background-color: var(--btn-op-bg);
    color: var(--btn-op-text);
  }

  button.operator:hover {
    background-color: var(--btn-op-hover);
  }

  button.operator:active {
    filter: brightness(0.9);
  }

  button.danger {
    background-color: var(--btn-danger-bg);
    color: var(--btn-danger-text);
  }

  button.danger:hover {
    background-color: var(--btn-danger-hover);
  }

  .span-2 {
    grid-column: span 2;
  }
`;class l{constructor(){this.currentOperand="0",this.previousOperand="",this.operation=void 0,this.shouldResetScreen=!1,this.error=!1}clear(){this.currentOperand="0",this.previousOperand="",this.operation=void 0,this.error=!1}delete(){if(this.error){this.clear();return}this.currentOperand.length===1||this.currentOperand.length===2&&this.currentOperand.startsWith("-")?this.currentOperand="0":this.currentOperand=this.currentOperand.toString().slice(0,-1)}appendNumber(t){this.error&&this.clear(),!(t==="."&&this.currentOperand.includes("."))&&(this.shouldResetScreen?(this.currentOperand=t,this.shouldResetScreen=!1):this.currentOperand==="0"&&t!=="."?this.currentOperand=t:this.currentOperand=this.currentOperand.toString()+t.toString())}chooseOperation(t){this.error&&this.clear(),this.currentOperand!==""&&(this.previousOperand!==""&&this.compute(),this.operation=t,this.previousOperand=this.currentOperand,this.currentOperand="")}compute(){let t;const e=parseFloat(this.previousOperand),r=parseFloat(this.currentOperand);if(isNaN(e)||isNaN(r))return null;switch(this.operation){case"+":t=e+r;break;case"-":t=e-r;break;case"×":t=e*r;break;case"÷":if(r===0)return this.error=!0,this.currentOperand="Erro",this.previousOperand="",this.operation=void 0,{expression:`${e} ÷ 0`,result:"Erro"};t=e/r;break;default:return null}t=Math.round(t*1e8)/1e8;const o=`${e} ${this.operation} ${r}`;return this.currentOperand=t.toString(),this.operation=void 0,this.previousOperand="",this.shouldResetScreen=!0,{expression:o,result:this.currentOperand}}}const s="c7f2de43-63d4-4862-b9a2-50b65d372935";function a(n,t){try{localStorage.setItem(`${s}_${n}`,JSON.stringify(t))}catch(e){console.error("Failed to save to localStorage",e)}}function i(n,t=null){try{const e=localStorage.getItem(`${s}_${n}`);return e?JSON.parse(e):t}catch(e){return console.error("Failed to load from localStorage",e),t}}function d(n){const t=i("history",[]);t.unshift(n),t.length>50&&t.pop(),a("history",t)}function h(){return i("history",[])}function u(){a("history",[])}class p extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.calculator=new l,this.themes=["light","dark","neon"],this.currentThemeIndex=this.themes.indexOf(i("theme","light")),this.currentThemeIndex===-1&&(this.currentThemeIndex=0)}connectedCallback(){this.render(),this.setTheme(this.themes[this.currentThemeIndex]),this.setupEventListeners(),this.updateDisplay()}setTheme(t){this.setAttribute("theme",t),a("theme",t)}toggleTheme(){this.currentThemeIndex=(this.currentThemeIndex+1)%this.themes.length,this.setTheme(this.themes[this.currentThemeIndex]);const t=this.shadowRoot.querySelector(".theme-toggle");t.textContent=`Tema: ${this.themes[this.currentThemeIndex].toUpperCase()}`}setupEventListeners(){const t=this.shadowRoot;t.querySelectorAll("[data-number]").forEach(o=>{o.addEventListener("click",()=>{this.calculator.appendNumber(o.innerText),this.updateDisplay()})}),t.querySelectorAll("[data-operation]").forEach(o=>{o.addEventListener("click",()=>{this.calculator.chooseOperation(o.innerText),this.updateDisplay()})}),t.querySelector("[data-equals]").addEventListener("click",()=>{const o=this.calculator.compute();o&&(d(o),this.renderHistory()),this.updateDisplay()}),t.querySelector("[data-all-clear]").addEventListener("click",()=>{this.calculator.clear(),this.updateDisplay()}),t.querySelector("[data-delete]").addEventListener("click",()=>{this.calculator.delete(),this.updateDisplay()}),t.querySelector(".theme-toggle").addEventListener("click",()=>this.toggleTheme());const e=t.querySelector(".history-btn"),r=t.querySelector(".history-panel");e.addEventListener("click",()=>{r.classList.toggle("open"),this.renderHistory()}),t.querySelector(".close-history").addEventListener("click",()=>{r.classList.remove("open")}),t.querySelector(".clear-history").addEventListener("click",()=>{u(),this.renderHistory()})}updateDisplay(){const t=this.shadowRoot;t.querySelector("[data-current-operand]").innerText=this.calculator.currentOperand,this.calculator.operation!=null?t.querySelector("[data-previous-operand]").innerText=`${this.calculator.previousOperand} ${this.calculator.operation}`:t.querySelector("[data-previous-operand]").innerText=""}renderHistory(){const t=this.shadowRoot.querySelector(".history-list"),e=h();if(e.length===0){t.innerHTML='<li class="history-item"><div class="history-expr">Nenhum histórico</div></li>';return}t.innerHTML=e.map(r=>`
      <li class="history-item">
        <div class="history-expr">${r.expression}</div>
        <div class="history-res">=${r.result}</div>
      </li>
    `).join("")}render(){const t=document.createElement("template"),e=this.themes[this.currentThemeIndex].toUpperCase();t.innerHTML=`
      <style>${c}</style>
      <div class="container">
        <div class="calculator">

          <div class="header">
            <button class="theme-toggle">Tema: ${e}</button>
            <button class="history-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </button>
          </div>

          <div class="history-panel">
            <div class="history-header">
              <span>Histórico</span>
              <div>
                <button class="history-btn clear-history" title="Limpar Histórico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
                <button class="history-btn close-history">✕</button>
              </div>
            </div>
            <ul class="history-list"></ul>
          </div>

          <div class="display">
            <div data-previous-operand class="previous-operand"></div>
            <div data-current-operand class="current-operand">0</div>
          </div>

          <div class="keypad">
            <button data-all-clear class="danger span-2">AC</button>
            <button data-delete>DEL</button>
            <button data-operation class="operator">÷</button>

            <button data-number>7</button>
            <button data-number>8</button>
            <button data-number>9</button>
            <button data-operation class="operator">×</button>

            <button data-number>4</button>
            <button data-number>5</button>
            <button data-number>6</button>
            <button data-operation class="operator">-</button>

            <button data-number>1</button>
            <button data-number>2</button>
            <button data-number>3</button>
            <button data-operation class="operator">+</button>

            <button data-number class="span-2">0</button>
            <button data-number>.</button>
            <button data-equals class="operator">=</button>
          </div>
        </div>
      </div>
    `,this.shadowRoot.appendChild(t.content.cloneNode(!0))}}customElements.define("calculadora-widget",p)})();
