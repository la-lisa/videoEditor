import { Button, Stack } from '@mui/material';
import { Redo, Undo, Clear } from '@mui/icons-material';
import useStore from '../../../store/useStore';


export default function UndoRedoButtons() {
  const { undo, redo, clear,getState } =
    useStore();
  return (
    <Stack direction="row">
      <Button startIcon={<Undo />} onClick={undo} disabled={!getState().prevStates.length}>
        undo
      </Button>
      <Button endIcon={<Redo />} onClick={redo} disabled={!getState().futureStates.length}>
        redo
      </Button>
      <Button endIcon={<Clear />} onClick={clear}>
        clear
      </Button>
    </Stack>
  );
}
