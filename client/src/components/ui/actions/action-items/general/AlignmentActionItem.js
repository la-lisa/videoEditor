import React from 'react';
import { AlignHorizontalCenter, QuestionMark } from '@mui/icons-material';
import { VIDEO_ALIGN } from '../../../../../utils/utils';
import { ListItemIcon, ListItemText, MenuItem, Stack } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function AlignmentActionItem() {
  const videoAlign = useStoreWithUndo((state) => state.videoAlign);
  const setVideoAlign = useStoreWithUndo((state) => state.setVideoAlign);

  return (
    <ActionItem Icon={() => <AlignHorizontalCenter />} title="Alignment">
      {Object.values(VIDEO_ALIGN).map((align) => {
        return (
          <MenuItem key={align} onClick={() => setVideoAlign(align)} selected={videoAlign === align}>
            <Stack direction="row" spacing={1}>
              <ListItemIcon>
                <QuestionMark fontSize="small" />
              </ListItemIcon>
              <ListItemText>{align}</ListItemText>
            </Stack>
          </MenuItem>
        );
      })}
    </ActionItem>
  );
}
