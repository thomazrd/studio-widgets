var i=`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --bg-color: #f3f4f6;
    --calc-bg: #ffffff;
    --text-main: #1f2937;
    --text-muted: #6b7280;
    --display-bg: #f9fafb;
    --btn-bg: #f3f4f6;
    --btn-bg-hover: #e5e7eb;
    --btn-bg-active: #d1d5db;
    --btn-op-bg: #f97316;
    --btn-op-bg-hover: #ea580c;
    --btn-op-bg-active: #c2410c;
    --btn-op-text: #ffffff;
    --btn-func-bg: #e5e7eb;
    --btn-func-bg-hover: #d1d5db;
    --btn-func-bg-active: #9ca3af;
    --border-radius: 12px;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --transition-speed: 0.15s;
  }

  .calculator-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: var(--calc-bg);
    box-sizing: border-box;
    overflow: hidden;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--calc-bg);
    border-bottom: 1px solid #e5e7eb;
  }

  .mode-toggle {
    display: flex;
    background-color: var(--btn-bg);
    border-radius: 20px;
    padding: 4px;
    position: relative;
  }

  .mode-btn {
    flex: 1;
    background: transparent;
    border: none;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--transition-speed);
    z-index: 1;
  }

  .mode-btn.active {
    color: var(--text-main);
  }

  .mode-indicator {
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: calc(50% - 4px);
    background-color: white;
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .mode-toggle.scientific .mode-indicator {
    transform: translateX(100%);
  }

  .display-section {
    flex: 0 0 auto;
    padding: 24px 16px;
    background-color: var(--display-bg);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    min-height: 100px;
    border-bottom: 1px solid #e5e7eb;
  }

  .history {
    font-size: 16px;
    color: var(--text-muted);
    min-height: 24px;
    margin-bottom: 8px;
    word-break: break-all;
    text-align: right;
  }

  .current-value {
    font-size: 48px;
    font-weight: 300;
    color: var(--text-main);
    word-break: break-all;
    line-height: 1.1;
    text-align: right;
    width: 100%;
  }

  .current-value.error {
    font-size: 36px;
    color: #ef4444;
  }

  .keypad {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 8px;
    padding: 16px;
    background-color: var(--calc-bg);
  }

  .keypad.scientific-mode {
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }

  .btn {
    border: none;
    border-radius: var(--border-radius);
    font-size: 20px;
    font-weight: 400;
    color: var(--text-main);
    background-color: var(--btn-bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-speed), transform 0.1s;
    user-select: none;
    box-shadow: var(--shadow-sm);
  }

  .btn:active {
    background-color: var(--btn-bg-active);
    transform: scale(0.96);
  }

  .btn:hover {
    background-color: var(--btn-bg-hover);
  }

  .btn.op {
    background-color: var(--btn-op-bg);
    color: var(--btn-op-text);
    font-size: 24px;
  }

  .btn.op:hover {
    background-color: var(--btn-op-bg-hover);
  }

  .btn.op:active {
    background-color: var(--btn-op-bg-active);
  }

  .btn.func {
    background-color: var(--btn-func-bg);
  }

  .btn.func:hover {
    background-color: var(--btn-func-bg-hover);
  }

  .btn.func:active {
    background-color: var(--btn-func-bg-active);
  }

  .btn.zero {
    grid-column: span 2;
  }

  .btn.sci-only {
    display: none;
    font-size: 16px;
  }

  .keypad.scientific-mode .btn.sci-only {
    display: flex;
  }

  .keypad.scientific-mode .btn.zero {
    grid-column: span 1;
  }

  /* Responsive adjustments for very small heights */
  @media (max-height: 400px) {
    .display-section {
      padding: 12px 16px;
      min-height: 80px;
    }
    .current-value {
      font-size: 32px;
    }
    .keypad {
      padding: 8px;
      gap: 4px;
    }
    .btn {
      font-size: 18px;
    }
  }
`;var n=class{constructor(){this.reset()}reset(){this.currentValue="0",this.expression=[],this.isError=!1,this.newInputExpected=!0}handleInput(t){if(this.isError){t==="C"&&this.reset();return}if(t==="C"){this.reset();return}if(t==="CE"){this.currentValue="0",this.newInputExpected=!0;return}/[0-9]/.test(t)?this.handleNumber(t):t==="."?this.handleDecimal():["+","-","*","/"].includes(t)?this.handleOperator(t):t==="="?this.calculate():t==="+/-"?this.toggleSign():t==="%"?this.handlePercentage():["sin","cos","tan","log","ln","sqrt","^","(",")"].includes(t)&&this.handleScientific(t)}handleNumber(t){this.newInputExpected?(this.currentValue=t,this.newInputExpected=!1):this.currentValue==="0"?this.currentValue=t:this.currentValue+=t}handleDecimal(){this.newInputExpected?(this.currentValue="0.",this.newInputExpected=!1):this.currentValue.includes(".")||(this.currentValue+=".")}handleOperator(t){!this.newInputExpected||this.expression.length===0||this.expression[this.expression.length-1]===")"?(this.newInputExpected||this.expression.push(this.currentValue),this.expression.push(t),this.newInputExpected=!0):["+","-","*","/"].includes(this.expression[this.expression.length-1])&&(this.expression[this.expression.length-1]=t)}handleScientific(t){if(t==="(")!this.newInputExpected&&this.currentValue!=="0"&&(this.expression.push(this.currentValue),this.expression.push("*")),this.expression.push("("),this.newInputExpected=!0;else if(t===")")this.newInputExpected||this.expression.push(this.currentValue),this.expression.push(")"),this.newInputExpected=!0;else if(t==="^")this.handleOperator("^");else{let e=parseFloat(this.currentValue),s;try{switch(t){case"sin":s=Math.sin(e);break;case"cos":s=Math.cos(e);break;case"tan":s=Math.tan(e);break;case"log":if(e<=0)throw new Error("Invalid");s=Math.log10(e);break;case"ln":if(e<=0)throw new Error("Invalid");s=Math.log(e);break;case"sqrt":if(e<0)throw new Error("Invalid");s=Math.sqrt(e);break}if(!isFinite(s)||isNaN(s))throw new Error("Invalid");this.currentValue=this.formatResult(s),this.newInputExpected=!0}catch{this.setError()}}}toggleSign(){this.currentValue!=="0"&&(this.currentValue.startsWith("-")?this.currentValue=this.currentValue.substring(1):this.currentValue="-"+this.currentValue)}handlePercentage(){let t=parseFloat(this.currentValue);this.currentValue=this.formatResult(t/100),this.newInputExpected=!0}calculate(){if(this.newInputExpected||this.expression.push(this.currentValue),this.expression.length!==0)try{let t=this.evaluateExpression(this.expression);!isFinite(t)||isNaN(t)?this.setError():(this.currentValue=this.formatResult(t),this.expression=[],this.newInputExpected=!0)}catch{this.setError()}}setError(){this.isError=!0,this.currentValue="Erro",this.expression=[]}formatResult(t){let e=t.toString();return e.length>12&&(e=t.toPrecision(10)),parseFloat(e).toString()}evaluateExpression(t){let e=t.map(s=>s==="^"?"**":s).join(" ");if(/[^0-9\+\-\*\/\.\(\)\s\*\*]/.test(e))throw new Error("Invalid tokens");if(/\/\s*0(?!\.)/.test(e))throw new Error("Division by zero");try{return new Function("return "+e)()}catch{throw new Error("Eval error")}}getState(){return{currentValue:this.currentValue,history:this.expression.join(" "),isError:this.isError}}};var a=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.logic=new n,this.mode="standard",this.uniqueId="calc_widget_v1_";try{localStorage.getItem(`${this.uniqueId}mode`)==="scientific"&&(this.mode="scientific")}catch{}}connectedCallback(){this.render(),this.setupEventListeners(),this.updateDisplay()}disconnectedCallback(){document.removeEventListener("keydown",this.handleKeyDown)}render(){this.shadowRoot.innerHTML=`
      <style>${i}</style>
      <div class="calculator-container">
        <div class="header">
          <div class="mode-toggle ${this.mode==="scientific"?"scientific":""}" id="mode-toggle">
            <div class="mode-indicator"></div>
            <button class="mode-btn ${this.mode==="standard"?"active":""}" data-mode="standard">Padr\xE3o</button>
            <button class="mode-btn ${this.mode==="scientific"?"active":""}" data-mode="scientific">Cient\xEDfico</button>
          </div>
        </div>

        <div class="display-section">
          <div class="history" id="history"></div>
          <div class="current-value" id="display">0</div>
        </div>

        <div class="keypad ${this.mode==="scientific"?"scientific-mode":""}" id="keypad">
          <!-- Scientific Extra Keys -->
          <button class="btn func sci-only" data-val="sin">sin</button>
          <button class="btn func sci-only" data-val="cos">cos</button>
          <button class="btn func sci-only" data-val="tan">tan</button>
          <button class="btn func sci-only" data-val="log">log</button>
          <button class="btn func sci-only" data-val="ln">ln</button>

          <button class="btn func sci-only" data-val="(">(</button>
          <button class="btn func sci-only" data-val=")">)</button>
          <button class="btn func sci-only" data-val="^">x^y</button>
          <button class="btn func sci-only" data-val="sqrt">\u221Ax</button>
          <button class="btn func sci-only" data-val="C">C</button>

          <!-- Standard Row 1 -->
          <button class="btn func" data-val="C">C</button>
          <button class="btn func" data-val="CE">CE</button>
          <button class="btn func" data-val="%">%</button>
          <button class="btn op" data-val="/">\xF7</button>

          <!-- Standard Row 2 -->
          <button class="btn" data-val="7">7</button>
          <button class="btn" data-val="8">8</button>
          <button class="btn" data-val="9">9</button>
          <button class="btn op" data-val="*">\xD7</button>

          <!-- Standard Row 3 -->
          <button class="btn" data-val="4">4</button>
          <button class="btn" data-val="5">5</button>
          <button class="btn" data-val="6">6</button>
          <button class="btn op" data-val="-">\u2212</button>

          <!-- Standard Row 4 -->
          <button class="btn" data-val="1">1</button>
          <button class="btn" data-val="2">2</button>
          <button class="btn" data-val="3">3</button>
          <button class="btn op" data-val="+">+</button>

          <!-- Standard Row 5 -->
          <button class="btn func" data-val="+/-">+/-</button>
          <button class="btn zero" data-val="0">0</button>
          <button class="btn" data-val=".">,</button>
          <button class="btn op" data-val="=">=</button>
        </div>
      </div>
    `,this.displayEl=this.shadowRoot.getElementById("display"),this.historyEl=this.shadowRoot.getElementById("history"),this.keypadEl=this.shadowRoot.getElementById("keypad"),this.modeToggleEl=this.shadowRoot.getElementById("mode-toggle")}setupEventListeners(){this.shadowRoot.querySelectorAll(".keypad .btn").forEach(t=>{t.addEventListener("click",e=>{let s=e.target.dataset.val;this.processInput(s)})}),this.shadowRoot.querySelectorAll(".mode-btn").forEach(t=>{t.addEventListener("click",e=>{let s=e.target.dataset.mode;this.setMode(s)})}),this.handleKeyDown=this.handleKeyDown.bind(this),document.addEventListener("keydown",this.handleKeyDown)}handleKeyDown(t){let s={Enter:"=",Escape:"C",Backspace:"CE",",":"."}[t.key]||t.key;["0","1","2","3","4","5","6","7","8","9",".","+","-","*","/","=","C","CE","(",")","^","%"].includes(s)&&(t.preventDefault(),this.processInput(s),this.visualizeKeyPress(s))}visualizeKeyPress(t){let e=this.shadowRoot.querySelector(`.btn[data-val="${t}"]`);e&&(e.style.transform="scale(0.96)",e.style.backgroundColor="var(--btn-bg-active)",setTimeout(()=>{e.style.transform="",e.style.backgroundColor=""},100))}processInput(t){this.logic.handleInput(t),this.updateDisplay()}updateDisplay(){let t=this.logic.getState();if(t.isError)this.displayEl.textContent=t.currentValue,this.displayEl.classList.add("error"),this.historyEl.textContent="";else{this.displayEl.classList.remove("error");let e=t.currentValue.replace(".",",");this.displayEl.textContent=e;let s=t.history.replace(/\*/g,"\xD7").replace(/\//g,"\xF7").replace(/\./g,",");this.historyEl.textContent=s}this.displayEl.textContent.length>10?this.displayEl.style.fontSize="32px":this.displayEl.textContent.length>14?this.displayEl.style.fontSize="24px":this.displayEl.style.fontSize="48px"}setMode(t){if(this.mode!==t){this.mode=t,this.modeToggleEl.className=`mode-toggle ${this.mode==="scientific"?"scientific":""}`,this.shadowRoot.querySelectorAll(".mode-btn").forEach(e=>{e.dataset.mode===this.mode?e.classList.add("active"):e.classList.remove("active")}),this.mode==="scientific"?this.keypadEl.classList.add("scientific-mode"):this.keypadEl.classList.remove("scientific-mode");try{localStorage.setItem(`${this.uniqueId}mode`,this.mode)}catch{}}}};customElements.get("calculator-widget")||customElements.define("calculator-widget",a);
