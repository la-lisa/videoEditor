import { createTheme } from '@mui/material/styles';

export default function composeGlobalTheme() {
  let theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  // scrollbar styles
  theme = createTheme(theme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: `${theme.palette.action.active} ${theme.palette.action.selected}`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: theme.palette.action.selected,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: theme.palette.action.selected,
              minHeight: theme.spacing(4),
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: theme.palette.action.focus,
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: theme.palette.action.active,
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.action.focus,
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: theme.palette.action.selected,
            },
          },
        },
      },
    },
  });

  return theme;
}
