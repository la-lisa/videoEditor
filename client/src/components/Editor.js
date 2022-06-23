import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, useTheme } from '@mui/material';
import DropzoneContainer from './DropzoneContainer';
import CanvasFormatDialog from './ui/dialogs/CanvasFormatDialog';
import { useAnimationFrame, useDimensionChange, useEventListener, useUploadVideo } from '../hooks/hooks';
import useStore from '../store/useStore';
import { CANVAS_FORMATS, clamp, DIALOG_CANCEL_BUTTON_TITLE, DIALOG_OK_BUTTON_TITLE, VIDEO_ALIGN } from '../utils/utils';
import { useThrottledCallback, useWindowResize } from 'beautiful-react-hooks';
import useStoreWithUndo from '../store/useStoreWithUndo';

const Editor = ({ onReady }, ref) => {
  const video = useStore((state) => state.video);
  const setVideo = useStore((state) => state.setVideo);
  const openDialog = useStore((state) => state.openDialog);
  const closeDialog = useStore((state) => state.closeDialog);
  const canvasFormat = useStoreWithUndo((state) => state.canvasFormat);
  const canvasFormatChosen = useStore((state) => state.canvasFormatChosen);
  const setCanvasFormatChosen = useStore((state) => state.setCanvasFormatChosen);
  const videoFit = useStoreWithUndo((state) => state.videoFit);
  const videoBgColor = useStoreWithUndo((state) => state.videoBgColor);
  const setDuration = useStore((state) => state.setDuration);
  const isPlaying = useStore((state) => state.isPlaying);
  const toggleIsPlaying = useStore((state) => state.toggleIsPlaying);
  const setTime = useStore((state) => state.setTime);
  const brightness = useStoreWithUndo((state) => state.brightness);
  const contrast = useStoreWithUndo((state) => state.contrast);
  const blur = useStoreWithUndo((state) => state.blur);
  const hue = useStoreWithUndo((state) => state.hue);
  const saturation = useStoreWithUndo((state) => state.saturation);
  const invert = useStoreWithUndo((state) => state.invert);
  const flipHorizontal = useStoreWithUndo((state) => state.flipHorizontal);
  const flipVertical = useStoreWithUndo((state) => state.flipVertical);
  const duration = useStore((state) => state.duration);
  const videoAlign = useStoreWithUndo((state) => state.videoAlign);
  const audioVolume = useStoreWithUndo((state) => state.audioVolume);
  const muteAudio = useStoreWithUndo((state) => state.muteAudio);
  const panShot = useStoreWithUndo((state) => state.panShot);
  const videoWidth = useStore((state) => state.videoWidth);
  const setVideoWidth = useStore((state) => state.setVideoWidth);
  const videoHeight = useStore((state) => state.videoHeight);
  const setVideoHeight = useStore((state) => state.setVideoHeight);
  const filename = useStore((state) => state.filename);

  useEventListener('keydown', handleKeydown);
  useEventListener('beforeunload', handleBeforeUnload);
  useEventListener('unload', handleUnload);
  useEventListener('userSeek', handleUserSeek, ref.current);
  useEventListener('play', handlePlay, ref.current);

  const handleMetadata = (e) => {
    setDuration(e.target.duration);
    setVideoWidth(e.target.videoWidth);
    setVideoHeight(e.target.videoHeight);
  };

  function handleKeydown(e) {
    if (e.keyCode === 32) {
      // space
      toggleIsPlaying();
    }
  }

  function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
  }

  function handleUnload() {
    const ua = JSON.stringify({ filename: filename });
    const headers = { type: 'application/json' };
    const blob = new Blob([ua], headers);
    navigator.sendBeacon('/api/deleteUploadsThumbs', blob);
  }

  function handleUserSeek(_) {
    setCurrentObjectPosition();
  }

  function handlePlay() {
    setCurrentObjectPosition();
  }

  const theme = useTheme();

  const uploadVideo = useUploadVideo();

  const Y_SPACING = 276; // div.App padding-top + padding-bottom
  const [maxHeight, setMaxHeight] = useState(window.innerHeight - Y_SPACING);
  const [maxWidth, setMaxWidth] = useState(0);

  const onWindowResizeHandler = useThrottledCallback(
    () => {
      setMaxHeight(window.innerHeight - Y_SPACING);
    },
    [setMaxHeight],
    50
  );

  const onVideoContainerResizeHandler = useCallback(
    (contentRect) => {
      setMaxWidth(contentRect.width);
    },
    [setMaxWidth]
  );

  const dimensionsRef = useDimensionChange(onVideoContainerResizeHandler);
  useWindowResize(onWindowResizeHandler);

  const handleCanvasFormatDialogAction = () => {
    setCanvasFormatChosen(true);
    closeDialog();
  };

  // upload the video to the server to get thumbnails
  useEffect(() => {
    if (!video) return;
    uploadVideo();
  }, [video]);

  useEffect(() => {
    if (video && !canvasFormatChosen) {
      openDialog(() => <CanvasFormatDialog />, {
        title: 'Choose Canvas Format',
        actionButton: {
          title: DIALOG_OK_BUTTON_TITLE,
          disableIfFalsy: 'canvasFormat',
          onClick: handleCanvasFormatDialogAction,
        },
        cancelButton: { title: DIALOG_CANCEL_BUTTON_TITLE, onClick: closeDialog },
      });
    }
  }, [canvasFormatChosen, video]);

  const videoUrl = useMemo(() => {
    if (video) {
      return URL.createObjectURL(video);
    }
  }, [video]);

  const syncStateToTime = () => setTime(ref.current?.currentTime);

  const showVideo = useMemo(() => {
    return video && videoUrl && canvasFormat && canvasFormatChosen;
  }, [canvasFormat, canvasFormatChosen, video, videoUrl]);

  useEffect(() => {
    if (showVideo === true && onReady) onReady();
  }, [showVideo, onReady]);

  const shouldAnimate = useMemo(() => isPlaying && panShot, [panShot, isPlaying]);
  const videoAspectRatio = useMemo(() => Number(videoWidth) / Number(videoHeight), [videoWidth, videoHeight]);

  const resetObjectPosition = () => {
    if (ref?.current) ref.current.style.objectPosition = objectPosition;
  };

  const setCurrentObjectPosition = () => {
    if (ref?.current && panShot) {
      const realVideoWidth = height * videoAspectRatio;
      const elapsedTimeFraction = (ref.current.currentTime || 0) / duration;
      const currentOffset = elapsedTimeFraction * -(realVideoWidth - width);
      ref.current.style.objectPosition = `left ${clamp(currentOffset, -(realVideoWidth - width), 0)}px top 50%`;
    }
  };

  useEffect(() => {
    // reset the `objectPosition` property of the video element when the user disables the pan shot feature
    if (!panShot) resetObjectPosition();
    // ... or set it initially to the correct value after the user enables the feature
    else setCurrentObjectPosition();
  }, [panShot]);

  const animationCallback = (deltaTime) => {
    const startOffset = 0;
    const currentValueString = ref.current.style.objectPosition;
    const currentOffset =
      Number(currentValueString.substring(currentValueString.indexOf(' '), currentValueString.indexOf('px'))) ||
      startOffset;
    const additionalPercentage = deltaTime / 1000 / duration;
    const realVideoWidth = height * videoAspectRatio;
    const additionalOffset = additionalPercentage * (realVideoWidth - width);
    ref.current.style.objectPosition = `left ${clamp(
      currentOffset - additionalOffset,
      -(realVideoWidth - width),
      startOffset
    )}px top 50%`;
  };

  useAnimationFrame(animationCallback, shouldAnimate);

  const [width, height] = useMemo(() => {
    if (!maxWidth || !maxHeight || !canvasFormat) return [0, 0];
    // try to use full width first
    if ((maxWidth * CANVAS_FORMATS[canvasFormat].y) / CANVAS_FORMATS[canvasFormat].x <= maxHeight) {
      return [maxWidth, (maxWidth * CANVAS_FORMATS[canvasFormat].y) / CANVAS_FORMATS[canvasFormat].x];
    } else {
      return [maxHeight * (CANVAS_FORMATS[canvasFormat].x / CANVAS_FORMATS[canvasFormat].y), maxHeight];
    }
  }, [maxWidth, maxHeight, canvasFormat]);

  const objectPosition = useMemo(() => {
    if (flipHorizontal) {
      if (videoAlign === VIDEO_ALIGN._LEFT) return VIDEO_ALIGN._RIGHT;
      if (videoAlign === VIDEO_ALIGN._RIGHT) return VIDEO_ALIGN._LEFT;
    }
    if (flipVertical) {
      if (videoAlign === VIDEO_ALIGN._TOP) return VIDEO_ALIGN._BOTTOM;
      if (videoAlign === VIDEO_ALIGN._BOTTOM) return VIDEO_ALIGN._TOP;
    }
    return videoAlign;
  }, [flipHorizontal, flipVertical, videoAlign]);

  useEffect(() => {
    if (ref?.current) ref.current.volume = audioVolume / 100.0;
  }, [audioVolume]);

  return (
    <Grid container align="center" justifyContent="center">
      <Grid ref={dimensionsRef} item align="center" xs={10} lg={8}>
        <Stack spacing={1} sx={{ height: '100%' }}>
          {showVideo ? (
            <>
              <Box
                className="videoWrapper"
                sx={{
                  position: 'relative',
                  alignSelf: 'center',
                  width: width,
                  height: height,
                  overflow: 'hidden',
                  border: theme.spacing(0.25),
                  borderColor: theme.palette.primary.dark,
                  borderStyle: 'dashed',
                  backgroundColor: videoBgColor,
                }}
              >
                <video
                  className="video"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: videoFit,
                    objectPosition: objectPosition,
                    transform: `rotateY(${flipHorizontal ? 180 : 0}deg) rotateX(${flipVertical ? 180 : 0}deg)`,
                    filter: `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${
                      saturation / 100
                    }) hue-rotate(${hue}deg) invert(${invert ? 100 : 0}%) blur(${blur}px)`,
                  }}
                  ref={ref}
                  src={videoUrl}
                  onLoadedMetadata={handleMetadata}
                  onTimeUpdate={syncStateToTime}
                  muted={muteAudio}
                />
              </Box>
            </>
          ) : (
            <DropzoneContainer setVideo={setVideo} />
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default forwardRef(Editor);
