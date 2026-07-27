import React from 'react'

function Header() {
  return (
    <>
    <div className='header h-20 w-full flex flex-col justify-center px-5 gap-2 mt-5'>
      <span className='font-sora text-(--muted-text)'>WORKSPACE</span>
      <span className='text-4xl text-(--text) font-newsreader font-bold'>All Notes</span>
    </div>
    </>
  )
}

export default Header