import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'redux/hooks';
import { deleteUser, logoutUser } from 'services/UserService';
import { toast } from 'react-toastify';
import { logout } from 'features/user/userSlice';
import { API_URL } from 'util/secrets';
import { useFetchUserData } from 'hooks/useFetchStoreData';

const MyProfile = () => {
  // hook setup
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // get state data
  const { userData } = useFetchUserData();

  // set role state
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (userData.isAdmin) {
      setRole('admin');
    } else {
      setRole('user');
    }
  }, [userData.isAdmin]);

  // format join date
  const joinDate = new Date(userData.createdAt).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // navigate to edit profile page
  const navigateToEditProfile = () => {
    navigate(`/dashboard/${role}/profile/edit`);
  };

  // navigate to edit profile page
  const navigateToChangePassword = () => {
    navigate(`/dashboard/${role}/profile/change-password`);
  };

  // initialise delete dialog state
  const [open, setOpen] = useState(false);

  // open dialog function
  const handleClickOpen = () => setOpen(true);

  // close dialog function
  const handleClose = () => setOpen(false);

  // delete profile
  const handleDelete = async (userId: string) => {
    // close dialog
    handleClose();
    // make delete request
    const response = await deleteUser(userId);
    // send toast notification based on response
    if (response.success) {
      toastSuccess(response.message);
    } else {
      toastError(response.error);
    }
    //logout user
    dispatch(logout());
    await logoutUser();
    navigate('/login');
  };

  return (
    <Card className="dashboard">
      {userData && (
        <>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant="h4">
              My Profile:
            </Typography>
            <Grid id="top-row" container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`First name: ${userData.firstName}`}</Typography>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`Last name: ${userData.lastName}`}</Typography>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`Email: ${userData.email}`}</Typography>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`Joined: ${joinDate}`}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Avatar
                  className="profile__avatar"
                  sx={{ width: 140, height: 140, mx: 'auto' }}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  src={`${API_URL}/${userData.profilePicture}`}
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8} md={6}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigateToEditProfile();
                  }}
                >
                  Edit Profile
                </Button>
              </Grid>
              <Box width="100%"></Box>
              <Grid item xs={12} sm={4} md={3}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigateToChangePassword();
                  }}
                >
                  Change Password
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    handleClickOpen();
                  }}
                >
                  Delete Account
                </Button>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Delete account?</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      This can't be undone. You will lose access to your
                      borrowed books and you will have to make a new account to
                      use the service again.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>CANCEL</Button>
                    <Button
                      onClick={() => {
                        handleDelete(userData._id);
                      }}
                    >
                      YES, DELETE MY ACCOUNT
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default MyProfile;
