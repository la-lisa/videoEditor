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
import CanvasFormatDialog from "./ui/CanvasFormatDialog";
import { PauseCircle, PlayCircle } from "@mui/icons-material";
import useEventListener from "../hooks/hooks";
import useStore from "../store/useStore";
import { VIDEO_FIT } from "../utils/utils";

const ffmpeg = createFFmpeg({ log: true });

export default function Editor() {
  const canvasFormat = useStore(state => state.canvasFormat);
  const setCanvasFormat = useStore(state => state.setCanvasFormat);
  const setVideoUploaded = useStore(state => state.setVideoUploaded);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [video, setVideo] = useState(null);
  const [newUrl, setNewUrl] = useState(null);
  const [trimTime, setTrimTime] = useState(['00:00:02', '00:00:04']);
  const [isCanvasFormatDialogShown, setIsCanvasFormatDialogShown] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoFit, setVideoFit] = useState('contain');
  const [bgColor, setBgColor] = useState('#000000');
  useEventListener("keydown", handleKeydown);
  const theme = useTheme();

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
    if (videoFit === "cover") {
      await ffmpeg.run(
        '-i',
        'temp.mp4',
        '-ss',
        trimTime[0],
        '-to',
        trimTime[1],
        '-vf',
        'crop=ih*' + canvasFormat + ':ih',
        'temp_2.mp4',
      );
    } else if (videoFit === "contain") {
      await ffmpeg.run(
        '-i',
        'temp.mp4',
        '-ss',
        trimTime[0],
        '-to',
        trimTime[1],
        '-vf',
        'pad=width=max(iw\\,ih*('+ canvasFormat + ')):height=ow/('+ canvasFormat + '):x=(ow-iw)/2:y=(oh-ih)/2:color=' + bgColor + ',setsar=1',
        'temp_2.mp4',
      );
    }
    const data = ffmpeg.FS('readFile', 'temp_2.mp4');
    setNewUrl(URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'})));
  }, [video, canvasFormat, videoFit, bgColor, trimTime]);

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

  // propagate change to store when video is uploaded/removed
  useEffect(() => {
    console.log(!!video);
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

  return (
    <Grid container align="center" justifyContent="center" spacing={2}>
      <Grid item align="center" xs={12} lg={8}>
        {ffmpegReady ? (
            <Stack spacing={1}>
              {video && videoUrl && canvasFormat ? (
                  <>
                    <Box className="videoWrapper" style={{ aspectRatio: canvasFormat }} sx={{ alignSelf: 'center',  height: '60vh', maxWidth: '100%', border: theme.spacing(0.25), borderColor: theme.palette.primary.dark, borderStyle: 'dashed', bgcolor: bgColor, }}>
                      <video className="video" style={{ width: '100%', height: '100%', objectFit: videoFit }} ref={videoElemRef} src={videoUrl} onLoadedMetadata={handleMetadata} onTimeUpdate={syncTimeToState} />
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
                    <Button variant="contained" onClick={writeFile}>Write File to Memory</Button>
                    { newUrl &&
                      <video src={newUrl} style={{ border: theme.spacing(0.25),
                        borderColor: theme.palette.primary.dark, borderStyle: 'dashed' }}/>
                    }
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