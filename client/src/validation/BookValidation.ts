import * as yup from 'yup';

// image upload restrictions
const FILE_SIZE = 1024 * 1024 * 2;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

// get current year
const getMaxYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

export const bookValidationSchemas = {
  // book schema
  bookSchema: yup.object({
    title: yup
      .string()
      .required('Title is required')
      .max(80, 'Title must contain at most 80 characters'),
    isbn: yup
      .string()
      .required('ISBN is required')
      .matches(/^\d+$/, 'ISBN can only contain numbers')
      .min(10, 'ISBN must contain at least 10 characters')
      .max(13, 'ISBN must contain at most 13 characters'),
    description: yup
      .string()
      .required('Description is required')
      .max(500, 'Description must be at most 500 characters'),
    authors: yup.array().of(yup.string().required('Author is required')),
    publisher: yup
      .string()
      .required('Publisher is required')
      .max(50, 'Publisher must be at most 50 characters'),
    publishedYear: yup
      .number()
      .typeError('Must be a number')
      .required('Year is required')
      .max(getMaxYear(), "Can't be in the future"),
    genres: yup.array().of(yup.string().required('Genre is required')),
    pageCount: yup
      .number()
      .typeError('Must be a number')
      .required('Page count is required'),
    image: yup.lazy((value) => {
      if (typeof value === 'object') {
        return yup
          .mixed()
          .test(
            'fileSize',
            "File size too large, can't be more than 2 MB",
            (value) => value.size <= FILE_SIZE
          )
          .test(
            'fileType',
            'Unsupported file format, only JPEG or PNG allowed',
            (value) => SUPPORTED_FORMATS.includes(value.type)
          );
      }
      return yup.mixed();
    }),
  }),
};
