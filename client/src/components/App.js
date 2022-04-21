import Editor from './Editor.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Stack } from '@mui/material';
import Actions from './Actions';
import Result from './Result';
import ModalDialog from './ui/dialogs/ModalDialog';
import CustomAppBar from './ui/appbar/CustomAppBar';
import { useRef, useState } from 'react';
import Timeline from './Timeline';

function App() {
  const [videoReady, setVideoReady] = useState(false);
  const videoElemRef = useRef();

  const handleVideoReady = () => {
    setVideoReady(true);
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomAppBar videoReady={videoReady} />
      <Container className="App" maxWidth="lg" sx={{ mt: 8 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={4}>
            <Editor ref={videoElemRef} onReady={handleVideoReady} />
            {videoReady && <Actions />}
          </Stack>
          {videoReady && <Timeline ref={videoElemRef} />}
          <Result />
        </Stack>
        <ModalDialog />
      </Container>
    </ThemeProvider>
  );
}

export default App;
