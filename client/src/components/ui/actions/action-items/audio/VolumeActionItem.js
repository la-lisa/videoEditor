import React from 'react';
import { VolumeUp } from '@mui/icons-material';
import { Box, Slider, Typography } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function VolumeActionItem() {
  const audioVolume = useStoreWithUndo((state) => state.audioVolume);
  const setAudioVolume = useStoreWithUndo((state) => state.setAudioVolume);

  return (
    <ActionItem Icon={() => <VolumeUp />} title="Volume">
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>Volume</Typography>
        <Slider
          aria-label="Volume %"
          onChange={(e) => setAudioVolume(e.target.value)}
          defaultValue={100}
          valueLabelDisplay="auto"
          value={audioVolume}
          step={1}
          min={10}
          max={150}
        />
      </Box>
    </ActionItem>
  );
}
