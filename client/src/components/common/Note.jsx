import React from 'react'
import StarIcon from '../../assets/star.svg'
import EditIcon from '../../assets/pen.svg'
import { useRef } from 'react'

function Note({id, title, content, starred, handleBlur}) {

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  return (
    <div onBlur={()=>handleBlur(id, titleRef.current.value, contentRef.current.value, starred)} className='h-60 w-50 flex flex-col items-start justify-start bg-neutral-100 border border-neutral-600/20 rounded-lg px-2 py-2 relative'>
      <div className='w-full flex items-center justify-between'>
        <input ref={titleRef} className='w-full text-2xl font-bold border-0 outline-0' defaultValue={title} autoFocus/>
        <button className='h-4 w-4 flex items-center justify-center cursor-pointer'>
          <img src={StarIcon} alt="" className='h-full w-full block opacity-50'/>
        </button>
      </div>
      <div className='h-full w-full overflow-hidden'>
        <textarea ref={contentRef} className='h-full w-full resize-none' defaultValue={content}></textarea>
      </div>
      <button className='h-4 w-4 flex items-center justify-center absolute right-2 bottom-2 cursor-pointer'>
        <img src={EditIcon} alt="" className='h-full w-full block opacity-50'/>
      </button>
    </div>
  )
}

export default Note