import React from 'react';
import ActionItem from '../../ActionItem';
import { ColorLens } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function BackgroundActionItem() {
  const videoBgColor = useStoreWithUndo((state) => state.videoBgColor);
  const setVideoBgColor = useStoreWithUndo((state) => state.setVideoBgColor);

  return (
    <ActionItem Icon={() => <ColorLens />} title="Background">
      <ChromePicker disableAlpha={true} color={videoBgColor} onChange={(color) => setVideoBgColor(color.hex)} />
    </ActionItem>
  );
}
