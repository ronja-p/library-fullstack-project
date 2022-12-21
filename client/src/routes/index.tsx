import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { customTheme } from 'theme';
import {
  Activate,
  UserDashboard,
  Error,
  Home,
  Login,
  Recovery,
  Register,
  ResetPassword,
  AdminDashboard,
  Book,
} from 'pages';
import Navbar from '../layout/Navbar';
import LoggedInRoute from './LoggedInRoute';
import AdminRoute from './AdminRoute';
import { useFetchUserData } from 'hooks/useFetchStoreData';
import { Author } from 'pages/Author';
import Footer from 'layout/Footer';

const Index = () => {
  const { userData } = useFetchUserData();
  return (
    //  provide custom MUI theme to all routes
    <ThemeProvider theme={customTheme}>
      {/* provide routes to each page */}
      <BrowserRouter>
        {/* provide navbar to all components */}
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Home />} />
            <Route path="/books/:bookId" element={<Book />} />
            <Route path="/authors/:authorSlug" element={<Author />} />
            <Route path="/dashboard" element={<LoggedInRoute />}>
              <Route
                path=""
                element={
                  userData.isAdmin ? (
                    <Navigate to="/dashboard/admin/profile" />
                  ) : (
                    <Navigate to="/dashboard/user/profile" />
                  )
                }
              />
            </Route>
            <Route path="/dashboard" element={<LoggedInRoute />}>
              <Route
                path="user"
                element={<Navigate to="/dashboard/user/profile" />}
              />
              <Route path="user/profile" element={<UserDashboard />} />
              <Route path="user/profile/edit" element={<UserDashboard />} />
              <Route
                path="user/profile/change-password"
                element={<UserDashboard />}
              />
              <Route path="user/my-books" element={<UserDashboard />} />
            </Route>
            <Route path="/dashboard" element={<AdminRoute />}>
              <Route
                path="admin"
                element={<Navigate to="/dashboard/admin/profile" />}
              />
              <Route path="admin/profile" element={<AdminDashboard />} />
              <Route path="admin/profile/edit" element={<AdminDashboard />} />
              <Route
                path="admin/profile/change-password"
                element={<AdminDashboard />}
              />
              <Route path="admin/my-books" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminDashboard />} />
              <Route path="admin/users/:userId" element={<AdminDashboard />} />
              <Route
                path="admin/users/edit/:userId"
                element={<AdminDashboard />}
              />
              <Route path="admin/authors" element={<AdminDashboard />} />
              <Route path="admin/authors/add" element={<AdminDashboard />} />
              <Route
                path="admin/authors/edit/:authorId"
                element={<AdminDashboard />}
              />
              <Route
                path="admin/authors/profile/:authorId"
                element={<AdminDashboard />}
              />
              <Route path="admin/books" element={<AdminDashboard />} />
              <Route path="admin/books/add" element={<AdminDashboard />} />
              <Route
                path="admin/books/edit/:bookId"
                element={<AdminDashboard />}
              />
              <Route
                path="admin/books/view/:bookId"
                element={<AdminDashboard />}
              />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activate/:activationToken" element={<Activate />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route
              path="/recovery/:recoveryToken"
              element={<ResetPassword />}
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Index;
