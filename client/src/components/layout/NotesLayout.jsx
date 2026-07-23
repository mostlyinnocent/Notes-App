import React from 'react'
import Note from '../common/Note'

import { useOutletContext } from 'react-router-dom'

function NotesLayout() {
  const {notes, handler} = useOutletContext()
  return (
    <div className='h-full w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 px-5 py-5'>
      {notes.map(note => (
        <Note key={note.id} id={note.id} title={note.title} content={note.content} starred={note.starred} handleBlur={handler}/>
      ))}
    </div>
  )
}

export default NotesLayout