import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { JWT_ACCESS } from '../util/secrets'

// check if user is logged in
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    // check if there is a cookie in request headers
    if (!req.headers.cookie) {
      return res.status(401).json({
        success: false,
        error: 'User is not logged in',
      })
    }

    // get token from cookie
    const token = req.headers.cookie.split('=')[1]
    if (!token) {
      return res.status(401).send({
        success: false,
        error: 'No token found',
      })
    }

    // verify login token
    const decoded = jwt.verify(token, JWT_ACCESS) as JwtPayloadId

    // add id to request
    req.body.id = decoded._id

    next()
  } catch (error: any) {
    return res.status(401).send({
      success: false,
      error: error.message,
    })
  }
}

// check if user is an admin
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if user exists
    const existingUser = await User.findById({ _id: req.body.id })
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        error: 'No user found with this id',
      })
    }

    // check if user is admin
    if (!existingUser.isAdmin) {
      return res.status(401).send({
        success: false,
        error: 'User is not an admin',
      })
    }

    next()
  } catch (error: any) {
    return res.status(401).send({
      success: false,
      error: error.message,
    })
  }
}

export const isLoggedOut = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if there is a cookie in request headers
    if (req.headers.cookie) {
      return res.status(401).json({
        success: false,
        error: 'Can\'t make this request while logged in',
      })
    }

    next()
  } catch (error: any) {
    return res.status(401).send({
      success: false,
      error: error.message,
    })
  }
}
