import Joi, { required } from 'joi'

// get current date
const getMaxDate = () => {
  return new Date()
}

export const authorSchemas = {
  // user registration schema
  authorSchema: Joi.object({
    name: Joi.string().required().trim().min(2).max(50).messages({
      'string.empty': 'Name is required',
      'string.max': 'Name must contain at most 50 characters',
    }),
    born: Joi.date().required().max(getMaxDate()).messages({
      'any.required': 'Date of birth is required',
      'date.max': 'Date can\'t be in the future',
    }),
    bio: Joi.string().allow('').max(500).messages({
      'string.max': 'Bio must be at most 500 characters',
    }),
    image: Joi.string().allow(''),
  }),
}
