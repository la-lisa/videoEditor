import useStore from '../../../store/useStore';
import { Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useStoreWithUndo from '../../../store/useStoreWithUndo';
import omit from 'lodash.omit';

export default function ModalDialog() {
  const content = useStore((state) => state.dialogContent);
  const state = useStore((state) => state.dialogState);
  const open = useStore((state) => state.isDialogShown);
  const setOpen = useStore((state) => state.setIsDialogShown);
  const { title, actionButton, cancelButton } = state;
  const [actionButtonDisabled, setActionButtonDisabled] = useState(true);

  const onClose = (_, reason) => {
    if (reason !== 'backdropClick') setOpen(false);
  };

  const handleActionButtonDisabledChange = (enabled, _) => setActionButtonDisabled(!enabled);

  useEffect(() => {
    let storeSubscription = undefined;

    if (actionButton?.disableIfFalsy) {
      // check which store contains the value we want to subscribe to
      const store =
        useStore.getState()[`${actionButton.disableIfFalsy}`] !== undefined
          ? useStore
          : useStoreWithUndo.getState()[`${actionButton.disableIfFalsy}`] !== undefined
          ? useStoreWithUndo
          : null;

      if (store) {
        storeSubscription = store.subscribe(
          handleActionButtonDisabledChange,
          (state) => state[`${actionButton.disableIfFalsy}`]
        );
      }
    }
    return () => {
      if (storeSubscription?.unsubscribe === 'function') storeSubscription.unsubscribe();
    };
  }, [actionButton]);

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
          {actionButton && (
            <Button
              sx={{ marginRight: 1 }}
              onClick={actionButton.onClick || undefined}
              variant="contained"
              disabled={actionButtonDisabled}
              {...omit(actionButton, 'disableIfFalsy')}
            >
              {actionButton.title}
            </Button>
          )}
          {cancelButton && (
            <Button onClick={cancelButton.onClick || undefined} variant="outlined" {...cancelButton}>
              {cancelButton.title}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
