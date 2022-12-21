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
import { toast } from 'react-toastify';
import { deleteBook } from 'services/BookService';

const DeleteBookButton = (props: {
  bookId: string;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  refresh: number;
}) => {
  // destructure props
  const { bookId, refresh } = props;

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

  // delete book
  const handleDelete = async (userId: string) => {
    // close dialog
    handleClose();
    // make delete request
    const response = await deleteBook(bookId);
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
        <DialogTitle>Delete book?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This can't be undone. This book will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
          <Button
            onClick={() => {
              handleDelete(bookId);
            }}
          >
            YES, DELETE BOOK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteBookButton;
