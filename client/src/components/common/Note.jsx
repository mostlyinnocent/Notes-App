import React, { useState } from 'react'
import StarIcon from '../../assets/star.svg'
import { useRef } from 'react'

function Note({id, title, content, starred, handleBlur, handleDelete}) {

  const [isEditable, setIsEditable] = useState(title==='');

  const parentRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  return (
    <div ref={parentRef} id='parentNode' onBlur={(event)=>{
        const nextFocusedElement = event.relatedTarget;
        const parentWraper = parentRef.current

        if(parentWraper.contains(nextFocusedElement)){
          console.log("Current focued element: ", nextFocusedElement);
          return
        } else {
          console.log("Saving Note...");
        }

        handleBlur(id, titleRef.current.value, contentRef.current.value, starred); 
        setIsEditable(false);
      }} className='h-[200px] w-full flex flex-col items-start justify-start border border-(--border) bg-(--card) shadow-(--shadow) rounded-[16px] px-4 pt-4 pb-0 relative gap-[10px] transition-all hover:translate-y-[-4px]'>
      <div className='w-full flex items-center justify-between'>
        <input id='titleNode' ref={titleRef} className='w-full text-(--text) text-2xl font-bold border-0 outline-0' placeholder="Title" defaultValue={title} autoFocus readOnly={!isEditable}/>
        <button className='h-5 w-5 flex items-center justify-center cursor-pointer'>
          <img src={StarIcon} alt="" className='h-full w-full block opacity-50'/>
        </button>
      </div>
      <div className='h-full w-full overflow-hidden'>
        <textarea id='contentNode' ref={contentRef} placeholder='Enter a note' className='h-full w-full text-(--muted-text) resize-none' defaultValue={content} readOnly={!isEditable}></textarea>
      </div>
      <div className='w-full h-[100px] flex items-center justify-end border-t border-t-(--border) gap-2'>
        <button onClick={()=>{console.log('edit clicked', id);setIsEditable(true)}} className='h-6 w-6 rounded-sm flex items-center justify-center cursor-pointer text-[#928e85] hover:bg-[#2b3440] hover:text-[#7ea3c9]'>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='h-[65%] w-[65%] block'>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
          </svg>
        </button >
        <button onClick={()=> handleDelete(id)} className='h-6 w-6 rounded-sm flex items-center justify-center cursor-pointer text-[#928e85] hover:bg-[#2b3440] hover:text-[#c0574f]'>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className='h-[65%] w-[65%] block'><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
        </button>
      </div>
    </div>
  )
}

export default Note