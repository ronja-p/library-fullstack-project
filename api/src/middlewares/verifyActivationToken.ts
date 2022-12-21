import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_ACTIVATE } from '../util/secrets'

export const verifyActivationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if token is in authorization header
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).send({
        success: false,
        error: 'Account activation token not found',
      })
    }

    // verify token
    jwt.verify(token, String(JWT_ACTIVATE), (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          error: 'Token expired or invalid, please register again',
        })
      } else {
        next()
      }
    })
  } catch (error: any) {
    // handle error
    return res.status(400).send({
      success: false,
      error: error.message,
    })
  }
}
