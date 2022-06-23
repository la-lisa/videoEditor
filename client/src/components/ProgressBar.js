import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PauseCircle, PlayCircle } from '@mui/icons-material';
import { useDimensionChange, useEventListener, useRenderVideo } from '../hooks/hooks';
import { Brush } from '@visx/brush';
import { scaleLinear } from '@visx/scale';
import useStore from '../store/useStore';
import { clamp, userSeekEvent } from '../utils/utils';
import * as PropTypes from 'prop-types';

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
  const [brushPosition, setBrushPosition] = useState(undefined);

  const theme = useTheme();

  const handleEnded = useCallback(() => setIsPlaying(false), [setIsPlaying]);
  const handlePlay = useCallback(() => setIsPlaying(true), [setIsPlaying]);
  const handlePause = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  useEventListener('ended', handleEnded, ref.current);
  useEventListener('play', handlePlay, ref.current);
  useEventListener('pause', handlePause, ref.current);

  // sync React state to the video element's play state
  useEffect(() => {
    isPlaying ? ref?.current?.play() : ref?.current?.pause();
  }, [isPlaying, ref]);

  const svgRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(100);

  // SCALES
  // Functions that help us map our data values to their corresponding physical pixel representation
  const brushScaleX = useMemo(
    () =>
      scaleLinear({
        domain: [0, duration], // data values (time)
        range: [0, maxWidth], // corresponding pixel values
        // nice: true, // use rounded values for start and end points
      }),
    [duration, maxWidth]
  );
  const brushScaleY = scaleLinear();

  const onProgressBarResizeHandler = useCallback(
    (contentRect) => {
      setMaxWidth(contentRect.width);
    },
    [setMaxWidth]
  );
  const dimensionsRef = useDimensionChange(onProgressBarResizeHandler);

  // update the brush selection on resize if there currently is a selection
  useEffect(() => {
    if (!startTime && !endTime) return;
    setBrushPosition({
      start: { x: brushScaleX(startTime) },
      end: { x: brushScaleX(endTime) },
    });
  }, [brushScaleX]);

  const handleSeek = (e) => {
    const mappedTimeValue = brushScaleX.invert(e.pageX - svgRef.current.getBoundingClientRect().left);
    if (ref.current) {
      ref.current.currentTime = mappedTimeValue;
      setStartTime(null);
      setEndTime(null);
      setBrushPosition(undefined);
    }
    ref.current.dispatchEvent(userSeekEvent);
  };

  const handleChange = (bounds) => {
    if (bounds && ref.current) {
      const domainMin = brushScaleX.domain()[0];
      const domainMax = brushScaleX.domain()[1];
      ref.current.currentTime = clamp(bounds.x0, domainMin, domainMax);
      setStartTime(Math.max(bounds.x0, 0));
      setEndTime(Math.min(bounds.x1, domainMax));
    }
    ref.current.dispatchEvent(userSeekEvent);
  };

  const playheadPosition = brushScaleX(time);

  const PlayPauseIcon = isPlaying ? PauseCircle : PlayCircle;

  const formatTimestamp = (time) => new Date(time * 1000).toISOString().slice(14, -5);

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
          <Box>
            <Typography variant="caption" whiteSpace="nowrap" style={{ userSelect: 'none' }}>
              {formatTimestamp(time)} / {formatTimestamp(duration)}
            </Typography>
          </Box>
          <Box
            ref={dimensionsRef}
            sx={{
              width: '100%',
              height: '100px',
            }}
          >
            <svg ref={svgRef} height="100%" width="100%">
              <g>
                <svg height={50} y={25}>
                  <defs>
                    <mask id="borderMask">
                      <rect fill="#fff" rx={theme.spacing(1.5)} ry={theme.spacing(1.5)} width="100%" height="100%" />
                    </mask>
                  </defs>
                  <g mask="url(#borderMask)">
                    <Thumbnails maxWidth={maxWidth} />
                    <Brush
                      xScale={brushScaleX}
                      yScale={brushScaleY}
                      width={maxWidth}
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
                  </g>
                  <rect
                    id="border"
                    fill="none"
                    stroke={theme.palette.primary.dark}
                    strokeWidth={2}
                    x={1}
                    y={1}
                    rx={theme.spacing(1.5)}
                    ry={theme.spacing(1.5)}
                    width={maxWidth - 2}
                    height={50 - 2}
                  />
                </svg>
                <Playhead xPos={playheadPosition} />
                <SelectionTimestamps
                  startTimeLocation={startTime ? brushScaleX(startTime) : null}
                  endTimeLocation={endTime ? brushScaleX(endTime) : null}
                />
              </g>
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

  return <rect x={xPos} width={4} height={60} y={20} fill={theme.palette.text.primary} />;
}

Playhead.propTypes = {
  xPos: PropTypes.number.isRequired,
};

function SelectionTimestamps({ startTimeLocation, endTimeLocation }) {
  const startTime = useStore((state) => state.startTime);
  const endTime = useStore((state) => state.endTime);

  const textProps = {
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    fill: '#fff',
    style: { userSelect: 'none' },
  };

  return (
    <g>
      <text x={startTimeLocation} y={10} {...textProps}>
        {startTime?.toFixed(2)}
      </text>
      <text x={endTimeLocation} y={10} {...textProps}>
        {endTime?.toFixed(2)}
      </text>
    </g>
  );
}

SelectionTimestamps.propTypes = {
  startTimeLocation: PropTypes.number,
  endTimeLocation: PropTypes.number,
};
