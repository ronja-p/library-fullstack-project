import mongoose, { Document, Schema } from 'mongoose'

export type BookDocument = Document & {
  title: string
  isbn: string
  description: string
  authors: string[]
  publisher: string
  publishedYear: number
  genres: string[]
  pageCount: number
  image: string
  rating: number
  isBorrowed: boolean
  borrowerId: string
  borrowDate: Date
  returnDate: Date
}

// get current year
const getMaxYear = () => {
  const currentDate = new Date()
  return currentDate.getFullYear()
}

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    reuired: true,
    index: true,
  },
  isbn: {
    type: String,
    reuired: true,
  },
  description: {
    type: String,
    reuired: true,
  },
  authors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      reuired: true,
    },
  ],
  publisher: {
    type: String,
    reuired: true,
  },
  publishedYear: {
    type: Number,
    required: true,
    max: getMaxYear(),
  },
  genres: [
    {
      type: String,
      reuired: true,
    },
  ],
  pageCount: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    default: 'public/images/books/default.svg',
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  isBorrowed: {
    type: Boolean,
  },
  borrowerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  borrowDate: {
    type: Date,
  },
  returnDate: {
    type: Date,
  },
})

export default mongoose.model<BookDocument>('Book', bookSchema)
