import React from 'react'
import StarIcon from '../../assets/star.svg'
import EditIcon from '../../assets/pen.svg'
import { useRef } from 'react'

function Note({id, title, content, starred, handleBlur}) {

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  return (
    <div onBlur={()=>handleBlur(id, titleRef.current.value, contentRef.current.value, starred)} className='h-[200px] w-full flex flex-col items-start justify-start bg-neutral-100 border border-neutral-600/20 rounded-[16px] px-4 py-4 relative gap-[10px]'>
      <div className='w-full flex items-center justify-between'>
        <input ref={titleRef} className='w-full text-2xl font-bold border-0 outline-0' placeholder="Title" defaultValue={title} autoFocus/>
        <button className='h-5 w-5 flex items-center justify-center cursor-pointer'>
          <img src={StarIcon} alt="" className='h-full w-full block opacity-50'/>
        </button>
      </div>
      <div className='h-[500px] overflow-hidden'>
        <textarea ref={contentRef} placeholder='Enter a note' className='h-full w-full resize-none' defaultValue={content}></textarea>
      </div>
      <div className='w-full h-full flex items-end justify-end border-t border-t-neutral-300 px-5'>
        <button className='h-4 w-4 flex items-center justify-center cursor-pointer'>
          <img src={EditIcon} alt="" className='h-full w-full block opacity-50'/>
        </button>
      </div>
    </div>
  )
}

export default Note