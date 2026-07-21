import React from 'react'
import Note from '../common/Note'

function NotesLayout() {
  return (
    <div className='h-full w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 px-5 py-5'>
      <Note></Note>
    </div>
  )
}

export default NotesLayout