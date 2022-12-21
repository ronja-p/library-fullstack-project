import * as fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User'
import userService from '../services/user.service'
import { BadRequestError } from '../helpers/apiError'
import { comparePassword, encryptPassword } from '../util/securePassword'
import { CLIENT_URL, JWT_ACTIVATE, JWT_ACCESS } from '../util/secrets'
import { sendEmail } from '../util/sendEmail'
import path from 'path'

// POST /users/register

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data from request body
    const { firstName, lastName, email, password } = req.body
    const profilePicture = req.file?.path

    // check if email is already registered

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(409).send({
        success: false,
        error: 'User with this email address already exists',
      })

    // encrypt password
    const hashPassword = await encryptPassword(password)

    // sign jwt token
    const activationToken = jwt.sign(
      { firstName, lastName, email, hashPassword, profilePicture },
      String(JWT_ACTIVATE),
      { expiresIn: '30m' }
    )

    // set email options
    const emailData = {
      email,
      subject: 'Account Activation',
      html: `
      <h2> Hello ${firstName}!</h2>
      <p> Please click here to <a href="${CLIENT_URL}/activate/${activationToken}">activate your account.</a></p>
      `,
    }

    // send activation email
    await sendEmail(emailData)

    // send success response
    return res.status(200).send({
      success: true,
      message: `Account activation email sent to ${email}`,
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

// GET /users/activate

export const activateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if token is in authorization header
    const activationToken = req.headers.authorization
    if (!activationToken) {
      return res.status(400).send({
        success: false,
        error: 'Account activation token not found',
      })
    }

    // decode data
    const { firstName, lastName, email, hashPassword, profilePicture } =
      jwt.decode(activationToken) as JwtPayload

    // check if email is already registered
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(409).send({
        success: false,
        error: 'This account is already activated',
      })

    // assign data to user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      profilePicture,
    })

    // create user in database
    await userService.create(user)

    // send success response
    return res.status(201).send({
      success: true,
      message: 'Account was activated successfully',
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

// POST /users/login

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data from request body
    const { email, password } = req.body

    // check if user exists
    const existingUser = await User.findOne({ email })
    if (!existingUser)
      return res.status(404).send({
        success: false,
        error: 'User with this email doesn\'t exist',
      })

    // compare password
    const isPasswordMatched = await comparePassword(
      password,
      existingUser.password
    )

    if (!isPasswordMatched) {
      return res.status(401).send({
        success: false,
        error: 'Email or password didn\'t match',
      })
    }

    // sign access token
    const accessToken = jwt.sign({ _id: existingUser._id }, JWT_ACCESS, {
      expiresIn: '30m',
    })

    // set access cookie
    res.cookie(String(existingUser._id), accessToken, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 29),
      httpOnly: true,
      sameSite: 'lax',
    })

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Login successful',
      accessToken,
      userData: {
        _id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        profilePicture: existingUser.profilePicture,
        isAdmin: existingUser.isAdmin,
        borrowedBooks: existingUser.borrowedBooks,
        createdAt: existingUser.createdAt,
      },
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

