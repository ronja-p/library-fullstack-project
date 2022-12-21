import React from 'react';
import { Card, CardContent, Grid, Typography, Avatar } from '@mui/material';
import { AuthorData } from 'types.ts/AuthorTypes';
import { API_URL } from 'util/secrets';
import { NavLink } from 'react-router-dom';

const AuthorSidebar = (props: { authorData: AuthorData[] }) => {
  // destructure props
  const { authorData } = props;

  // format born date
  const formatBornDate = (bornDate: Date) => {
    return new Date(bornDate).toLocaleDateString('en-gb', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    authorData && (
      <Card className="card__sidebar">
        {authorData.map((author, index) => (
          <CardContent key={index}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <NavLink to={`/authors/${author.slug}`}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 80,
                      height: 80,
                      float: 'left',
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
                    variant="h5"
                    fontSize={28}
                    noWrap={false}
                  >{`${author.name}`}</Typography>
                </NavLink>
              </Grid>
            </Grid>
            <Typography
              sx={{ my: 3.5 }}
              fontSize={18}
              variant="body1"
            >{`Born: ${formatBornDate(author.born)}`}</Typography>
            {author.bio && (
              <Typography
                className="paragraph--large"
                sx={{ mt: 3.5 }}
                fontSize={18}
                variant="body1"
                align="justify"
                paragraph={true}
              >
                {author.bio}
              </Typography>
            )}
          </CardContent>
        ))}
      </Card>
    )
  );
};

export default AuthorSidebar;
