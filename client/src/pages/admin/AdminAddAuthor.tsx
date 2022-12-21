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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { toast } from 'react-toastify';
import { authorValidationSchemas } from 'validation/AuthorValidation';
import BackButton from 'components/BackButton';
import { createAuthor } from 'services/AuthorServices';

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

// formik update profile form
const AdminAddAuthor = () => {
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
      enableReinitialize
      initialValues={{
        name: '',
        born: new Date(0),
        bio: '',
        image: '',
      }}
      // // use yup validation schema
      validationSchema={authorValidationSchemas.authorSchema}
      // onSubmit function
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // append form data
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('born', values.born.toJSON());
        formData.append('bio', values.bio);
        formData.append('image', values.image);
        setSubmitting(true);
        // make axios request to POST /authors
        const response = await createAuthor(formData);
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
      {({ isSubmitting, setFieldValue, errors, values }) => (
        // card component to hold the form
        <Card className="dashboard__form">
          <BackButton />
          <CardContent sx={{ maxWidth: 520, mx: 'auto' }}>
            <Typography gutterBottom variant="h4" align="center">
              Add Author
            </Typography>
            <Form encType="multipart/form-data">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={8}>
                  <MyTextField
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                  />
                </Grid>
                {/* date picker */}
                <Grid item xs={12} sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth"
                      value={values.born}
                      onChange={(date) => {
                        setFieldValue('born', date);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="normal"
                          error={!!errors.born}
                          helperText={errors.born && `${errors.born}`}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="bio"
                    type="text"
                    label="Bio"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    margin="normal"
                    multiline
                    helperText={errors.bio}
                    error={!!errors.bio}
                    rows={4}
                    value={values.bio}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('bio', event.target.value);
                    }}
                  />
                </Grid>

                {/* upload photo button, with hidden file input */}
                <Grid item xs={12}>
                  <Button
                    sx={{ my: 1.6, height: 48 }}
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    color="secondary"
                    fullWidth
                  >
                    Upload Photo
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      id="image"
                      name="image"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        if (!event.currentTarget.files) return;
                        setFieldValue('image', event.currentTarget.files[0]);
                      }}
                    />
                  </Button>
                  {/* conditional error message for profilePicture */}
                  <p className="form__error">
                    {errors.image && `${errors.image}`}
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
                    Add Author
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

export default AdminAddAuthor;
