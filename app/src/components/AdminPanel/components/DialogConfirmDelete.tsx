import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

interface DialogConfirmDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DialogConfirmDelete: React.FC<DialogConfirmDeleteProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this image?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirmDelete;
