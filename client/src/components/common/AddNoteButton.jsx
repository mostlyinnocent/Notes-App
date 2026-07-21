import React from 'react'
import AddNoteIcon from '../../assets/plus.svg'

function AddNoteButton() {
  return (
    <button className='h-10 w-10 bg-neutral-900 rounded-full flex items-center justify-center'>
      <img src={AddNoteIcon} alt="" className='h-[90%] w-[80%] block'/>
    </button>
  )
}

export default AddNoteButton