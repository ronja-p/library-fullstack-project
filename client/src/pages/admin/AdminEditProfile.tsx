import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { userValidationSchemas } from 'validation/UserValidation';
import { updateUser } from 'services/UserService';
import BackButton from 'components/BackButton';
import { getUserById } from 'services/AdminServices';
import { UserData } from 'types.ts/UserTypes';

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
const AdminEditProfile = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // hook setup
  const navigate = useNavigate();

  // get user id from url params
  const { userId } = useParams();

  // initialise user state
  const [user, setUser] = useState<UserData>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    isAdmin: false,
    borrowedBooks: [],
    createdAt: new Date(0),
  });

  // fetch user
  const fetchUser = async (userId: string) => {
    const response = await getUserById(userId);
    setUser(response.user);
  };

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId]);

  return (
    <Formik
      // set initial values
      enableReinitialize
      initialValues={{
        firstName: `${user.firstName}`,
        lastName: `${user.lastName}`,
        email: `${user.email}`,
        profilePicture: '',
      }}
      // use yup validation schema
      validationSchema={userValidationSchemas.updateUserSchema}
      // onSubmit function
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // append form data
        const formData = new FormData();
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('profilePicture', values.profilePicture);
        setSubmitting(true);
        // make axios request to PUT /users/:userId
        const response = await updateUser(formData, user._id);
        setSubmitting(false);
        // send toast notification based on response
        if (response.success) {
          toastSuccess(response.message);
          resetForm();
          navigate('/dashboard/admin/users');
        } else {
          toastError(response.error);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, errors }) => (
        // card component to hold the form
        <Card className="dashboard__form">
          <BackButton />
          <CardContent sx={{ maxWidth: 520, mx: 'auto' }}>
            <Typography gutterBottom variant="h4" align="center">
              Update User Profile
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
                    Update Profile
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

export default AdminEditProfile;