// POST /users/logout
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if cookie exists
    if (!req.headers.cookie) {
      return res.status(404).send({
        success: false,
        message: 'No cookie found',
      })
    }

    // check if token exists
    const token = req.headers.cookie.split('=')[1]

    if (!token) {
      return res.status(404).send({
        success: false,
        message: 'No token found',
      })
    }

    // decode jwt token
    const { _id } = jwt.decode(token) as JwtPayload

    // delete cookie
    res.clearCookie(`${_id}`)

    // send success response
    return res.status(200).send({
      success: true,
      message: 'User logged out',
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

// GET /users/authorize
export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // send success response
    return res.status(200).send({
      success: true,
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

// POST /users/recover
export const sendRecoveryEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data from request body
    const { email } = req.body

    // check if user exists
    const existingUser = await User.findOne({ email })
    if (!existingUser)
      return res.status(404).send({
        success: false,
        error: 'User with this email doesn\'t exist',
      })

    // generate random token
    const token = crypto.randomBytes(64).toString('hex')

    // update token in database
    const updateToken = await User.updateOne(
      { email: email },
      {
        $set: {
          token: token,
        },
      }
    )

    // set email options
    const emailData = {
      email,
      subject: 'Account Recovery',
      html: `
      <h2> Hello ${existingUser.firstName}!</h2>
      <p> Please click here to <a href="http://localhost:3000/recovery/${token}">reset your password.</a></p>
      `,
    }

    // send activation email
    await sendEmail(emailData)

    // send success response
    return res.status(200).send({
      success: true,
      message: `Recovery email sent to ${email}`,
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

// POST /users/recover/:recoveryToken
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data from request body and params
    const { email, password } = req.body
    const token = req.params.recoveryToken

    // check if user with this token exists
    const existingUser = await User.findOne({ token })
    if (!existingUser)
      return res.status(404).send({
        success: false,
        error: 'Recovery token is inavlid',
      })

    // check if email and token match database
    if (email !== existingUser.email || token !== existingUser.token) {
      return res.status(400).send({
        success: false,
        error: 'Email and token didn\'t match',
      })
    }

    // encrypt password
    const hashPassword = await encryptPassword(password)

    // update password
    await User.findByIdAndUpdate(
      { _id: existingUser._id },
      {
        $set: {
          password: hashPassword,
          token: '',
        },
      }
    )

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Password was reset',
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

// PUT /users/password/:userId

export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get user id from request params
    const userId = req.params.userId

    // find user in database
    const existingUser = await User.findOne({ _id: userId })
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      })
    }

    // get data from request body
    const { password } = req.body

    // encrypt new password
    const updatedPassword = await encryptPassword(password)

    // update user in database
    const updatedUser = await userService.update(userId, {
      password: updatedPassword,
    })

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Password updated successfully',
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

// PUT /users/:userId

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get user id from request params
    const userId = req.params.userId

    // get data from request body
    const update = req.body
    const profilePicture = req.file?.path

    // find user in database
    const existingUser = await User.findOne({ _id: userId })
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      })
    }

    // if there's a profile picture add it to update data
    if (profilePicture) {
      update.profilePicture = profilePicture
      //delete old profile picture from server
      if (existingUser.profilePicture !== 'public/images/users/default.svg') {
        fs.unlink(path.join(existingUser.profilePicture), (error) => {
          if (error) console.log(error)
        })
      }
    } else {
      update.profilePicture = existingUser.profilePicture
    }

    // update user in database
    const updatedUser = await userService.update(userId, update)

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Profile updated successfully',
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

// DELETE /users/:userId

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // delete user
    const deletedUser = await userService.deleteUser(req.params.userId)
    if (!deletedUser) {
      return res.status(400).send({
        success: false,
        error: 'Couldn\'t delete user',
      })
    }

    // if there's a profile picture delete it
    if (
      deletedUser.profilePicture &&
      deletedUser.profilePicture !== 'public/images/users/default.svg'
    ) {
      //delete old profile picture from server
      fs.unlink(path.join(deletedUser.profilePicture), (error) => {
        if (error) console.log(error)
      })
    }

    // send success response
    return res.status(200).send({
      success: true,
      message: 'Account has been deleted',
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

// GET /users/:userId

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await userService.findById(req.params.userId))
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /users/profile

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find user by ID
    const userData = await userService.findById(req.body.id)
    if (!userData)
      return res.status(404).send({
        success: false,
        error: 'User not found',
      })

    // send success response
    res.status(200).send({ success: true, userData })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// GET /users

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find all users
    const users = await userService.findAll()

    // send success response
    res.status(200).send({ success: true, users })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}

// get user by id

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // find user by ID
    const user = await userService.findById(req.params.userId)
    if (!user)
      return res.status(404).send({
        success: false,
        error: 'User not found',
      })

    // send success response
    res.status(200).send({ success: true, user })
  } catch (error) {
    // handle error
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', 400, error))
    } else {
      next(error)
    }
  }
}
