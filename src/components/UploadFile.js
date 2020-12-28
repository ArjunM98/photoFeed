import React, {useState} from 'react';
import {Dialog, DialogTitle} from '@material-ui/core';

function Upload(props) {
  const [open, setOpen] = useState(props.isOpen ? true : false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose()} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
      <input type='file' />
    </Dialog>
  );
}

export default Upload;
