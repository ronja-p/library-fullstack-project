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
import { sendRecoveryEmail } from 'services/UserService';

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

export const Recovery = () => {
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
        email: '',
      }}
      // use yup validation schema
      validationSchema={userValidationSchemas.recoverUserSchema}
      //on submit function
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        // make axios request to POST /users/recovery
        const response = await sendRecoveryEmail(values);
        setSubmitting(false);
        if (response.success) {
          toastSuccess(response.message);
          resetForm();
        } else {
          toastError(response.error);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Card className="card">
          <CardContent>
            <Typography gutterBottom variant="h4" align="center">
              Account Recovery
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
                  <Button
                    sx={{ my: 1.6, height: 48 }}
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    color="secondary"
                    fullWidth
                  >
                    Send Recovery Email
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
