const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../notes.db');
let db = null;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  migrate(db);
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function migrate(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS note_tags (
      note_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (note_id, tag_id),
      FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);
}

function all(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function get(db, sql, params = []) {
  const rows = all(db, sql, params);
  return rows[0] || null;
}

function run(db, sql, params = []) {
  db.run(sql, params);
  const lastIdRes = db.exec('SELECT last_insert_rowid() as id');
  return { lastInsertRowid: lastIdRes[0].values[0][0] };
}

function searchNotes(db, query, tag) {
  const term = `%${query}%`;
  if (tag) {
    return all(db, `
      SELECT DISTINCT n.* FROM notes n
      JOIN note_tags nt ON nt.note_id = n.id
      JOIN tags t ON t.id = nt.tag_id
      WHERE (n.title LIKE ? OR n.content LIKE ?) AND t.name = ?
      ORDER BY n.updated_at DESC
    `, [term, term, tag.toLowerCase()]);
  }
  return all(db, `SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC`, [term, term]);
}

module.exports = { getDb, saveDb, all, get, run, searchNotes };