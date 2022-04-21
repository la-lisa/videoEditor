import useStore from '../../../store/useStore';
import { Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';

export default function ModalDialog() {
  const content = useStore((state) => state.dialogContent);
  const state = useStore((state) => state.dialogState);
  const open = useStore((state) => state.isDialogShown);
  const setOpen = useStore((state) => state.setIsDialogShown);
  const { title, actionButton, cancelButton } = state;

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={onClose} open={open} aria-label={`${title} Dialog`}>
      <DialogTitle>
        <Typography variant="h6" component="p" align="center">
          {title}
        </Typography>
      </DialogTitle>
      {content && content()}
      {(actionButton || cancelButton) && (
        <DialogActions sx={{ mt: 2 }}>
          {cancelButton && (
            <Button onClick={cancelButton.onClick || undefined} variant="outlined">
              {cancelButton.title}
            </Button>
          )}
          {actionButton && (
            <Button onClick={actionButton.onClick || undefined} variant="contained">
              {actionButton.title}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
