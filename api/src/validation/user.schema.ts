import Joi from 'joi'
import passwordComplexity from 'joi-password-complexity'

// set password complexity
const complexityOptions = {
  min: 8,
  max: 50,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
}

export const userSchemas = {
  // user registration schema
  registerUserSchema: Joi.object({
    firstName: Joi.string().required().trim().min(2).max(20).messages({
      'any.required': 'First name is required',
      'string.min': 'First name must contain at least 2 characters',
      'string.max': 'First name must contain at most 20 characters',
    }),
    lastName: Joi.string().required().trim().min(2).max(20).messages({
      'any.required': 'Last name is required',
      'string.min': 'Last name must contain at least 2 characters',
      'string.max': 'Last name must contain at most 20 characters',
    }),
    email: Joi.string().required().trim().email().messages({
      'any.required': 'Email is required',
      'string.email': 'Not a valid email address',
    }),
    password: passwordComplexity(complexityOptions, 'Password')
      .required()
      .messages({
        'any.required': 'Password is required',
      }),
    passwordConfirm: Joi.any().required().valid(Joi.ref('password')).messages({
      'any.required': 'Confirm password is required',
      'any.only': 'Passwords must match',
    }),
    profilePicture: Joi.string().allow(''),
  }),
  // user login schema
  loginUserSchema: Joi.object({
    email: Joi.string().required().trim().email().messages({
      'any.required': 'Email is required',
      'string.email': 'Not a valid email address',
    }),
    password: passwordComplexity(complexityOptions, 'Password')
      .required()
      .messages({
        'any.required': 'Password is required',
      }),
  }),
  // account recovery schema
  recoverUserSchema: Joi.object({
    email: Joi.string().required().trim().email().messages({
      'any.required': 'Email is required',
      'string.email': 'Not a valid email address',
    }),
  }),
  // user update schema
  updateUserSchema: Joi.object({
    firstName: Joi.string().required().trim().min(2).max(20).messages({
      'any.required': 'First name is required',
      'string.min': 'First name must contain at least 2 characters',
      'string.max': 'First name must contain at most 20 characters',
    }),
    lastName: Joi.string().required().trim().min(2).max(20).messages({
      'any.required': 'Last name is required',
      'string.min': 'Last name must contain at least 2 characters',
      'string.max': 'Last name must contain at most 20 characters',
    }),
    email: Joi.string().required().trim().email().messages({
      'any.required': 'Email is required',
      'string.email': 'Not a valid email address',
    }),
    profilePicture: Joi.string().allow(''),
  }),
  // update password schema
  updatePasswordSchema: Joi.object({
    password: passwordComplexity(complexityOptions, 'Password')
      .required()
      .messages({
        'any.required': 'Password is required',
      }),
    passwordConfirm: Joi.any().required().valid(Joi.ref('password')).messages({
      'any.required': 'Confirm password is required',
      'any.only': 'Passwords must match',
    }),
  }),
}
