import React from 'react';
import useStoreWithUndo from '../../../../store/useStoreWithUndo';
import { RestartAlt } from '@mui/icons-material';
import ActionItem from '../ActionItem';
import { useTheme } from '@mui/material';

export default function ResetAllActionItem() {
  const { getState } = useStoreWithUndo();
  const theme = useTheme();

  const clearAll = () => {
    useStoreWithUndo.setState(getState().prevStates[0], false);
  };

  return (
    <ActionItem
      Icon={() => <RestartAlt />}
      title="Reset All"
      onClick={clearAll}
      disabled={getState().prevStates.length <= 1}
      sx={{ color: theme.palette.warning.main }}
    />
  );
}
