import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
// ICON

import { sanity, urlFor } from '../../sanity'
import MasonryLayout from '../MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../../utils/queries'
import Spinner from '../Spinner'
import { UserSanity } from '../../types/user'
import { PinType } from '../../types/pins'
import { DownloadSimple, PaperPlaneTilt, SpinnerGap } from 'phosphor-react'
import { Oval } from 'react-loader-spinner'

export type PinDetailProps = {
  user?: UserSanity
}

const PinDetail = ({ user }: PinDetailProps) => {
  const [pins, setPins] = useState<PinType[]>()
  const [pinDetail, setPinDetail] = useState<PinType>()
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()

  if (!user) {
    const navigate = useNavigate()
    navigate('/login')
  }

  const fetchPinDetails = async () => {
    let query = pinDetailQuery(pinId)

    if (query) {
      const data = await sanity.fetch(query)
      setPinDetail(data[0])

      if (data[0]) {
        query = pinDetailMorePinQuery(data[0])

        const moreData = await sanity.fetch(query)

        setPins(moreData)
      }
    }
  }

  const handleComment = async () => {
    if (comment && pinId) {
      setAddingComment(true)

      await sanity
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidV4(),
            postedBy: { _type: 'postedBy', _ref: user?._id },
          },
        ])
        .commit()

      fetchPinDetails()
      setComment('')
      setAddingComment(false)
      window.location.reload()
    }
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])

  if (!pinDetail) return <Spinner message="Loading pin..." />

  return (
    <>
      <div
        className="flex xl-flex-row flex-col m-auto bg-white"
        style={{ maxWidth: '1500px', borderRadius: '32px' }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            alt="user post"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-red-500 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl hover:shadow-md outline-none transition-all duration-300"
              >
                <DownloadSimple weight="bold" />
              </a>
            </div>
            <a
              href={pinDetail.destination}
              target="_blank"
              rel="noreferrer"
              className="bg-red-500 rounded-full flex items-center justify-center text-white hover:shadow-md outline-none px-2 transition-all duration-200"
            >
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-semibold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg w-40"
          >
            <img
              src={pinDetail.postedBy?.image}
              alt="user profile picture"
              className="w-10 h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <hr
            className="mt-7 mb-6 w-96 border-none bg-gradient-to-r from-gray-300 to-white"
            style={{ height: '1px' }}
          />
          <h2 className="text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, index) => (
              <div key={index} className="flex gap-2 mt-5 bg-white rounded-lg">
                <img
                  src={comment.postedBy.image}
                  alt="user image"
                  className="w-10 h-10 rounded-full cursor-pointer mt-1"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="flex flex-col flex-wrap pb-1 overflow-clip"
                  style={{ maxWidth: '1360px' }}
                >
                  <p className="text-black font-bold text-sm">
                    {comment.postedBy.userName}
                  </p>
                  <p className="break-words w-full overflow-clip pr-4">
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-end mt-6 gap-3">
            <Link
              to={`/user-profile/${pinDetail.postedBy?._id}`}
              className="flex items-center"
            >
              {user?.image ? (
                <img
                  src={user?.image}
                  alt="user profile picture"
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <></>
              )}
            </Link>
            <input
              type="text"
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              onClick={handleComment}
              className="flex items-center justify-center bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none md:w-20 md:h-11 w-20 h-9"
              disabled={addingComment}
            >
              {addingComment ? (
                <Oval
                  height={22}
                  width={22}
                  color="white"
                  secondaryColor="white"
                />
              ) : (
                <PaperPlaneTilt size={20} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </div>
      {pins?.length ? (
        <>
          <h2 className="text-center font-bold text-2x mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." className="mt-4" />
      )}
    </>
  )
}

export default PinDetail
