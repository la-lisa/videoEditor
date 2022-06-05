import React from 'react';
import { AspectRatio } from '@mui/icons-material';
import { CANVAS_FORMATS } from '../../../../../utils/utils';
import { ListItemIcon, ListItemText, MenuItem, Stack, SvgIcon } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { ReactComponent as _16_BY_9 } from '../../../../../assets/_16_BY_9.svg';
import { ReactComponent as _1_BY_1 } from '../../../../../assets/_1_BY_1.svg';
import { ReactComponent as _4_BY_3 } from '../../../../../assets/_4_BY_3.svg';
import { ReactComponent as _9_BY_16 } from '../../../../../assets/_9_BY_16.svg';

export default function AspectRatioActionItem() {
  const canvasFormat = useStoreWithUndo((state) => state.canvasFormat);
  const setCanvasFormat = useStoreWithUndo((state) => state.setCanvasFormat);

  const iconComponentForAspectRatio = (aspectRatio) => {
    switch (aspectRatio) {
      case '_16_BY_9':
        return _16_BY_9;
      case '_1_BY_1':
        return _1_BY_1;
      case '_4_BY_3':
        return _4_BY_3;
      case '_9_BY_16':
        return _9_BY_16;
      default:
        return null;
    }
  };

  return (
    <ActionItem Icon={() => <AspectRatio />} title="Aspect Ratio">
      {Object.keys(CANVAS_FORMATS).map((key) => {
        return (
          <MenuItem key={`menuItem-${key}`} onClick={() => setCanvasFormat(key)} selected={canvasFormat === key}>
            <Stack direction="row" spacing={1}>
              <ListItemIcon sx={{ alignItems: 'center' }}>
                <SvgIcon fontSize="small" component={iconComponentForAspectRatio(key)} inheritViewBox />
              </ListItemIcon>
              <ListItemText>{CANVAS_FORMATS[key].title}</ListItemText>
            </Stack>
          </MenuItem>
        );
      })}
    </ActionItem>
  );
}
