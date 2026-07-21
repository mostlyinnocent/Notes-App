import React from 'react'

function NavBar({children}) {
  return (
    <div className='nav h-screen w-20 flex justify-center items-start py-20 border-r border-neutral-400/50'>{children}</div>
  )
}

export default NavBar