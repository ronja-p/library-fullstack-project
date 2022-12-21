import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  // navigate hook setup
  const navigate = useNavigate();
  return (
    <IconButton
      className="back-button"
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowBackIcon fontSize="large" color="primary" />
    </IconButton>
  );
};

export default BackButton;
