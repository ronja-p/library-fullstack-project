import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteUser } from 'services/UserService';
import { toast } from 'react-toastify';

const DeleteUserButton = (props: {
  userId: string;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  refresh: number;
}) => {
  // destructure props
  const { userId, refresh } = props;

  // toast setup
  const toastSuccess = (message: string) => {
    toast.success(`${message}`);
  };

  const toastError = (error: string) => {
    toast.error(`${error}`);
  };

  // initialise delete dialog state
  const [open, setOpen] = useState(false);

  // open dialog function
  const handleClickOpen = () => setOpen(true);

  // close dialog function
  const handleClose = () => setOpen(false);

  // delete profile
  const handleDelete = async (userId: string) => {
    // close dialog
    handleClose();
    // make delete request
    const response = await deleteUser(userId);
    props.setRefresh(refresh + 1);
    // send toast notification based on response
    if (response.success) {
      toastSuccess(response.message);
    } else {
      toastError(response.error);
    }
  };
  return (
    <>
      <Button
        size="medium"
        variant="outlined"
        fullWidth
        startIcon={<DeleteForeverIcon />}
        onClick={() => {
          handleClickOpen();
        }}
      >
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This can't be undone. This account will be permanently deleted and
            the user will lose access to the service.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
          <Button
            onClick={() => {
              handleDelete(userId);
            }}
          >
            YES, DELETE ACCOUNT
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteUserButton;
