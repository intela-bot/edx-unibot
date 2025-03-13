import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
} from '@mui/material';


function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog
      open={isOpen}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      aria-labelledby="reset-settings-title"
      aria-describedby="reset-settings-description"
    >
      <DialogTitle id="reset-settings-title">
        <Typography variant="h4" gutterBottom>
          Reset Settings
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="reset-settings-description">
          <Typography variant="body1">
            Are you sure you want to reset all settings?
          </Typography>
          <Typography variant="body1">
            This action cannot be undone.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} autoFocus color="error">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationModal;
