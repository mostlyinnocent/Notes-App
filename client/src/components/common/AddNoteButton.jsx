import React from 'react'
import AddNoteIcon from '../../assets/plus.svg'

function AddNoteButton({addNote}) {
  return (
    <button onClick={addNote} className='h-10 w-full bg-(--accent) rounded-lg flex items-center justify-start px-5 gap-2.5 hover:brightness-[1.05]'>
      <div>
        <img src={AddNoteIcon} alt="" className='h-[100%] w-[100%] block'/>
      </div>
      <span className='text-(--text)'>New note</span>
    </button>
  )
}

export default AddNoteButton