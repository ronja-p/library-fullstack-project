import React from 'react';
import { useAppSelector } from 'redux/hooks';
import { Card, CardContent, Grid, Container } from '@mui/material';
import LoadingRing from '../../../assets/images/LoadingRing.svg';
import UserSidebar from 'pages/user/dashboard/UserSidebar';
import { useLocation } from 'react-router-dom';
import MyProfile from './MyProfile';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import MyBooks from './MyBooks';

export const UserDashboard = () => {
  // get state data
  const data = useAppSelector((state) => state.user.data);
  const { userData } = data;

  // use location hook
  const location = useLocation();

  return data ? (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        {/* sidebar */}

        <Grid item xs={12} sm={3}>
          <Card className="dashboard">
            <CardContent>
              <UserSidebar userData={userData} />
            </CardContent>
          </Card>
        </Grid>

        {/* main content */}

        <Grid item xs={12} sm={9}>
          {location.pathname === '/dashboard/user/profile' && <MyProfile />}
          {location.pathname === '/dashboard/user/profile/edit' && (
            <EditProfile />
          )}
          {location.pathname === '/dashboard/user/profile/change-password' && (
            <ChangePassword />
          )}
          {location.pathname === '/dashboard/user/my-books' && <MyBooks />}
        </Grid>
      </Grid>
    </Container>
  ) : (
    <img className="loading" src={LoadingRing} alt="Loading" />
  );
};
