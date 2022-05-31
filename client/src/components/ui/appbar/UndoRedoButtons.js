import { Button, Stack } from '@mui/material';
import { Redo, Undo, Clear } from '@mui/icons-material';
import useStore from '../../../store/useStore';


export default function UndoRedoButtons() {
  const { undo, redo, clear,getState } =
    useStore();

  const clearAll = () => {
    useStore.setState(getState().prevStates[1], true);
    clear()
  }

  console.log(getState().prevStates)

  return (
    <Stack direction="row">
      <Button startIcon={<Undo />} onClick={undo} disabled={getState().prevStates.length <= 2}>
        undo
      </Button>
      <Button endIcon={<Redo />} onClick={redo} disabled={!getState().futureStates.length}>
        redo
      </Button>
      <Button endIcon={<Clear />} onClick={clearAll} disabled={!getState().prevStates.length}>
        clear
      </Button>
    </Stack>
  );
}
