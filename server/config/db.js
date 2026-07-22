import Database from 'better-sqlite3'

const db = new Database('notes.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    date_created TEXT,
    starred INTEGER
  )
  STRICT
`)

export default db