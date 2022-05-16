import Editor from './Editor.js';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container, CssBaseline } from '@mui/material';
import Actions from './Actions';
import ModalDialog from './ui/dialogs/ModalDialog';
import CustomAppBar from './ui/appbar/CustomAppBar';
import { useRef, useState } from 'react';
import Timeline from './Timeline';
import composeGlobalTheme from './ui/theme/globalTheme';

export default function App() {
  const [videoReady, setVideoReady] = useState(false);
  const videoElemRef = useRef();

  const handleVideoReady = () => {
    setVideoReady(true);
  };

  const theme = composeGlobalTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100%', position: 'relative' }}>
        <CssBaseline />
        <CustomAppBar videoReady={videoReady} />
        <Box
          className="App"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            height: '100%',
            width: '100%',
            pt: 12,
            pb: '180px',
          }}
        >
          <Container maxWidth="xl" sx={{ display: 'flex', height: '100%' }}>
            <Editor ref={videoElemRef} onReady={handleVideoReady} />
            {videoReady && <Actions />}
          </Container>
          {videoReady && <Timeline ref={videoElemRef} />}
          <ModalDialog />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
