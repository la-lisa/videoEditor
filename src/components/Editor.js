import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Box, Button, CircularProgress, Grid, Slider, Stack } from "@mui/material";
import DropzoneContainer from "./DropzoneContainer";
import CanvasFormatDialog from "./ui/CanvasFormatDialog";
import { PauseCircle, PlayCircle } from "@mui/icons-material";
import useEventListener from "../hooks/hooks";

const ffmpeg = createFFmpeg({ log: true });

export default function Editor() {
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [video, setVideo] = useState(null);
  const [canvasFormat, setCanvasFormat] = useState(null);
  const [isCanvasFormatDialogShown, setIsCanvasFormatDialogShown] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEventListener("keydown", handleKeydown);

  const videoElemRef = createRef();

  const handleCanvasFormatDialogBack = () => {
    setIsCanvasFormatDialogShown(false);
  }

  const handleCanvasFormatDialogClose = (value) => {
    setIsCanvasFormatDialogShown(false);
    setCanvasFormat(value);
  };

  const writeFile = useCallback(async () => {
    await ffmpeg.FS('writeFile', 'temp.mp4', await fetchFile(video));
  }, [video]);

  useEffect(() => {
    const load = async () => {
      await ffmpeg.load();
      setFfmpegReady(true);
    }
    load();
  }, []);

  useEffect(() => {
    video && !canvasFormat && setIsCanvasFormatDialogShown(true);
  }, [canvasFormat, video]);

  const videoUrl = useMemo(() => {
    if (video) {
      return URL.createObjectURL(video);
    }
  }, [video]);

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

  return (
    <Grid container align="center" justifyContent="center" spacing={2}>
      <Grid item align="center" xs={12} lg={8}>
        {ffmpegReady ? (
            <Stack spacing={1}>
              {video && videoUrl && canvasFormat ? (
                  <>
                    <video ref={videoElemRef} src={videoUrl} onLoadedMetadata={handleMetadata} onTimeUpdate={syncTimeToState} />
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
                    <Button variant="contained" onClick={writeFile}>Write File to Memory</Button>
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
      <CanvasFormatDialog
        open={isCanvasFormatDialogShown}
        onBack={handleCanvasFormatDialogBack}
        onClose={handleCanvasFormatDialogClose}
      />
    </Grid>
  );
}