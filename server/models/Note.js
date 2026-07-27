import db from '../config/db.js'

function checkDb(){
  if(!db){
    throw new Error("Database not connected");
    
  }
}

export function getAllNotes(){
  checkDb();
  const notes = db.prepare(`SELECT * FROM notes`).all()
  return notes

}

export function getNoteById(id){
  checkDb();
  const note = db.prepare(`SELECT * FROM notes WHERE id = ?`).get(id);
  return note;
}

export function createNote({title, content}){
  checkDb();
  const result = db.prepare(`INSERT INTO notes (title, content, date_created, starred) VALUES (?, ?, ?, ?)`).run(title, content, new Date().toISOString(), 0)
  return getNoteById(result.lastInsertRowid);
}

export function updateNote(id, {title, content, starred}){
  checkDb();
  const result = db.prepare(`UPDATE notes SET title = ?, content = ?, starred = ? WHERE id = ?`).run(title, content, starred, id);
  return getNoteById(id);
}

export function deleteNote(id){
  checkDb();
  const result = db.prepare(`DELETE FROM notes WHERE id = ?`).run(id)
  return result.changes > 0 ;
}

export function getStarredNotes(starred){
  checkDb();
  const starredNotes = db.prepare(`SELECT * FROM notes WHERE starred = ?`).all(starred);
  return starredNotes;
}