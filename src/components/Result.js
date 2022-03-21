import useStore from "../store/useStore";
import { useTheme } from "@mui/material";

export default function Result() {
  const url = useStore(state => state.resultVideoURL);
  const theme = useTheme();

  return (
    <>
      { url &&
        <video src={url} style={{ border: theme.spacing(0.25),
          borderColor: theme.palette.primary.dark, borderStyle: 'dashed' }} />
      }
    </>
  )
}