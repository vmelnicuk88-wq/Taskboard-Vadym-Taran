// backend/routes/tasks.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

function parsePositiveId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseDeadline(value) {
  if (value === undefined || value === null || value === '') return { value: null };
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { error: 'Nieprawidłowy termin (wymagany format RRRR-MM-DD)' };
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return { error: 'Nieprawidłowy termin (wymagany format RRRR-MM-DD)' };
  }
  return { value };
}

function validateTask(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (title.length < 3 || title.length > 100) {
    return { error: 'Tytuł musi mieć od 3 do 100 znaków' };
  }

  const status = body.status || 'todo';
  if (!STATUSES.includes(status)) return { error: 'Nieprawidłowy status' };

  const priority = body.priority || 'medium';
  if (!PRIORITIES.includes(priority)) return { error: 'Nieprawidłowy priorytet' };

  const boardId = parsePositiveId(body.boardId);
  if (!boardId) return { error: 'Nieprawidłowa tablica' };

  let assigneeId = null;
  if (body.assigneeId !== undefined && body.assigneeId !== null && body.assigneeId !== '') {
    assigneeId = parsePositiveId(body.assigneeId);
    if (!assigneeId) return { error: 'Nieprawidłowy użytkownik' };
  }

  const deadline = parseDeadline(body.deadline);
  if (deadline.error) return deadline;

  return {
    value: {
      title,
      description: body.description === undefined || body.description === '' ? null : body.description,
      status,
      priority,
      deadline: deadline.value,
      boardId,
      assigneeId
    }
  };
}

async function validateReferences(task) {
  const [boards] = await pool.query(
    'SELECT id FROM boards WHERE id = ? AND isDeleted = 0',
    [task.boardId]
  );
  if (boards.length === 0) return 'Wybrana tablica nie istnieje';

  if (task.assigneeId !== null) {
    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [task.assigneeId]);
    if (users.length === 0) return 'Wybrany użytkownik nie istnieje';
  }
  return null;
}

// GET /api/tasks/:id — szczegóły aktywnego zadania.
router.get('/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(404).json({ error: 'Zadanie nie istnieje' });

    const [rows] = await pool.query(
      'SELECT id, title, description, status, priority, deadline, boardId, assigneeId, createdAt FROM tasks WHERE id = ? AND isDeleted = 0',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Zadanie nie istnieje' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks — tworzenie zadania.
router.post('/', async (req, res, next) => {
  try {
    const validation = validateTask(req.body || {});
    if (validation.error) return res.status(400).json({ error: validation.error });
    const task = validation.value;

    const referenceError = await validateReferences(task);
    if (referenceError) return res.status(400).json({ error: referenceError });

    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, deadline, boardId, assigneeId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [task.title, task.description, task.status, task.priority, task.deadline, task.boardId, task.assigneeId]
    );
    res.status(201).json({ id: result.insertId, ...task });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id — pełna walidacja i aktualizacja wszystkich pól.
router.put('/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(404).json({ error: 'Zadanie nie istnieje' });

    const [existing] = await pool.query(
      'SELECT id FROM tasks WHERE id = ? AND isDeleted = 0',
      [id]
    );
    if (existing.length === 0) return res.status(404).json({ error: 'Zadanie nie istnieje' });

    const validation = validateTask(req.body || {});
    if (validation.error) return res.status(400).json({ error: validation.error });
    const task = validation.value;

    const referenceError = await validateReferences(task);
    if (referenceError) return res.status(400).json({ error: referenceError });

    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, deadline = ?, boardId = ?, assigneeId = ? WHERE id = ? AND isDeleted = 0',
      [task.title, task.description, task.status, task.priority, task.deadline, task.boardId, task.assigneeId, id]
    );
    res.json({ id, ...task });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id — soft delete; deletedById pozostaje NULL do poniedziałku 3.
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(404).json({ error: 'Zadanie nie istnieje' });

    const [result] = await pool.query(
      'UPDATE tasks SET isDeleted = 1, deletedAt = NOW() WHERE id = ? AND isDeleted = 0',
      [id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Zadanie nie istnieje' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;