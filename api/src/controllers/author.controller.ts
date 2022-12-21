import * as fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import slugify from 'slugify'
import Author from '../models/Author'
import authorService from '../services/author.service'
import { BadRequestError } from '../helpers/apiError'

// POST /authors

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data from request
    const { name, born, bio, booksWritten } = req.body
    const image = req.file?.path

    // assign data to model
    const author = new Author({
      name,
      slug: slugify(name),
      born,
      bio,
      image,
      booksWritten,
    })

    // store author in database
    await authorService.create(author)

    // send success response
    return res
      .status(200)
      .send({ success: true, message: 'Author added successfully' })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// PUT /authors/:authorId

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get author id from request params
    const authorId = req.params.authorId

    // get data from request body
    const update = req.body
    const image = req.file?.path

    // find author in database
    const existingAuthor = await Author.findOne({ _id: authorId })
    if (!existingAuthor) {
      return res.status(404).send({
        success: false,
        message: 'Author not found',
      })
    }

    // if there's an image add it to update data
    if (image) {
      update.image = image
      //delete old image from server
      if (existingAuthor.image !== 'public/images/authors/default.svg')
        fs.unlink(path.join(existingAuthor.image), (error) => {
          if (error) console.log(error)
        })
    } else {
      update.image = existingAuthor.image
    }

    // update author in database
    const updatedAuthor = await authorService.update(authorId, update)

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Author updated successfully',
      updatedAuthor,
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

// DELETE /authors/:authorId

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // delete author
    const deletedAuthor = await authorService.deleteAuthor(req.params.authorId)
    if (!deletedAuthor) {
      return res.status(400).send({
        success: false,
        error: 'Couldn\'t delete author',
      })
    }

    // if there's an image delete it
    if (
      deletedAuthor.image &&
      deletedAuthor.image !== 'public/images/authors/default.svg'
    ) {
      //delete old image from server
      fs.unlink(path.join(deletedAuthor.image), (error) => {
        if (error) console.log(error)
      })
    }

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Author has been deleted',
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

// GET /authors/profile/:authorSlug

export const findBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find author
    const author = await authorService.findBySlug(req.params.authorSlug)

    // send success response
    res.status(200).send({ success: true, author })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /authors/:authorId

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find author
    const author = await authorService.findById(req.params.authorId)

    // send success response
    res.status(200).send({ success: true, author })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /authors

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find all authors
    const authors = await authorService.findAll()

    // send success response
    res.status(200).send({ success: true, authors })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /feature
export const getFeaturedAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find featured users
    const featuredAuthors = await Author.find(
      { featured: true },
      { _id: 1, name: 1, slug: 1, image: 1 }
    )

    // send success response
    res.status(200).send({ success: true, featuredAuthors })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// PUT /feature/:authorId

export const featureAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data
    const authorId = req.params.authorId
    const { featureStatus } = req.body

    // count featured users
    const featuredCount = await Author.countDocuments({ featured: true })

    // if adding to featured, check if featured limit is already reached
    if (featureStatus === false && featuredCount >= 3) {
      return res.status(400).send({
        success: false,
        error: 'A maximum of 3 authors can be featured at once',
      })
    }

    // find author and update
    const featuredAuthor = await Author.findByIdAndUpdate(
      authorId,
      {
        featured: !featureStatus,
      },
      {
        new: true,
      }
    )

    // check if author exist
    if (!featuredAuthor) {
      res.status(404).send({ success: false, message: 'Author not found' })
    }

    if (featuredAuthor && featuredAuthor.featured) {
      // send success response
      return res
        .status(200)
        .send({ success: true, message: 'Author added to featured list' })
    } else {
      return res
        .status(200)
        .send({ success: true, message: 'Author removed from featured list' })
    }
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}
