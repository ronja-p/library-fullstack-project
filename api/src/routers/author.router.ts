import express from 'express'
import { isAdmin } from '../middlewares/authorizeUser'
import { isLoggedIn } from '../middlewares/authorizeUser'

import {
  createAuthor,
  deleteAuthor,
  featureAuthor,
  findAll,
  findById,
  findBySlug,
  updateAuthor,
  getFeaturedAuthors,
} from '../controllers/author.controller'
import { uploadAuthorImage } from '../middlewares/uploadFile'
import { runValidation } from '../validation/runValidation'
import { authorSchemas } from '../validation/author.schema'

const router = express.Router()

// create author
router.post(
  '/',
  isLoggedIn,
  isAdmin,
  uploadAuthorImage.single('image'),
  runValidation(authorSchemas.authorSchema),
  createAuthor
)

// get all authors
router.get('/', findAll)

// get featured authors
router.get('/feature', getFeaturedAuthors)

// feature author
router.put('/feature/:authorId', isLoggedIn, isAdmin, featureAuthor)

// get author by slug
router.get('/profile/:authorSlug', findBySlug)

// get author by id
router.get('/:authorId', findById)

// update author by id
router.put(
  '/:authorId',
  isLoggedIn,
  isAdmin,
  uploadAuthorImage.single('image'),
  updateAuthor
)

// delete author by id
router.delete('/:authorId', isLoggedIn, isAdmin, deleteAuthor)

export default router
