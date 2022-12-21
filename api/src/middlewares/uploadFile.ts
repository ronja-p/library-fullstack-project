import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'
import path from 'path'

// image upload restrictions
const FILE_SIZE = 1024 * 1024 * 2
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

const tempStorage = multer.memoryStorage()

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/users')
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniquePrefix + '-' + file.originalname)
  },
})

const authorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/authors')
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniquePrefix + '-' + file.originalname)
  },
})

const bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/books')
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniquePrefix + '-' + file.originalname)
  },
})

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (SUPPORTED_FORMATS.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
export const tempUpload: multer.Multer = multer({
  storage: tempStorage,
  limits: { fileSize: FILE_SIZE },
  fileFilter: fileFilter,
})

export const uploadProfilePicture: multer.Multer = multer({
  storage: userStorage,
  limits: { fileSize: FILE_SIZE },
  fileFilter: fileFilter,
})

export const uploadAuthorImage: multer.Multer = multer({
  storage: authorStorage,
  limits: { fileSize: FILE_SIZE },
  fileFilter: fileFilter,
})

export const uploadBookImage: multer.Multer = multer({
  storage: bookStorage,
  limits: { fileSize: FILE_SIZE },
  fileFilter: fileFilter,
})
