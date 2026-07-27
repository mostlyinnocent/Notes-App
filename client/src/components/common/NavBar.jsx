import React from 'react'
import techoLogo from '../../assets/Techo Logo.svg'

function NavBar({children}) {
  return (
    <div className='nav h-screen w-65 flex flex-col justify-start items-center bg-(--sidebar) py-5 px-4 border-r border-(--border) gap-4'>
      <div className='flex items-center justify-center gap-2'>
        <div className='h-[32px] w-[32px] flex items-center justify-center'>
          <img src={techoLogo} alt="" />
        </div>
        <span className='font-newsreader text-(--text) text-[20px]'>Techō</span>  
      </div>
      <div className='h-full w-full flex flex-col items-center justify-start'>
        {children}
        <div className='h-full w-full flex flex-col items-center justify-start mt-5 gap-[4px]'>
        <button className='h-10 w-full rounded-lg flex items-center justify-start px-5 gap-2.5 text-[#928e85] hover:bg-[#2b3440] focus:text-[#7ea3c9] focus:bg-[#2b3440]'>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>
          </svg>
          <span className='font-sora'>All notes</span>
        </button>
        {/* starred notes */}
        <button className='h-10 w-full rounded-lg flex items-center justify-start px-5 gap-2.5 text-[#928e85] hover:bg-[#2b3440] focus:text-[#7ea3c9] focus:bg-[#2b3440]'>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.98l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85z"/>
          </svg>
          <span className='font-sora'>Starred</span>
        </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar