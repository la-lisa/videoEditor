import { Box, Button, Slider, Stack } from "@mui/material";
import { forwardRef, useEffect, useMemo } from "react";
import { PauseCircle, PlayCircle } from "@mui/icons-material";
import useStore from "../store/useStore";
import { useWriteFile } from "../hooks/hooks";

const Timeline = (props, ref) => {
  const isPlaying = useStore(state => state.isPlaying);
  const toggleIsPlaying = useStore(state => state.toggleIsPlaying);
  const duration = useStore(state => state.duration);
  const time = useStore(state => state.time);
  const writeFile = useWriteFile();

  useEffect(() => {
    isPlaying ? ref?.current?.play() : ref?.current?.pause();
  }, [isPlaying, ref]);

  const handleScrub = (_, newValue) => {
    if (ref.current) {
      ref.current.currentTime = newValue;
    }
  }

  const PlayPauseIcon = useMemo(() => {
    return isPlaying ? PauseCircle : PlayCircle;
  }, [isPlaying]);

  return (
    <>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <Box onClick={toggleIsPlaying} sx={{ display: "flex", my: 1 }}>
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
        <Button variant="contained" onClick={writeFile}>Render</Button>
      </Stack>
   </>
  )
};

export default forwardRef(Timeline);