import * as yup from 'yup';

// image upload restrictions
const FILE_SIZE = 1024 * 1024 * 2;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

// get current date
const getMaxDate = () => {
  return new Date();
};

export const authorValidationSchemas = {
  // author schema
  authorSchema: yup.object({
    name: yup
      .string()
      .required('Name is required')
      .min(2, 'Must contain at least 2 characters')
      .max(20, 'Must contain at most 50 characters'),
    born: yup
      .date()
      .required('Date required')
      .max(getMaxDate(), "Can't be in the future"),
    bio: yup.string().max(500, 'Bio must be at most 500 characters'),

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
