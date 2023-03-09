import { NavLink, Link } from 'react-router-dom'
import { UserSanity } from '../../types/user'

import categoriesMock from '../../utils/categoriesMock'
import logo from '../../assets/logo.png'
import { House } from 'phosphor-react'

const isNotActiveStyle =
  'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-75 ease-in-out capitalize'

const isActiveStyle =
  'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-75 ease-in-out capitalize'

export type SidebarProps = {
  user?: UserSanity
  closeToggle?: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({ user, closeToggle }: SidebarProps) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false)
  }

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img
            src={logo}
            alt="camera written shareme on your right"
            className="w-full"
          />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <House size={24} weight="fill" />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">
            Discover categories
          </h3>
          {categoriesMock
            .slice(0, categoriesMock.length - 1)
            .map((category) => (
              <NavLink
                key={category.name}
                to={`/category/${category.name.toLocaleLowerCase()}`}
                className={({ isActive }) =>
                  isActive ? isActiveStyle : isNotActiveStyle
                }
                onClick={handleCloseSidebar}
              >
                <img
                  src={category.image}
                  alt="category image"
                  className="w-8 h-8 rounded-full shadow-sm"
                />
                {category.name}
              </NavLink>
            ))}
        </div>
      </div>
      {user ? (
        <Link
          to={`/user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            alt="your profile image"
            className="w-10 h-10 rounded-full"
            referrerPolicy="no-referrer"
          />
          <p>{user.userName}</p>
        </Link>
      ) : (
        <div className="px-2 py-4">
          <Link
            to="/login"
            className="flex items-center justify-center bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none max-md:hidden"
          >
            Sign-in
          </Link>
        </div>
      )}
    </div>
  )
}

export default Sidebar
