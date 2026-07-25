import React, { useState } from 'react'
import StarIcon from '../../assets/star.svg'
import EditIcon from '../../assets/pen.svg'
import { useRef } from 'react'

function Note({id, title, content, starred, handleBlur}) {

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
      }} className='h-[200px] w-full flex flex-col items-start justify-start bg-neutral-100 border border-neutral-600/20 rounded-[16px] px-4 py-4 relative gap-[10px]'>
      <div className='w-full flex items-center justify-between'>
        <input id='titleNode' ref={titleRef} className='w-full text-2xl font-bold border-0 outline-0' placeholder="Title" defaultValue={title} autoFocus readOnly={!isEditable}/>
        <button className='h-5 w-5 flex items-center justify-center cursor-pointer'>
          <img src={StarIcon} alt="" className='h-full w-full block opacity-50'/>
        </button>
      </div>
      <div className='h-[500px] overflow-hidden'>
        <textarea id='contentNode' ref={contentRef} placeholder='Enter a note' className='h-full w-full resize-none' defaultValue={content} readOnly={!isEditable}></textarea>
      </div>
      <div className='w-full h-full flex items-end justify-end border-t border-t-neutral-300 px-5'>
        <button onClick={()=>{console.log('edit clicked', id);setIsEditable(true)}} className='h-4 w-4 flex items-center justify-center cursor-pointer'>
          <img src={EditIcon} alt="" className='h-full w-full block opacity-50'/>
        </button>
      </div>
    </div>
  )
}

export default Note