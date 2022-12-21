import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingRing from '../../assets/images/LoadingRing.svg';
import { featureAuthor, getAuthors } from 'services/AuthorServices';
import { AuthorDataPopulated } from 'types.ts/AuthorTypes';
import { useFetchUserData } from 'hooks/useFetchStoreData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteAuthorButton from 'components/DeleteAuthorButton';
import { API_URL } from 'util/secrets';

const AdminAuthors = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };
  // get state data
  const { userData } = useFetchUserData();

  // initialise refresh state
  const [refresh, setRefresh] = useState(0);

  // fetch authors
  const [authors, setAuthors] = useState<AuthorDataPopulated[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const { authors } = await getAuthors();
      setAuthors(authors);
    };
    fetchAuthors();
  }, [refresh]);

  // navigate to edit author page
  const navigate = useNavigate();

  const navigateToAddAuthor = () => {
    navigate('/dashboard/admin/authors/add');
  };

  const navigateToAuthorProfile = (authorId: string) => {
    navigate(`/dashboard/admin/authors/profile/${authorId}`);
  };

  const navigateToEditAuthor = (authorId: string) => {
    navigate(`/dashboard/admin/authors/edit/${authorId}`);
  };

  // feature author
  const handleFeatureAuthor = async (
    authorId: string,
    featureStatus: boolean
  ) => {
    // set data
    const data = {
      featureStatus: featureStatus,
    };
    // make feature request
    const response = await featureAuthor(authorId, data);
    // refresh users
    setRefresh(refresh + 1);
    // send toast notification based on response
    if (response.success) {
      toastSuccess(response.message);
    } else {
      toastError(response.error);
    }
  };

  return userData ? (
    <Card className="dashboard">
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Typography variant="h4" fontSize={28}>
            AUTHOR OVERVIEW
          </Typography>
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              navigateToAddAuthor();
            }}
          >
            Add Author
          </Button>
        </Grid>
      </Grid>
      {authors.map((author) => (
        <Card key={author._id} className="dashboard__content">
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={9}>
                <Typography variant="h5">{author.name}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Avatar
                  variant="rounded"
                  sx={{ width: 60, height: 60, float: 'right' }}
                  alt={`${author.name}`}
                  src={`${API_URL}/${author.image}`}
                />
              </Grid>{' '}
            </Grid>
            {author.born && (
              <Box sx={{ my: 1.5 }}>
                <Typography noWrap variant="body1">
                  {`Born: ${new Date(author.born).toLocaleDateString('en-gb', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`}
                </Typography>
              </Box>
            )}
            {author.bio && (
              <Box sx={{ my: 1.5 }}>
                <Typography
                  className="paragraph--small"
                  variant="body1"
                  textAlign="justify"
                >
                  {author.bio}
                </Typography>
              </Box>
            )}
            {author.booksWritten && (
              <Box sx={{ my: 1.5 }}>
                <Typography noWrap variant="body1">
                  Books written:
                  {author.booksWritten.map((book, index) => (
                    <span key={index}>
                      {index + 1 < author.booksWritten.length
                        ? ` ${book.title}, `
                        : ` ${book.title}`}
                    </span>
                  ))}
                </Typography>
              </Box>
            )}
            <Grid container spacing={1}>
              <Grid item md={4} xs={12}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigateToAuthorProfile(author._id);
                  }}
                >
                  View Author
                </Button>
              </Grid>
              <Grid item md={4} xs={12}>
                <Button
                  size="medium"
                  variant="outlined"
                  fullWidth
                  startIcon={
                    author.featured ? <StarIcon /> : <StarBorderIcon />
                  }
                  onClick={() => {
                    handleFeatureAuthor(author._id, author.featured);
                  }}
                >
                  Feature
                </Button>
              </Grid>
              <Grid item md={2} xs={6}>
                <DeleteAuthorButton
                  authorId={author._id}
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
                    navigateToEditAuthor(author._id);
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

export default AdminAuthors;
