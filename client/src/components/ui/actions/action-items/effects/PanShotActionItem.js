import React from 'react';
import ActionItem from '../../ActionItem';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, Slider, Switch, Typography } from '@mui/material';
import { VIDEO_FIT } from '../../../../../utils/utils';

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
  const setVideoFit = useStoreWithUndo((state) => state.setVideoFit);

  const handleEnablePanShot = () => {
    if (panShot) {
      setZoom(0);
    }
    setPanShot(!panShot);
    setVideoFit(VIDEO_FIT._COVER);
  };
  return (
    <>
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>PanShot</Typography>
        <ControlCameraIcon />
        <Switch onChange={handleEnablePanShot} checked={panShot} color="primary" />
        <Typography gutterBottom>Zoom</Typography>
        <Slider
          aria-label="Zoom %"
          onChange={(e) => setZoom(e.target.value)}
          defaultValue={0}
          valueLabelDisplay="auto"
          value={zoom}
          min={0}
          max={100}
          disabled={!panShot}
        />
      </Box>
    </>
  );
}
