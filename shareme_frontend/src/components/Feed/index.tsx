import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { sanity } from '../../sanity'
import { PinType } from '../../types/pins'
import { searchQuery } from '../../utils/queries'
import { feedQuery } from '../../utils/queries'

import MasonryLayout from '../MasonryLayout'
import Spinner from '../Spinner'

const Feed = () => {
  const [pins, setPins] = useState<PinType[]>([])
  const [loading, setLoading] = useState(true)
  const { categoryId } = useParams()

  useEffect(() => {
    const queryCategories = async () => {
      setLoading(true)
      if (categoryId) {
        const query = searchQuery(categoryId)
        const data = await sanity.fetch(query)
        setPins(data)
        setLoading(false)
      } else {
        const data = await sanity.fetch(feedQuery)
        setPins(data)
        setLoading(false)
      }
    }

    queryCategories()
  }, [categoryId])

  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />
  }

  return pins.length ? (
    <MasonryLayout pins={pins} />
  ) : (
    <h2 className="font-bold text-2xl">No pins available.</h2>
  )
}

export default Feed
