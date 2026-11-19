const { buildTaskFilters } = require('../taskFilters');
const express=require('express'),pool=require('../db'),router=express.Router();
router.get('/',async(req,res,next)=>{try{const [rows]=await pool.query('SELECT id,name,description,ownerId,createdAt FROM boards WHERE isDeleted=0');res.json(rows)}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{const [rows]=await pool.query('SELECT id,name,description,ownerId FROM boards WHERE id=? AND isDeleted=0',[req.params.id]);if(!rows.length)return res.status(404).json({error:'Nie znaleziono tablicy'});res.json(rows[0])}catch(e){next(e)}});
router.post('/',async(req,res,next)=>{try{const name=String(req.body.name||'').trim();if(!name||name.length>80)return res.status(400).json({error:'Nazwa musi mieć od 1 do 80 znaków'});const [r]=await pool.query('INSERT INTO boards (name,description,ownerId) VALUES (?,?,?)',[name,req.body.description||null,req.session.userId]);res.status(201).json({id:r.insertId,name})}catch(e){next(e)}});
router.put('/:id',async(req,res,next)=>{try{const name=String(req.body.name||'').trim();if(!name||name.length>80)return res.status(400).json({error:'Nazwa musi mieć od 1 do 80 znaków'});const [r]=await pool.query('UPDATE boards SET name=?,description=? WHERE id=? AND isDeleted=0',[name,req.body.description||null,req.params.id]);if(!r.affectedRows)return res.status(404).json({error:'Nie znaleziono tablicy'});res.json({id:Number(req.params.id),name})}catch(e){next(e)}});
router.delete('/:id',async(req,res,next)=>{try{const [r]=await pool.query('UPDATE boards SET isDeleted=1,deletedAt=NOW(),deletedById=? WHERE id=? AND isDeleted=0',[req.session.userId,req.params.id]);if(!r.affectedRows)return res.status(404).json({error:'Nie znaleziono tablicy'});res.status(204).end()}catch(e){next(e)}});
router.get('/:boardId/tasks', async (req, res, next) => {
  try {
    const boardId = Number(req.params.boardId);
    if (!Number.isSafeInteger(boardId) || boardId < 1) {
      return res.status(400).json({ error: 'Nieprawidłowa tablica' });
    }
    let filters;
    try {
      filters = buildTaskFilters(req.query, boardId);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    const [boards] = await pool.query('SELECT id FROM boards WHERE id = ? AND isDeleted = 0', [boardId]);
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
