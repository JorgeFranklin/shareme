import { createBrowserRouter } from 'react-router-dom'
import Feed from '../components/Feed'
import Login from '../components/Login'
import UserProfile from '../components/UserProfile'
import Home from '../containers/Home'
import Pins from '../containers/Pins'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/*',
    element: <Home />,
  },
  {
    path: '/user-profile/:userId',
    element: <UserProfile />,
  },
  {
    path: '/*',
    element: <Pins />,
  },
])

export default router
