import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import NotesLayout from '../components/layout/NotesLayout'
import { Navigate } from 'react-router-dom'

const router = createBrowserRouter([
  {
    element: <MainLayout/>,
    children: [
      {
        index: true,
        element: <Navigate to="/notes" replace/>
      },
      { path: '/notes/starred',
        element: <NotesLayout onlyStarred/>
      },
      {
        path: '/notes/:noteId?',
        element: <NotesLayout/>,
      },
    ]
  }
])

export default router