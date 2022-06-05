import React from 'react';
import { ZoomIn } from '@mui/icons-material';
import { Box, Slider, Typography } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function ZoomActionItem() {
  const zoom = useStoreWithUndo((state) => state.zoom);
  const setZoom = useStoreWithUndo((state) => state.setZoom);

  return (
    <ActionItem Icon={() => <ZoomIn />} title="Zoom">
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>Zoom</Typography>
        <Slider
          aria-label="Zoom %"
          onChange={(e) => setZoom(e.target.value)}
          defaultValue={0}
          valueLabelDisplay="auto"
          value={zoom}
          min={-100}
          max={100}
        />
      </Box>
    </ActionItem>
  );
}
