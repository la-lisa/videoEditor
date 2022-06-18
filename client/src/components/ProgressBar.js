import { Box, Button, Container, Stack, useTheme } from '@mui/material';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PauseCircle, PlayCircle } from '@mui/icons-material';
import { useDimensionChange, useRenderVideo } from '../hooks/hooks';
import { Brush } from '@visx/brush';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import useStore from '../store/useStore';
import { clamp } from '../utils/utils';
import * as PropTypes from 'prop-types';
import { useDebouncedCallback } from 'beautiful-react-hooks';

const ProgressBar = ({ videoReady }, ref) => {
  const isPlaying = useStore((state) => state.isPlaying);
  const toggleIsPlaying = useStore((state) => state.toggleIsPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const duration = useStore((state) => state.duration);
  const time = useStore((state) => state.time);
  const startTime = useStore((state) => state.startTime);
  const endTime = useStore((state) => state.endTime);
  const setStartTime = useStore((state) => state.setStartTime);
  const setEndTime = useStore((state) => state.setEndTime);
  const renderVideo = useRenderVideo();
  const theme = useTheme();

  const [brushPosition, setBrushPosition] = useState(undefined);

  // register event listeners on mount
  useEffect(() => {
    ref?.current?.addEventListener('ended', () => setIsPlaying(false));
    ref?.current?.addEventListener('play', () => setIsPlaying(true));
    ref?.current?.addEventListener('pause', () => setIsPlaying(false));
  }, []);

  // sync React state to the video element's play state
  useEffect(() => {
    isPlaying ? ref?.current?.play() : ref?.current?.pause();
  }, [isPlaying, ref]);

  const handleSeek = (e) => {
    const mappedTimeValue = brushScaleX.invert(e.pageX - svgRef.current.getBoundingClientRect().left);
    if (ref.current) {
      ref.current.currentTime = mappedTimeValue;
      setStartTime(null);
      setEndTime(null);
      setBrushPosition(undefined);
    }
  };

  const handleChange = useDebouncedCallback((bounds) => {
    if (!bounds) return;
    if (ref.current) {
      const domainMin = brushScaleX.domain()[0];
      const domainMax = brushScaleX.domain()[1];
      ref.current.currentTime = clamp(bounds.x0, domainMin, domainMax);
      setStartTime(Math.max(bounds.x0, 0));
      setEndTime(Math.min(bounds.x1, domainMax));
    }
  });

  const svgRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const xBrushMax = useMemo(() => maxWidth || 100, [maxWidth]);

  const onProgressBarResizeHandler = useCallback(
    (contentRect) => {
      setMaxWidth(contentRect.width);
    },
    [setMaxWidth]
  );
  const dimensionsRef = useDimensionChange(onProgressBarResizeHandler);

  // SCALES
  // Functions that help us map our data values to their corresponding physical pixel representation
  const brushScaleX = useMemo(
    () =>
      scaleLinear({
        domain: [0, duration], // data values (time)
        range: [0, xBrushMax], // corresponding pixel values
        // nice: true, // use rounded values for start and end points
      }),
    [duration, xBrushMax]
  );
  const brushScaleY = scaleLinear();

  // update the brush selection on resize if there currently is a selection
  useEffect(() => {
    if (!startTime && !endTime) return;
    setBrushPosition({
      start: { x: brushScaleX(startTime) },
      end: { x: brushScaleX(endTime) },
    });
  }, [brushScaleX]);

  const playheadPosition = brushScaleX(time);

  const PlayPauseIcon = isPlaying ? PauseCircle : PlayCircle;

  return (
    <Container
      maxWidth="xl"
      sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', flex: 1, justifyContent: 'center' }}
    >
      <Box height="180px" display="flex" flex={1} alignSelf="flex-end" alignItems="center">
        <Stack spacing={2} flex={1} direction="row" alignItems="center" height="100px">
          <Box onClick={toggleIsPlaying} sx={{ display: 'flex', my: 1 }}>
            <PlayPauseIcon titleAccess="Play/Pause (Space)" fontSize="large" sx={{ cursor: 'pointer' }} />
          </Box>
          <Box
            ref={dimensionsRef}
            sx={{
              width: '100%',
              height: '50px',
              border: `${theme.spacing(0.25)} solid`,
              borderColor: theme.palette.primary.dark,
              borderRadius: theme.spacing(1.5),
            }}
          >
            <svg ref={svgRef} height="100%" width="100%" style={{ borderRadius: theme.spacing(1.5) }}>
              <Thumbnails maxWidth={maxWidth} />
              <Group>
                <Brush
                  xScale={brushScaleX}
                  yScale={brushScaleY}
                  width={xBrushMax}
                  height={50}
                  key={brushPosition ? `${brushPosition.start.x},${brushPosition.end.x}` : ''}
                  initialBrushPosition={brushPosition}
                  handleSize={8}
                  resizeTriggerAreas={['left', 'right']}
                  onClick={handleSeek}
                  onChange={handleChange}
                  useWindowMoveEvents
                  selectedBoxStyle={{ fill: theme.palette.primary.dark, fillOpacity: '50%' }}
                />
              </Group>
              <Playhead xPos={playheadPosition} />
            </svg>
          </Box>
          <Button variant="contained" onClick={renderVideo} disabled={!videoReady}>
            Render
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default forwardRef(ProgressBar);

function Thumbnails({ maxWidth }) {
  const thumbUrls = useStore((state) => state.thumbUrls);
  const thumbWidth = useStore((state) => state.thumbWidth);
  const borderWidth = 2;
  const margin = useMemo(() => {
    if (!maxWidth || !thumbWidth || !thumbUrls) return null;
    return (maxWidth - thumbWidth * thumbUrls.length) / (thumbUrls.length - 1);
  }, [maxWidth, thumbWidth, thumbUrls]);

  if (!thumbUrls) return null;
  return thumbUrls.map((url, idx) => (
    <image href={url} key={idx} x={(thumbWidth + margin) * idx} y={`-${borderWidth}px`} />
  ));
}

Thumbnails.propTypes = {
  maxWidth: PropTypes.number.isRequired,
};

function Playhead({ xPos }) {
  const theme = useTheme();

  return <rect x={xPos} width={4} height={50} fill={theme.palette.action.active} />;
}

Playhead.propTypes = {
  xPos: PropTypes.number.isRequired,
};
