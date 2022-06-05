import { Menu, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function ActionItem({ Icon, title, onClick, disabled, sx, children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;
  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        onClick={disabled ? undefined : onClick || handleClick}
        sx={{
          whiteSpace: 'nowrap',
          alignItems: 'center',
          userSelect: 'none',
          ...sx,
          ...(disabled ? { color: theme.palette.text.disabled } : { cursor: 'pointer' }),
        }}
      >
        <Icon />
        <Typography>{title}</Typography>
      </Stack>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </Menu>
    </>
  );
}

ActionItem.propTypes = {
  Icon: PropTypes.func,
  title: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
