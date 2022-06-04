import { Button, Stack } from '@mui/material';
import { Redo, Undo, Clear } from '@mui/icons-material';
import useStoreWithUndo from '../../../store/useStoreWithUndo';

export default function UndoRedoButtons() {
  const { undo, redo, getState } = useStoreWithUndo();

  const clearAll = () => {
    useStoreWithUndo.setState(getState().prevStates[0], false);
  };

  return (
    <Stack direction="row">
      <Button startIcon={<Undo />} onClick={undo} disabled={getState().prevStates.length <= 1}>
        undo
      </Button>
      <Button endIcon={<Redo />} onClick={redo} disabled={!getState().futureStates.length}>
        redo
      </Button>
      <Button endIcon={<Clear />} onClick={clearAll} disabled={getState().prevStates.length <= 1}>
        clear
      </Button>
    </Stack>
  );
}
