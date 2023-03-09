import { useState, useEffect } from 'react'

import MasonryLayout from '../MasonryLayout'
import { sanity } from '../../sanity'
import { feedQuery, searchQuery } from '../../utils/queries'
import Spinner from '../Spinner'
import { PinType } from '../../types/pins'

export type SearchProps = {
  searchTerm?: string
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>
}

const Search = ({ searchTerm, setSearchTerm }: SearchProps) => {
  const [pins, setPins] = useState<PinType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const querySearchTerm = async () => {
      if (searchTerm) {
        setLoading(true)
        const query = searchQuery(searchTerm.toLowerCase())
        const data = await sanity.fetch(query)
        setPins(data)
        setLoading(false)
      } else {
        const data = await sanity.fetch(feedQuery)
        setPins(data)
        setLoading(false)
      }
    }

    querySearchTerm()
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="Searching for pins..." />}
      {pins.length > 0 && <MasonryLayout pins={pins} />}
      {pins.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl">No pins found.</div>
      )}
    </div>
  )
}

export default Search
