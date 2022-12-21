import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup);

// image upload restrictions
const FILE_SIZE = 1024 * 1024 * 2;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

export const userValidationSchemas = {
  // user registration schema
  registerUserSchema: yup.object({
    firstName: yup
      .string()
      .required('First name is required')
      .min(2, 'Must contain at least 2 characters')
      .max(20, 'Must contain at most 20 characters'),
    lastName: yup
      .string()
      .required('Last name is required')
      .min(2, 'Must contain at least 2 characters')
      .max(20, 'Must contain at most 20 characters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Not a valid email address'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be at most 50 characters')
      .minLowercase(1, 'Password must contain at least 1 lower case letter')
      .minUppercase(1, 'Password must contain at least 1 upper case letter')
      .minNumbers(1, 'Password must contain at least 1 number'),
    passwordConfirm: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),

    profilePicture: yup.lazy((value) => {
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
  // user login schema
  loginUserSchema: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Not a valid email address'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be at most 50 characters')
      .minLowercase(1, 'Password must contain at least 1 lower case letter')
      .minUppercase(1, 'Password must contain at least 1 upper case letter')
      .minNumbers(1, 'Password must contain at least 1 number'),
  }),
  // account recovery schema
  recoverUserSchema: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Not a valid email address'),
  }),
  // update user schema
  updateUserSchema: yup.object({
    firstName: yup
      .string()
      .required('First name is required')
      .min(2, 'Must contain at least 2 characters')
      .max(20, 'Must contain at most 20 characters'),
    lastName: yup
      .string()
      .required('Last name is required')
      .min(2, 'Must contain at least 2 characters')
      .max(20, 'Must contain at most 20 characters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Not a valid email address'),
    profilePicture: yup.lazy((value) => {
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
  // update password schema
  updatePasswordSchema: yup.object({
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be at most 50 characters')
      .minLowercase(1, 'Password must contain at least 1 lower case letter')
      .minUppercase(1, 'Password must contain at least 1 upper case letter')
      .minNumbers(1, 'Password must contain at least 1 number'),
    passwordConfirm: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  }),
};
