import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, useField, FieldAttributes } from 'formik';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import { userValidationSchemas } from 'validation/UserValidation';
import { resetPassword } from 'services/UserService';

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

export const ResetPassword = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // redirect
  const navigate = useNavigate();

  // get token from url
  const { recoveryToken } = useParams();

  return (
    <Formik
      // set initial values
      initialValues={{
        email: '',
        password: '',
      }}
      // use yup validation schema
      validationSchema={userValidationSchemas.loginUserSchema}
      //on submit function
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        // make axios request to POST /users/recovery
        const response = await resetPassword(values, recoveryToken);
        setSubmitting(false);
        if (response.success) {
          toastSuccess(response.message);
          navigate('/login');
        } else {
          toastError(response.error);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h4" align="center">
              Reset Password
            </Typography>
            <Form>
              <Grid container spacing={1}>
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
                    placeholder="New Password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    sx={{ my: 1.6, height: 48 }}
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    color="secondary"
                    fullWidth
                  >
                    Reset Password
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
