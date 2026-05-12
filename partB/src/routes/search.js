const express = require('express');
const router = express.Router();
const { getDb, searchNotes, all } = require('../db/database');

router.get('/', async (req, res) => {
  const { q, tag } = req.query;
  if (!q) return res.status(400).json({ error: 'Query is required' });
  const db = await getDb();
  const rows = searchNotes(db, q.trim(), tag);
  const result = rows.map(note => ({
    ...note,
    tags: all(db, 'SELECT t.name FROM tags t JOIN note_tags nt ON nt.tag_id = t.id WHERE nt.note_id = ?', [note.id]).map(r => r.name),
    snippet: note.content.slice(0, 100) + '...'
  }));
  res.json({ data: result });
});

module.exports = router;