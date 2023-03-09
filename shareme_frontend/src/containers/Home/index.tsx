import { useState, useRef, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { sanity } from '../../sanity/index'
import { userQuery } from '../../utils/queries'
import getUserInfo from '../../utils/get-user-info'

import { Sidebar, UserProfile } from '../../components/allComponents'
import { Oval } from 'react-loader-spinner'
import Pins from '../Pins'

import logo from '../../assets/logo.png'
import { UserSanity } from '../../types/user'
import { List, XCircle } from 'phosphor-react'

const Home = () => {
  const [user, setUser] = useState<UserSanity>()
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const scrollRef = useRef<any>(null)
  const userInfo = getUserInfo()

  useEffect(() => {
    const queryUser = async () => {
      if (userInfo) {
        const query = userQuery(userInfo)
        const data = await sanity.fetch(query)

        setUser(data[0])
      }
    }

    queryUser()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="relative p-2 w-full flex flex-row justify-between items-center shadow-md">
          <List
            size={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/" className="">
            <img
              src={logo}
              alt="photo camera with a text written shareme on the right"
              className="w-28 absolute inset-0 m-auto"
            />
          </Link>
          {user?.image ? (
            <Link to={`user-profile/${user?._id}`}>
              <img
                src={user?.image}
                alt="your profile picture"
                className="w-12 rounded-full border-red-400 border-2"
                referrerPolicy="no-referrer"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center bg-red-500 text-white rounded-full px-3 py-2 font-semibold text-sm outline-none"
            >
              Sign-in
            </Link>
          )}
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <XCircle
                size={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div
        className="pb-2 flex-1 h-screen overflow-y-scroll overflow-x-hidden"
        ref={scrollRef}
      >
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home
