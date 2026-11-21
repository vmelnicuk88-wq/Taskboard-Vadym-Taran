// Walidacja wejścia bez dostępu do bazy danych, łatwa do testowania.
const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

function positiveId(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !/^[1-9][0-9]*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function optionalDeadline(value) {
  if (value === undefined || value === null || value === '') return { valid: true, value: null };
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { valid: false };
  }
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return { valid: false };
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day) {
    return { valid: false };
  }
  return { valid: true, value };
}

function validateTask(body, existingBoardId = null) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Nieprawidłowe dane zadania' };
  }
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const boardId = body.boardId === undefined && existingBoardId !== null
    ? positiveId(existingBoardId) : positiveId(body.boardId);
  const status = body.status === undefined ? 'todo' : body.status;
  const priority = body.priority === undefined ? 'medium' : body.priority;
  if (title.length < 3 || title.length > 100 || !boardId ||
      !STATUSES.includes(status) || !PRIORITIES.includes(priority) ||
      (body.description !== undefined && body.description !== null &&
       typeof body.description !== 'string')) {
    return { error: 'Nieprawidłowe dane zadania' };
  }
  const assigneeId = body.assigneeId === undefined || body.assigneeId === null ||
    body.assigneeId === '' ? null : positiveId(body.assigneeId);
  if (assigneeId === null && body.assigneeId !== undefined &&
      body.assigneeId !== null && body.assigneeId !== '') {
    return { error: 'Nieprawidłowa osoba' };
  }
  const deadline = optionalDeadline(body.deadline);
  if (!deadline.valid) return { error: 'Nieprawidłowy termin (RRRR-MM-DD)' };
  return {
    task: {
      boardId,
      title,
      description: body.description || null,
      status,
      priority,
      deadline: deadline.value,
      assigneeId
    }
  };
}

module.exports = { validateTask, positiveId, optionalDeadline };
