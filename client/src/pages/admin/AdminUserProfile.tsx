import React, { useState, useEffect } from 'react';
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { API_URL } from 'util/secrets';
import { UserData } from 'types.ts/UserTypes';
import { useParams } from 'react-router-dom';
import { getUserById } from 'services/AdminServices';
import BackButton from 'components/BackButton';

const AdminUserProfile = () => {
  // get user id from url params
  const { userId } = useParams();

  // initialise user state
  const [user, setUser] = useState<UserData>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    isAdmin: false,
    borrowedBooks: [],
    createdAt: new Date(0),
  });

  // fetch user
  const fetchUser = async (userId: string) => {
    const response = await getUserById(userId);
    setUser(response.user);
  };

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId]);

  // format join date
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="dashboard" sx={{ pb: 8 }}>
      <BackButton />
      {user?.firstName && (
        <>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Typography sx={{ mb: 2 }} variant="h4">
                  User Profile:
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`First name: ${user.firstName}`}</Typography>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`Last name: ${user.lastName}`}</Typography>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`Email: ${user.email}`}</Typography>
                <Typography
                  sx={{ py: 0.5 }}
                  fontSize={18}
                  variant="body1"
                >{`Joined: ${joinDate}`}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Avatar
                  sx={{ width: 140, height: 140, ml: 14, mt: -5 }}
                  alt={`${user.firstName} ${user.lastName}`}
                  src={`${API_URL}/${user.profilePicture}`}
                />
              </Grid>
            </Grid>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AdminUserProfile;
