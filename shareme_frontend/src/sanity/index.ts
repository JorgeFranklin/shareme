import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const sanity = createClient({
  projectId: import.meta.env.VITE_REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-10-21',
  useCdn: false,
  token: import.meta.env.VITE_REACT_APP_SANITY_PROJECT_TOKEN,
  ignoreBrowserTokenWarning: true,
})

const builder = imageUrlBuilder(sanity)

export const urlFor = (source: SanityImageSource) => builder.image(source)
