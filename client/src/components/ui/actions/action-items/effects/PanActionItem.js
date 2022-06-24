import React from 'react';
import ActionItem from '../../ActionItem';
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, capitalize, ListItemText, MenuItem, Stack, Switch, Typography } from '@mui/material';
import { PAN_DIRECTION } from '../../../../../utils/utils';

export default function PanActionItem() {
  const panShot = useStoreWithUndo((state) => state.panShot);
  const setPanShot = useStoreWithUndo((state) => state.setPanShot);
  const panDirection = useStoreWithUndo((state) => state.panDirection);
  const setPanDirection = useStoreWithUndo((state) => state.setPanDirection);

  const togglePanShot = () => {
    setPanShot(!panShot);
  };

  return (
    <ActionItem Icon={() => <CameraFrontIcon />} title="Pan Shot">
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>Virtual Pan Shot</Typography>
        <Switch onChange={togglePanShot} checked={panShot} color="primary" />
        <Typography gutterBottom>Direction</Typography>
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
    </ActionItem>
  );
}
