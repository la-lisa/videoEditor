import React from 'react';
import ActionItem from '../../ActionItem';
import { ZoomIn } from '@mui/icons-material';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, Slider, Switch, Typography } from '@mui/material';

export default function PanShotActionItem() {
  return (
    <ActionItem Icon={() => <CameraFrontIcon />} title="PanShot">
      <PanShotHandles />
    </ActionItem>
  );
}

function PanShotHandles() {
  const panShot = useStoreWithUndo((state) => state.panShot);
  const setPanShot = useStoreWithUndo((state) => state.setPanShot);
  const zoom = useStoreWithUndo((state) => state.zoom);
  const setZoom = useStoreWithUndo((state) => state.setZoom);

  return (
    <>
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>PanShot</Typography>
        <ControlCameraIcon />
        <Switch onChange={() => setPanShot(!panShot)} checked={panShot} color="primary" />
        <Typography gutterBottom>Zoom</Typography>
        <ZoomIn />
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
    </>
  );
}
