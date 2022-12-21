import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
} from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import { BookDataPopulated } from 'types.ts/BookTypes';
import { borrowBook, getPopulatedBook, returnBook } from 'services/BookService';
import { API_URL } from 'util/secrets';
import AuthorSidebar from './AuthorSidebar';
import BackButton from './BackButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { useFetchUserData } from 'hooks/useFetchStoreData';
import { useAppDispatch } from 'redux/hooks';
import { updateProfile } from 'features/user/userSlice';

const BookCard = () => {
  // dispatch hook setup
  const dispatch = useAppDispatch();

  // get state data
  const { userData } = useFetchUserData();

  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // get book id from params
  const { bookId } = useParams();

  // initialise book state
  const [book, setBook] = useState<BookDataPopulated>({
    _id: '',
    title: '',
    isbn: '',
    description: '',
    authors: [],
    publisher: '',
    publishedYear: 2022,
    genres: [],
    pageCount: 0,
    image: 'public\\images\\books\\default.svg',
    rating: 10,
    isBorrowed: false,
    borrowerId: '',
    borrowDate: new Date(0),
    returnDate: new Date(0),
  });

  // fetch book
  useEffect(() => {
    const fetchBook = async (bookId: string) => {
      const { book } = await getPopulatedBook(bookId);
      setBook(book);
    };
    if (bookId) fetchBook(bookId);
  }, [bookId]);

  // handle borrowing book
  const handleBorrowBook = async (bookId: string) => {
    const response = await borrowBook(bookId);
    // send toast notification based on response
    if (response.success) {
      toastSuccess(response.message);
      setBook(response.updatedBook);
      dispatch(updateProfile(response.updatedUser));
    } else {
      toastError(response.error);
    }
  };

  // handle returning book
  const handleReturnBook = async (bookId: string) => {
    const response = await returnBook(bookId);
    // send toast notification based on response
    if (response.success) {
      toastSuccess(response.message);
      setBook(response.updatedBook);
      dispatch(updateProfile(response.updatedUser));
    } else {
      toastError(response.error);
    }
  };

  return (
    book && (
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          <Grid item md={8} xs={12}>
            <Card className="book-list">
              <BackButton />
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item md={9} xs={12}>
                    <Typography
                      variant="h4"
                      noWrap={false}
                    >{`${book.title}`}</Typography>

                    <Typography sx={{ mb: 3 }} noWrap variant="body1">
                      {`${book.publishedYear}`}
                    </Typography>

                    <Typography>Written by:</Typography>
                    {book.authors.map((author, index) => (
                      <NavLink to={`/authors/${author.slug}`} key={index}>
                        <Typography sx={{ mb: 3 }}>{author.name}</Typography>
                      </NavLink>
                    ))}
                    <Typography sx={{ mb: 3 }} variant="body1">
                      {`Publisher: ${book.publisher}`}
                    </Typography>
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 120,
                        height: 180,
                        mx: 'auto',
                        mb: 3,
                      }}
                      alt={`${book.title}`}
                      src={`${API_URL}/${book.image}`}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ mb: 3 }} variant="body1" align="justify">
                      {`${book.description}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography sx={{ mb: 3 }} variant="body1">
                      {`Page count: ${book.pageCount}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack sx={{ float: 'right' }} direction="row" spacing={1}>
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
                  <Grid item md={3} xs={6}>
                    {book.borrowerId === userData._id && (
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          handleReturnBook(book._id);
                        }}
                      >
                        Return Book
                      </Button>
                    )}
                    {book.borrowerId && book.borrowerId !== userData._id && (
                      <Button variant="outlined" fullWidth disabled>
                        Unavailable
                      </Button>
                    )}
                    {!book.borrowerId && (
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          handleBorrowBook(book._id);
                        }}
                      >
                        Borrow
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4} xs={12}>
            <AuthorSidebar authorData={book.authors} />
          </Grid>
        </Grid>
      </Container>
    )
  );
};

export default BookCard;
