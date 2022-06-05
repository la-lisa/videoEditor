import React from 'react';
import { VolumeOff } from '@mui/icons-material';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function MuteActionItem() {
  const muteAudio = useStoreWithUndo((state) => state.muteAudio);
  const setMuteAudio = useStoreWithUndo((state) => state.setMuteAudio);

  const handleMute = () => {
    setMuteAudio(!muteAudio);
  };

  return (
    <ActionItem Icon={() => <VolumeOff />} title="Mute">
      <FormGroup>
        <FormControlLabel
          control={<Switch onChange={handleMute} checked={muteAudio} color="primary" />}
          label="Audio Off"
          labelPlacement="top"
        />
      </FormGroup>
    </ActionItem>
  );
}
