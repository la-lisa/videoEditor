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
  const zoomPanDirection = useStoreWithUndo((state) => state.zoomPanDirection);
  const setZoomPanDirection = useStoreWithUndo((state) => state.setZoomPanDirection);
  const setPanShot = useStoreWithUndo((state) => state.setPanShot);

  const handleEnableZoomPan = () => {
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
        <Switch onChange={handleEnableZoomPan} checked={zoomPan} color="primary" />
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
    </>
  );
}
