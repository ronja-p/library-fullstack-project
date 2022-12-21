import Joi from 'joi'

// get current year
const getMaxYear = () => {
  const currentDate = new Date()
  return currentDate.getFullYear()
}

export const bookSchema = {
  // create book schema
  createBookSchema: Joi.object({
    title: Joi.string().required().trim().max(80).messages({
      'string.empty': 'Title is required',
      'string.max': 'Title must contain at most 80 characters',
    }),
    isbn: Joi.string()
      .required()
      .pattern(/^[0-9]+$/, 'numbers')
      .min(10)
      .max(13)
      .messages({
        'string.empty': 'ISBN is required',
        'string.pattern.name': 'ISBN must only contain numbers',
        'string.min': 'ISBN must contain at least 10 digits',
        'string.max': 'ISBN must contain at most 13 digits',
      }),
    description: Joi.string().required().max(500).messages({
      'string.empty': 'Description is required',
      'string.max': 'Description must contain at most 500 characters',
    }),
    authors: Joi.array().items(
      Joi.string().required().messages({ 'string.empty': 'Author is required' })
    ),
    publisher: Joi.string().required().max(50).messages({
      'string.empty': 'Publisher is required',
      'string.max': 'Publisher must contain at most 50 characters',
    }),
    publishedYear: Joi.number()
      .required()
      .max(getMaxYear())
      .messages({ 'number.max': 'Can\'t be in the future' }),
    genres: Joi.array().items(
      Joi.string().required().messages({ 'string.empty': 'Genre is required' })
    ),
    pageCount: Joi.number().required(),
    image: Joi.string().allow(''),
  }),
}
