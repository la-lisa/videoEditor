import Editor from "./Editor.js"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline } from "@mui/material";

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
        <Editor/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
