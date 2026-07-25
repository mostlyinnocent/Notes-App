import React from 'react'
import Note from '../common/Note'

import { useOutletContext } from 'react-router-dom'

function NotesLayout() {
  const {notes, saveHandler, deleteHandler} = useOutletContext()
  return (
    <div className='h-full w-full grid grid-cols-[repeat(auto-fill,minmax(282px,1fr))] content-start gap-5 px-5 py-5'>
      {notes.map(note => (
        <Note key={note.id} id={note.id} title={note.title} content={note.content} starred={note.starred} handleBlur={saveHandler} handleDelete={deleteHandler}/>
      ))}
    </div>
  )
}

export default NotesLayout