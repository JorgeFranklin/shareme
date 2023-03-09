export type PostedBy = {
  image: string
  userName: string
  _id: string
}

export type SavedBy = {
  _key: string
  postedBy: PostedBy
}

export type Comment = {
  _key: string
  _type: string
  comment: string
  postedBy: PostedBy
}

export type PinType = {
  title: string
  userID: string
  destination: string
  comments: Comment[]
  category: string
  about: string
  image: {
    _type: string
    asset: {
      url: string
    }
  }
  postedBy: PostedBy
  save: SavedBy[]
  _id: string
  _updatedAt: string
  _type: string
  _rev: string
  _createdAt: string
}
