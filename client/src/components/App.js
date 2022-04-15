import Editor from "./Editor.js"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Container,
  CssBaseline,
  Stack,
} from "@mui/material";
import Actions from "./Actions";
import Result from "./Result";
import ModalDialog from "./ui/dialogs/ModalDialog";
import CustomAppBar from "./ui/appbar/CustomAppBar";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <CustomAppBar />
      <Container className="App" maxWidth="lg" sx={{ mt: 8 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={4}>
            <Editor />
            <Actions />
          </Stack>
          <Result />
        </Stack>
        <ModalDialog />
      </Container>
    </ThemeProvider>
  );
}

export default App;
