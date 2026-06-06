const WIDGET_ID = '4a289684-640c-4e86-89f6-23b983fe4f2c';
const STORAGE_KEY = `${WIDGET_ID}_notes`;

export function getNotes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading notes from localStorage:', error);
    return [];
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
}

export function createNote(note = {}) {
  const notes = getNotes();
  const newNote = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    title: note.title || 'New Note',
    content: note.content || '',
    timestamp: Date.now(),
    ...note
  };
  notes.unshift(newNote); // Add to top
  saveNotes(notes);
  return newNote;
}

export function updateNote(id, updates) {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...updates, timestamp: Date.now() };
    saveNotes(notes);
    return notes[index];
  }
  return null;
}

export function deleteNote(id) {
  const notes = getNotes();
  const newNotes = notes.filter((n) => n.id !== id);
  saveNotes(newNotes);
}
