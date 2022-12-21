import Author, { AuthorDocument } from '../models/Author'
import { NotFoundError } from '../helpers/apiError'

const create = async (author: AuthorDocument): Promise<AuthorDocument> => {
  return author.save()
}

const findBySlug = async (authorSlug: string): Promise<AuthorDocument> => {
  const foundAuthor = await Author.findOne({ slug: authorSlug }).populate(
    'booksWritten'
  )

  if (!foundAuthor) {
    throw new NotFoundError('Author not found')
  }

  return foundAuthor
}

const findById = async (authorId: string): Promise<AuthorDocument> => {
  const foundAuthor = await Author.findById(authorId)

  if (!foundAuthor) {
    throw new NotFoundError('Author not found')
  }

  return foundAuthor
}

const findAll = async (): Promise<AuthorDocument[]> => {
  return Author.find()
    .sort({ name: 1 })
    .populate({ path: 'booksWritten', model: 'Book' })
}

const update = async (
  authorId: string,
  update: Partial<AuthorDocument>
): Promise<AuthorDocument | null> => {
  const foundAuthor = await Author.findByIdAndUpdate(authorId, update, {
    new: true,
  })

  if (!foundAuthor) {
    throw new NotFoundError('Author not found')
  }

  return foundAuthor
}

const deleteAuthor = async (
  authorId: string
): Promise<AuthorDocument | null> => {
  const foundAuthor = await Author.findByIdAndDelete(authorId)

  if (!foundAuthor) {
    throw new NotFoundError('Author not found')
  }

  return foundAuthor
}

export default {
  create,
  findBySlug,
  findById,
  findAll,
  update,
  deleteAuthor,
}
