import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import { useFetchUserData } from 'hooks/useFetchStoreData';
import { BookDataPopulated } from 'types.ts/BookTypes';
import { getBooks, returnBook } from 'services/BookService';
import { API_URL } from 'util/secrets';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'redux/hooks';
import { updateProfile } from 'features/user/userSlice';

const MyBooks = () => {
  // dispatch hook setup
  const dispatch = useAppDispatch();

  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // get state data
  const { userData } = useFetchUserData();

  // initialise my books state
  const [myBooks, setMyBooks] = useState<BookDataPopulated[]>([]);

  // fetch books and filter for my books
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await getBooks();
      setMyBooks(
        response.books.filter((book: BookDataPopulated) =>
          userData.borrowedBooks.includes(book._id)
        )
      );
    };
    fetchBooks();
  }, []);

  // navigate to view book page
  const navigate = useNavigate();

  const navigateToViewBook = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  // handle returning book
  const handleReturnBook = async (bookId: string) => {
    const response = await returnBook(bookId);
    // send toast notification based on response
    if (response.success) {
      toastSuccess(response.message);
      setMyBooks((current) =>
        current.filter((book) => book._id !== response.updatedBook._id)
      );
      dispatch(updateProfile(response.updatedUser));
    } else {
      toastError(response.error);
    }
  };

  return (
    <Card className="dashboard">
      {userData && (
        <>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant="h4">
              My Books:
            </Typography>
            {myBooks.map((book) => (
              <Card key={book._id} className="dashboard__content">
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item md={2} xs={12}>
                      <NavLink to={`/books/${book._id}`}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 100,
                            height: 150,
                            mx: 'auto',
                          }}
                          alt={`${book.title}`}
                          src={`${API_URL}/${book.image}`}
                        />
                      </NavLink>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <NavLink to={`/books/${book._id}`}>
                        <Typography variant="h5" noWrap={false}>
                          {book.title}
                        </Typography>
                      </NavLink>
                      <Typography noWrap variant="body1">
                        {`${book.publishedYear}`}
                      </Typography>
                      <Typography sx={{ mt: 2 }}>
                        Written by:
                        {book.authors.map((author, index) => (
                          <NavLink to={`/authors/${author.slug}`} key={index}>
                            <span>
                              {index + 1 < book.authors.length
                                ? ` ${author.name}, `
                                : ` ${author.name}`}
                            </span>
                          </NavLink>
                        ))}
                      </Typography>
                    </Grid>

                    {book.description && (
                      <Grid item md={6} xs={12}>
                        <Typography
                          className="paragraph--large"
                          variant="body1"
                          textAlign="justify"
                        >
                          {book.description}
                        </Typography>
                      </Grid>
                    )}

                    <Grid item md={3} xs={12}>
                      <Button
                        size="medium"
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          navigateToViewBook(book._id);
                        }}
                      >
                        View Book
                      </Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
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
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default MyBooks;
