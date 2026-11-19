const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { login, password, firstName, lastName } = req.body || {};
    const name = typeof login === 'string' ? login.trim() : '';
    const first = typeof firstName === 'string' ? firstName.trim() : '';
    const last = typeof lastName === 'string' ? lastName.trim() : '';
    if (name.length < 3 || name.length > 30 || first.length < 1 || first.length > 80 ||
        last.length < 1 || last.length > 80 || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Uzupełnij pola: login 3–30 znaków, hasło min. 8 znaków' });
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE login = ?', [name]);
    if (existing.length) return res.status(409).json({ error: 'Ten login jest już zajęty' });
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (login,passwordHash,firstName,lastName) VALUES (?,?,?,?)',
      [name, passwordHash, first, last]
    );
    req.session.userId = result.insertId;
    res.status(201).json({ id: result.insertId, login: name, firstName: first, lastName: last });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ten login jest już zajęty' });
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { login, password } = req.body || {};
    if (typeof login !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Podaj login i hasło' });
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE login = ?', [login.trim()]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
    }
    req.session.userId = user.id;
    res.json({ id: user.id, login: user.login, firstName: user.firstName, lastName: user.lastName });
  } catch (error) { next(error); }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,login,firstName,lastName FROM users WHERE id = ?', [req.session.userId]
    );
    if (!rows.length) return res.status(401).json({ error: 'Użytkownik nie istnieje' });
    res.json(rows[0]);
  } catch (error) { next(error); }
});

module.exports = router;
