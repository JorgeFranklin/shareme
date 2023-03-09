import { MagnifyingGlass, Plus } from 'phosphor-react'
import { Link, useNavigate } from 'react-router-dom'
import { UserSanity } from '../../types/user'
// IMPORTAR ICONS PARECIDOS

export type NavbarProps = {
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  user?: UserSanity
}

const Navbar = ({ searchTerm, setSearchTerm, user }: NavbarProps) => {
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <MagnifyingGlass size={18} className="ml-1" />
        <input
          type="text"
          onChange={({ target }) => setSearchTerm(target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className="p-2 w-full bg-white outline-none placeholder:text-black"
        />
      </div>
      <div className="flex gap-2">
        <Link
          to={`/user-profile/${user._id}`}
          className="hidden md:block min-w-min w-12 h-12"
        >
          <img
            src={user.image}
            alt="your profile picture"
            className="rounded-lg"
            referrerPolicy="no-referrer"
          />
        </Link>
        <Link
          to={`create-pin`}
          className="bg-white text-gray-500 rounded-full md:rounded-lg min-w-min w-12 h-12 flex justify-center items-center shadow-sm"
        >
          <Plus size={20} weight="bold" />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
