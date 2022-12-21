import dotenv from 'dotenv'
import fs from 'fs'

import logger from './logger'

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables')
  dotenv.config({ path: '.env' })
}

export const ENVIRONMENT = process.env.NODE_ENV
const prod = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

export const CLIENT_URL = process.env['CLIENT_URL'] as string
export const JWT_ACTIVATE = process.env['JWT_ACTIVATE'] as string
export const JWT_ACCESS = process.env['JWT_ACCESS'] as string
export const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID'] as string
export const GOOGLE_CLIENT_SECRET = process.env[
  'GOOGLE_CLIENT_SECRET'
] as string
export const MONGODB_URI = process.env['MONGODB_URI'] as string
// Use this instead if you want to use local mongodb
// export const MONGODB_URI = (
//   prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL']
// ) as string
export const SMTP_EMAIL = process.env['SMTP_EMAIL'] as string
export const SMTP_PASSWORD = process.env['SMTP_PASSWORD'] as string

if (!JWT_ACTIVATE) {
  logger.error('No client secret. Set JWT_ACTIVATE environment variable.')
  process.exit(1)
}

if (!JWT_ACCESS) {
  logger.error('No client secret. Set JWT_ACCESS environment variable.')
  process.exit(1)
}

if (!MONGODB_URI) {
  if (prod) {
    logger.error(
      'No mongo connection string. Set MONGODB_URI environment variable.'
    )
  } else {
    logger.error(
      'No mongo connection string. Set MONGODB_URI_LOCAL environment variable.'
    )
  }
  process.exit(1)
}
