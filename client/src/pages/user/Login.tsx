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
import { toast } from 'react-toastify';
import { userValidationSchemas } from 'validation/UserValidation';
import { loginUser } from 'services/UserService';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'redux/hooks';
import { login } from 'features/user/userSlice';

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

export const Login = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // navigate setup
  const navigate = useNavigate();

  // reducer setup
  const dispatch = useAppDispatch();

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
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        // make axios request to POST /users/login
        const response = await loginUser(values);
        setSubmitting(false);
        if (response.success) {
          const role = response.userData.isAdmin ? 'admin' : 'user';
          dispatch(login(response));
          toastSuccess(response.message);
          resetForm();
          navigate(`/dashboard/${role}`);
        } else {
          toastError(response.error);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h4" align="center">
              User Login
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
                    placeholder="Password"
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
                    Login
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <Link to="/recovery">Forgot Password</Link>
                  </Typography>
                </Grid>
              </Grid>
            </Form>
          </CardContent>
        </Card>
      )}
    </Formik>
  );
};
