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
import { countTotalBooks, getBooksAndPaginate } from 'services/BookService';
import { API_URL } from 'util/secrets';
import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import FilterByAuthor from './FilterByAuthor';
import SortBy from './SortBy';

const BookList = () => {
  // fetch, count and paginate books
  const [books, setBooks] = useState<BookDataPopulated[]>([]);

  const [totalBooks, setTotalBooks] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 4;

  const fetchBooks = async () => {
    const { books } = await getBooksAndPaginate(page);
    setBooks(books);
  };

  const countBooks = async () => {
    const { booksTotal } = await countTotalBooks();
    setTotalBooks(booksTotal);
  };

  useEffect(() => {
    fetchBooks();
    countBooks();
  }, []);

  // fetch books when page changes
  useEffect(() => {
    fetchBooks();
    countBooks();
  }, [page]);

  return (
    books && (
      <Card className="book-list">
        <CardContent>
          <Typography textAlign={'center'} variant="h4" gutterBottom>
            Book Overview
          </Typography>
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
            {books.map((book) => (
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

            <Grid item xs={12}>
              <Stack alignItems="center">
                <Pagination
                  count={Math.ceil(totalBooks / pageSize)}
                  color="primary"
                  page={page}
                  boundaryCount={2}
                  onChange={(event, page) => {
                    setPage(page);
                  }}
                  renderItem={(params) => <PaginationItem {...params} />}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  );
};

export default BookList;
