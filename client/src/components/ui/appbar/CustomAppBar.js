import {
  alpha,
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  ThemeProvider,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import UndoRedoButtons from './UndoRedoButtons';
import { createTheme } from '@mui/material/styles';
import { useRenderVideo } from '../../../hooks/hooks';
import useStore from '../../../store/useStore';

export default function CustomAppBar({ videoReady }) {
  const renderVideo = useRenderVideo();
  const theme = useTheme();

  const showButtons = useStore((state) => state.canvasFormatChosen);

  const createButtonTheme = (theme) =>
    createTheme({
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
      },
    });

  return (
    <Box sx={{ position: 'absolute', top: 0, right: 0, left: 0, height: theme.spacing(8), zIndex: 1 }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} flexGrow={1}>
            <Stack direction="row" alignItems="center">
              <Link component={IconButton} href="/" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <SvgIcon fontSize="large" component={Logo} inheritViewBox />
              </Link>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, userSelect: 'none' }}>
                ezvideo
              </Typography>
            </Stack>
            {showButtons && (
              <ThemeProvider theme={(theme) => createButtonTheme(theme)}>
                <UndoRedoButtons />
                <Button onClick={renderVideo} disabled={!videoReady}>
                  render
                </Button>
              </ThemeProvider>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
