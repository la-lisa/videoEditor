import React from 'react';
import ActionItem from '../../ActionItem';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, capitalize, ListItemText, MenuItem, Stack, Switch, Typography } from '@mui/material';
import { PAN_DIRECTION, VIDEO_FIT } from '../../../../../utils/utils';

export default function PanActionItem() {
  return (
    <ActionItem Icon={() => <CameraFrontIcon />} title="PanShot">
      <PanShotHandles />
    </ActionItem>
  );
}

function PanShotHandles() {
  const panShot = useStoreWithUndo((state) => state.panShot);
  const setPanShot = useStoreWithUndo((state) => state.setPanShot);
  const setVideoFit = useStoreWithUndo((state) => state.setVideoFit);
  const setPanDirection = useStoreWithUndo((state) => state.setPanDirection);
  const panDirection = useStoreWithUndo((state) => state.panDirection);
  const setZoomPan = useStoreWithUndo((state) => state.setZoomPan);
  const setZoom = useStoreWithUndo((state) => state.setZoom);

  const handleEnablePanShot = () => {
    if (!panShot) {
      setZoomPan(false);
      setZoom(0);
    }
    setPanShot(!panShot);
    setVideoFit(VIDEO_FIT._COVER);
  };
  return (
    <>
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>Pan</Typography>
        <Switch onChange={handleEnablePanShot} checked={panShot} color="primary" />
        <Typography gutterBottom>Panshot Direction</Typography>
        {Object.values(PAN_DIRECTION).map((direction) => {
          return (
            <MenuItem
              disabled={!panShot}
              key={direction}
              onClick={() => setPanDirection(direction)}
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
