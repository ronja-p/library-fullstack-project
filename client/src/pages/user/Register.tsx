import React from 'react';
import { Formik, Form, useField, FieldAttributes } from 'formik';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { toast } from 'react-toastify';
import { userValidationSchemas } from 'validation/UserValidation';
import { registerUser } from 'services/UserService';

// reusable MUI text field with formik functionality
const MyTextField: React.FC<FieldAttributes<{}>> = ({
  type,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      required
      type={type}
      label={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      variant="outlined"
      color="secondary"
      fullWidth
      margin="normal"
    />
  );
};

// formik registration form
export const Register = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  return (
    <Formik
      // set initial values
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        profilePicture: '',
      }}
      // use yup validation schema
      validationSchema={userValidationSchemas.registerUserSchema}
      // onSubmit function
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // append form data
        const formData = new FormData();
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('passwordConfirm', values.passwordConfirm);
        formData.append('profilePicture', values.profilePicture);
        setSubmitting(true);
        // make axios request to POST /users
        const response = await registerUser(formData);
        setSubmitting(false);
        // send toast notification based on response
        if (response.success) {
          toastSuccess(response.message);
          resetForm();
        } else {
          toastError(response.error);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, errors }) => (
        // card component to hold the form
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h4" align="center">
              User Registration
            </Typography>
            <Form encType="multipart/form-data">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <MyTextField
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MyTextField
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <MyTextField
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <MyTextField
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <MyTextField
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    placeholder="Confirm Password"
                  />
                </Grid>

                {/* upload profile picture button, with hidden file input */}
                <Grid item xs={12}>
                  <Button
                    sx={{ my: 1.6, height: 48 }}
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    color="secondary"
                    fullWidth
                  >
                    Upload Profile Picture
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        if (!event.currentTarget.files) return;
                        setFieldValue(
                          'profilePicture',
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                  </Button>
                  {/* conditional error message for profilePicture */}
                  <p className="form__error">
                    {errors.profilePicture && `${errors.profilePicture}`}
                  </p>
                </Grid>
                {/* submit button */}
                <Grid item xs={12}>
                  <Button
                    sx={{ height: 48 }}
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    color="secondary"
                    fullWidth
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </CardContent>
        </Card>
      )}
    </Formik>
  );
};
