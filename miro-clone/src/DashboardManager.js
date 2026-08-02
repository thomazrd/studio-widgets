export class DashboardManager {
  constructor(app) {
    this.app = app;
  }

  renderDashboard() {
    this.app.dashboardEl.style.display = 'flex';
    this.app.boardViewEl.style.display = 'none';
    this.app.currentBoardId = null;

    const boards = this.app.boardStore.getBoards();
    this.app.boardsGridEl.innerHTML = '';

    boards.forEach(board => {
      const card = document.createElement('div');
      card.className = 'board-card';
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-btn')) {
          this.openBoard(board.id);
        }
      });

      const dateStr = new Date(board.updatedAt).toLocaleString('pt-BR');

      card.innerHTML = `
        <div class="board-title">${board.title}</div>
        <div class="board-date">Atualizado em: ${dateStr}</div>
        <div class="board-actions">
          <button class="btn btn-danger delete-btn" data-id="${board.id}">Excluir</button>
        </div>
      `;

      const deleteBtn = card.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este quadro?')) {
          this.app.boardStore.deleteBoard(board.id);
          this.renderDashboard();
        }
      });

      this.app.boardsGridEl.appendChild(card);
    });
  }

  createNewBoard() {
    const newBoard = this.app.boardStore.createBoard('Quadro sem título');
    this.openBoard(newBoard.id);
  }

  openBoard(id) {
    const board = this.app.boardStore.getBoard(id);
    if (!board) return;

    this.app.currentBoardId = id;
    this.app.dashboardEl.style.display = 'none';
    this.app.boardViewEl.style.display = 'block';
    this.app.boardTitleInput.value = board.title;

    this.app.loadBoardState();
  }

  showDashboard() {
    this.renderDashboard();
  }
}
