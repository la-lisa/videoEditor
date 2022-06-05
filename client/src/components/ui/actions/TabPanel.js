import React from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';

/**
 * @see https://mui.com/material-ui/react-tabs/#vertical-tabs
 */
export default function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ overflowY: 'auto' }}
    >
      {value === index && (
        <Stack spacing={2} padding={2} minWidth={200}>
          {children}
        </Stack>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
