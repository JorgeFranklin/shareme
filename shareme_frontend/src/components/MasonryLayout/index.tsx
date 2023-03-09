import { PinType } from '../../types/pins'
import Masonry from 'react-masonry-css'

import Pin from '../../components/Pin'

const breakPointObject = {
  default: 4,
  3000: 6,
  2000: 5,
  1400: 4,
  1200: 3,
  1000: 2,
  500: 1,
}

export type MasonryLayoutProps = {
  pins: PinType[]
}

const MasonryLayout = ({ pins }: MasonryLayoutProps) => {
  return (
    <Masonry
      className="flex animate-slide-fwd"
      breakpointCols={breakPointObject}
    >
      {pins?.map((pin) => (
        <Pin key={pin._id} {...pin} />
      ))}
    </Masonry>
  )
}

export default MasonryLayout
