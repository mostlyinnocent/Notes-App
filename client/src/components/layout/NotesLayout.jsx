import React from 'react'
import Note from '../common/Note'

import { useOutletContext } from 'react-router-dom'

function NotesLayout({onlyStarred}) {
  const {notes, saveHandler, deleteHandler} = useOutletContext()
  const visibleNotes = onlyStarred ? notes.filter(n => n.starred) : notes
  return (
    <div className='h-full w-full grid grid-cols-[repeat(auto-fill,minmax(282px,1fr))] content-start gap-5 px-5 py-5'>
      {visibleNotes.map(note => (
        <Note key={note.id} id={note.id} title={note.title} content={note.content} starred={note.starred} handleBlur={saveHandler} handleDelete={deleteHandler}/>
      ))}
    </div>
  )
}

export default NotesLayout