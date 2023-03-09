import { ArrowUpRight, DownloadSimple, TrashSimple } from 'phosphor-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { sanity, urlFor } from '../../sanity'
import { PinType } from '../../types/pins'
import getUserInfo from '../../utils/get-user-info'

export type PinProps = PinType

const Pin = ({ _id, destination, image, postedBy, save }: PinProps) => {
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const userInfo = getUserInfo()
  const navigate = useNavigate()

  const alreadySaved =
    save?.filter(({ postedBy: { _id } }) => _id === userInfo)?.length > 0

  const savePin = async (_id: string) => {
    if (!alreadySaved) {
      setSavingPost(true)
      await sanity
        .patch(_id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: userInfo,
            },
          },
        ])
        .commit()

      window.location.reload()
    }
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    savePin(_id)
  }

  const deletePin = async (_id: string) => {
    await sanity.delete(_id)
    window.location.reload()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deletePin(_id)
  }

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all  duration-500 ease-in-out"
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        <img
          src={urlFor(image.asset.url).width(250).url()}
          className="rounded-lg w-full"
          alt="user post"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: '100%' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image.asset.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <DownloadSimple />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save && save.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={handleSave}
                  disabled={savingPost}
                >
                  {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {!!destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold text-xs p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <ArrowUpRight />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}
              {postedBy?._id === userInfo && (
                <button
                  type="button"
                  className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={handleDelete}
                >
                  <TrashSimple size={23} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy._id}`}
        className="flex gap-2 mt-2 items-center"
        onClick={() => {}}
      >
        <img
          src={postedBy.image}
          alt="user profile picture"
          className="w-8 h-8 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        <p className="font-semibold capitalize">{postedBy.userName}</p>
      </Link>
    </div>
  )
}

export default Pin
