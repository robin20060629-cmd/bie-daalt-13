const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
 
const DB_PATH = path.join(__dirname, '../../notes.db');
 
let db = null;
let SQL = null;
 
async function getDb() {
  if (db) return db;
 
  SQL = await initSqlJs();
 
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
 
  migrate(db);
  saveDb(); // initial save
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
 
// Helper: run a query and return all rows as objects
function all(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}
 
// Helper: run a query and return first row
function get(db, sql, params = []) {
  const rows = all(db, sql, params);
  return rows[0] || null;
}
 
// Helper: run INSERT/UPDATE/DELETE
function run(db, sql, params = []) {
  db.run(sql, params);
  const lastId = db.exec('SELECT last_insert_rowid() as id')[0];
  const changes = db.exec('SELECT changes() as c')[0];
  return {
    lastInsertRowid: lastId ? lastId.values[0][0] : null,
    changes: changes ? changes.values[0][0] : 0
  };
}
 
function closeDb() {
  if (db) {
    saveDb();
    db.close();
    db = null;
  }
}
 
// Full-text search (manual LIKE since sql.js has no FTS5)
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
  return all(db, `
    SELECT * FROM notes
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY updated_at DESC
  `, [term, term]);
}
 
module.exports = { getDb, saveDb, closeDb, all, get, run, searchNotes };