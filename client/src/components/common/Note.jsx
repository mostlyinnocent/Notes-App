import React from 'react'
import StarIcon from '../../assets/star.svg'
import EditIcon from '../../assets/pen.svg'

function Note({title, content}) {
  return (
    <div className='h-60 w-50 flex flex-col items-start justify-start bg-blue-500 rounded-lg px-2 py-2 relative'>
      <div className='w-full flex items-center justify-between'>
        <span className='text-2xl font-bold'>{title}</span>
        <button className='h-6 w-6 flex items-center justify-center'>
          <img src={StarIcon} alt="" className='h-full w-full block'/>
        </button>
      </div>
      <div className='h-full w-full overflow-hidden'>
        <p>{content}</p>
      </div>
      <button className='h-6 w-6 flex items-center justify-center absolute right-2 bottom-2'>
        <img src={EditIcon} alt="" className='h-full w-full block'/>
      </button>
    </div>
  )
}

export default Note