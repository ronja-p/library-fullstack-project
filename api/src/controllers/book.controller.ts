import * as fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import Book from '../models/Book'
import bookService from '../services/book.service'
import { BadRequestError } from '../helpers/apiError'
import Author from '../models/Author'
import userService from '../services/user.service'

// POST /books

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data from request
    const {
      title,
      isbn,
      description,
      authors,
      publisher,
      publishedYear,
      genres,
      pageCount,
    } = req.body

    const image = req.file?.path

    // assign data to model
    const book = new Book({
      title,
      isbn,
      description,
      authors,
      publisher,
      publishedYear,
      genres,
      pageCount,
      image,
    })

    // store book in database
    const createdBook = await bookService.create(book)

    // find each author and add book
    book.authors.map(async (author) => {
      const foundAuthor = await Author.findById(author)
      if (foundAuthor) {
        const authorBooks = [...foundAuthor.booksWritten, createdBook._id]
        await Author.findByIdAndUpdate(
          author,
          { booksWritten: authorBooks },
          {
            new: true,
          }
        )
      }
    })

    // send success response
    return res
      .status(200)
      .send({ success: true, message: 'Book added successfully' })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// PUT /books/:bookId

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get book id from request params
    const bookId = req.params.bookId

    // get data from request body
    const update = req.body
    const image = req.file?.path

    // find book in database
    const existingBook = await Book.findOne({ _id: bookId })
    if (!existingBook) {
      return res.status(404).send({
        success: false,
        message: 'Book not found',
      })
    }

    // if there's an image add it to update data
    if (image) {
      update.image = image
      //delete old image from server
      if (existingBook.image !== 'public/images/books/default.svg')
        fs.unlink(path.join(existingBook.image), (error) => {
          if (error) console.log(error)
        })
    } else {
      update.image = existingBook.image
    }

    // update book in database
    const updatedBook = await bookService.update(bookId, update)

    // find each author and add book
    if (!updatedBook) {
      return res.status(400).send({
        success: false,
        error: 'Couldn\'t update book',
      })
    }
    updatedBook.authors.map(async (author) => {
      const foundAuthor = await Author.findById(author)
      if (foundAuthor && !foundAuthor?.booksWritten.includes(updatedBook._id)) {
        const authorBooks = [...foundAuthor.booksWritten, updatedBook._id]
        await Author.findByIdAndUpdate(
          author,
          { booksWritten: authorBooks },
          {
            new: true,
          }
        )
      }
    })

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Book updated successfully',
      updatedBook,
    })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// DELETE /books/:bookId

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // delete book
    const deletedBook = await bookService.deleteBook(req.params.bookId)
    if (!deletedBook) {
      return res.status(400).send({
        success: false,
        error: 'Couldn\'t delete book',
      })
    }

    // if there's an image delete it
    if (
      deletedBook.image &&
      deletedBook.image !== 'public/images/books/default.svg'
    ) {
      //delete old image from server
      fs.unlink(path.join(deletedBook.image), (error) => {
        if (error) console.log(error)
      })
    }

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Book has been deleted',
    })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /books/:bookId

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find book
    const book = await bookService.findById(req.params.bookId)

    // send success response
    res.status(200).send({ success: true, book })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /books/populate/:bookId

export const findByIdAndPopulate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find book
    const book = await bookService.findByIdAndPopulate(req.params.bookId)

    // send success response
    res.status(200).send({ success: true, book })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /books

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get all books from database
    const books = await bookService.findAll()

    // send success response
    return res.status(200).send({ success: true, books })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /books/count

export const countTotalBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get all books from database
    const booksTotal = await Book.find().countDocuments()

    // send success response
    return res.status(200).send({ success: true, booksTotal })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /books/paginate

export const findAllAndPaginate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page } = req.query

    const pageNumber = Number(page)

    // get paginated books from database
    const books = await bookService.findAllAndPaginate(pageNumber)

    // send success response
    return res.status(200).send({ success: true, books })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /books/search/:searchValue

export const searchBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get search value from request params
    const { searchValue } = req.query

    // get paginated books from database
    const books = await Book.find({
      $or: [
        { title: { $regex: searchValue, $options: 'i' } },
        { isbn: { $regex: searchValue, $options: 'i' } },
      ],
    })

    // send success response
    return res.status(200).send({ success: true, books })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// PATCH /books/borrow/:bookId

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get book id from request params
    const bookId = req.params.bookId

    // get user id from request body
    const userId = req.body.id

    // find book
    const book = await bookService.findById(bookId)
    if (!book) {
      return res.status(404).send({
        success: false,
        error: 'Book not found',
      })
    }

    if (book.borrowerId === userId) {
      return res.status(400).send({
        success: false,
        error: 'You have borrowed this book already',
      })
    }

    if (book.borrowerId) {
      return res.status(404).send({
        success: false,
        error: 'Someone else has borrowed this book already',
      })
    }

    // find user
    const user = await userService.findById(userId)
    if (!user) {
      return res.status(404).send({
        success: false,
        error: 'User not found',
      })
    }

    // check if user has already borrowed 3 books
    if (user.borrowedBooks.length >= 3) {
      return res.status(404).send({
        success: false,
        error: 'You can\'t borrow more than three books at once',
      })
    }

    // update book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        borrowerId: userId,
        borrowDate: Date.now(),
        returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    ).populate('authors')

    // update user
    const updatedUser = await userService.update(userId, {
      borrowedBooks: [...user.borrowedBooks, bookId],
    })

    // send success response
    return res.status(200).send({
      success: true,
      message: `Added "${book.title}" to My Books for one week`,
      updatedBook,
      updatedUser,
    })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// PATCH /books/borrow/:bookId

export const returnBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get book id from request params
    const bookId = req.params.bookId

    // get user id from request body
    const userId = req.body.id

    // find book
    const book = await bookService.findById(bookId)
    if (!book) {
      return res.status(404).send({
        success: false,
        error: 'Book not found',
      })
    }

    console.log(String(book.borrowerId), userId)

    if (String(book.borrowerId) !== userId) {
      return res.status(400).send({
        success: false,
        error: 'You have\'nt borrowed this book',
      })
    }

    // find user
    const user = await userService.findById(userId)
    if (!user) {
      return res.status(404).send({
        success: false,
        error: 'User not found',
      })
    }

    // update book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        $unset: {
          borrowerId: 1,
          borrowDate: 1,
          returnDate: 1,
        },
      },
      { new: true }
    ).populate('authors')

    // update user
    const updatedUser = await userService.update(userId, {
      borrowedBooks: user.borrowedBooks.filter((book) => book !== bookId),
    })

    // send success response
    return res.status(200).send({
      success: true,
      message: `Returned "${book.title}"`,
      updatedBook,
      updatedUser,
    })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /books/sort

export const sortBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get search value from request params
    const property = String(req.query.property)
    const order = Number(req.query.order)

    console.log(property, order)

    if (!property || !order) {
      return res.status(404).send({
        success: false,
        error: 'Property or order missing',
      })
    }

    const sortedBooks = await Book.find().sort({
      [property]: order === 1 ? 1 : -1,
    })

    // send success response
    return res.status(200).send({ success: true, sortedBooks })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}
