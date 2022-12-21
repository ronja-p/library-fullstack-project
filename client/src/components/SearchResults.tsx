import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Chip,
  Pagination,
  PaginationItem,
  Stack,
} from '@mui/material';
import { BookDataPopulated } from 'types.ts/BookTypes';
import { API_URL } from 'util/secrets';
import { NavLink, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import BackButton from './BackButton';
import FilterByAuthor from './FilterByAuthor';
import SortBy from './SortBy';

const SearchResults = () => {
  // fetch, count and paginate books
  const [searchResults, setSearchResults] = useState<BookDataPopulated[]>([]);

  // get search state from location
  const { state } = useLocation();

  useEffect(() => {
    setSearchResults(state);
  }, [state]);

  return searchResults.length ? (
    <Card className="book-list">
      <BackButton />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchBar />
          </Grid>
          <Grid item md={6} xs={12}>
            <FilterByAuthor />
          </Grid>
          <Grid item md={6} xs={12}>
            <SortBy />
          </Grid>

          {searchResults.map((book) => (
            <Grid key={book._id} item md={6} xs={12}>
              <Card>
                <CardContent sx={{ minHeight: 240 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={8}>
                      <NavLink to={`/books/${book._id}`}>
                        <Typography
                          variant="h5"
                          noWrap={false}
                        >{`${book.title}`}</Typography>
                      </NavLink>

                      <Typography sx={{ mb: 1 }} noWrap variant="body1">
                        {`${book.publishedYear}`}
                      </Typography>

                      <Typography>Written by:</Typography>
                      {book.authors.map((author, index) => (
                        <NavLink to={`/authors/${author.slug}`} key={index}>
                          <Typography key={index}>{author.name}</Typography>
                        </NavLink>
                      ))}
                    </Grid>
                    <Grid item xs={4}>
                      <NavLink to={`/books/${book._id}`}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 80,
                            height: 120,
                          }}
                          alt={`${book.title}`}
                          src={`${API_URL}/${book.image}`}
                        />
                      </NavLink>
                    </Grid>
                    <Stack sx={{ mt: 2 }} direction="row" spacing={1}>
                      {book.genres.map((genre, index) => (
                        <Chip
                          key={index}
                          label={genre}
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12}></Grid>
        </Grid>
      </CardContent>
    </Card>
  ) : (
    <Card className="book-list">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchBar />
          </Grid>
          <Grid item xs={12}>
            <BackButton />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">No results found</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SearchResults;
