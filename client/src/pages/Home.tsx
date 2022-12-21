import React from 'react';
import { Container, Grid } from '@mui/material';
import BookList from 'components/BookList';
import FeaturedAuthors from 'components/FeaturedAuthors';
import { useLocation } from 'react-router-dom';
import SearchResults from 'components/SearchResults';

export const Home = () => {
  // use location hook
  const location = useLocation();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={1}>
        <Grid item md={8}>
          {location.pathname === '/' && <BookList />}
          {location.pathname === '/search' && <SearchResults />}
        </Grid>
        <Grid item md={4}>
          <FeaturedAuthors />
        </Grid>
      </Grid>
    </Container>
  );
};
