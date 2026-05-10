const express = require('express');
const router = express.Router();
const { getDb, all } = require('../db/database');

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
  try {
    const db = await getDb();
    const notes = all(db, "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ?", [`%${q}%`, `%${q}%`]);
    res.json({ data: notes });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
