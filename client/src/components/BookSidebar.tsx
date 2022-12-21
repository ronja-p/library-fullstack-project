import React from 'react';
import { Card, CardContent, Grid, Typography, Avatar } from '@mui/material';
import { AuthorData } from 'types.ts/AuthorTypes';
import { API_URL } from 'util/secrets';
import { NavLink } from 'react-router-dom';
import { BookData } from 'types.ts/BookTypes';

const BookSidebar = (props: { bookData: BookData[] }) => {
  // destructure props
  const { bookData } = props;

  return (
    bookData && (
      <Card className="card__sidebar">
        <CardContent>
          {bookData.map((book, index) => (
            <Card key={index} sx={{ my: 0.5 }}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item md={4} sm={6} xs={12}>
                    <NavLink to={`/books/${book._id}`}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 80,
                          height: 120,
                          mx: 'auto',
                        }}
                        alt={`${book.title}`}
                        src={`${API_URL}/${book.image}`}
                      />
                    </NavLink>
                  </Grid>
                  <Grid item md={8} sm={6} xs={12}>
                    <NavLink to={`/books/${book._id}`}>
                      <Typography
                        sx={{ width: 160 }}
                        variant="h5"
                        noWrap={false}
                      >{`${book.title}`}</Typography>
                    </NavLink>
                    <Typography
                      sx={{ my: 0.5 }}
                      fontSize={18}
                      variant="body1"
                    >{`${book.publishedYear}`}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    )
  );
};

export default BookSidebar;
