const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,login,firstName,lastName FROM users ORDER BY firstName,lastName'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
