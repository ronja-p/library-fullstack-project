import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_ACCESS } from '../util/secrets'

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if cookie exists
    if (!req.headers.cookie) {
      return res.status(404).send({
        success: false,
        message: 'No cookie found, please login again',
      })
    }

    // check if token exists
    const oldToken = req.headers.cookie.split('=')[1]
    const _id = req.headers.cookie.split('=')[0]

    if (!oldToken) {
      return res.status(404).send({
        success: false,
        message: 'No token found, please login again',
      })
    }

    // verify old token
    jwt.verify(oldToken, String(JWT_ACCESS), (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          error: 'Token expired or invalid, please login again',
        })
      } else {
        // reset the cookie
        res.clearCookie(`${_id}`)

        // generate new token
        const newToken = jwt.sign({ _id: _id }, JWT_ACCESS, {
          expiresIn: '30m',
        })

        // set new cookie
        res.cookie(String(_id), newToken, {
          path: '/',
          expires: new Date(Date.now() + 1000 * 60 * 29),
          httpOnly: true,
          sameSite: 'lax',
        })

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
