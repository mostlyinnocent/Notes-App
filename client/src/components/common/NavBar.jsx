import React from 'react'

function NavBar({children}) {
  return (
    <div className='nav h-screen w-65 flex justify-center items-start bg-(--sidebar) py-5 px-4 border-r border-(--border)'>{children}</div>
  )
}

export default NavBar