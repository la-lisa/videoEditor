import React from 'react';
import { AlignHorizontalCenter } from '@mui/icons-material';
import { VIDEO_ALIGN } from '../../../../../utils/utils';
import { capitalize, ListItemIcon, ListItemText, MenuItem, Stack, SvgIcon } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { ReactComponent as AlignmentCenter } from '../../../../../assets/alignment-center.svg';
import { ReactComponent as AlignmentTop } from '../../../../../assets/alignment-top.svg';
import { ReactComponent as AlignmentRight } from '../../../../../assets/alignment-right.svg';
import { ReactComponent as AlignmentBottom } from '../../../../../assets/alignment-bottom.svg';
import { ReactComponent as AlignmentLeft } from '../../../../../assets/alignment-left.svg';

export default function AlignmentActionItem() {
  const videoAlign = useStoreWithUndo((state) => state.videoAlign);
  const setVideoAlign = useStoreWithUndo((state) => state.setVideoAlign);

  const iconComponentForAlignment = (alignment) => {
    switch (alignment) {
      case VIDEO_ALIGN._CENTER:
        return AlignmentCenter;
      case VIDEO_ALIGN._TOP:
        return AlignmentTop;
      case VIDEO_ALIGN._RIGHT:
        return AlignmentRight;
      case VIDEO_ALIGN._BOTTOM:
        return AlignmentBottom;
      case VIDEO_ALIGN._LEFT:
        return AlignmentLeft;
      default:
        return null;
    }
  };

  return (
    <ActionItem Icon={() => <AlignHorizontalCenter />} title="Alignment">
      {Object.values(VIDEO_ALIGN).map((align) => {
        return (
          <MenuItem key={align} onClick={() => setVideoAlign(align)} selected={videoAlign === align}>
            <Stack direction="row" spacing={1}>
              <ListItemIcon>
                <SvgIcon fontSize="small" component={iconComponentForAlignment(align)} inheritViewBox />
              </ListItemIcon>
              <ListItemText>{capitalize(align)}</ListItemText>
            </Stack>
          </MenuItem>
        );
      })}
    </ActionItem>
  );
}
