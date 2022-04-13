import {createRef, useCallback, useEffect, useMemo, useState} from "react";
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
import {PauseCircle, PlayCircle} from "@mui/icons-material";
import useEventListener from "../hooks/hooks";
import useStore from "../store/useStore";
import axios from 'axios';
import {VIDEO_FIT} from "../utils/utils";

export default function Editor() {
    const canvasFormat = useStore(state => state.canvasFormat);
    const setCanvasFormat = useStore(state => state.setCanvasFormat);
    const setVideoUploaded = useStore(state => state.setVideoUploaded);
    const setResultVideoURL = useStore(state => state.setResultVideoURL);
    const videoFit = useStore(state => state.videoFit);
    const trimTime = useStore(state => state.trimTime);
    const videoBgColor = useStore(state => state.videoBgColor)
    const [video, setVideo] = useState(null);
    const [isCanvasFormatDialogShown, setIsCanvasFormatDialogShown] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playing, setPlaying] = useState(false);

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
        const vfOptions = videoFit === VIDEO_FIT._COVER
          ? { filter: 'crop', options: `ih*${canvasFormat}:ih`}
          : { filter: 'pad', options: `width=max(iw\\,ih*(${canvasFormat})):height=ow/(${canvasFormat}):x=(ow-iw)/2:y=(oh-ih)/2:color=${videoBgColor},setsar=1` }

        const formData = new FormData();
        formData.append("file", video);
        formData.append("trimTime", trimTime);
        formData.append("vfOptions", JSON.stringify(vfOptions));
        const res =  await axios.post('/encode', formData);
        // await ffmpeg.run(
        //     '-ss',
        //     trimTime[0],
        //     '-i',
        //     'temp.mp4',
        //     '-to',
        //     trimTime[1],
        //     '-copyts',
        //     '-vf',
        //     vfOptions,
        //     'temp_2.mp4',
        // );

        setResultVideoURL(res.data.newVideoUrl);
    }, [video, videoFit, setResultVideoURL, trimTime, canvasFormat, videoBgColor]);

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
                    <Stack spacing={1}>
                        {video && videoUrl && canvasFormat ? (
                            <>
                                <Box className="videoWrapper" style={{aspectRatio: canvasFormat}} sx={{
                                    alignSelf: 'center',
                                    height: '60vh',
                                    maxWidth: '100%',
                                    border: theme.spacing(0.25),
                                    borderColor: theme.palette.primary.dark,
                                    borderStyle: 'dashed',
                                    bgcolor: videoBgColor,
                                }}>
                                    <video className="video"
                                           style={{width: '100%', height: '100%', objectFit: videoFit}}
                                           ref={videoElemRef} src={videoUrl} onLoadedMetadata={handleMetadata}
                                           onTimeUpdate={syncTimeToState}/>
                                </Box>
                                <Stack spacing={2} direction="row" sx={{mb: 1}} alignItems="center">
                                    {/* Timeline */}
                                    <Box onClick={togglePlaying} sx={{display: "flex", my: 1}}>
                                        <PlayPauseIcon titleAccess="Play/Pause (Space)" fontSize="large"
                                                       sx={{cursor: "pointer"}}/>
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
                    {/*<CircularProgress/>*/}
            </Grid>
            <CanvasFormatDialog
                open={isCanvasFormatDialogShown}
                onBack={handleCanvasFormatDialogBack}
                onClose={handleCanvasFormatDialogClose}
            />
        </Grid>
    );
}