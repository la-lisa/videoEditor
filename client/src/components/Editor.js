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
import VideoProgressDialog from "./ui/dialogs/VideoProgressDialog";
import axios from 'axios';
import io from "socket.io-client";

const Editor = ({ onReady }, ref) => {
  const video = useStore(state => state.video);
  const setVideo = useStore(state => state.setVideo);
  const canvasFormat = useStore(state => state.canvasFormat);
  const canvasFormatChosen = useStore(state => state.canvasFormatChosen);
  const setCanvasFormatChosen = useStore(state => state.setCanvasFormatChosen);
  const videoFit = useStore(state => state.videoFit);
  const startTime = useStore(state => state.startTime);
  const endTime = useStore(state => state.endTime);
  const videoBgColor = useStore(state => state.videoBgColor);
  const openDialog = useStore(state => state.openDialog);
  const closeDialog = useStore(state => state.closeDialog);
  const setDuration = useStore(state => state.setDuration);
  const toggleIsPlaying = useStore(state => state.toggleIsPlaying);
  const setTime = useStore(state => state.setTime);
  const setResultVideoURL = useStore(state => state.setResultVideoURL);
  const setResultVideoProgress = useStore(state => state.setResultVideoProgress);

  useEventListener("keydown", handleKeydown);
  useEventListener("beforeunload", handleBeforeUnload);
  const theme = useTheme();

  const handleCanvasFormatDialogAction = () => {
    setCanvasFormatChosen(true);
    closeDialog();
  };
    const writeFile = useCallback(async () => {
        const vfOptions = videoFit === VIDEO_FIT._COVER
          ? { filter: 'crop', options: {w:`ih*${canvasFormat}`, h:'ih'}}
          : [{ filter: 'pad', options: {w:`max(iw\\,ih*(${canvasFormat}))`, h:`ow/(${canvasFormat})`, x: '(ow-iw)/2', y:'(oh-ih)/2', color:`${videoBgColor}`}}, {filter: 'setsar',
            options: '1'}]

        let start = startTime.split(':');
        let end = endTime.split(':');
        let secondsStart = (+start[0]) * 60 * 60 + (+start[1]) * 60 + (+start[2]);
        let secondsEnd = (+end[0]) * 60 * 60 + (+end[1]) * 60 + (+end[2]);

        const formData = new FormData();
        formData.append("file", video);
        formData.append("trimTime", JSON.stringify([secondsStart,secondsEnd]));
        formData.append("vfOptions", JSON.stringify(vfOptions));
        const res =  await axios.post('/encode', formData);

        setResultVideoURL(res.data.newVideoUrl);
    }, [video, videoFit, setResultVideoURL, startTime, endTime, canvasFormat, videoBgColor]);


    useEffect(() => {
        const load = async () => {
            var socket = io('http://localhost:3001');
            socket.on("uploadProgress", (progress) => {
                console.log(progress + "%")
                setResultVideoProgress(progress)
            })
        }
        load();
    }, []);

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
                    backgroundColor: videoBgColor,
                }}
              >
                <video
                  className="video"
                  style={{ width: '100%', height: '100%', objectFit: videoFit, backgroundColor: videoBgColor }}
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