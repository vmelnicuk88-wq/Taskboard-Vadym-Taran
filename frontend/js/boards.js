// Obsługa listy tablic; wymaga js/api.js i elementów strony boards.html.
let editingBoardId = null;
const boardList = document.getElementById('boardsList');
const boardForm = document.getElementById('boardForm');
const boardModalElement = document.getElementById('boardModal');
const boardModal = boardModalElement && window.bootstrap ? new bootstrap.Modal(boardModalElement) : null;
function boardMessage(message) {
  const element = document.getElementById('message');
  if (element) { element.textContent = message; element.className = 'alert alert-danger'; }
}
async function loadBoards() {
  const boards = await api('/boards');
  if (!boardList) return;
  boardList.replaceChildren();
  for (const board of boards) {
    const card = document.createElement('article');
    card.className = 'card shadow-sm mb-3';
    const body = document.createElement('div');
    body.className = 'card-body';
    const title = document.createElement('h2');
    title.className = 'h5';
    title.textContent = board.name;
    const description = document.createElement('p');
    description.textContent = board.description || '';
    const owner = document.createElement('p');
    owner.className = 'text-muted small';
    owner.textContent = board.createdByName || board.ownerName || '';
    const open = document.createElement('a');
    open.className = 'btn btn-primary me-2';
    open.href = 'board.html?id=' + encodeURIComponent(board.id);
    open.textContent = 'Otwórz';
    const edit = document.createElement('button');
    edit.className = 'btn btn-outline-secondary me-2';
    edit.textContent = 'Edytuj';
    edit.addEventListener('click', () => {
      editingBoardId = board.id;
      if (boardForm) {
        boardForm.elements.namedItem('name').value = board.name || '';
        boardForm.elements.namedItem('description').value = board.description || '';
      }
      boardModal?.show();
    });
    const remove = document.createElement('button');
    remove.className = 'btn btn-outline-danger';
    remove.textContent = 'Usuń';
    remove.addEventListener('click', async () => {
      if (!confirm('Usunąć tę tablicę?')) return;
      try { await api('/boards/' + board.id, 'DELETE'); await loadBoards(); }
      catch (error) { boardMessage(error.message); }
    });
    body.append(title, description, owner, open, edit, remove);
    card.append(body);
    boardList.append(card);
  }
}
document.getElementById('newBoardBtn')?.addEventListener('click', () => {
  editingBoardId = null;
  boardForm?.reset();
  boardModal?.show();
});
boardForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(boardForm);
  const name = String(data.get('name') || '').trim();
  if (!name) return boardMessage('Podaj nazwę tablicy');
  try {
    const path = editingBoardId ? '/boards/' + editingBoardId : '/boards';
    await api(path, editingBoardId ? 'PUT' : 'POST', {
      name, description: String(data.get('description') || '').trim()
    });
    boardModal?.hide();
    await loadBoards();
  } catch (error) { boardMessage(error.message); }
});
(async () => {
  try {
    const user = await currentUser();
    const name = document.getElementById('userName');
    if (name) name.textContent = user.firstName || user.login;
    await loadBoards();
  } catch (error) { boardMessage(error.message); }
})();
document.getElementById('logoutBtn')?.addEventListener('click', () => logout().catch(error => boardMessage(error.message)));
