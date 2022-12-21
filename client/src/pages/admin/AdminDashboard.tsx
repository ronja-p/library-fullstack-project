import React from 'react';
import { Card, CardContent, Grid, Container } from '@mui/material';
import LoadingRing from '../../assets/images/LoadingRing.svg';
import MyProfile from 'pages/user/dashboard/MyProfile';
import { matchPath, useLocation } from 'react-router-dom';
import { useFetchUserData } from 'hooks/useFetchStoreData';
import AdminAuthors from './AdminAuthors';
import AdminBooks from './AdminBooks';
import EditProfile from 'pages/user/dashboard/EditProfile';
import ChangePassword from 'pages/user/dashboard/ChangePassword';
import UserSidebar from 'pages/user/dashboard/UserSidebar';
import MyBooks from 'pages/user/dashboard/MyBooks';
import AdminUsers from './AdminUsers';
import AdminUserProfile from './AdminUserProfile';
import AdminEditProfile from './AdminEditProfile';
import AdminAddAuthor from './AdminAddAuthor';
import AdminEditAuthor from './AdminEditAuthor';
import AdminAuthorProfile from './AdminAuthorProfile';
import AdminAddBook from './AdminAddBook';
import AdminEditBook from './AdminEditBook';
import AdminBookView from './AdminBookView';

export const AdminDashboard = () => {
  // get state data
  const { userData } = useFetchUserData();

  // hook setup
  const location = useLocation();

  return userData ? (
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
          {location.pathname === '/dashboard/admin/profile' && <MyProfile />}
          {location.pathname === '/dashboard/admin/profile/edit' && (
            <EditProfile />
          )}
          {location.pathname === '/dashboard/admin/profile/change-password' && (
            <ChangePassword />
          )}
          {location.pathname === '/dashboard/admin/my-books' && <MyBooks />}
          {location.pathname === '/dashboard/admin/users' && <AdminUsers />}
          {matchPath(
            '/dashboard/admin/users/:userId',
            String(location.pathname)
          ) && <AdminUserProfile />}
          {matchPath(
            '/dashboard/admin/users/edit/:userId',
            String(location.pathname)
          ) && <AdminEditProfile />}
          {location.pathname === '/dashboard/admin/books' && <AdminBooks />}
          {location.pathname === '/dashboard/admin/books/add' && (
            <AdminAddBook />
          )}
          {matchPath(
            '/dashboard/admin/books/edit/:bookId',
            String(location.pathname)
          ) && <AdminEditBook />}
          {matchPath(
            '/dashboard/admin/books/view/:bookId',
            String(location.pathname)
          ) && <AdminBookView />}

          {location.pathname === '/dashboard/admin/authors' && <AdminAuthors />}
          {location.pathname === '/dashboard/admin/authors/add' && (
            <AdminAddAuthor />
          )}
          {matchPath(
            '/dashboard/admin/authors/edit/:authorId',
            String(location.pathname)
          ) && <AdminEditAuthor />}
          {matchPath(
            '/dashboard/admin/authors/profile/:authorId',
            String(location.pathname)
          ) && <AdminAuthorProfile />}
        </Grid>
      </Grid>
    </Container>
  ) : (
    <img className="loading" src={LoadingRing} alt="Loading" />
  );
};
