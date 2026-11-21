const express = require('express');
const pool = require('../db');
const { buildTaskFilters } = require('../taskFilters');
const { positiveId } = require('../taskValidation');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,name,description,ownerId,createdAt FROM boards WHERE isDeleted = 0'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = positiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID tablicy' });
    const [rows] = await pool.query(
      'SELECT id,name,description,ownerId FROM boards WHERE id = ? AND isDeleted = 0',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!name || name.length > 80) {
      return res.status(400).json({ error: 'Nazwa musi mieć od 1 do 80 znaków' });
    }
    const [created] = await pool.query(
      'INSERT INTO boards (name,description,ownerId) VALUES (?,?,?)',
      [name, req.body.description || null, req.session.userId]
    );
    res.status(201).json({ id: created.insertId, name });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = positiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID tablicy' });
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (!name || name.length > 80) {
      return res.status(400).json({ error: 'Nazwa musi mieć od 1 do 80 znaków' });
    }
    const [updated] = await pool.query(
      'UPDATE boards SET name = ?, description = ? WHERE id = ? AND isDeleted = 0',
      [name, req.body.description || null, id]
    );
    if (!updated.affectedRows) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }
    res.json({ id, name });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = positiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID tablicy' });
    const [updated] = await pool.query(
      'UPDATE boards SET isDeleted = 1, deletedAt = NOW(), deletedById = ? ' +
      'WHERE id = ? AND isDeleted = 0',
      [req.session.userId, id]
    );
    if (!updated.affectedRows) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get('/:boardId/tasks', async (req, res, next) => {
  try {
    const boardId = positiveId(req.params.boardId);
    if (!boardId) return res.status(400).json({ error: 'Nieprawidłowa tablica' });
    let filters;
    try {
      filters = buildTaskFilters(req.query, boardId);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    const [boards] = await pool.query(
      'SELECT id FROM boards WHERE id = ? AND isDeleted = 0',
      [boardId]
    );
    if (!boards.length) return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    const sql = 'SELECT id,title,status,priority,deadline,assigneeId FROM tasks WHERE ' +
      filters.where + ' ORDER BY createdAt DESC, id DESC';
    const [tasks] = await pool.query(sql, filters.params);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
