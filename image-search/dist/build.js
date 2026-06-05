(function(){"use strict";const n=[{id:"1",title:"Mountain Landscape",tags:["nature","mountain","landscape","snow"],url:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400"},{id:"2",title:"Serene Beach",tags:["nature","beach","ocean","water","summer"],url:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400"},{id:"3",title:"City Skyline Night",tags:["city","urban","night","architecture","lights"],url:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400"},{id:"4",title:"Minimalist Desk Workspace",tags:["technology","office","desk","computer","minimal"],url:"https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=400"},{id:"5",title:"Coffee Art",tags:["food","coffee","cafe","drink","morning"],url:"https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400"},{id:"6",title:"Forest Path",tags:["nature","forest","trees","path","green"],url:"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400"},{id:"7",title:"Abstract Architecture",tags:["architecture","abstract","building","modern","design"],url:"https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400"},{id:"8",title:"Vintage Car",tags:["car","vehicle","vintage","transportation","retro"],url:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=400"},{id:"9",title:"Fresh Vegetables",tags:["food","healthy","vegetables","fresh","market"],url:"https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=400"},{id:"10",title:"Starlight Sky",tags:["nature","space","stars","night","sky"],url:"https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&q=80&w=400"},{id:"11",title:"Cozy Reading Corner",tags:["home","interior","books","reading","cozy"],url:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"},{id:"12",title:"Neon City Streets",tags:["city","urban","neon","night","street"],url:"https://images.unsplash.com/photo-1555679427-1f6dfcce943b?auto=format&fit=crop&q=80&w=1200",thumbnail:"https://images.unsplash.com/photo-1555679427-1f6dfcce943b?auto=format&fit=crop&q=80&w=400"}],a="24c10110-0bb8-4585-8d71-1dd0c04e638b-last-search",s=document.createElement("template");s.innerHTML=`
<style>
  :host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    background-color: #f9f9fb;
    box-sizing: border-box;
    overflow-y: auto;
  }

  * {
    box-sizing: border-box;
  }

  .container {
    width: 100%;
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .header {
    margin-bottom: 24px;
    text-align: center;
  }

  .header h1 {
    margin: 0 0 16px 0;
    font-size: 28px;
    font-weight: 600;
    color: #1d1d1f;
  }

  .search-container {
    max-width: 600px;
    margin: 0 auto;
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 16px 20px 16px 48px;
    font-size: 16px;
    border: none;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    outline: none;
    color: #1d1d1f;
  }

  .search-input:focus {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #86868b;
    width: 20px;
    height: 20px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    width: 100%;
  }

  .card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    position: relative;
    aspect-ratio: 4/3;
  }

  .card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .card:hover img {
    transform: scale(1.05);
  }

  .card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card:hover .card-overlay {
    opacity: 1;
  }

  .card-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  .card-tags {
    margin-top: 4px;
    font-size: 12px;
    color: rgba(255,255,255,0.8);
  }

  .no-results {
    text-align: center;
    padding: 40px;
    color: #86868b;
    font-size: 18px;
    grid-column: 1 / -1;
  }

  /* Lightbox */
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .lightbox.active {
    opacity: 1;
    pointer-events: all;
  }

  .lightbox img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    transform: scale(0.95);
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .lightbox.active img {
    transform: scale(1);
  }

  .lightbox-close {
    position: absolute;
    top: 20px;
    right: 30px;
    color: white;
    font-size: 40px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 10px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .lightbox-close:hover {
    opacity: 1;
  }

  .lightbox-info {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: white;
    background: rgba(0,0,0,0.5);
    padding: 12px 24px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .lightbox-title {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .container {
      padding: 16px;
    }
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    }
  }
</style>

<div class="container">
  <div class="header">
    <h1>Image Search</h1>
    <div class="search-container">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" class="search-input" placeholder="Search by title or tags..." />
    </div>
  </div>

  <div class="grid" id="image-grid"></div>
</div>

<div class="lightbox" id="lightbox">
  <button class="lightbox-close" id="lightbox-close">&times;</button>
  <img id="lightbox-img" src="" alt="Full size" />
  <div class="lightbox-info">
    <p class="lightbox-title" id="lightbox-title"></p>
  </div>
</div>
`;class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(s.content.cloneNode(!0)),this.searchInput=this.shadowRoot.querySelector(".search-input"),this.grid=this.shadowRoot.getElementById("image-grid"),this.lightbox=this.shadowRoot.getElementById("lightbox"),this.lightboxImg=this.shadowRoot.getElementById("lightbox-img"),this.lightboxTitle=this.shadowRoot.getElementById("lightbox-title"),this.lightboxCloseBtn=this.shadowRoot.getElementById("lightbox-close"),this.images=n,this.debounceTimeout=null}connectedCallback(){this.setupEventListeners(),this.loadLastSearch()}setupEventListeners(){this.searchInput.addEventListener("input",t=>{clearTimeout(this.debounceTimeout);const o=(t.target.value||"").trim();this.debounceTimeout=setTimeout(()=>{this.saveSearchTerm(o),this.renderImages(o)},300)}),this.lightboxCloseBtn.addEventListener("click",()=>this.closeLightbox()),this.lightbox.addEventListener("click",t=>{t.target===this.lightbox&&this.closeLightbox()}),this._handleKeyDown=t=>{t.key==="Escape"&&this.lightbox.classList.contains("active")&&this.closeLightbox()},document.addEventListener("keydown",this._handleKeyDown)}disconnectedCallback(){document.removeEventListener("keydown",this._handleKeyDown)}loadLastSearch(){const t=localStorage.getItem(a)||"";this.searchInput.value=t,this.renderImages(t)}saveSearchTerm(t){try{localStorage.setItem(a,t)}catch(o){console.warn("Could not save to localStorage",o)}}renderImages(t=""){const o=t.toLowerCase(),r=this.images.filter(e=>e.title.toLowerCase().includes(o)||e.tags.some(i=>i.toLowerCase().includes(o)));if(this.grid.innerHTML="",r.length===0){this.grid.innerHTML='<div class="no-results">No images found for your search.</div>';return}r.forEach(e=>{const i=document.createElement("div");i.className="card",i.innerHTML=`
        <img src="${e.thumbnail}" alt="${e.title}" loading="lazy" />
        <div class="card-overlay">
          <p class="card-title">${e.title}</p>
          <p class="card-tags">${e.tags.join(", ")}</p>
        </div>
      `,i.addEventListener("click",()=>this.openLightbox(e)),this.grid.appendChild(i)})}openLightbox(t){this.lightboxImg.src=t.url,this.lightboxImg.alt=t.title,this.lightboxTitle.textContent=t.title,this.lightbox.classList.add("active")}closeLightbox(){this.lightbox.classList.remove("active"),setTimeout(()=>{this.lightboxImg.src=""},300)}}customElements.define("image-search-widget",c)})();
