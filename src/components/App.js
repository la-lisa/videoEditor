import Editor from "./Editor.js"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline, Stack } from "@mui/material";
import Actions from "./Actions";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container className="App" maxWidth="lg">
        <h1>ffmpeg.wasm video editor</h1>
        <Stack direction="row" spacing={4}>
          <Editor />
          <Actions />
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
