import { useState, useEffect } from 'react'
// ICON
import { useParams, useNavigate, Link } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from '../../utils/queries'
import { sanity } from '../../sanity'
import MasonryLayout from '../MasonryLayout'
import Spinner from '../Spinner'
import { UserSanity } from '../../types/user'
import { PinType } from '../../types/pins'
import { House, SignOut } from 'phosphor-react'

const randomImage = 'https://source.unsplash.com/1600x900/?synthwave'

const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full 2-20 outline-none'

const notActiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full 2-20 outline-none'

const UserProfile = () => {
  const [user, setUser] = useState<UserSanity>()
  const [pins, setPins] = useState<PinType[]>()
  const [text, setText] = useState('Created')
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate()
  const { userId } = useParams()

  const handleLogout = () => {
    googleLogout()
    window.localStorage.removeItem('user')

    navigate('/')
  }

  useEffect(() => {
    const queryUser = async () => {
      const query = userQuery(userId)

      const data = await sanity.fetch(query)
      setUser(data[0])
    }

    queryUser()
  }, [userId])

  useEffect(() => {
    const queryUserPins = async () => {
      if (text === 'Created') {
        const createdPinsQuery = userCreatedPinsQuery(userId)

        const data = await sanity.fetch(createdPinsQuery)
        setPins(data)
      } else {
        const savedPinsQuery = userSavedPinsQuery(userId)

        const data = await sanity.fetch(savedPinsQuery)
        setPins(data)
      }
    }

    queryUserPins()
  }, [text, userId])

  if (!userId) return <Spinner message="Loading profile..." />

  return (
    <div className="relative pb-2 h-full justify-center  items-center">
      <div className="flex flex-col pb-5">
        <div className="relative  flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              alt="user banner picture"
              className="w-full h-370 2xsl;h-510 shadow-lg object-cover"
            />
            {user?.image ? (
              <img
                src={user?.image}
                alt="user profile picture"
                className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="bg-gray-100 rounded-full w-20 h-20 -mt-10 shadow-xl"></div>
            )}
            <h1 className="font-bold text-3xl text-center mt-3">
              {user?.userName}
            </h1>
            <Link to="/" className="absolute top-0 z-1 left-0 p-2">
              <button className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md text-gray-500">
                <House size={20} weight="bold" />
              </button>
            </Link>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === localStorage.getItem('user') && (
                <button
                  onClick={handleLogout}
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md text-red-500"
                >
                  <SignOut size={20} weight="bold" />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                if (e.currentTarget.textContent) {
                  setText(e.currentTarget.textContent)
                  setActiveBtn('created')
                }
              }}
              className={`${
                activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                if (e.currentTarget.textContent) {
                  setText(e.currentTarget.textContent)
                  setActiveBtn('saved')
                }
              }}
              className={`${
                activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          <div className="px-2">
            {pins?.length ? (
              <MasonryLayout pins={pins} />
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl  mt-2">
                {'No pins here :('}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
