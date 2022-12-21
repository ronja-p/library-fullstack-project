import { Request, Response, NextFunction } from 'express'
import { Schema } from 'joi'

// joi validator
export const runValidation = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      errors: {
        wrap: {
          label: '',
        },
      },
    })

    if (error) {
      console.log(
        error.details.map((errDetail) => errDetail.type),
        error
      )
      const messages = error.details.map((err) => err.message)
      return res.status(400).json({
        error: messages,
      })
    }
    next()
  }
}
