export type UserGoogle = {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  picture: string
  sub: string
}

export type UserSanity = {
  image: string
  userName: string
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
}
