import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import NavBar from '../common/NavBar'
import { Outlet } from 'react-router-dom'
import './MainLayout.css'
import AddNoteButton from '../common/AddNoteButton'
import NotesLayout from './NotesLayout'

function MainLayout() {

  const [note, setNote] = useState([])

  useEffect(() => {
    loadNotes()
  }, []);


  async function addNote(){
    const response = await fetch("http://localhost:3000/notes", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({title: '', content: '' }),
    })
    const newNote = await response.json()
    setNote(prev => [...prev, newNote])
  }

  async function saveNote(id, title, content, starred){
    const response = await fetch(`http://localhost:3000/notes/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({id: id, title: title, content: content, starred: starred})
    })
    const updatedNote = await response.json();
    setNote(prev => prev.map(n => n.id === id ? updatedNote : n))
    console.log(`${id} Note saved`);
  }

  async function loadNotes(){
    const response = await fetch("http://localhost:3000/notes", {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    const notes = await response.json();
    setNote(notes)
  }

  async function deleteNote(id){
    const response = await fetch(`http://localhost:3000/notes/${id}`,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    })
    const note = await response.json();
    setNote(prev => prev.filter(n => n.id !== id))
  }

  const noteObj = {
    notes: note,
    saveHandler: saveNote,
    deleteHandler: deleteNote
  }

  return (
    <div className="layout h-full w-full">
      <Header></Header>
      <NavBar>
        <AddNoteButton addNote={addNote}></AddNoteButton>
      </NavBar>
      <main className='main flex-1'><Outlet context={noteObj}/></main>
    </div>
  )
}

export default MainLayout