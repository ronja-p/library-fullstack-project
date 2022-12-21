import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import LoadingRing from '../../assets/images/LoadingRing.svg';
import { useFetchUserData } from 'hooks/useFetchStoreData';
import { getBooks } from 'services/BookService';
import { BookDataPopulated } from 'types.ts/BookTypes';
import { API_URL } from 'util/secrets';
import DeleteBookButton from 'components/DeleteBookButton';

const AdminBooks = () => {
  // get state data
  const { userData } = useFetchUserData();

  // initialise refresh state
  const [refresh, setRefresh] = useState(0);

  // fetch books
  const [books, setBooks] = useState<BookDataPopulated[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { books } = await getBooks();
      setBooks(books);
      console.log(books);
    };
    fetchBooks();
  }, [refresh]);

  // navigate to other pages page
  const navigate = useNavigate();

  const navigateToAddBook = () => {
    navigate('/dashboard/admin/books/add');
  };

  const navigateToViewBook = (bookId: string) => {
    navigate(`/dashboard/admin/books/view/${bookId}`);
  };

  const navigateToEditBook = (bookId: string) => {
    navigate(`/dashboard/admin/books/edit/${bookId}`);
  };

  return userData ? (
    <Card className="dashboard">
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Typography variant="h4" fontSize={28}>
            BOOK OVERVIEW
          </Typography>
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              navigateToAddBook();
            }}
          >
            Add Book
          </Button>
        </Grid>
      </Grid>
      {books.map((book) => (
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

              <Grid item md={4} xs={12}>
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
              <Grid item md={2} xs={6}>
                <DeleteBookButton
                  bookId={book._id}
                  setRefresh={setRefresh}
                  refresh={refresh}
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => {
                    navigateToEditBook(book._id);
                  }}
                >
                  Edit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Card>
  ) : (
    <img className="loading" src={LoadingRing} alt="Loading" />
  );
};

export default AdminBooks;
