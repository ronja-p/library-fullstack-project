type JwtPayloadUser = {
  firstName: string
  lastName: string
  email: string
  hashPassword: string
  profilePicture: string | null
}

type JwtPayloadId = {
  _id: string
}
