import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, useTheme } from '@mui/material';
import DropzoneContainer from './DropzoneContainer';
import CanvasFormatDialog from './ui/dialogs/CanvasFormatDialog';
import { useDimensionChange, useEventListener } from '../hooks/hooks';
import useStore from '../store/useStore';
import { CANVAS_FORMATS, DIALOG_CANCEL_BUTTON_TITLE, DIALOG_OK_BUTTON_TITLE } from '../utils/utils';
import { useThrottledCallback, useWindowResize } from 'beautiful-react-hooks';

const Editor = ({ onReady }, ref) => {
  const video = useStore((state) => state.video);
  const setVideo = useStore((state) => state.setVideo);
  const canvasFormat = useStore((state) => state.canvasFormat);
  const canvasFormatChosen = useStore((state) => state.canvasFormatChosen);
  const setCanvasFormatChosen = useStore((state) => state.setCanvasFormatChosen);
  const videoFit = useStore((state) => state.videoFit);
  const videoBgColor = useStore((state) => state.videoBgColor);
  const openDialog = useStore((state) => state.openDialog);
  const closeDialog = useStore((state) => state.closeDialog);
  const setDuration = useStore((state) => state.setDuration);
  const toggleIsPlaying = useStore((state) => state.toggleIsPlaying);
  const setTime = useStore((state) => state.setTime);
  const brightness = useStore((state) => state.brightness);
  const contrast = useStore((state) => state.contrast);
  const blur = useStore((state) => state.blur);
  const hue = useStore((state) => state.hue);
  const saturation = useStore((state) => state.saturation);
  const invert = useStore((state) => state.invert);
  const flipHorizontal = useStore((state) => state.flipHorizontal);
  const flipVertical = useStore((state) => state.flipVertical);
  const zoom = useStore((state) => state.zoom);
  const videoAlign = useStore((state) => state.videoAlign);

  useEventListener('keydown', handleKeydown);
  useEventListener('beforeunload', handleBeforeUnload);

  const theme = useTheme();

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

  const onVideoContainerResizeHandler = useThrottledCallback(
    (contentRect) => {
      setMaxWidth(contentRect.width);
    },
    [setMaxWidth],
    50
  );

  const dimensionsRef = useDimensionChange(onVideoContainerResizeHandler);
  useWindowResize(onWindowResizeHandler);

  const handleCanvasFormatDialogAction = () => {
    setCanvasFormatChosen(true);
    closeDialog();
  };

  useEffect(() => {
    video &&
      !canvasFormat &&
      openDialog(() => <CanvasFormatDialog />, {
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

  return (
    <Grid container align="center" justifyContent="center">
      <Grid ref={dimensionsRef} item align="center" xs={12} lg={8}>
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
                    objectPosition:videoAlign,
                    transform: `rotateY(${flipHorizontal ? 180 : 0}deg) rotateX(${flipVertical ? 180 : 0}deg) scale(${zoom/100 + 1})`,
                    filter: `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100}) hue-rotate(${hue}deg) invert(${
                      invert ? 100 : 0
                    }%) blur(${blur}px)`,
                  }}
                  ref={ref}
                  src={videoUrl}
                  onLoadedMetadata={handleMetadata}
                  onTimeUpdate={syncTimeToState}
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
