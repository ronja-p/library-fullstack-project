import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

const Footer = () => {
  return (
    <Paper
      className="footer"
      sx={{
        width: '100%',
        position: 'absolute',
        bottom: -130,
        background: '#f06292',
      }}
      component="footer"
      square
      variant="outlined"
      color="primary"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            my: 1,
          }}
        >
          <LocalLibraryOutlinedIcon className="nav__icon" />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            mb: 2,
          }}
        >
          <Typography variant="body2" color="white">
            Copyright © 2022 Ronja Pietrzykowska
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
