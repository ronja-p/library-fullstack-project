import { Request, Response, NextFunction } from 'express'

import { BadRequestError } from '../helpers/apiError'

export default function (req: Request, res: Response, next: NextFunction) {
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    !req.is([
      'application/json',
      'multipart/form-data',
      'application/x-www-form-urlencoded',
    ])
  ) {
    next(new BadRequestError('Request body must be of type json'))
  } else {
    next()
  }
}
