class BoardStore {
  constructor(instanceId) {
    this.prefix = `miro_clone_v1_${instanceId}_`;
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getBoards() {
    const boardsStr = localStorage.getItem(this.prefix + 'boards');
    if (!boardsStr) return [];
    try {
      return JSON.parse(boardsStr);
    } catch (e) {
      return [];
    }
  }

  saveBoards(boards) {
    localStorage.setItem(this.prefix + 'boards', JSON.stringify(boards));
  }

  createBoard(title) {
    const boards = this.getBoards();
    const newBoard = {
      id: this.generateId(),
      title: title || 'Novo Quadro',
      updatedAt: new Date().toISOString(),
      elements: []
    };
    boards.push(newBoard);
    this.saveBoards(boards);
    return newBoard;
  }

  updateBoard(id, updates) {
    const boards = this.getBoards();
    const index = boards.findIndex(b => b.id === id);
    if (index !== -1) {
      boards[index] = { ...boards[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveBoards(boards);
      return boards[index];
    }
    return null;
  }

  deleteBoard(id) {
    let boards = this.getBoards();
    boards = boards.filter(b => b.id !== id);
    this.saveBoards(boards);
  }

  getBoard(id) {
    return this.getBoards().find(b => b.id === id) || null;
  }
}

export { BoardStore };
