import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Badge,
  Button,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import LoadingRing from '../../assets/images/LoadingRing.svg';
import { getUsers } from 'services/AdminServices';
import { UserData } from 'types.ts/UserTypes';
import DeleteUserButton from 'components/DeleteUserButton';
import { useFetchUserData } from 'hooks/useFetchStoreData';

const AdminUsers = () => {
  // get state data
  const { userData } = useFetchUserData();

  // initialise refresh state
  const [refresh, setRefresh] = useState(0);

  // fetch users
  const [users, setUsers] = useState<UserData[]>([]);

  const fetchUsers = async () => {
    const response = await getUsers();
    setUsers(response.users);
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  // navigate to user profile and edit profile page
  const navigate = useNavigate();

  const navigateToUserProfile = (userId: string) => {
    navigate(`/dashboard/admin/users/${userId}`);
  };

  const navigateToEditProfile = (userId: string) => {
    navigate(`/dashboard/admin/users/edit/${userId}`);
  };

  return userData ? (
    <Card className="dashboard">
      <Typography sx={{ mb: 2 }} variant="h4" fontSize={28}>
        USER OVERVIEW
      </Typography>
      {users.map((user) => (
        <Card key={user._id} className="dashboard__content">
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Typography
                  variant="h6"
                  noWrap={false}
                >{`${user.firstName} ${user.lastName}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                {user.isAdmin ? (
                  <Badge
                    className="dashboard__badge-text"
                    badgeContent={'Admin'}
                    color="error"
                  >
                    <AccountCircleIcon
                      className="dashboard__badge-icon"
                      fontSize="large"
                    />
                  </Badge>
                ) : (
                  <Badge
                    className="dashboard__badge-text"
                    badgeContent={'User'}
                    color="info"
                  >
                    <AccountCircleIcon
                      className="dashboard__badge-icon"
                      fontSize="large"
                    />
                  </Badge>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{`${user.email}`}</Typography>
              </Grid>
              <Grid item md={4} sm={10} xs={12}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigateToUserProfile(user._id);
                  }}
                >
                  View Profile
                </Button>
              </Grid>
              <Grid item md={2} sm={5} xs={6}>
                <DeleteUserButton
                  userId={user._id}
                  setRefresh={setRefresh}
                  refresh={refresh}
                />
              </Grid>
              <Grid item md={2} sm={5} xs={6}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => {
                    navigateToEditProfile(user._id);
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

export default AdminUsers;
