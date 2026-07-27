import * as Note from "../models/Note.js";


function catchError(res, err){
  res.status(500).json({error: err.message});
}

export function createNote(req, res){
  try {
    const note = Note.createNote(req.body)
    res.status(201).json(note)
  } catch (err){
    catchError(res, err);
  }
}

export function getAllNotes(req, res){
  try {
    const notes = Note.getAllNotes()
    res.json(notes)
  } catch (err){
    catchError(res, err);
  }
}

export function getNoteById(req, res){
  try{
    const note = Note.getNoteById(Number(req.params.id))
    if(!note){
      return res.status(404).json({ error: "Note not found"})
    }
    res.json(note)
  } catch(err){
    catchError(res, err)
  }
}

export function updateNote(req, res){
  try {
    const note = Note.updateNote(Number(req.params.id), req.body)
    if(!note){
      return res.status(404).json({error: "Note not found"})
    }
    res.json(note)
  } catch(err) {
    catchError(res, err)
  }
}

export function deleteNote(req, res){
  try {
    const wasDeleted = Note.deleteNote(Number(req.params.id))
    if(!wasDeleted){
      return res.status(404).json({error: "Note not found"})
    }
    res.json(wasDeleted)
  } catch(err) {
    catchError(res, err)
  }
}

export function getStarredNotes(req, res){
  try {
    const note = Note.getStarredNotes(Number(req.query.starred))
    res.json(note)
  } catch(err) {
    catchError(res, err)
  }
}