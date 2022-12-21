import React, { useState, useEffect } from 'react';
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { API_URL } from 'util/secrets';
import { useParams } from 'react-router-dom';
import { getAuthorById } from 'services/AuthorServices';
import BackButton from 'components/BackButton';
import { AuthorData } from 'types.ts/AuthorTypes';

const AdminAuthorProfile = () => {
  // get author id from url params
  const { authorId } = useParams();

  // initialise author state
  const [author, setAuthor] = useState<AuthorData>({
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

  // fetch author
  const fetchAuthor = async (authorId: string) => {
    const response = await getAuthorById(authorId);
    setAuthor(response.author);
  };

  useEffect(() => {
    if (authorId) fetchAuthor(authorId);
  }, [authorId]);

  // format born date
  const bornDate = new Date(author.born).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="dashboard" sx={{ pb: 8 }}>
      <BackButton />
      {author.name && (
        <>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Typography sx={{ mb: 2 }} variant="h4">
                  {`${author.name}`}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`Born: ${bornDate}`}</Typography>
                {author.bio && (
                  <Typography
                    sx={{ py: 0.5 }}
                    fontSize={18}
                    variant="body1"
                    align="justify"
                    paragraph={true}
                  >{`Bio: ${author.bio}`}</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Avatar
                  variant="rounded"
                  sx={{ width: 140, height: 140, ml: 14, mt: -10 }}
                  alt={`${author.name}`}
                  src={`${API_URL}/${author.image}`}
                />
              </Grid>
            </Grid>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AdminAuthorProfile;
