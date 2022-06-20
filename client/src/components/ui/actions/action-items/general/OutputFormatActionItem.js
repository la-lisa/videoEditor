import React from 'react';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { OUTPUT_FORMAT } from '../../../../../utils/utils';
import { ListItemText, MenuItem, Stack } from '@mui/material';
import ActionItem from '../../ActionItem';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';

export default function AspectRatioActionItem() {
  const outputFormat = useStoreWithUndo((state) => state.outputFormat);
  const setOutputFormat = useStoreWithUndo((state) => state.setOutputFormat);

  return (
    <ActionItem Icon={() => <OndemandVideoIcon />} title="Output Videoformat">
      {Object.values(OUTPUT_FORMAT).map((key) => {
        return (
          <MenuItem key={`menuItem-${key}`} onClick={() => setOutputFormat(key)} selected={outputFormat === key}>
            <Stack direction="row" spacing={1}>
              <ListItemText>{key}</ListItemText>
            </Stack>
          </MenuItem>
        );
      })}
    </ActionItem>
  );
}
