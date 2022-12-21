import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, Avatar } from '@mui/material';
import { getFeaturedAuthors } from 'services/AuthorServices';
import { AuthorData } from 'types.ts/AuthorTypes';
import { API_URL } from 'util/secrets';
import { NavLink } from 'react-router-dom';

const FeaturedAuthors = () => {
  // initialise featured authors state
  const [featuredAuthors, setFeaturedAuthors] = useState<AuthorData[]>([]);

  // fetch featured users
  const fetchFeatured = async () => {
    const { featuredAuthors } = await getFeaturedAuthors();
    setFeaturedAuthors(featuredAuthors);
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    featuredAuthors && (
      <>
        <Card className="card__sidebar">
          <CardContent>
            <Typography
              textAlign={'center'}
              variant="h5"
              noWrap={false}
              gutterBottom
              sx={{ mb: 2 }}
            >
              Featured Authors
            </Typography>
            <Grid container spacing={2}>
              {featuredAuthors.map((author) => (
                <Grid key={author._id} item md={12} xs={12}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <NavLink to={`/authors/${author.slug}`}>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 60,
                                height: 60,
                                mx: 'auto',
                              }}
                              alt={`${author.name}`}
                              src={`${API_URL}/${author.image}`}
                            />
                          </NavLink>
                        </Grid>
                        <Grid item xs={8}>
                          <NavLink to={`/authors/${author.slug}`}>
                            <Typography
                              sx={{ width: 160 }}
                              fontSize={22}
                              variant="h5"
                              noWrap={false}
                            >
                              {author.name}
                            </Typography>
                          </NavLink>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </>
    )
  );
};

export default FeaturedAuthors;
