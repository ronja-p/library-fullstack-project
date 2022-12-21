import Book, { BookDocument } from '../models/Book'
import { NotFoundError } from '../helpers/apiError'

const create = async (book: BookDocument): Promise<BookDocument> => {
  return book.save()
}

const findById = async (bookId: string): Promise<BookDocument> => {
  const foundBook = await Book.findById(bookId)

  if (!foundBook) {
    throw new NotFoundError('Book not found')
  }

  return foundBook
}

const findByIdAndPopulate = async (bookId: string): Promise<BookDocument> => {
  const foundBook = await Book.findById(bookId).populate('authors')

  if (!foundBook) {
    throw new NotFoundError('Book not found')
  }

  return foundBook
}

const findAll = async (): Promise<BookDocument[]> => {
  return Book.find().sort({ title: 1 }).populate('authors')
}

const findAllAndPaginate = async (page: number): Promise<BookDocument[]> => {
  const limit = 4
  return Book.find()
    .sort({ title: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('authors')
}

const update = async (
  bookId: string,
  update: Partial<BookDocument>
): Promise<BookDocument | null> => {
  const foundBook = await Book.findByIdAndUpdate(bookId, update, {
    new: true,
  })

  if (!foundBook) {
    throw new NotFoundError('Book not found')
  }

  return foundBook
}

const deleteBook = async (bookId: string): Promise<BookDocument | null> => {
  const foundBook = Book.findByIdAndDelete(bookId)

  if (!foundBook) {
    throw new NotFoundError('Book not found')
  }

  return foundBook
}

export default {
  create,
  findById,
  findByIdAndPopulate,
  findAll,
  findAllAndPaginate,
  update,
  deleteBook,
}
