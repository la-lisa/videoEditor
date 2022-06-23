import React from 'react';
import { FitScreen } from '@mui/icons-material';
import { VIDEO_FIT } from '../../../../../utils/utils';
import { capitalize, ListItemIcon, ListItemText, MenuItem, Stack, SvgIcon } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { ReactComponent as VideoFitContain } from '../../../../../assets/video-fit-contain.svg';
import { ReactComponent as VideoFitCover } from '../../../../../assets/video-fit-cover.svg';

export default function VideoFitActionItem() {
  const videoFit = useStoreWithUndo((state) => state.videoFit);
  const setVideoFit = useStoreWithUndo((state) => state.setVideoFit);

  const iconComponentForVideoFit = (videoFit) => {
    return videoFit === VIDEO_FIT._COVER ? VideoFitCover : VideoFitContain;
  };

  const handleChangeVideoFit = (fit) => {
    setVideoFit(fit);
  };

  return (
    <ActionItem Icon={() => <FitScreen />} title="Video Fit">
      {Object.values(VIDEO_FIT).map((fit) => {
        return (
          <MenuItem key={`menuItem-${fit}`} onClick={() => handleChangeVideoFit(fit)} selected={videoFit === fit}>
            <Stack direction="row" spacing={1}>
              <ListItemIcon>
                <SvgIcon component={iconComponentForVideoFit(fit)} inheritViewBox />
              </ListItemIcon>
              <ListItemText>{capitalize(fit)}</ListItemText>
            </Stack>
          </MenuItem>
        );
      })}
    </ActionItem>
  );
}

export const userSeekEvent = new CustomEvent('userSeek', { detail: { timestamp: () => this.currentTime } });
