import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Slider,
  Stack,
  useTheme
} from "@mui/material";
import DropzoneContainer from "./DropzoneContainer";
import CanvasFormatDialog from "./ui/dialogs/CanvasFormatDialog";
import { PauseCircle, PlayCircle } from "@mui/icons-material";
import useEventListener from "../hooks/hooks";
import useStore from "../store/useStore";
import { DIALOG_CANCEL_BUTTON_TITLE, DIALOG_OK_BUTTON_TITLE, VIDEO_FIT } from "../utils/utils";
import VideoProgressDialog from "./ui/dialogs/VideoProgressDialog";

const ffmpeg = createFFmpeg({ log: true });

export default function Editor() {
  const canvasFormat = useStore(state => state.canvasFormat);
  const canvasFormatChosen = useStore(state => state.canvasFormatChosen);
  const setCanvasFormatChosen = useStore(state => state.setCanvasFormatChosen);
  const setVideoUploaded = useStore(state => state.setVideoUploaded);
  const setResultVideoURL = useStore(state => state.setResultVideoURL);
  const videoFit = useStore(state => state.videoFit);
  const trimTime = useStore(state => state.trimTime);
  const videoBgColor = useStore(state => state.videoBgColor);
  const setResultVideoProgress = useStore(state => state.setResultVideoProgress);
  const openDialog = useStore(state => state.openDialog);
  const closeDialog = useStore(state => state.closeDialog);

  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [video, setVideo] = useState(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEventListener("keydown", handleKeydown);
  useEventListener("beforeunload", handleBeforeUnload);
  const theme = useTheme();
  const videoElemRef = createRef();

  const handleCanvasFormatDialogAction = () => {
    setCanvasFormatChosen(true);
    closeDialog();
  };

  const handleVideoProgressDialogCancel = () => {
    // TODO figure out how to cancel running task
    closeDialog();
  }

  const writeFile = useCallback(async () => {
    openDialog(() => <VideoProgressDialog />, {
      title: 'Rendering...',
      cancelButton: { title: DIALOG_CANCEL_BUTTON_TITLE, onClick: handleVideoProgressDialogCancel },
    });

    await ffmpeg.FS('writeFile', 'temp.mp4', await fetchFile(video));

    const vfOptions = videoFit === VIDEO_FIT._COVER
      ? `crop=ih*${canvasFormat}:ih`
      : `pad=width=max(iw\\,ih*(${canvasFormat})):height=ow/(${canvasFormat}):x=(ow-iw)/2:y=(oh-ih)/2:color=${videoBgColor},setsar=1`
    const useTrimTime = trimTime?.[0] && trimTime?.[1];
    await ffmpeg.run(
      ...(useTrimTime ?
        [
          '-ss',
          trimTime[0],
        ] : []
      ),
      '-i',
      'temp.mp4',
      ...(useTrimTime ?
        [
          '-to',
          trimTime[1],
          '-copyts',
        ] : []
      ),
      '-vf',
      vfOptions,
      'temp_2.mp4',
    );

    const data = ffmpeg.FS('readFile', 'temp_2.mp4');
    setResultVideoURL(URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' })));
    closeDialog();
  }, [video, videoFit, trimTime, canvasFormat, videoBgColor]);

  useEffect(() => {
    const load = async () => {
      ffmpeg.setProgress((progress) => setResultVideoProgress(progress));
      await ffmpeg.load();
      setFfmpegReady(true);
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

  // propagate change to store when video is uploaded/removed
  useEffect(() => {
    setVideoUploaded(!!video);
  }, [setVideoUploaded, video]);

  const handleScrub = (_, newValue) => {
    if (videoElemRef.current) {
      videoElemRef.current.currentTime = newValue;
    }
  }

  const PlayPauseIcon = useMemo(() => {
    return playing ? PauseCircle : PlayCircle;
  }, [playing]);

    const syncTimeToState = useCallback(() => {
        setTime(videoElemRef.current?.currentTime);
    }, [videoElemRef, setTime]);

  const handleMetadata = (e) => {
    setDuration(e.target.duration);
  }

  const togglePlaying = () => {
    videoElemRef.current?.paused ? videoElemRef.current?.play() : videoElemRef.current?.pause();
    setPlaying(oldValue => !oldValue);
  }

  function handleKeydown(e) {
    if (e.keyCode === 32) { // space
      togglePlaying();
    }
  }

  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
  }

  const showVideo = useMemo(() => {
    return video && videoUrl && canvasFormat && canvasFormatChosen;
  }, [canvasFormat, canvasFormatChosen, video, videoUrl]);

  return (
    <Grid container align="center" justifyContent="center" spacing={2}>
      <Grid item align="center" xs={12} lg={8}>
        {ffmpegReady ? (
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
                        ref={videoElemRef}
                        src={videoUrl}
                        onLoadedMetadata={handleMetadata}
                        onTimeUpdate={syncTimeToState}
                      />
                    </Box>
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                      {/* Timeline */}
                      <Box onClick={togglePlaying} sx={{ display: "flex", my: 1 }}>
                        <PlayPauseIcon titleAccess="Play/Pause (Space)" fontSize="large" sx={{ cursor: "pointer" }} />
                      </Box>
                      <Slider
                        defaultValue={0}
                        value={time}
                        max={duration}
                        step={0.05}
                        onChange={handleScrub}
                        valueLabelDisplay="auto"
                      />
                    </Stack>
                    <Button variant="contained" onClick={writeFile}>Render</Button>
                  </>
                ) : (
                  <DropzoneContainer setVideo={setVideo}/>
                )
              }
            </Stack>
          ) : (
            <CircularProgress/>
          )
        }
      </Grid>
    </Grid>
  );
}