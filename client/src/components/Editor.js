import { forwardRef, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Stack,
  useTheme
} from "@mui/material";
import DropzoneContainer from "./DropzoneContainer";
import CanvasFormatDialog from "./ui/dialogs/CanvasFormatDialog";
import { useEventListener } from "../hooks/hooks";
import useStore from "../store/useStore";
import { DIALOG_CANCEL_BUTTON_TITLE, DIALOG_OK_BUTTON_TITLE } from "../utils/utils";

const Editor = ({ onReady }, ref) => {
  const video = useStore(state => state.video);
  const setVideo = useStore(state => state.setVideo);
  const canvasFormat = useStore(state => state.canvasFormat);
  const canvasFormatChosen = useStore(state => state.canvasFormatChosen);
  const setCanvasFormatChosen = useStore(state => state.setCanvasFormatChosen);
  const videoFit = useStore(state => state.videoFit);
  const videoBgColor = useStore(state => state.videoBgColor);
  const openDialog = useStore(state => state.openDialog);
  const closeDialog = useStore(state => state.closeDialog);
  const setDuration = useStore(state => state.setDuration);
  const toggleIsPlaying = useStore(state => state.toggleIsPlaying);
  const setTime = useStore(state => state.setTime);

  useEventListener("keydown", handleKeydown);
  useEventListener("beforeunload", handleBeforeUnload);
  const theme = useTheme();

  const handleCanvasFormatDialogAction = () => {
    setCanvasFormatChosen(true);
    closeDialog();
  };

  useEffect(() => {
    video && !canvasFormat && openDialog(() => <CanvasFormatDialog />, {
      title: 'Choose Canvas Format',
      actionButton: { title: DIALOG_OK_BUTTON_TITLE, onClick: handleCanvasFormatDialogAction },
      cancelButton: { title: DIALOG_CANCEL_BUTTON_TITLE, onClick: closeDialog },
    });
  }, [canvasFormat, video]);

  const videoUrl = useMemo(() => {
    if (video) {
      return URL.createObjectURL(video);
    }
  }, [video]);

  const syncTimeToState = useCallback(() => {
    setTime(ref.current?.currentTime);
  }, [ref, setTime]);

  const handleMetadata = (e) => {
    setDuration(e.target.duration);
  }

  function handleKeydown(e) {
    if (e.keyCode === 32) { // space
      toggleIsPlaying();
    }
  }

  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
  }

  const showVideo = useMemo(() => {
    return video && videoUrl && canvasFormat && canvasFormatChosen;
  }, [canvasFormat, canvasFormatChosen, video, videoUrl]);

  useEffect(() => {
    if (showVideo === true && onReady) onReady();
  }, [showVideo, onReady]);

  return (
    <Grid container align="center" justifyContent="center" spacing={2}>
      <Grid item align="center" xs={12} lg={8}>
        <Stack spacing={1}>
          {showVideo ? (
            <>
              <Box
                className="videoWrapper"
                style={{ aspectRatio: canvasFormat }}
                sx={{
                  alignSelf: 'center',
                  height: '60vh',
                  maxWidth: '100%',
                  border: theme.spacing(0.25),
                  borderColor: theme.palette.primary.dark,
                  borderStyle: 'dashed',
                  bgcolor: videoBgColor,
                }}
              >
                <video
                  className="video"
                  style={{ width: '100%', height: '100%', objectFit: videoFit }}
                  ref={ref}
                  src={videoUrl}
                  onLoadedMetadata={handleMetadata}
                  onTimeUpdate={syncTimeToState}
                />
              </Box>
            </>
          ) : (
            <DropzoneContainer setVideo={setVideo}/>
          )}
        </Stack>
        {/*<CircularProgress/>*/}
      </Grid>
    </Grid>
  );
}

export default forwardRef(Editor);