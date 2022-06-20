import React from 'react';
import ActionItem from '../../ActionItem';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, capitalize, ListItemText, MenuItem, Slider, Stack, Switch, Typography } from '@mui/material';
import { VIDEO_FIT, ZOOMPAN_OPTIONS } from '../../../../../utils/utils';

export default function ZoomPanActionItem() {
  return (
    <ActionItem Icon={() => <ControlCameraIcon />} title="ZoomPan">
      <PanShotHandles />
    </ActionItem>
  );
}

function PanShotHandles() {
  const zoomPan = useStoreWithUndo((state) => state.zoomPan);
  const setZoomPan = useStoreWithUndo((state) => state.setZoomPan);
  const zoom = useStoreWithUndo((state) => state.zoom);
  const setZoom = useStoreWithUndo((state) => state.setZoom);
  const setVideoFit = useStoreWithUndo((state) => state.setVideoFit);
  const setZoomPanDirection = useStoreWithUndo((state) => state.setZoomPanDirection);
  const panDirection = useStoreWithUndo((state) => state.panDirection);
  const setPanShot = useStoreWithUndo((state) => state.setPanShot);

  const handleEnablePanShot = () => {
    if (zoomPan) {
      setZoom(0);
    }
    if (!zoomPan) {
      setPanShot(false);
    }
    setZoomPan(!zoomPan);
    setVideoFit(VIDEO_FIT._COVER);
  };
  return (
    <>
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>ZoomPan</Typography>
        <Switch onChange={handleEnablePanShot} checked={zoomPan} color="primary" />
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
        <Typography gutterBottom>Zoompan Direction</Typography>
        {Object.values(ZOOMPAN_OPTIONS).map((direction) => {
          return (
            <MenuItem
              disabled={!zoomPan}
              key={direction}
              onClick={() => setZoomPanDirection(direction)}
              selected={panDirection === direction}
            >
              <Stack direction="row" spacing={1}>
                <ListItemText>{capitalize(direction)}</ListItemText>
              </Stack>
            </MenuItem>
          );
        })}
      </Box>
    </>
  );
}
