import React from 'react';
import { AvTimer } from '@mui/icons-material';
import { TextField } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function TrimActionItem() {
  const endTime = useStoreWithUndo((state) => state.endTime);
  const startTime = useStoreWithUndo((state) => state.startTime);
  const setStartTime = useStoreWithUndo((state) => state.setStartTime);
  const setEndTime = useStoreWithUndo((state) => state.setEndTime);

  return (
    <ActionItem Icon={() => <AvTimer />} title="Trim">
      <TextField
        id="start"
        label="Starting Time"
        variant="outlined"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <TextField
        id="end"
        label="End Time"
        variant="outlined"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
    </ActionItem>
  );
}
