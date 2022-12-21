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
import { updateUserPassword } from 'services/UserService';
import BackButton from 'components/BackButton';
import { useFetchUserData } from 'hooks/useFetchStoreData';

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

// formik change password form
const ChangePassword = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // get state data
  const { userData } = useFetchUserData();

  return (
    <Formik
      // set initial values
      enableReinitialize
      initialValues={{
        password: '',
        passwordConfirm: '',
      }}
      // use yup validation schema
      validationSchema={userValidationSchemas.updatePasswordSchema}
      // onSubmit function
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        // make axios request to PUT /users/:userId
        const response = await updateUserPassword(values, userData._id);
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
      {({ isSubmitting }) => (
        // card component to hold the form
        <Card className="dashboard__form">
          <BackButton />
          <CardContent sx={{ maxWidth: 520, mx: 'auto' }}>
            <Form encType="multipart/form-data">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h4" align="center">
                    Change Password
                  </Typography>
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
                    Update Password
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

export default ChangePassword;
