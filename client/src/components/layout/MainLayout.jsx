import React from 'react'
import Header from '../common/Header'
import NavBar from '../common/NavBar'
import { Outlet } from 'react-router-dom'
import './MainLayout.css'
import AddNoteButton from '../common/AddNoteButton'

function MainLayout() {
  return (
    <div className="layout h-full w-full">
      <Header></Header>
      <NavBar>
        <AddNoteButton></AddNoteButton>
      </NavBar>
      <main className='main flex-1'><Outlet/></main>
    </div>
  )
}

export default MainLayout