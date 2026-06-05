import { styles } from './css.js';
import { TRANSLATIONS } from './constants.js';
import { fetchBooks, fetchChapters, fetchChapter } from './api.js';
import { saveState, loadState } from './storage.js';

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

class BibleAppWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // State
    this.state = {
      translation: loadState('translation', 'almeida'),
      theme: loadState('theme', 'light'),
      favorites: loadState('favorites', []),
      currentBook: loadState('currentBook', null),
      currentChapter: loadState('currentChapter', 1),
      books: [],
      chapters: [],
      verses: [],
      loading: false,
      sidebarOpen: false,
      favoritesOpen: false
    };
  }

  connectedCallback() {
    this.render();
    this.applyTheme();
    this.setupEventListeners();
    this.init();
  }

  async init() {
    this.setLoading(true);
    await this.loadBooks();

    if (!this.state.currentBook && this.state.books && this.state.books.length > 0) {
      this.state.currentBook = this.state.books[0].id;
    }

    if (this.state.currentBook) {
      await this.loadChapters();
      await this.loadChapter();
    }
    this.setLoading(false);
  }

  setLoading(isLoading) {
    this.state.loading = isLoading;
    const loader = this.shadowRoot.querySelector('#loading-indicator');
    if (loader) {
      loader.style.display = isLoading ? 'flex' : 'none';
    }
    const readerArea = this.shadowRoot.querySelector('.reader-area');
    if (readerArea) {
      if (isLoading) {
        readerArea.style.opacity = '0.5';
      } else {
        readerArea.style.opacity = '1';
      }
    }
  }

  async loadBooks() {
    const books = await fetchBooks(this.state.translation);
    if (books) {
      this.state.books = books;
    }
    this.renderSidebar();
  }

  async loadChapters() {
    if (!this.state.currentBook) return;
    const chapters = await fetchChapters(this.state.translation, this.state.currentBook);
    if (chapters) {
      this.state.chapters = chapters;
    }
    this.renderChapterNav();
  }

  async loadChapter() {
    if (!this.state.currentBook || !this.state.currentChapter) return;
    const verses = await fetchChapter(this.state.translation, this.state.currentBook, this.state.currentChapter);
    if (verses) {
      this.state.verses = verses;
    }
    this.renderVerses();

    // Save current location
    saveState('currentBook', this.state.currentBook);
    saveState('currentChapter', this.state.currentChapter);
  }

  async changeTranslation(translationId) {
    this.state.translation = translationId;
    saveState('translation', translationId);

    // Reload books to update names to correct language
    await this.loadBooks();

    this.setLoading(true);
    await this.loadChapter();
    this.setLoading(false);
  }

  async selectBook(bookId) {
    this.state.currentBook = bookId;
    this.state.currentChapter = 1;
    this.state.sidebarOpen = false;
    this.updateOverlay();

    // Re-render sidebar to update active state
    this.renderSidebar();

    this.setLoading(true);
    await this.loadChapters();
    await this.loadChapter();
    this.setLoading(false);
  }

  async selectChapter(chapterNum) {
    this.state.currentChapter = parseInt(chapterNum);
    this.setLoading(true);
    await this.loadChapter();
    this.setLoading(false);
    this.renderChapterNav(); // Update select value and buttons
  }

  toggleFavorite(verse) {
    const isFavorite = this.isFavorite(this.state.currentBook, verse.chapter, verse.verse);

    if (isFavorite) {
      this.state.favorites = this.state.favorites.filter(
        f => !(f.book_id === this.state.currentBook && f.chapter === verse.chapter && f.verse === verse.verse)
      );
    } else {
      const bookName = this.state.books.find(b => b.id === this.state.currentBook)?.name || this.state.currentBook;
      this.state.favorites.push({
        ...verse,
        book_id: this.state.currentBook,
        book_name: bookName,
        translation: this.state.translation
      });
    }

    saveState('favorites', this.state.favorites);
    this.renderVerses(); // Re-render to update heart icons
    this.renderFavorites();
  }

  isFavorite(bookId, chapter, verseNum) {
    return this.state.favorites.some(
      f => f.book_id === bookId && f.chapter === chapter && f.verse === verseNum
    );
  }

  removeFavorite(index) {
    this.state.favorites.splice(index, 1);
    saveState('favorites', this.state.favorites);
    this.renderFavorites();
    this.renderVerses();
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    saveState('theme', this.state.theme);
    this.applyTheme();
  }

  applyTheme() {
    if (this.state.theme === 'dark') {
      this.classList.add('dark-theme');
    } else {
      this.classList.remove('dark-theme');
    }
  }

  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
    const sidebar = this.shadowRoot.querySelector('.sidebar');
    if (this.state.sidebarOpen) {
      sidebar.classList.add('open');
    } else {
      sidebar.classList.remove('open');
    }
    this.updateOverlay();
  }

  toggleFavoritesPanel() {
    this.state.favoritesOpen = !this.state.favoritesOpen;
    const panel = this.shadowRoot.querySelector('.favorites-panel');
    if (this.state.favoritesOpen) {
      panel.classList.add('open');
      this.renderFavorites();
    } else {
      panel.classList.remove('open');
    }
    this.updateOverlay();
  }

  updateOverlay() {
    const overlay = this.shadowRoot.querySelector('.overlay');
    if (this.state.sidebarOpen || this.state.favoritesOpen) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
      this.shadowRoot.querySelector('.sidebar').classList.remove('open');
      this.shadowRoot.querySelector('.favorites-panel').classList.remove('open');
      this.state.sidebarOpen = false;
      this.state.favoritesOpen = false;
    }
  }

  setupEventListeners() {
    const sr = this.shadowRoot;

    sr.querySelector('#translation-select').addEventListener('change', (e) => {
      this.changeTranslation(e.target.value);
    });

    sr.querySelector('#theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    sr.querySelector('#menu-btn').addEventListener('click', () => {
      this.toggleSidebar();
    });

    sr.querySelector('#favorites-btn').addEventListener('click', () => {
      this.toggleFavoritesPanel();
    });

    sr.querySelector('#close-favorites').addEventListener('click', () => {
      this.toggleFavoritesPanel();
    });

    sr.querySelector('.overlay').addEventListener('click', () => {
      this.updateOverlay();
    });

    // Delegated event listener for chapter navigation
    sr.querySelector('.reader-area').addEventListener('click', (e) => {
      const prevBtn = e.target.closest('#prev-chapter');
      const nextBtn = e.target.closest('#next-chapter');

      if (prevBtn && this.state.currentChapter > 1) {
        this.selectChapter(this.state.currentChapter - 1);
      } else if (nextBtn && this.state.currentChapter < this.state.chapters.length) {
        this.selectChapter(this.state.currentChapter + 1);
      }
    });

    sr.querySelector('.reader-area').addEventListener('change', (e) => {
      if (e.target.id === 'chapter-select') {
        this.selectChapter(e.target.value);
      }
    });
  }

  renderSidebar() {
    const bookList = this.shadowRoot.querySelector('.book-list');
    if (!bookList) return;
    bookList.innerHTML = '';

    if (this.state.books && this.state.books.length > 0) {
      this.state.books.forEach(book => {
        const li = document.createElement('li');
        li.className = `book-item ${book.id === this.state.currentBook ? 'active' : ''}`;
        li.textContent = book.name;
        li.addEventListener('click', () => this.selectBook(book.id));
        bookList.appendChild(li);
      });
    }
  }

  renderChapterNav() {
    const readerArea = this.shadowRoot.querySelector('.reader-area');
    if (!readerArea) return;

    let existingNav = readerArea.querySelector('.chapter-nav');

    if (!this.state.currentBook || !this.state.chapters || this.state.chapters.length === 0) {
      if (existingNav) existingNav.remove();
      return;
    }

    const navHtml = `
      <div class="chapter-nav">
        <button id="prev-chapter" ${this.state.currentChapter <= 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>&larr; Anterior</button>
        <select id="chapter-select" class="chapter-select">
          ${this.state.chapters.map(c => `<option value="${c.chapter}" ${c.chapter === this.state.currentChapter ? 'selected' : ''}>Capítulo ${c.chapter}</option>`).join('')}
        </select>
        <button id="next-chapter" ${this.state.currentChapter >= this.state.chapters.length ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>Próximo &rarr;</button>
      </div>
    `;

    if (existingNav) {
      existingNav.outerHTML = navHtml;
    } else {
      readerArea.insertAdjacentHTML('afterbegin', navHtml);
    }
  }

  renderVerses() {
    const readerArea = this.shadowRoot.querySelector('.reader-area');
    if (!readerArea) return;

    // Clear existing verses but keep nav
    const existingVerses = readerArea.querySelectorAll('.verse');
    existingVerses.forEach(v => v.remove());

    // Remove no-results if exists
    const noResults = readerArea.querySelector('.no-results');
    if (noResults) noResults.remove();

    const versesContainer = document.createElement('div');

    if (this.state.verses && this.state.verses.length > 0) {
      this.state.verses.forEach(verse => {
        const isFav = this.isFavorite(this.state.currentBook, verse.chapter, verse.verse);

        const verseEl = document.createElement('div');
        verseEl.className = 'verse';

        const numDiv = document.createElement('div');
        numDiv.className = 'verse-num';
        numDiv.textContent = verse.verse;

        const textDiv = document.createElement('div');
        textDiv.className = 'verse-text';
        textDiv.textContent = verse.text;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'verse-actions';

        const favBtn = document.createElement('button');
        favBtn.className = `icon-btn fav-btn ${isFav ? 'active' : ''}`;
        favBtn.title = 'Favoritar';
        favBtn.textContent = isFav ? '★' : '☆';
        favBtn.addEventListener('click', () => this.toggleFavorite(verse));

        actionsDiv.appendChild(favBtn);

        verseEl.appendChild(numDiv);
        verseEl.appendChild(textDiv);
        verseEl.appendChild(actionsDiv);

        versesContainer.appendChild(verseEl);
      });
      readerArea.appendChild(versesContainer);
    } else {
       const emptyDiv = document.createElement('div');
       emptyDiv.className = 'no-results';
       emptyDiv.style.cssText = 'padding: 20px; text-align: center; font-style: italic; opacity: 0.7;';
       emptyDiv.textContent = 'Nenhum versículo encontrado.';
       readerArea.appendChild(emptyDiv);
    }

    // Ensure nav is at the top
    this.renderChapterNav();

    // Scroll to top
    readerArea.scrollTop = 0;
  }

  renderFavorites() {
    const list = this.shadowRoot.querySelector('.favorites-list');
    if (!list) return;
    list.innerHTML = '';

    if (this.state.favorites.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.style.cssText = 'padding:15px;text-align:center;opacity:0.7;';
      emptyLi.textContent = 'Nenhum versículo salvo ainda.';
      list.appendChild(emptyLi);
      return;
    }

    this.state.favorites.forEach((fav, index) => {
      const li = document.createElement('li');
      li.className = 'favorite-item';

      const refDiv = document.createElement('div');
      refDiv.className = 'favorite-ref';

      const refText = document.createElement('span');
      refText.textContent = `${fav.book_name} ${fav.chapter}:${fav.verse} `;

      const transSpan = document.createElement('span');
      transSpan.style.cssText = 'font-size:0.8em;opacity:0.7';
      transSpan.textContent = `(${fav.translation.toUpperCase()})`;
      refText.appendChild(transSpan);

      const rmBtn = document.createElement('button');
      rmBtn.className = 'icon-btn';
      rmBtn.title = 'Remover';
      rmBtn.textContent = '✕';
      rmBtn.addEventListener('click', () => this.removeFavorite(index));

      refDiv.appendChild(refText);
      refDiv.appendChild(rmBtn);

      const textDiv = document.createElement('div');
      textDiv.className = 'favorite-text';
      textDiv.textContent = `"${fav.text.trim()}"`;

      li.appendChild(refDiv);
      li.appendChild(textDiv);
      list.appendChild(li);
    });
  }

  render() {
    const translationOptions = TRANSLATIONS.map(t =>
      `<option value="${escapeHTML(t.id)}" ${t.id === this.state.translation ? 'selected' : ''}>${escapeHTML(t.name)}</option>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="app-container">
        <header class="header">
          <div style="display:flex;align-items:center;">
            <button id="menu-btn" class="menu-toggle">☰</button>
            <h1>Bíblia Sagrada</h1>
          </div>
          <div class="header-controls">
            <select id="translation-select">
              ${translationOptions}
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
    `;
  }
}

customElements.define('bible-app-widget', BibleAppWidget);
