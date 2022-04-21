import { Button, Stack } from '@mui/material';
import { Redo, Undo } from '@mui/icons-material';
import useStore from '../../../store/useStore';

export default function UndoRedoButtons() {
  const canUndo = useStore((state) => state.canUndo);
  const canRedo = useStore((state) => state.canRedo);

  return (
    <Stack direction="row">
      <Button startIcon={<Undo />} disabled={!canUndo}>
        undo
      </Button>
      <Button endIcon={<Redo />} disabled={!canRedo}>
        redo
      </Button>
    </Stack>
  );
}
