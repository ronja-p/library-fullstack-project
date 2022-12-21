import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { API_URL } from 'util/secrets';
import BackButton from './BackButton';
import { getAuthorBySlug } from 'services/AuthorServices';
import { AuthorDataPopulated } from 'types.ts/AuthorTypes';
import BookSidebar from './BookSidebar';

const AuthorCard = () => {
  // get book id from params
  const { authorSlug } = useParams();

  // initialise book state
  const [author, setAuthor] = useState<AuthorDataPopulated>({
    _id: '',
    name: '',
    slug: '',
    born: new Date(0),
    bio: '',
    image: '',
    booksWritten: [],
    featured: false,
    createdAt: new Date(0),
  });

  // fetch book
  useEffect(() => {
    const fetchAuthor = async (authorSlug: string) => {
      const { author } = await getAuthorBySlug(authorSlug);
      setAuthor(author);
    };
    if (authorSlug) fetchAuthor(authorSlug);
  }, [authorSlug]);

  // format born date
  const bornDate = new Date(author.born).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    author && (
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          <Grid item md={8} xs={12}>
            <Card className="book-list">
              <BackButton />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Avatar
                      variant="rounded"
                      sx={{ width: 140, height: 140, mx: 'auto' }}
                      alt={`${author.name}`}
                      src={`${API_URL}/${author.image}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Typography variant="h4" noWrap={false}>
                      {`${author.name}`}
                    </Typography>
                    <Typography
                      sx={{ py: 0.5 }}
                      fontSize={18}
                      variant="body1"
                    >{`Born: ${bornDate}`}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    {author.bio && (
                      <Typography
                        sx={{ py: 0.5 }}
                        fontSize={18}
                        variant="body1"
                        align="justify"
                        paragraph={true}
                      >{`${author.bio}`}</Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4} xs={12}>
            <BookSidebar bookData={author.booksWritten} />
          </Grid>
        </Grid>
      </Container>
    )
  );
};

export default AuthorCard;
