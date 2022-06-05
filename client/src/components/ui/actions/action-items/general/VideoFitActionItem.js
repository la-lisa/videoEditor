import React from 'react';
import { FitScreen, QuestionMark } from '@mui/icons-material';
import { VIDEO_FIT } from '../../../../../utils/utils';
import { ListItemIcon, ListItemText, MenuItem, Stack } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function VideoFitActionItem() {
  const videoFit = useStoreWithUndo((state) => state.videoFit);
  const setVideoFit = useStoreWithUndo((state) => state.setVideoFit);

  return (
    <ActionItem Icon={() => <FitScreen />} title="Video Fit">
      {Object.values(VIDEO_FIT).map((fit) => {
        return (
          <MenuItem key={`menuItem-${fit}`} onClick={() => setVideoFit(fit)} selected={videoFit === fit}>
            <Stack direction="row" spacing={1}>
              <ListItemIcon>
                <QuestionMark fontSize="small" />
              </ListItemIcon>
              <ListItemText>{fit}</ListItemText>
            </Stack>
          </MenuItem>
        );
      })}
    </ActionItem>
  );
}
