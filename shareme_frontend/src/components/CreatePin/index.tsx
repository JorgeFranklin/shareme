import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrashSimple, UploadSimple } from 'phosphor-react'

import { SanityImageAssetDocument } from '@sanity/client'
import { sanity } from '../../sanity'

import Spinner from '../Spinner'
import categoriesMock from '../../utils/categoriesMock'

import { UserSanity } from '../../types/user'

export type CreatePinProps = {
  user?: UserSanity
}

const CreatePin = ({ user }: CreatePinProps) => {
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(false)
  const [category, setCategory] = useState('')
  const [imageAsset, setImageAsset] = useState<SanityImageAssetDocument>()
  const [wrongImageType, setWrongImageType] = useState(false)
  const [wrongDestination, setWrongDestination] = useState(false)

  const navigate = useNavigate()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const supportedTypes = [
      'image/png',
      'image/svg',
      'image/jpeg',
      'image/gif',
      'image/tiff',
    ]
    const selectedFile = e.target.files![0]
    const typesAreCorrect = supportedTypes.includes(selectedFile.type)

    if (typesAreCorrect) {
      try {
        setWrongImageType(false)
        setLoading(true)

        const document = await sanity.assets.upload('image', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })

        setImageAsset(document)
        setLoading(false)
      } catch (err) {
        console.log('Image upload error', err)
      }
    } else {
      setWrongImageType(true)
    }
  }

  const savePin = async () => {
    setFields(false)
    const correctDestination =
      destination.includes('http') && destination.includes('://')

    if (!correctDestination) {
      setWrongDestination(true)
      return
    }
    if (title && about && destination && imageAsset?._id && category) {
      setFields(false)
      const document = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id,
        },
        category,
      }

      await sanity.create(document)
      navigate('/')
    } else {
      setFields(true)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 font-bold text-xl mb-5">
          Please fill in all the fields.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full rounded-3xl shadow-sm">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full rounded-3xl">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420 rounded-3xl">
            {loading && <Spinner />}
            {wrongImageType && (
              <p className="text-red-500 font-bold text-xl">
                Wrong image type.
              </p>
            )}
            {wrongDestination && (
              <p className="text-red-500 font-bold text-sm">
                Destination must contain "http" or "https".
              </p>
            )}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <UploadSimple />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <p className="mt-6 text-gray-400 text-center">
                    Use JPG, JPEG, SVG, PNG, GIF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={handleUpload}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full object-cover rounded-3xl"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(undefined)}
                >
                  <TrashSimple />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="outline-none text-xl sm:text-2xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                alt="your profile picture"
                className="w-10 h-10 rounded-full"
                referrerPolicy="no-referrer"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about?"
            className="outline-none text-xl sm:text-2xl border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-xl sm:text-2xl border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose pin category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white">
                  Select category
                </option>
                {categoriesMock.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-center mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full 2-28 outline-none"
              >
                Post pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
