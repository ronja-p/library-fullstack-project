import mongoose, { Document, Schema } from 'mongoose'

export type AuthorDocument = Document & {
  name: string
  slug: string
  born: string
  bio: string
  image: string
  booksWritten: string[]
  featured: boolean
  createdAt: Date
}

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  born: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  bio: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: 'public/images/authors/default.svg',
  },
  booksWritten: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model<AuthorDocument>('Author', authorSchema)
