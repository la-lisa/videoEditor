import { Box, Button, Container, Slider, Stack } from '@mui/material';
import { forwardRef, useEffect, useMemo } from 'react';
import { PauseCircle, PlayCircle } from '@mui/icons-material';
import useStore from '../store/useStore';
import { useWriteFile } from '../hooks/hooks';

const Timeline = ({ videoReady }, ref) => {
  const isPlaying = useStore((state) => state.isPlaying);
  const toggleIsPlaying = useStore((state) => state.toggleIsPlaying);
  const duration = useStore((state) => state.duration);
  const time = useStore((state) => state.time);
  const writeFile = useWriteFile();

  useEffect(() => {
    isPlaying ? ref?.current?.play() : ref?.current?.pause();
  }, [isPlaying, ref]);

  const handleScrub = (_, newValue) => {
    if (ref.current) {
      ref.current.currentTime = newValue;
    }
  };

  const PlayPauseIcon = useMemo(() => {
    return isPlaying ? PauseCircle : PlayCircle;
  }, [isPlaying]);

  return (
    <Container
      maxWidth="xl"
      sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', flex: 1, justifyContent: 'center' }}
    >
      <Box height="180px" flex={1} alignSelf="flex-end">
        <Stack alignSelf="flex-start" spacing={2} flex={1} direction="row" alignItems="center" height="100px">
          <Box onClick={toggleIsPlaying} sx={{ display: 'flex', my: 1 }}>
            <PlayPauseIcon titleAccess="Play/Pause (Space)" fontSize="large" sx={{ cursor: 'pointer' }} />
          </Box>
          <Slider
            defaultValue={0}
            value={time}
            max={duration}
            step={0.05}
            onChange={handleScrub}
            valueLabelDisplay="auto"
          />
          <Button variant="contained" onClick={writeFile} disabled={!videoReady}>
            Render
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default forwardRef(Timeline);
