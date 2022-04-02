import {
  alpha,
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  SvgIcon,
  ThemeProvider,
  Toolbar,
  Typography
} from "@mui/material";
import { ReactComponent as Logo } from "../../../assets/logo.svg";
import UndoRedoButtons from "./UndoRedoButtons";
import { createTheme } from "@mui/material/styles";

export default function CustomAppBar() {
  const createButtonTheme = (theme) => createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: theme.palette.primary.contrastText,
      },
      action: {
        ...theme.action,
        disabled: alpha(theme.palette.primary.contrastText, theme.palette.action.disabledOpacity),
      },
      divider: theme.palette.primary.contrastText,
    }
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} flexGrow={1}>
            <Stack direction="row" alignItems="center">
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <SvgIcon fontSize="large" component={Logo} inheritViewBox />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                ezvideo
              </Typography>
            </Stack>
            <ThemeProvider theme={(theme) => createButtonTheme(theme)}>
              <UndoRedoButtons />
              <Button disabled>
                render
              </Button>
            </ThemeProvider>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}