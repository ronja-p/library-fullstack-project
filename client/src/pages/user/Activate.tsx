import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import { activateUser } from 'services/UserService';
import { UserActivationData } from 'types.ts/UserTypes';

export const Activate = () => {
  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // set up redirect
  const navigate = useNavigate();

  // set up user name state
  const [name, setName] = useState('');

  // set up isValidToken state
  const [isValidToken, setIsValidToken] = useState(false);

  // get token from url
  const { activationToken } = useParams();

  // decode token
  useEffect(() => {
    const decodeToken = async () => {
      try {
        if (activationToken) {
          const { firstName, lastName } =
            jwtDecode<UserActivationData>(activationToken);
          setName(`${firstName} ${lastName}`);
          setIsValidToken(true);
        }
      } catch (error) {
        setIsValidToken(false);
      }
    };
    decodeToken();
  }, [activationToken]);

  //

  return (
    <>
      <Card className="card">
        <CardContent>
          {/* render activate button if token is valid */}
          {isValidToken && (
            <>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                align="center"
              >
                Hello {name}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                align="center"
                sx={{ my: 2 }}
              >
                Thank you for registering! In order to finish activating your
                account pleases click the button below.
              </Typography>
              <Box textAlign="center">
                {/* activate button */}
                <Button
                  sx={{ height: 48, width: '30%' }}
                  variant="contained"
                  component="div"
                  color="secondary"
                  onClick={async () => {
                    const response = await activateUser(activationToken);
                    if (response.success) {
                      toastSuccess(response.message);
                      navigate('/login');
                    } else {
                      toastError(response.error);
                    }
                  }}
                >
                  Activate
                </Button>
              </Box>{' '}
            </>
          )}
          {/* render register button if token is invalid */}
          {!isValidToken && (
            <>
              <Typography
                variant="body1"
                component="div"
                align="center"
                sx={{ my: 2 }}
              >
                Link is invalid or expired, please register again.
              </Typography>
              <Box textAlign="center">
                {/* register button */}
                <Button
                  sx={{ height: 48, width: '30%' }}
                  variant="contained"
                  component="div"
                  color="secondary"
                  onClick={() => {
                    navigate('/register');
                  }}
                >
                  Register
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
