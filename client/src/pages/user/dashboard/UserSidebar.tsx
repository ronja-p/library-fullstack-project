import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { UserData } from 'types.ts/UserTypes';
import { API_URL } from 'util/secrets';

const UserSidebar = (props: { userData: UserData }) => {
  // destructure props
  const { userData } = props;

  // set role state
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (userData.isAdmin) {
      setRole('admin');
    } else {
      setRole('user');
    }
  }, [userData.isAdmin]);

  return (
    <Box className="sidebar">
      <Avatar
        className="sidebar__avatar"
        sx={{ width: 56, height: 56, mb: 2 }}
        alt={`${userData.firstName} ${userData.lastName}`}
        src={`${API_URL}/${userData.profilePicture}`}
      />
      <Typography
        className="sidebar__name"
        variant="body1"
        fontSize={20}
        sx={{ mb: 2 }}
      >{`${userData.firstName} ${userData.lastName}`}</Typography>
      <ul className="sidebar__list">
        <li>
          <Button
            className="sidebar__btn"
            component={NavLink}
            to={`/dashboard/${role}/profile`}
            variant="contained"
            fullWidth
            color="primary"
            sx={{ my: 0.5 }}
          >
            Profile
          </Button>
        </li>
        <li>
          <Button
            className="sidebar__btn"
            component={NavLink}
            to={`/dashboard/${role}/my-books`}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              my: 0.5,
            }}
          >
            My Books
          </Button>
        </li>
        {userData.isAdmin && (
          <>
            <li className="sidebar__content">
              <Button
                className="sidebar__btn"
                component={NavLink}
                to="/dashboard/admin/users"
                variant="contained"
                fullWidth
                color="primary"
                sx={{ my: 0.5 }}
              >
                Users
              </Button>
            </li>
            <li className="sidebar__content">
              <Button
                className="sidebar__btn"
                component={NavLink}
                to="/dashboard/admin/authors"
                variant="contained"
                fullWidth
                color="primary"
                sx={{ my: 0.5 }}
              >
                Authors
              </Button>
            </li>
            <li>
              <Button
                className="sidebar__btn"
                component={NavLink}
                to="/dashboard/admin/books"
                variant="contained"
                fullWidth
                color="primary"
                sx={{ my: 0.5 }}
              >
                Books
              </Button>
            </li>
          </>
        )}
      </ul>
    </Box>
  );
};

export default UserSidebar;
