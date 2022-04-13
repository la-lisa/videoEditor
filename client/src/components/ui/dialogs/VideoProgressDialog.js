import CircularProgressWithLabel from "../CircularProgressWithLabel";
import useStore from "../../../store/useStore";
import { Container, useTheme } from "@mui/material";

export default function VideoProgressDialog() {
  const progress = useStore(state => state.resultVideoProgress);
  const val = progress?.ratio ? Math.max(0, (progress.ratio * 100)) : null;
  const theme = useTheme();

  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
      <CircularProgressWithLabel value={val} size={theme.spacing(12)} />
    </Container>
  );
}