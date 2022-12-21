import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Stack } from '@mui/material';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import { useAppDispatch } from 'redux/hooks';
import { toast } from 'react-toastify';
import { logout } from 'features/user/userSlice';
import { logoutUser } from 'services/UserService';
import { useFetchUserData } from 'hooks/useFetchStoreData';

const Navbar = () => {
  // hook setup
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // get state data
  const data = useFetchUserData();
  const isAdmin = data.userData.isAdmin;

  const handleLogout = async () => {
    // dispatch reducer action
    dispatch(logout());

    // make axios request
    const response = await logoutUser();

    // send toast notification based on response
    if (response.success) {
      toastSuccess(response.message);
    } else {
      toastError(response.error);
    }
  };

  return (
    <AppBar className="nav" position="static" component="nav">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          onClick={() => {
            navigate('/');
          }}
        >
          <LocalLibraryOutlinedIcon className="nav nav__icon" />
        </IconButton>
        <Typography className="nav nav__heading" variant="h6" component="div">
          Open Library Project
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mx: 2 }}>
          <NavLink className="nav nav__link" to="/">
            HOME
          </NavLink>
          {!data.isLoggedIn && (
            <>
              <NavLink className="nav nav__link" to="/login">
                LOGIN
              </NavLink>
              <NavLink className="nav nav__link" to="/register">
                REGISTER
              </NavLink>
            </>
          )}
          {data.isLoggedIn && (
            <>
              <NavLink
                className="nav nav__link"
                to={`/dashboard/${isAdmin ? 'admin' : 'user'}`}
              >
                {data.userData.firstName.toUpperCase()}
              </NavLink>
              <NavLink
                className="nav nav__link"
                to="/login"
                onClick={handleLogout}
              >
                LOGOUT
              </NavLink>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
