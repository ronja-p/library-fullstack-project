import express from 'express'

import {
  createBook,
  deleteBook,
  findAll,
  countTotalBooks,
  findAllAndPaginate,
  searchBooks,
  sortBooks,
  findById,
  findByIdAndPopulate,
  updateBook,
  borrowBook,
  returnBook,
} from '../controllers/book.controller'
import { runValidation } from '../validation/runValidation'
import { isAdmin, isLoggedIn } from '../middlewares/authorizeUser'
import { bookSchema } from '../validation/book.schema'
import { uploadBookImage } from '../middlewares/uploadFile'

const router = express.Router()

// create book
router.post(
  '/',
  uploadBookImage.single('image'),
  runValidation(bookSchema.createBookSchema),
  createBook
)

// get all books
router.get('/', findAll)

// count total books
router.get('/count', countTotalBooks)

// get paginated books
router.get('/paginate', findAllAndPaginate)

// get books from search
router.get('/search', searchBooks)

// get sorted books
router.get('/sort', sortBooks)

// get book by id and populate
router.get('/populate/:bookId', findByIdAndPopulate)

// get book by id
router.get('/:bookId', findById)

//update book by id
router.put(
  '/:bookId',
  isLoggedIn,
  isAdmin,
  uploadBookImage.single('image'),
  updateBook
)

// delete book by id
router.delete('/:bookId', isLoggedIn, isAdmin, deleteBook)

// borrow book
router.patch('/borrow/:bookId', isLoggedIn, borrowBook)

// borrow book
router.patch('/return/:bookId', isLoggedIn, returnBook)

export default router
