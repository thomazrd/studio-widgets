import { API_BASE_URL } from './constants.js';

const BOOKS = [
  { id: 'GEN', name: 'Gênesis', name_en: 'Genesis', chapters: 50 },
  { id: 'EXO', name: 'Êxodo', name_en: 'Exodus', chapters: 40 },
  { id: 'LEV', name: 'Levítico', name_en: 'Leviticus', chapters: 27 },
  { id: 'NUM', name: 'Números', name_en: 'Numbers', chapters: 36 },
  { id: 'DEU', name: 'Deuteronômio', name_en: 'Deuteronomy', chapters: 34 },
  { id: 'JOS', name: 'Josué', name_en: 'Joshua', chapters: 24 },
  { id: 'JDG', name: 'Juízes', name_en: 'Judges', chapters: 21 },
  { id: 'RUT', name: 'Rute', name_en: 'Ruth', chapters: 4 },
  { id: '1SA', name: '1 Samuel', name_en: '1 Samuel', chapters: 31 },
  { id: '2SA', name: '2 Samuel', name_en: '2 Samuel', chapters: 24 },
  { id: '1KI', name: '1 Reis', name_en: '1 Kings', chapters: 22 },
  { id: '2KI', name: '2 Reis', name_en: '2 Kings', chapters: 25 },
  { id: '1CH', name: '1 Crônicas', name_en: '1 Chronicles', chapters: 29 },
  { id: '2CH', name: '2 Crônicas', name_en: '2 Chronicles', chapters: 36 },
  { id: 'EZR', name: 'Esdras', name_en: 'Ezra', chapters: 10 },
  { id: 'NEH', name: 'Neemias', name_en: 'Nehemiah', chapters: 13 },
  { id: 'EST', name: 'Ester', name_en: 'Esther', chapters: 10 },
  { id: 'JOB', name: 'Jó', name_en: 'Job', chapters: 42 },
  { id: 'PSA', name: 'Salmos', name_en: 'Psalms', chapters: 150 },
  { id: 'PRO', name: 'Provérbios', name_en: 'Proverbs', chapters: 31 },
  { id: 'ECC', name: 'Eclesiastes', name_en: 'Ecclesiastes', chapters: 12 },
  { id: 'SNG', name: 'Cânticos', name_en: 'Song of Solomon', chapters: 8 },
  { id: 'ISA', name: 'Isaías', name_en: 'Isaiah', chapters: 66 },
  { id: 'JER', name: 'Jeremias', name_en: 'Jeremiah', chapters: 52 },
  { id: 'LAM', name: 'Lamentações', name_en: 'Lamentations', chapters: 5 },
  { id: 'EZK', name: 'Ezequiel', name_en: 'Ezekiel', chapters: 48 },
  { id: 'DAN', name: 'Daniel', name_en: 'Daniel', chapters: 12 },
  { id: 'HOS', name: 'Oséias', name_en: 'Hosea', chapters: 14 },
  { id: 'JOL', name: 'Joel', name_en: 'Joel', chapters: 3 },
  { id: 'AMO', name: 'Amós', name_en: 'Amos', chapters: 9 },
  { id: 'OBA', name: 'Obadias', name_en: 'Obadiah', chapters: 1 },
  { id: 'JON', name: 'Jonas', name_en: 'Jonah', chapters: 4 },
  { id: 'MIC', name: 'Miquéias', name_en: 'Micah', chapters: 7 },
  { id: 'NAM', name: 'Naum', name_en: 'Nahum', chapters: 3 },
  { id: 'HAB', name: 'Habacuque', name_en: 'Habakkuk', chapters: 3 },
  { id: 'ZEP', name: 'Sofonias', name_en: 'Zephaniah', chapters: 3 },
  { id: 'HAG', name: 'Ageu', name_en: 'Haggai', chapters: 2 },
  { id: 'ZEC', name: 'Zacarias', name_en: 'Zechariah', chapters: 14 },
  { id: 'MAL', name: 'Malaquias', name_en: 'Malachi', chapters: 4 },
  { id: 'MAT', name: 'Mateus', name_en: 'Matthew', chapters: 28 },
  { id: 'MRK', name: 'Marcos', name_en: 'Mark', chapters: 16 },
  { id: 'LUK', name: 'Lucas', name_en: 'Luke', chapters: 24 },
  { id: 'JHN', name: 'João', name_en: 'John', chapters: 21 },
  { id: 'ACT', name: 'Atos', name_en: 'Acts', chapters: 28 },
  { id: 'ROM', name: 'Romanos', name_en: 'Romans', chapters: 16 },
  { id: '1CO', name: '1 Coríntios', name_en: '1 Corinthians', chapters: 16 },
  { id: '2CO', name: '2 Coríntios', name_en: '2 Corinthians', chapters: 13 },
  { id: 'GAL', name: 'Gálatas', name_en: 'Galatians', chapters: 6 },
  { id: 'EPH', name: 'Efésios', name_en: 'Ephesians', chapters: 6 },
  { id: 'PHP', name: 'Filipenses', name_en: 'Philippians', chapters: 4 },
  { id: 'COL', name: 'Colossenses', name_en: 'Colossians', chapters: 4 },
  { id: '1TH', name: '1 Tessalonicenses', name_en: '1 Thessalonians', chapters: 5 },
  { id: '2TH', name: '2 Tessalonicenses', name_en: '2 Thessalonians', chapters: 3 },
  { id: '1TI', name: '1 Timóteo', name_en: '1 Timothy', chapters: 6 },
  { id: '2TI', name: '2 Timóteo', name_en: '2 Timothy', chapters: 4 },
  { id: 'TIT', name: 'Tito', name_en: 'Titus', chapters: 3 },
  { id: 'PHM', name: 'Filemom', name_en: 'Philemon', chapters: 1 },
  { id: 'HEB', name: 'Hebreus', name_en: 'Hebrews', chapters: 13 },
  { id: 'JAS', name: 'Tiago', name_en: 'James', chapters: 5 },
  { id: '1PE', name: '1 Pedro', name_en: '1 Peter', chapters: 5 },
  { id: '2PE', name: '2 Pedro', name_en: '2 Peter', chapters: 3 },
  { id: '1JN', name: '1 João', name_en: '1 John', chapters: 5 },
  { id: '2JN', name: '2 João', name_en: '2 John', chapters: 1 },
  { id: '3JN', name: '3 João', name_en: '3 John', chapters: 1 },
  { id: 'JUD', name: 'Judas', name_en: 'Jude', chapters: 1 },
  { id: 'REV', name: 'Apocalipse', name_en: 'Revelation', chapters: 22 }
];

export async function fetchBooks(translationId) {
  // Return the statically defined list of books, localizing names if needed
  // bible-api.com expects English names for queries
  return BOOKS.map(b => ({
    id: b.name_en, // Use English name as ID for querying API
    name: translationId === 'almeida' ? b.name : b.name_en,
    chapters: b.chapters
  }));
}

export async function fetchChapters(translationId, bookId) {
  // Based on the static book data, generate an array of chapters
  const book = BOOKS.find(b => b.name_en === bookId);
  if (!book) return [];

  const chapters = [];
  for (let i = 1; i <= book.chapters; i++) {
    chapters.push({ chapter: i });
  }
  return chapters;
}

export async function fetchChapter(translationId, bookId, chapterNum) {
  try {
    const query = `${encodeURIComponent(bookId)}+${chapterNum}`;
    const response = await fetch(`${API_BASE_URL}/${query}?translation=${translationId}`);
    if (!response.ok) throw new Error('Failed to fetch chapter');
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return [];
  }
}
