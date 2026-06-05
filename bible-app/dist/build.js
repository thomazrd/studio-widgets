(function(){var e=`
:host {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  box-sizing: border-box;
  --primary-color: #2c3e50;
  --accent-color: #3498db;
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e0e0e0;
  --header-height: 60px;
}

:host(.dark-theme) {
  --primary-color: #1a1a2e;
  --accent-color: #0f3460;
  --bg-color: #16213e;
  --text-color: #e94560;
  --border-color: #2c3e50;
  color: #e0e0e0;
  background-color: #1a1a1d;
}

*, *::before, *::after {
  box-sizing: inherit;
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 20px;
  background-color: var(--primary-color);
  color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.header h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.header-controls {
  display: flex;
  gap: 10px;
}

select, button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

button {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  transition: background-color 0.2s;
}

button:hover {
  opacity: 0.9;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 250px;
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
  background-color: rgba(0,0,0,0.02);
  position: sticky;
  top: 0;
  z-index: 5;
}

.book-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.book-item {
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.book-item:hover, .book-item.active {
  background-color: rgba(0,0,0,0.05);
  font-weight: 500;
}

:host(.dark-theme) .book-item:hover, :host(.dark-theme) .book-item.active {
  background-color: rgba(255,255,255,0.05);
}

.reader-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.chapter-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.chapter-select {
  padding: 8px;
  font-size: 1rem;
}

.verse {
  display: flex;
  margin-bottom: 12px;
  line-height: 1.6;
  font-size: 1.1rem;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.verse:hover {
  background-color: rgba(0,0,0,0.02);
}

:host(.dark-theme) .verse:hover {
  background-color: rgba(255,255,255,0.02);
}

.verse-num {
  font-size: 0.8em;
  font-weight: bold;
  color: var(--accent-color);
  margin-right: 10px;
  min-width: 25px;
  text-align: right;
  user-select: none;
}

.verse-text {
  flex: 1;
}

.verse-actions {
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  gap: 5px;
}

.verse:hover .verse-actions {
  opacity: 1;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 2px 5px;
  font-size: 1.2rem;
  opacity: 0.6;
}

.icon-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.icon-btn.active {
  color: #f1c40f;
  opacity: 1;
}

.favorites-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background-color: var(--bg-color);
  border-left: 1px solid var(--border-color);
  box-shadow: -2px 0 5px rgba(0,0,0,0.05);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.favorites-panel.open {
  transform: translateX(0);
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-color);
  cursor: pointer;
  padding: 0;
}

.favorites-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  list-style: none;
  margin: 0;
}

.favorite-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.favorite-ref {
  font-weight: bold;
  font-size: 0.9em;
  color: var(--accent-color);
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.favorite-text {
  font-size: 0.9em;
  font-style: italic;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-style: italic;
  color: var(--text-color);
  opacity: 0.7;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .menu-toggle {
    display: block !important;
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  margin-right: 10px;
}

.overlay {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 15;
}

.overlay.active {
  display: block;
}
`,t=`96440838-0fee-4b58-b104-e68dd8e8b9bd`,n=`https://bible-api.com`,r=[{id:`almeida`,name:`João Ferreira de Almeida (Português)`},{id:`web`,name:`World English Bible (English)`},{id:`kjv`,name:`King James Version (English)`},{id:`bbe`,name:`Bible in Basic English (English)`}],i=[{id:`GEN`,name:`Gênesis`,name_en:`Genesis`,chapters:50},{id:`EXO`,name:`Êxodo`,name_en:`Exodus`,chapters:40},{id:`LEV`,name:`Levítico`,name_en:`Leviticus`,chapters:27},{id:`NUM`,name:`Números`,name_en:`Numbers`,chapters:36},{id:`DEU`,name:`Deuteronômio`,name_en:`Deuteronomy`,chapters:34},{id:`JOS`,name:`Josué`,name_en:`Joshua`,chapters:24},{id:`JDG`,name:`Juízes`,name_en:`Judges`,chapters:21},{id:`RUT`,name:`Rute`,name_en:`Ruth`,chapters:4},{id:`1SA`,name:`1 Samuel`,name_en:`1 Samuel`,chapters:31},{id:`2SA`,name:`2 Samuel`,name_en:`2 Samuel`,chapters:24},{id:`1KI`,name:`1 Reis`,name_en:`1 Kings`,chapters:22},{id:`2KI`,name:`2 Reis`,name_en:`2 Kings`,chapters:25},{id:`1CH`,name:`1 Crônicas`,name_en:`1 Chronicles`,chapters:29},{id:`2CH`,name:`2 Crônicas`,name_en:`2 Chronicles`,chapters:36},{id:`EZR`,name:`Esdras`,name_en:`Ezra`,chapters:10},{id:`NEH`,name:`Neemias`,name_en:`Nehemiah`,chapters:13},{id:`EST`,name:`Ester`,name_en:`Esther`,chapters:10},{id:`JOB`,name:`Jó`,name_en:`Job`,chapters:42},{id:`PSA`,name:`Salmos`,name_en:`Psalms`,chapters:150},{id:`PRO`,name:`Provérbios`,name_en:`Proverbs`,chapters:31},{id:`ECC`,name:`Eclesiastes`,name_en:`Ecclesiastes`,chapters:12},{id:`SNG`,name:`Cânticos`,name_en:`Song of Solomon`,chapters:8},{id:`ISA`,name:`Isaías`,name_en:`Isaiah`,chapters:66},{id:`JER`,name:`Jeremias`,name_en:`Jeremiah`,chapters:52},{id:`LAM`,name:`Lamentações`,name_en:`Lamentations`,chapters:5},{id:`EZK`,name:`Ezequiel`,name_en:`Ezekiel`,chapters:48},{id:`DAN`,name:`Daniel`,name_en:`Daniel`,chapters:12},{id:`HOS`,name:`Oséias`,name_en:`Hosea`,chapters:14},{id:`JOL`,name:`Joel`,name_en:`Joel`,chapters:3},{id:`AMO`,name:`Amós`,name_en:`Amos`,chapters:9},{id:`OBA`,name:`Obadias`,name_en:`Obadiah`,chapters:1},{id:`JON`,name:`Jonas`,name_en:`Jonah`,chapters:4},{id:`MIC`,name:`Miquéias`,name_en:`Micah`,chapters:7},{id:`NAM`,name:`Naum`,name_en:`Nahum`,chapters:3},{id:`HAB`,name:`Habacuque`,name_en:`Habakkuk`,chapters:3},{id:`ZEP`,name:`Sofonias`,name_en:`Zephaniah`,chapters:3},{id:`HAG`,name:`Ageu`,name_en:`Haggai`,chapters:2},{id:`ZEC`,name:`Zacarias`,name_en:`Zechariah`,chapters:14},{id:`MAL`,name:`Malaquias`,name_en:`Malachi`,chapters:4},{id:`MAT`,name:`Mateus`,name_en:`Matthew`,chapters:28},{id:`MRK`,name:`Marcos`,name_en:`Mark`,chapters:16},{id:`LUK`,name:`Lucas`,name_en:`Luke`,chapters:24},{id:`JHN`,name:`João`,name_en:`John`,chapters:21},{id:`ACT`,name:`Atos`,name_en:`Acts`,chapters:28},{id:`ROM`,name:`Romanos`,name_en:`Romans`,chapters:16},{id:`1CO`,name:`1 Coríntios`,name_en:`1 Corinthians`,chapters:16},{id:`2CO`,name:`2 Coríntios`,name_en:`2 Corinthians`,chapters:13},{id:`GAL`,name:`Gálatas`,name_en:`Galatians`,chapters:6},{id:`EPH`,name:`Efésios`,name_en:`Ephesians`,chapters:6},{id:`PHP`,name:`Filipenses`,name_en:`Philippians`,chapters:4},{id:`COL`,name:`Colossenses`,name_en:`Colossians`,chapters:4},{id:`1TH`,name:`1 Tessalonicenses`,name_en:`1 Thessalonians`,chapters:5},{id:`2TH`,name:`2 Tessalonicenses`,name_en:`2 Thessalonians`,chapters:3},{id:`1TI`,name:`1 Timóteo`,name_en:`1 Timothy`,chapters:6},{id:`2TI`,name:`2 Timóteo`,name_en:`2 Timothy`,chapters:4},{id:`TIT`,name:`Tito`,name_en:`Titus`,chapters:3},{id:`PHM`,name:`Filemom`,name_en:`Philemon`,chapters:1},{id:`HEB`,name:`Hebreus`,name_en:`Hebrews`,chapters:13},{id:`JAS`,name:`Tiago`,name_en:`James`,chapters:5},{id:`1PE`,name:`1 Pedro`,name_en:`1 Peter`,chapters:5},{id:`2PE`,name:`2 Pedro`,name_en:`2 Peter`,chapters:3},{id:`1JN`,name:`1 João`,name_en:`1 John`,chapters:5},{id:`2JN`,name:`2 João`,name_en:`2 John`,chapters:1},{id:`3JN`,name:`3 João`,name_en:`3 John`,chapters:1},{id:`JUD`,name:`Judas`,name_en:`Jude`,chapters:1},{id:`REV`,name:`Apocalipse`,name_en:`Revelation`,chapters:22}];async function a(e){return i.map(t=>({id:t.name_en,name:e===`almeida`?t.name:t.name_en,chapters:t.chapters}))}async function o(e,t){let n=i.find(e=>e.name_en===t);if(!n)return[];let r=[];for(let e=1;e<=n.chapters;e++)r.push({chapter:e});return r}async function s(e,t,r){try{let i=`${encodeURIComponent(t)}+${r}`,a=await fetch(`${n}/${i}?translation=${e}`);if(!a.ok)throw Error(`Failed to fetch chapter`);return(await a.json()).verses}catch(e){return console.error(`Error fetching chapter:`,e),[]}}function c(e,n){try{localStorage.setItem(`${t}_${e}`,JSON.stringify(n))}catch(e){console.error(`Error saving state`,e)}}function l(e,n){try{let r=localStorage.getItem(`${t}_${e}`);return r?JSON.parse(r):n}catch(e){return console.error(`Error loading state`,e),n}}function u(e){return e.replace(/[&<>'"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,"'":`&#39;`,'"':`&quot;`})[e]||e)}var d=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this.state={translation:l(`translation`,`almeida`),theme:l(`theme`,`light`),favorites:l(`favorites`,[]),currentBook:l(`currentBook`,null),currentChapter:l(`currentChapter`,1),books:[],chapters:[],verses:[],loading:!1,sidebarOpen:!1,favoritesOpen:!1}}connectedCallback(){this.render(),this.applyTheme(),this.setupEventListeners(),this.init()}async init(){this.setLoading(!0),await this.loadBooks(),!this.state.currentBook&&this.state.books&&this.state.books.length>0&&(this.state.currentBook=this.state.books[0].id),this.state.currentBook&&(await this.loadChapters(),await this.loadChapter()),this.setLoading(!1)}setLoading(e){this.state.loading=e;let t=this.shadowRoot.querySelector(`#loading-indicator`);t&&(t.style.display=e?`flex`:`none`);let n=this.shadowRoot.querySelector(`.reader-area`);n&&(e?n.style.opacity=`0.5`:n.style.opacity=`1`)}async loadBooks(){let e=await a(this.state.translation);e&&(this.state.books=e),this.renderSidebar()}async loadChapters(){if(!this.state.currentBook)return;let e=await o(this.state.translation,this.state.currentBook);e&&(this.state.chapters=e),this.renderChapterNav()}async loadChapter(){if(!this.state.currentBook||!this.state.currentChapter)return;let e=await s(this.state.translation,this.state.currentBook,this.state.currentChapter);e&&(this.state.verses=e),this.renderVerses(),c(`currentBook`,this.state.currentBook),c(`currentChapter`,this.state.currentChapter)}async changeTranslation(e){this.state.translation=e,c(`translation`,e),await this.loadBooks(),this.setLoading(!0),await this.loadChapter(),this.setLoading(!1)}async selectBook(e){this.state.currentBook=e,this.state.currentChapter=1,this.state.sidebarOpen=!1,this.updateOverlay(),this.renderSidebar(),this.setLoading(!0),await this.loadChapters(),await this.loadChapter(),this.setLoading(!1)}async selectChapter(e){this.state.currentChapter=parseInt(e),this.setLoading(!0),await this.loadChapter(),this.setLoading(!1),this.renderChapterNav()}toggleFavorite(e){if(this.isFavorite(this.state.currentBook,e.chapter,e.verse))this.state.favorites=this.state.favorites.filter(t=>!(t.book_id===this.state.currentBook&&t.chapter===e.chapter&&t.verse===e.verse));else{let t=this.state.books.find(e=>e.id===this.state.currentBook)?.name||this.state.currentBook;this.state.favorites.push({...e,book_id:this.state.currentBook,book_name:t,translation:this.state.translation})}c(`favorites`,this.state.favorites),this.renderVerses(),this.renderFavorites()}isFavorite(e,t,n){return this.state.favorites.some(r=>r.book_id===e&&r.chapter===t&&r.verse===n)}removeFavorite(e){this.state.favorites.splice(e,1),c(`favorites`,this.state.favorites),this.renderFavorites(),this.renderVerses()}toggleTheme(){this.state.theme=this.state.theme===`light`?`dark`:`light`,c(`theme`,this.state.theme),this.applyTheme()}applyTheme(){this.state.theme===`dark`?this.classList.add(`dark-theme`):this.classList.remove(`dark-theme`)}toggleSidebar(){this.state.sidebarOpen=!this.state.sidebarOpen;let e=this.shadowRoot.querySelector(`.sidebar`);this.state.sidebarOpen?e.classList.add(`open`):e.classList.remove(`open`),this.updateOverlay()}toggleFavoritesPanel(){this.state.favoritesOpen=!this.state.favoritesOpen;let e=this.shadowRoot.querySelector(`.favorites-panel`);this.state.favoritesOpen?(e.classList.add(`open`),this.renderFavorites()):e.classList.remove(`open`),this.updateOverlay()}updateOverlay(){let e=this.shadowRoot.querySelector(`.overlay`);this.state.sidebarOpen||this.state.favoritesOpen?e.classList.add(`active`):(e.classList.remove(`active`),this.shadowRoot.querySelector(`.sidebar`).classList.remove(`open`),this.shadowRoot.querySelector(`.favorites-panel`).classList.remove(`open`),this.state.sidebarOpen=!1,this.state.favoritesOpen=!1)}setupEventListeners(){let e=this.shadowRoot;e.querySelector(`#translation-select`).addEventListener(`change`,e=>{this.changeTranslation(e.target.value)}),e.querySelector(`#theme-toggle`).addEventListener(`click`,()=>{this.toggleTheme()}),e.querySelector(`#menu-btn`).addEventListener(`click`,()=>{this.toggleSidebar()}),e.querySelector(`#favorites-btn`).addEventListener(`click`,()=>{this.toggleFavoritesPanel()}),e.querySelector(`#close-favorites`).addEventListener(`click`,()=>{this.toggleFavoritesPanel()}),e.querySelector(`.overlay`).addEventListener(`click`,()=>{this.updateOverlay()}),e.querySelector(`.reader-area`).addEventListener(`click`,e=>{let t=e.target.closest(`#prev-chapter`),n=e.target.closest(`#next-chapter`);t&&this.state.currentChapter>1?this.selectChapter(this.state.currentChapter-1):n&&this.state.currentChapter<this.state.chapters.length&&this.selectChapter(this.state.currentChapter+1)}),e.querySelector(`.reader-area`).addEventListener(`change`,e=>{e.target.id===`chapter-select`&&this.selectChapter(e.target.value)})}renderSidebar(){let e=this.shadowRoot.querySelector(`.book-list`);e&&(e.innerHTML=``,this.state.books&&this.state.books.length>0&&this.state.books.forEach(t=>{let n=document.createElement(`li`);n.className=`book-item ${t.id===this.state.currentBook?`active`:``}`,n.textContent=t.name,n.addEventListener(`click`,()=>this.selectBook(t.id)),e.appendChild(n)}))}renderChapterNav(){let e=this.shadowRoot.querySelector(`.reader-area`);if(!e)return;let t=e.querySelector(`.chapter-nav`);if(!this.state.currentBook||!this.state.chapters||this.state.chapters.length===0){t&&t.remove();return}let n=`
      <div class="chapter-nav">
        <button id="prev-chapter" ${this.state.currentChapter<=1?`disabled style="opacity:0.5;cursor:not-allowed;"`:``}>&larr; Anterior</button>
        <select id="chapter-select" class="chapter-select">
          ${this.state.chapters.map(e=>`<option value="${e.chapter}" ${e.chapter===this.state.currentChapter?`selected`:``}>Capítulo ${e.chapter}</option>`).join(``)}
        </select>
        <button id="next-chapter" ${this.state.currentChapter>=this.state.chapters.length?`disabled style="opacity:0.5;cursor:not-allowed;"`:``}>Próximo &rarr;</button>
      </div>
    `;t?t.outerHTML=n:e.insertAdjacentHTML(`afterbegin`,n)}renderVerses(){let e=this.shadowRoot.querySelector(`.reader-area`);if(!e)return;e.querySelectorAll(`.verse`).forEach(e=>e.remove());let t=e.querySelector(`.no-results`);t&&t.remove();let n=document.createElement(`div`);if(this.state.verses&&this.state.verses.length>0)this.state.verses.forEach(e=>{let t=this.isFavorite(this.state.currentBook,e.chapter,e.verse),r=document.createElement(`div`);r.className=`verse`;let i=document.createElement(`div`);i.className=`verse-num`,i.textContent=e.verse;let a=document.createElement(`div`);a.className=`verse-text`,a.textContent=e.text;let o=document.createElement(`div`);o.className=`verse-actions`;let s=document.createElement(`button`);s.className=`icon-btn fav-btn ${t?`active`:``}`,s.title=`Favoritar`,s.textContent=t?`★`:`☆`,s.addEventListener(`click`,()=>this.toggleFavorite(e)),o.appendChild(s),r.appendChild(i),r.appendChild(a),r.appendChild(o),n.appendChild(r)}),e.appendChild(n);else{let t=document.createElement(`div`);t.className=`no-results`,t.style.cssText=`padding: 20px; text-align: center; font-style: italic; opacity: 0.7;`,t.textContent=`Nenhum versículo encontrado.`,e.appendChild(t)}this.renderChapterNav(),e.scrollTop=0}renderFavorites(){let e=this.shadowRoot.querySelector(`.favorites-list`);if(e){if(e.innerHTML=``,this.state.favorites.length===0){let t=document.createElement(`li`);t.style.cssText=`padding:15px;text-align:center;opacity:0.7;`,t.textContent=`Nenhum versículo salvo ainda.`,e.appendChild(t);return}this.state.favorites.forEach((t,n)=>{let r=document.createElement(`li`);r.className=`favorite-item`;let i=document.createElement(`div`);i.className=`favorite-ref`;let a=document.createElement(`span`);a.textContent=`${t.book_name} ${t.chapter}:${t.verse} `;let o=document.createElement(`span`);o.style.cssText=`font-size:0.8em;opacity:0.7`,o.textContent=`(${t.translation.toUpperCase()})`,a.appendChild(o);let s=document.createElement(`button`);s.className=`icon-btn`,s.title=`Remover`,s.textContent=`✕`,s.addEventListener(`click`,()=>this.removeFavorite(n)),i.appendChild(a),i.appendChild(s);let c=document.createElement(`div`);c.className=`favorite-text`,c.textContent=`"${t.text.trim()}"`,r.appendChild(i),r.appendChild(c),e.appendChild(r)})}}render(){let t=r.map(e=>`<option value="${u(e.id)}" ${e.id===this.state.translation?`selected`:``}>${u(e.name)}</option>`).join(``);this.shadowRoot.innerHTML=`
      <style>${e}</style>
      <div class="app-container">
        <header class="header">
          <div style="display:flex;align-items:center;">
            <button id="menu-btn" class="menu-toggle">☰</button>
            <h1>Bíblia Sagrada</h1>
          </div>
          <div class="header-controls">
            <select id="translation-select">
              ${t}
            </select>
            <button id="favorites-btn" title="Favoritos">★</button>
            <button id="theme-toggle" title="Alternar Tema">🌓</button>
          </div>
        </header>

        <div id="loading-indicator" class="loader" style="display: none; position: absolute; top: var(--header-height); left: 0; right: 0; bottom: 0; background: rgba(255,255,255, 0.8); z-index: 100; justify-content: center; align-items: center; font-size: 1.2rem;">Carregando...</div>

        <div class="main-content">
          <aside class="sidebar">
            <div class="sidebar-header">Livros</div>
            <ul class="book-list"></ul>
          </aside>

          <main class="reader-area">
            <!-- Chapter nav and verses will be injected here -->
          </main>

          <aside class="favorites-panel">
            <div class="favorites-header">
              Meus Favoritos
              <button id="close-favorites" class="close-btn">×</button>
            </div>
            <ul class="favorites-list"></ul>
          </aside>

          <div class="overlay"></div>
        </div>
      </div>
    `}};customElements.define(`bible-app-widget`,d)})();