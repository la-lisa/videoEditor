import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, useTheme } from '@mui/material';
import DropzoneContainer from './DropzoneContainer';
import CanvasFormatDialog from './ui/dialogs/CanvasFormatDialog';
import { useDimensionChange, useEventListener, useUploadVideo } from '../hooks/hooks';
import useStore from '../store/useStore';
import { CANVAS_FORMATS, DIALOG_CANCEL_BUTTON_TITLE, DIALOG_OK_BUTTON_TITLE, VIDEO_ALIGN } from '../utils/utils';
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
  const zoom = useStoreWithUndo((state) => state.zoom);
  const videoAlign = useStoreWithUndo((state) => state.videoAlign);
  const audioVolume = useStoreWithUndo((state) => state.audioVolume);
  const muteAudio = useStoreWithUndo((state) => state.muteAudio);

  useEventListener('keydown', handleKeydown);
  useEventListener('beforeunload', handleBeforeUnload);

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

  const syncStateToTime = useCallback(() => {
    setTime(ref.current?.currentTime);
  }, [ref, setTime]);

  const handleMetadata = (e) => {
    setDuration(e.target.duration);
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

  const showVideo = useMemo(() => {
    return video && videoUrl && canvasFormat && canvasFormatChosen;
  }, [canvasFormat, canvasFormatChosen, video, videoUrl]);

  useEffect(() => {
    if (showVideo === true && onReady) onReady();
  }, [showVideo, onReady]);

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
                    transform: `rotateY(${flipHorizontal ? 180 : 0}deg) rotateX(${flipVertical ? 180 : 0}deg) scale(${
                      zoom / 100 + 1
                    })`,
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
