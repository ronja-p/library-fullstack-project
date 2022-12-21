import React, { useEffect, useState } from 'react';
import { Formik, Form, useField, FieldAttributes, FieldArray } from 'formik';
import {
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { toast } from 'react-toastify';
// import { validationSchemas } from 'validation/UserValidation';
import BackButton from 'components/BackButton';
import { addBook } from 'services/BookService';
import { AuthorData } from 'types.ts/AuthorTypes';
import { getAuthors } from 'services/AuthorServices';
import { bookValidationSchemas } from 'validation/BookValidation';

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

// formik add book form
const AdminAddBook = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // fetch authors
  const [authors, setAuthors] = useState<AuthorData[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const { authors } = await getAuthors();
      setAuthors(authors);
    };
    fetchAuthors();
  }, []);

  return (
    <Formik
      // set initial values
      initialValues={{
        title: '',
        isbn: '',
        description: '',
        authors: [''],
        publisher: '',
        publishedYear: '',
        genres: [''],
        pageCount: '',
        image: '',
      }}
      // use yup validation schema
      validationSchema={bookValidationSchemas.bookSchema}
      // onSubmit function
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // append form data
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('isbn', values.isbn);
        formData.append('description', values.description);
        values.authors.forEach((author) =>
          formData.append('authors[]', author)
        );
        formData.append('publisher', values.publisher);
        formData.append('publishedYear', values.publishedYear);
        values.genres.forEach((genre) => formData.append('genres[]', genre));
        formData.append('pageCount', values.pageCount);
        formData.append('image', values.image);
        setSubmitting(true);
        // make axios request to POST /books
        const response = await addBook(formData);
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
      {(props) => {
        const {
          isSubmitting,
          setFieldValue,
          errors,
          values,
          touched,
          handleBlur,
        } = props;
        return (
          // card component to hold the form
          <Card className="dashboard__form">
            <BackButton />
            <CardContent sx={{ maxWidth: 520, mx: 'auto' }}>
              <Typography gutterBottom variant="h4" align="center">
                Add Book:
              </Typography>
              <Form encType="multipart/form-data">
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <MyTextField
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Title"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MyTextField
                      type="text"
                      id="isbn"
                      name="isbn"
                      placeholder="ISBN"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      type="text"
                      label="Description"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      margin="normal"
                      multiline
                      helperText={touched.description && errors.description}
                      error={touched.description && !!errors.description}
                      rows={4}
                      value={values.description}
                      onBlur={handleBlur}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFieldValue('description', event.target.value);
                        console.log(touched);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2.5, mb: -3 }}>
                    <FieldArray name="authors">
                      {(fieldArrayProps) => {
                        const { push, remove } = fieldArrayProps;
                        return (
                          <>
                            {values.authors.map((author, index) => (
                              <>
                                <FormControl fullWidth>
                                  <InputLabel
                                    color={
                                      errors.authors?.[index]
                                        ? 'error'
                                        : 'secondary'
                                    }
                                  >
                                    Author
                                  </InputLabel>
                                  <Select
                                    key={index}
                                    id={`authors[${index}]`}
                                    name={`authors[${index}]`}
                                    label="Author"
                                    color="secondary"
                                    error={!!errors.authors?.[index]}
                                    value={values.authors[index]}
                                    onChange={(event) => {
                                      console.log(errors);
                                      setFieldValue(
                                        `authors[${index}]`,
                                        event.target.value
                                      );
                                    }}
                                  >
                                    {authors &&
                                      authors.map((author) => {
                                        const { _id, name } = author;
                                        return (
                                          <MenuItem
                                            key={_id}
                                            value={_id}
                                          >{`${name}`}</MenuItem>
                                        );
                                      })}
                                  </Select>
                                  <FormHelperText sx={{ color: '#d32f2f' }}>
                                    {errors.authors?.[index] &&
                                      `${errors.authors?.[index]}`}
                                  </FormHelperText>
                                </FormControl>
                                <IconButton
                                  sx={{ mt: 0, pb: 2, float: 'right' }}
                                  disabled={isSubmitting}
                                  color="secondary"
                                  onClick={() => push('')}
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>

                                {values.authors.length > 1 && (
                                  <IconButton
                                    sx={{ mt: 0, pb: 2, float: 'right' }}
                                    disabled={isSubmitting}
                                    color="secondary"
                                    onClick={() => remove(index)}
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                )}
                              </>
                            ))}
                          </>
                        );
                      }}
                    </FieldArray>
                  </Grid>
                  <Grid item md={8} xs={12}>
                    <MyTextField
                      type="text"
                      id="publisher"
                      name="publisher"
                      placeholder="Publisher"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <MyTextField
                      type="text"
                      id="publishedYear"
                      name="publishedYear"
                      placeholder="Published Year"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1, mb: -3 }}>
                    <FieldArray name="genres">
                      {(fieldArrayProps) => {
                        const { push, remove } = fieldArrayProps;
                        return (
                          <>
                            {values.genres.map((genre, index) => (
                              <>
                                <MyTextField
                                  key={index}
                                  type="text"
                                  id={`genres[${index}]`}
                                  name={`genres[${index}]`}
                                  placeholder="Genre"
                                />
                                <IconButton
                                  sx={{ mt: -1, mb: -1, float: 'right' }}
                                  disabled={isSubmitting}
                                  color="secondary"
                                  onClick={() => push('')}
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                                {values.genres.length > 1 && (
                                  <IconButton
                                    sx={{ mt: -1, mb: -1, float: 'right' }}
                                    disabled={isSubmitting}
                                    color="secondary"
                                    onClick={() => remove(index)}
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                )}
                              </>
                            ))}
                          </>
                        );
                      }}
                    </FieldArray>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <MyTextField
                      type="text"
                      id="pageCount"
                      name="pageCount"
                      placeholder="Page Count"
                    />
                  </Grid>

                  {/* upload image button, with hidden file input */}
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
                      Add Book
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </CardContent>
          </Card>
        );
      }}
    </Formik>
  );
};

export default AdminAddBook;
