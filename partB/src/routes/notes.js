const express = require('express');
const router = express.Router();
const { getDb, saveDb, all, get, run } = require('../db/database');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.vfs;

function getNoteTags(db, noteId) {
  return all(db, 'SELECT t.name FROM tags t JOIN note_tags nt ON nt.tag_id = t.id WHERE nt.note_id = ?', [noteId]).map(r => r.name);
}

function setNoteTags(db, noteId, tagNames) {
  run(db, 'DELETE FROM note_tags WHERE note_id = ?', [noteId]);
  tagNames.forEach(name => {
    const trimmed = name.trim().toLowerCase();
    if (trimmed) {
      run(db, 'INSERT OR IGNORE INTO tags (name) VALUES (?)', [trimmed]);
      const tag = get(db, 'SELECT id FROM tags WHERE name = ?', [trimmed]);
      if (tag) run(db, 'INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)', [noteId, tag.id]);
    }
  });
}

router.get('/', async (req, res) => {
  const db = await getDb();
  const notes = all(db, 'SELECT * FROM notes ORDER BY updated_at DESC');
  res.json({ data: notes.map(n => ({ ...n, tags: getNoteTags(db, n.id) })) });
});

router.post('/', async (req, res) => {
  const { title, content = '', tags = [] } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const db = await getDb();
  const result = run(db, 'INSERT INTO notes (title, content) VALUES (?, ?)', [title.trim(), content]);
  setNoteTags(db, result.lastInsertRowid, tags);
  saveDb();
  res.status(201).json({ message: 'Note created' });
});

router.delete('/:id', async (req, res) => {
  const db = await getDb();
  run(db, 'DELETE FROM notes WHERE id = ?', [req.params.id]);
  saveDb();
  res.json({ message: 'Note deleted' });
});

router.get('/:id/pdf', async (req, res) => {
  const db = await getDb();
  const note = get(db, 'SELECT * FROM notes WHERE id = ?', [req.params.id]);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  
  const docDefinition = {
    content: [
      { text: note.title, fontSize: 20, bold: true },
      { text: `Date: ${note.created_at}`, fontSize: 10, color: 'grey' },
      { text: '\n' + note.content }
    ]
  };
  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.getBuffer((buffer) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buffer);
  });
});

module.exports = router;