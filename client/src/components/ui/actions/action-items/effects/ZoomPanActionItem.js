import React from 'react';
import ActionItem from '../../ActionItem';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, capitalize, ListItemText, MenuItem, Slider, Stack, Switch, Typography } from '@mui/material';
import { ZOOMPAN_OPTIONS } from '../../../../../utils/utils';

export default function ZoomPanActionItem() {
  const zoomPan = useStoreWithUndo((state) => state.zoomPan);
  const setZoomPan = useStoreWithUndo((state) => state.setZoomPan);
  const zoom = useStoreWithUndo((state) => state.zoom);
  const setZoom = useStoreWithUndo((state) => state.setZoom);
  const zoomPanDirection = useStoreWithUndo((state) => state.zoomPanDirection);
  const setZoomPanDirection = useStoreWithUndo((state) => state.setZoomPanDirection);

  const toggleZoomPan = () => {
    setZoomPan(!zoomPan);
  };

  return (
    <ActionItem Icon={() => <ControlCameraIcon />} title="Zoom Pan">
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>ZoomPan</Typography>
        <Switch onChange={toggleZoomPan} checked={zoomPan} color="primary" />
        <Typography gutterBottom>Zoom</Typography>
        <Slider
          aria-label="Zoom %"
          onChange={(e) => setZoom(e.target.value)}
          defaultValue={0}
          valueLabelDisplay="auto"
          value={zoom}
          min={0}
          max={100}
          disabled={!zoomPan}
        />
        <Typography gutterBottom>Direction</Typography>
        {Object.values(ZOOMPAN_OPTIONS).map((option) => {
          return (
            <MenuItem
              disabled={!zoomPan}
              key={option}
              onClick={() => setZoomPanDirection(option)}
              selected={zoomPanDirection === option}
            >
              <Stack direction="row" spacing={1}>
                <ListItemText>{capitalize(option)}</ListItemText>
              </Stack>
            </MenuItem>
          );
        })}
      </Box>
    </ActionItem>
  );
}
