import { images } from './data.js';

const WIDGET_ID = '24c10110-0bb8-4585-8d71-1dd0c04e638b';
const STORAGE_KEY = `${WIDGET_ID}-last-search`;

const template = document.createElement('template');
template.innerHTML = `
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
`;

class ImageSearchWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.searchInput = this.shadowRoot.querySelector('.search-input');
    this.grid = this.shadowRoot.getElementById('image-grid');
    this.lightbox = this.shadowRoot.getElementById('lightbox');
    this.lightboxImg = this.shadowRoot.getElementById('lightbox-img');
    this.lightboxTitle = this.shadowRoot.getElementById('lightbox-title');
    this.lightboxCloseBtn = this.shadowRoot.getElementById('lightbox-close');

    this.images = images;
    this.debounceTimeout = null;
  }

  connectedCallback() {
    this.setupEventListeners();
    this.loadLastSearch();
  }

  setupEventListeners() {
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimeout);
      const term = (e.target.value || '').trim();
      this.debounceTimeout = setTimeout(() => {
        this.saveSearchTerm(term);
        this.renderImages(term);
      }, 300);
    });

    this.lightboxCloseBtn.addEventListener('click', () => this.closeLightbox());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.closeLightbox();
    });

    // Add escape key support for closing lightbox
    // We attach this to the document so it works even if widget isn't focused
    this._handleKeyDown = (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.closeLightbox();
      }
    };
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  loadLastSearch() {
    const lastSearch = localStorage.getItem(STORAGE_KEY) || '';
    this.searchInput.value = lastSearch;
    this.renderImages(lastSearch);
  }

  saveSearchTerm(term) {
    try {
      localStorage.setItem(STORAGE_KEY, term);
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  renderImages(searchTerm = '') {
    const lowerTerm = searchTerm.toLowerCase();
    const filteredImages = this.images.filter(img => {
      return img.title.toLowerCase().includes(lowerTerm) ||
             img.tags.some(tag => tag.toLowerCase().includes(lowerTerm));
    });

    this.grid.innerHTML = '';

    if (filteredImages.length === 0) {
      this.grid.innerHTML = '<div class="no-results">No images found for your search.</div>';
      return;
    }

    filteredImages.forEach(img => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${img.thumbnail}" alt="${img.title}" loading="lazy" />
        <div class="card-overlay">
          <p class="card-title">${img.title}</p>
          <p class="card-tags">${img.tags.join(', ')}</p>
        </div>
      `;

      card.addEventListener('click', () => this.openLightbox(img));
      this.grid.appendChild(card);
    });
  }

  openLightbox(img) {
    this.lightboxImg.src = img.url;
    this.lightboxImg.alt = img.title;
    this.lightboxTitle.textContent = img.title;
    this.lightbox.classList.add('active');
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    setTimeout(() => {
      this.lightboxImg.src = '';
    }, 300); // Clear after transition
  }
}

customElements.define('image-search-widget', ImageSearchWidget);
