const express = require('express');
const pool = require('../db');
const { positiveId, validateTask } = require('../taskValidation');

const router = express.Router();

async function checkReferences(task, res) {
  const [boards] = await pool.query(
    'SELECT id FROM boards WHERE id = ? AND isDeleted = 0',
    [task.boardId]
  );
  if (!boards.length) {
    res.status(404).json({ error: 'Nie znaleziono tablicy' });
    return false;
  }
  if (task.assigneeId !== null) {
    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [task.assigneeId]);
    if (!users.length) {
      res.status(400).json({ error: 'Nieprawidłowa osoba' });
      return false;
    }
  }
  return true;
}

router.get('/:id', async (req, res, next) => {
  try {
    const id = positiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID zadania' });
    const [rows] = await pool.query(
      'SELECT id,boardId,title,description,status,priority,deadline,assigneeId ' +
      'FROM tasks WHERE id = ? AND isDeleted = 0',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Nie znaleziono zadania' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const result = validateTask(req.body);
    if (result.error) return res.status(400).json({ error: result.error });
    const task = result.task;
    if (!(await checkReferences(task, res))) return;
    const [created] = await pool.query(
      'INSERT INTO tasks (boardId,title,description,status,priority,deadline,assigneeId) ' +
      'VALUES (?,?,?,?,?,?,?)',
      [task.boardId, task.title, task.description, task.status,
        task.priority, task.deadline, task.assigneeId]
    );
    res.status(201).json({ id: created.insertId, title: task.title });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = positiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID zadania' });
    const [existing] = await pool.query(
      'SELECT id,boardId FROM tasks WHERE id = ? AND isDeleted = 0',
      [id]
    );
    if (!existing.length) return res.status(404).json({ error: 'Nie znaleziono zadania' });

    // Nie wolno zmienić zadania na tablicę nieistniejącą lub usuniętą.
    const result = validateTask(req.body, existing[0].boardId);
    if (result.error) return res.status(400).json({ error: result.error });
    const task = result.task;
    if (!(await checkReferences(task, res))) return;

    const [updated] = await pool.query(
      'UPDATE tasks SET boardId = ?, title = ?, description = ?, status = ?, ' +
      'priority = ?, deadline = ?, assigneeId = ? WHERE id = ? AND isDeleted = 0',
      [task.boardId, task.title, task.description, task.status,
        task.priority, task.deadline, task.assigneeId, id]
    );
    if (!updated.affectedRows) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }
    res.json({ id, title: task.title });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = positiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID zadania' });
    const [updated] = await pool.query(
      'UPDATE tasks SET isDeleted = 1, deletedAt = NOW(), deletedById = ? ' +
      'WHERE id = ? AND isDeleted = 0',
      [req.session.userId, id]
    );
    if (!updated.affectedRows) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
