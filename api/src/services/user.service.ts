import User, { UserDocument } from '../models/User'
import { NotFoundError } from '../helpers/apiError'
import * as fs from 'fs'
import path from 'path'

const create = async (user: UserDocument): Promise<UserDocument> => {
  return user.save()
}

const findById = async (userId: string): Promise<UserDocument> => {
  const foundUser = await User.findById(userId)

  if (!foundUser) {
    throw new NotFoundError('User not found')
  }

  return foundUser
}

const findAll = async (): Promise<UserDocument[]> => {
  return User.find().sort({ firstName: 1 })
}

const update = async (
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const foundUser = await User.findByIdAndUpdate(userId, update, {
    new: true,
  }).select({ password: 0, token: 0 })

  if (!foundUser) {
    throw new NotFoundError('User not found')
  }

  return foundUser
}

const deleteUser = async (userId: string): Promise<UserDocument | null> => {
  const foundUser = await User.findByIdAndDelete(userId)

  if (!foundUser) {
    throw new NotFoundError('User not found')
  }

  const profilePicturePath =
    path.join(__dirname, '../../public/images/users/') +
    foundUser.profilePicture

  fs.access(profilePicturePath, (err) => {
    if (err) {
      console.log('Profile picture doesnt exist')
    } else {
      fs.unlink(profilePicturePath, (error) => {
        if (error) throw error
        console.log('Profile picture was deleted')
      })
    }
  })

  return foundUser
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteUser,
}
