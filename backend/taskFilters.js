// Parametry wszystkich filtrów są wiązane przez mysql2, bez składania wartości w SQL.
function buildTaskFilters(query, boardId) {
  const parts = ['boardId = ?', 'isDeleted = 0'];
  const params = [boardId];
  if (query.priority !== undefined && query.priority !== '') {
    if (!['low', 'medium', 'high'].includes(query.priority)) {
      throw new Error('Nieprawidłowy priorytet');
    }
    parts.push('priority = ?');
    params.push(query.priority);
  }
  if (query.assigneeId !== undefined && query.assigneeId !== '') {
    if (typeof query.assigneeId !== 'string' || !/^[1-9][0-9]*$/.test(query.assigneeId) ||
        !Number.isSafeInteger(Number(query.assigneeId))) {
      throw new Error('Nieprawidłowa osoba');
    }
    parts.push('assigneeId = ?');
    params.push(Number(query.assigneeId));
  }
  if (query.q !== undefined && query.q !== '') {
    if (typeof query.q !== 'string' || query.q.length > 100) {
      throw new Error('Nieprawidłowe wyszukiwanie');
    }
    const search = query.q.trim();
    if (search) {
      parts.push('title LIKE ?');
      params.push('%' + search + '%');
    }
  }
  return { where: parts.join(' AND '), params };
}
module.exports = { buildTaskFilters };
