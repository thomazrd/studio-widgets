import { getNotes, createNote, updateNote, deleteNote } from './store.js';
import DOMPurify from 'dompurify';
import { SquarePen, Trash2, Bold, Italic, Underline, List } from 'lucide';

class MacOSNotes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.notes = [];
    this.selectedNoteId = null;
    this.searchQuery = '';
    this.saveTimeout = null;
  }

  connectedCallback() {
    this.render();
    this.loadNotes();
    this.setupEventListeners();
  }

  loadNotes() {
    this.notes = getNotes();
    if (this.notes.length > 0 && !this.selectedNoteId) {
      this.selectedNoteId = this.notes[0].id;
    }
    this.renderNotesList();
    this.loadSelectedNote();
  }

  setupEventListeners() {
    const searchInput = this.shadowRoot.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderNotesList();
    });

    const newNoteBtn = this.shadowRoot.querySelector('#new-note-btn');
    newNoteBtn.addEventListener('click', () => {
      const newNote = createNote({ title: 'New Note', content: '' });
      this.notes = getNotes();
      this.selectedNoteId = newNote.id;
      this.searchQuery = '';
      this.shadowRoot.querySelector('.search-input').value = '';
      this.renderNotesList();
      this.loadSelectedNote();
      this.shadowRoot.querySelector('.editor-area').focus();
    });

    const deleteBtn = this.shadowRoot.querySelector('#delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (this.selectedNoteId) {
        deleteNote(this.selectedNoteId);
        this.notes = getNotes();
        this.selectedNoteId = this.notes.length > 0 ? this.notes[0].id : null;
        this.renderNotesList();
        this.loadSelectedNote();
      }
    });

    const editorArea = this.shadowRoot.querySelector('.editor-area');
    editorArea.addEventListener('input', () => {
      if (this.selectedNoteId) {
        const content = editorArea.innerHTML;
        // Extract plain text preserving visual line breaks
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = DOMPurify.sanitize(content);

        // Convert block elements and BRs to newlines for text extraction
        const htmlToText = (node) => {
            let text = '';
            for (const child of node.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    text += child.textContent;
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    const nodeName = child.nodeName.toLowerCase();
                    if (nodeName === 'br') {
                        text += '\n';
                    } else if (nodeName === 'div' || nodeName === 'p' || nodeName === 'li') {
                        if (text.length > 0 && !text.endsWith('\n')) text += '\n';
                        text += htmlToText(child);
                        if (!text.endsWith('\n')) text += '\n';
                    } else {
                        text += htmlToText(child);
                    }
                }
            }
            return text;
        };

        const textContent = htmlToText(tempDiv);
        const lines = textContent.split('\n').map(l => l.trim()).filter(l => l);

        const title = lines.length > 0 ? lines[0] : 'New Note';

        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          updateNote(this.selectedNoteId, { title, content });
          this.notes = getNotes();
          this.renderNotesList();
        }, 500); // Debounce save
      }
    });

    // Formatting buttons
    const formatButtons = [
      { id: 'bold-btn', command: 'bold' },
      { id: 'italic-btn', command: 'italic' },
      { id: 'underline-btn', command: 'underline' },
      { id: 'list-btn', command: 'insertUnorderedList' }
    ];

    formatButtons.forEach(btn => {
      const el = this.shadowRoot.querySelector(`#${btn.id}`);
      if (el) {
        el.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent losing focus from editor
          document.execCommand(btn.command, false, null);
          editorArea.focus();
        });
      }
    });

    // Prevent default mousedown to keep focus in editor when clicking toolbar
    this.shadowRoot.querySelector('.toolbar').addEventListener('mousedown', (e) => {
        if(e.target.closest('.icon-button')) {
            e.preventDefault();
        }
    });
  }

  loadSelectedNote() {
    const editorArea = this.shadowRoot.querySelector('.editor-area');
    if (this.selectedNoteId) {
      const note = this.notes.find(n => n.id === this.selectedNoteId);
      if (note) {
        editorArea.innerHTML = DOMPurify.sanitize(note.content);
        editorArea.contentEditable = 'true';
      } else {
        editorArea.innerHTML = '';
        editorArea.contentEditable = 'false';
      }
    } else {
      editorArea.innerHTML = '';
      editorArea.contentEditable = 'false';
    }
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  }

  renderNotesList() {
    const listContainer = this.shadowRoot.querySelector('.notes-list');
    listContainer.innerHTML = '';

    const filteredNotes = this.notes.filter(note =>
      note.title.toLowerCase().includes(this.searchQuery) ||
      (note.content && note.content.toLowerCase().includes(this.searchQuery))
    );

    filteredNotes.forEach(note => {
      const item = document.createElement('div');
      item.className = `note-item ${note.id === this.selectedNoteId ? 'selected' : ''}`;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = DOMPurify.sanitize(note.content);

      const htmlToText = (node) => {
          let text = '';
          for (const child of node.childNodes) {
              if (child.nodeType === Node.TEXT_NODE) {
                  text += child.textContent;
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                  const nodeName = child.nodeName.toLowerCase();
                  if (nodeName === 'br') {
                      text += '\n';
                  } else if (nodeName === 'div' || nodeName === 'p' || nodeName === 'li') {
                      if (text.length > 0 && !text.endsWith('\n')) text += '\n';
                      text += htmlToText(child);
                      if (!text.endsWith('\n')) text += '\n';
                  } else {
                      text += htmlToText(child);
                  }
              }
          }
          return text;
      };

      const textContent = htmlToText(tempDiv);
      const lines = textContent.split('\n').map(l => l.trim()).filter(l => l);

      let previewText = 'No additional text';
      if (lines.length > 1) {
          previewText = lines.slice(1).join(' ').trim();
      } else if (lines.length === 1 && lines[0] !== note.title) {
          // Fallback if title mismatch
          previewText = lines[0].replace(note.title, '').trim() || previewText;
      }

      item.innerHTML = `
        <div class="note-item-title">${DOMPurify.sanitize(note.title)}</div>
        <div class="note-item-preview">${DOMPurify.sanitize(previewText)}</div>
        <div class="note-item-time">${this.formatDate(note.timestamp)}</div>
      `;

      item.addEventListener('click', () => {
        this.selectedNoteId = note.id;
        this.renderNotesList();
        this.loadSelectedNote();
      });

      listContainer.appendChild(item);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #ffffff;
          color: #333333;
        }

        .container {
          display: flex;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .sidebar {
          width: 250px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background-color: #f6f6f6;
          border-right: 1px solid #e0e0e0;
        }

        .sidebar-header {
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .search-container {
          display: flex;
          background-color: #e3e3e3;
          border-radius: 6px;
          padding: 4px 8px;
          align-items: center;
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 13px;
          padding-left: 5px;
        }

        .notes-list {
          flex: 1;
          overflow-y: auto;
        }

        .note-item {
          padding: 12px 20px;
          border-bottom: 1px solid #e0e0e0;
          cursor: pointer;
          user-select: none;
        }

        .note-item.selected {
          background-color: #eab308; /* Yellow accent color for macOS Notes */
          color: white;
          border-bottom: 1px solid #dca306;
        }

        .note-item-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .note-item-preview {
          font-size: 12px;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .note-item.selected .note-item-preview {
          color: rgba(255, 255, 255, 0.8);
        }

        .note-item-time {
          font-size: 11px;
          color: #aaa;
          margin-top: 4px;
        }

        .note-item.selected .note-item-time {
          color: rgba(255, 255, 255, 0.7);
        }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
        }

        .toolbar {
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid #e0e0e0;
          background-color: #f6f6f6;
        }

        .toolbar-group {
          display: flex;
          gap: 10px;
        }

        .icon-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          transition: background-color 0.1s;
        }

        .icon-button:hover {
          background-color: #e0e0e0;
        }

        .editor-area {
          flex: 1;
          overflow-y: auto;
          padding: 40px 60px;
          outline: none;
          font-size: 15px;
          line-height: 1.5;
        }

        .editor-area[placeholder]:empty:before {
          content: attr(placeholder);
          color: #aaa;
          pointer-events: none;
          display: block; /* For Firefox */
        }
      </style>
      <div class="container">
        <div class="sidebar">
          <div class="sidebar-header">
            <div class="search-container">
              <input type="text" class="search-input" placeholder="Search">
            </div>
          </div>
          <div class="notes-list">
            <!-- Notes list will be populated here -->
          </div>
        </div>
        <div class="main-area">
          <div class="toolbar">
            <div class="toolbar-group">
              <button class="icon-button" id="delete-btn" title="Delete note">
                <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
              </button>
              <button class="icon-button" id="new-note-btn" title="New note">
                <i data-lucide="square-pen" style="width: 18px; height: 18px;"></i>
              </button>
            </div>
            <div class="toolbar-group">
              <button class="icon-button" id="bold-btn" title="Bold">
                <i data-lucide="bold" style="width: 18px; height: 18px;"></i>
              </button>
              <button class="icon-button" id="italic-btn" title="Italic">
                <i data-lucide="italic" style="width: 18px; height: 18px;"></i>
              </button>
              <button class="icon-button" id="underline-btn" title="Underline">
                <i data-lucide="underline" style="width: 18px; height: 18px;"></i>
              </button>
              <button class="icon-button" id="list-btn" title="List">
                <i data-lucide="list" style="width: 18px; height: 18px;"></i>
              </button>
            </div>
          </div>
          <div class="editor-area" contenteditable="true" placeholder="Start typing here..."></div>
        </div>
      </div>
    `;

    import('lucide').then(({ createIcons, SquarePen, Trash2, Bold, Italic, Underline, List }) => {
      createIcons({
        icons: { SquarePen, Trash2, Bold, Italic, Underline, List },
        root: this.shadowRoot
      });
    });
  }
}

customElements.define('macos-notes', MacOSNotes);
