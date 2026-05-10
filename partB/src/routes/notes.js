const express = require('express');
const router = express.Router();
const { getDb, saveDb, all, get, run } = require('../db/database');

function getNoteTags(db, noteId) {
  return all(db, 'SELECT t.name FROM tags t JOIN note_tags nt ON nt.tag_id = t.id WHERE nt.note_id = ?', [noteId]).map(r => r.name);
}

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const notes = all(db, 'SELECT * FROM notes ORDER BY updated_at DESC');
    const result = notes.map(n => ({ ...n, tags: getNoteTags(db, n.id) }));
    res.json({ data: result });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { title, content = '', tags = [] } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const db = await getDb();
    const result = run(db, 'INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
    const noteId = result.lastInsertRowid;
    for (const tag of tags) {
      run(db, 'INSERT OR IGNORE INTO tags (name) VALUES (?)', [tag.toLowerCase()]);
      const tagRow = get(db, 'SELECT id FROM tags WHERE name = ?', [tag.toLowerCase()]);
      run(db, 'INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)', [noteId, tagRow.id]);
    }
    saveDb();
    res.status(201).json({ data: { id: noteId, title, content, tags } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
