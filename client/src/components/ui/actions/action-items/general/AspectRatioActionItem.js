import React from 'react';
import { AspectRatio, QuestionMark } from '@mui/icons-material';
import { CANVAS_FORMATS } from '../../../../../utils/utils';
import { ListItemIcon, ListItemText, MenuItem, Stack } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function AspectRatioActionItem() {
  const canvasFormat = useStoreWithUndo((state) => state.canvasFormat);
  const setCanvasFormat = useStoreWithUndo((state) => state.setCanvasFormat);

  return (
    <ActionItem Icon={() => <AspectRatio />} title="Aspect Ratio">
      {Object.keys(CANVAS_FORMATS).map((key) => {
        return (
          <MenuItem key={`menuItem-${key}`} onClick={() => setCanvasFormat(key)} selected={canvasFormat === key}>
            <Stack direction="row" spacing={1}>
              <ListItemIcon>
                <QuestionMark fontSize="small" />
              </ListItemIcon>
              <ListItemText>{CANVAS_FORMATS[key].title}</ListItemText>
            </Stack>
          </MenuItem>
        );
      })}
    </ActionItem>
  );
}
