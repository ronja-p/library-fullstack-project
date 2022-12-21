import express from 'express'
import {
  registerUser,
  activateAccount,
  loginUser,
  logoutUser,
  authorizeUser,
  sendRecoveryEmail,
  resetPassword,
  deleteUser,
  findAll,
  updateUserPassword,
  updateUser,
  getUserProfile,
  getUserById,
} from '../controllers/user.controller'
import { runValidation } from '../validation/runValidation'
import { userSchemas } from '../validation/user.schema'
import { uploadProfilePicture } from '../middlewares/uploadFile'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/authorizeUser'
import { verifyActivationToken } from '../middlewares/verifyActivationToken'
import { refreshToken } from '../middlewares/refreshToken'

const router = express.Router()

// register user
router.post(
  '/register',
  isLoggedOut,
  uploadProfilePicture.single('profilePicture'),
  runValidation(userSchemas.registerUserSchema),
  registerUser
)
// activate account
router.get('/activate', isLoggedOut, verifyActivationToken, activateAccount)

// login user
router.post(
  '/login',
  isLoggedOut,
  runValidation(userSchemas.loginUserSchema),
  loginUser
)

// logout user
router.get('/logout', isLoggedIn, refreshToken, logoutUser)

// check if user is logged in
router.get('/check-login', isLoggedIn, refreshToken, authorizeUser)

// check if user is admin
router.get('/check-admin', isLoggedIn, isAdmin, refreshToken, authorizeUser)

// recover account
router.post(
  '/recover',
  isLoggedOut,
  runValidation(userSchemas.recoverUserSchema),
  sendRecoveryEmail
)

// reset password
router.post(
  '/recover/:recoveryToken',
  isLoggedOut,
  runValidation(userSchemas.loginUserSchema),
  resetPassword
)

// get user profile
router.get('/profile', isLoggedIn, getUserProfile)

// get all users
router.get('/', isLoggedIn, isAdmin, findAll)

// get user by id
router.get('/:userId', isLoggedIn, isAdmin, getUserById)

// update password
router.put(
  '/password/:userId',
  runValidation(userSchemas.updatePasswordSchema),
  isLoggedIn,
  updateUserPassword
)

// update user
router.put(
  '/:userId',
  uploadProfilePicture.single('profilePicture'),
  runValidation(userSchemas.updateUserSchema),
  isLoggedIn,
  updateUser
)

// delete user
router.delete('/:userId', isLoggedIn, isAdmin, deleteUser)

export default router
