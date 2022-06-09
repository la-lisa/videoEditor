import React from 'react';
import ActionItem from '../../ActionItem';
import { Flip } from '@mui/icons-material';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, Switch, Typography } from '@mui/material';

export default function FlipActionItem() {
  return (
    <ActionItem Icon={() => <FlipCameraAndroidIcon />} title="Flip Video">
      <FlipHandles />
    </ActionItem>
  );
}

function FlipHandles() {
  const flipHorizontal = useStoreWithUndo((state) => state.flipHorizontal);
  const setFlipHorizontal = useStoreWithUndo((state) => state.setFlipHorizontal);
  const flipVertical = useStoreWithUndo((state) => state.flipVertical);
  const setFlipVertical = useStoreWithUndo((state) => state.setFlipVertical);

  return (
    <>
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>Flip Horizontal</Typography>
        <Flip />
        <Switch onChange={() => setFlipHorizontal(!flipHorizontal)} checked={flipHorizontal} color="primary" />
        <Typography gutterBottom>Flip Vertical</Typography>
        <Flip style={{ transform: 'rotate(90deg)' }} />
        <Switch onChange={() => setFlipVertical(!flipVertical)} checked={flipVertical} color="primary" />
      </Box>
    </>
  );
}
