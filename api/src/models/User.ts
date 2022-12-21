import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  profilePicture: string
  isAdmin: boolean
  borrowedBooks: string[]
  token: string
  createdAt: Date
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minLength: [2, 'First name must be at least 2 characters'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minLength: [2, 'Last name must be at least 2 characters'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
  },
  profilePicture: {
    type: String,
    default: 'public/images/users/default.svg',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  borrowedBooks: [
    {
      type: String,
      default: [],
    },
  ],
  token: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model<UserDocument>('User', userSchema)
