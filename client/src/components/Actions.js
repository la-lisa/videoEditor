import {
  Box,
  FormControlLabel,
  FormGroup,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useCallback, useState } from 'react';
import {
  AlignHorizontalCenter,
  AspectRatio,
  AvTimer,
  ColorLens,
  Contrast,
  ExpandMore,
  FitScreen,
  QuestionMark,
  VolumeOff,
  VolumeUp,
  ZoomIn,
} from '@mui/icons-material';
import styles from './Actions.module.css';
import ActionItem from './ActionItem';
import { CANVAS_FORMATS, VIDEO_FIT, VIDEO_ALIGN } from '../utils/utils';
import useStoreWithUndo from '../store/useStoreWithUndo';
import { ChromePicker } from 'react-color';
import AdjustmentSliders from './AdjustmentSliders';

export default function Actions() {
  const canvasFormat = useStoreWithUndo((state) => state.canvasFormat);
  const setCanvasFormat = useStoreWithUndo((state) => state.setCanvasFormat);
  const setVideoFit = useStoreWithUndo((state) => state.setVideoFit);
  const videoBgColor = useStoreWithUndo((state) => state.videoBgColor);
  const setVideoBgColor = useStoreWithUndo((state) => state.setVideoBgColor);
  const endTime = useStoreWithUndo((state) => state.endTime);
  const startTime = useStoreWithUndo((state) => state.startTime);
  const setStartTime = useStoreWithUndo((state) => state.setStartTime);
  const setEndTime = useStoreWithUndo((state) => state.setEndTime);
  const muteAudio = useStoreWithUndo((state) => state.muteAudio);
  const setMuteAudio = useStoreWithUndo((state) => state.setMuteAudio);
  const audioVolume = useStoreWithUndo((state) => state.audioVolume);
  const setAudioVolume = useStoreWithUndo((state) => state.setAudioVolume);
  const zoom = useStoreWithUndo((state) => state.zoom);
  const setZoom = useStoreWithUndo((state) => state.setZoom);
  const videoAlign = useStoreWithUndo((state) => state.videoAlign);
  const setVideoAlign = useStoreWithUndo((state) => state.setVideoAlign);
  const [isOpen, setIsOpen] = useState(false);

  const toggleActions = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const theme = useTheme();

  const handleMute = () => {
    setMuteAudio(!muteAudio);
  };

  return (
    <Paper elevation={1}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', height: '100%', width: '100%' }}>
        <Stack
          spacing={2}
          className={`${styles.actionsPanel} ${isOpen ? `${styles.open}` : `${styles.collapsed}`}`}
          sx={isOpen ? { padding: 2 } : {}}
        >
          <ActionItem Icon={() => <AspectRatio />} title="Aspect Ratio">
            {Object.keys(CANVAS_FORMATS).map((key) => {
              return (
                <MenuItem key={`menuItem-${key}`} onClick={() => setCanvasFormat(key)} selected={canvasFormat === key}>
                  <Stack direction="row" spacing={1}>
                    <ListItemIcon>
                      <QuestionMark fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{CANVAS_FORMATS[key].title}</ListItemText>
                  </Stack>
                </MenuItem>
              );
            })}
          </ActionItem>
          <ActionItem Icon={() => <FitScreen />} title="Video Fit">
            {Object.values(VIDEO_FIT).map((videoFit) => {
              return (
                <MenuItem key={videoFit} onClick={() => setVideoFit(videoFit)}>
                  <Stack direction="row" spacing={1}>
                    <ListItemIcon>
                      <QuestionMark fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{videoFit}</ListItemText>
                  </Stack>
                </MenuItem>
              );
            })}
          </ActionItem>
          <ActionItem Icon={() => <AvTimer />} title="Trim">
            <TextField
              id="start"
              label="Starting Time"
              variant="outlined"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField
              id="end"
              label="End Time"
              variant="outlined"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </ActionItem>
          <ActionItem Icon={() => <AlignHorizontalCenter />} title="Alignment">
            {Object.values(VIDEO_ALIGN).map((align) => {
              return (
                <MenuItem key={align} onClick={() => setVideoAlign(align)} selected={videoAlign === align}>
                  <Stack direction="row" spacing={1}>
                    <ListItemIcon>
                      <QuestionMark fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{align}</ListItemText>
                  </Stack>
                </MenuItem>
              );
            })}
          </ActionItem>
          <ActionItem Icon={() => <ZoomIn />} title="Zoom">
            <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
              <Typography gutterBottom>Zoom</Typography>
              <Slider
                aria-label="Zoom %"
                onChange={(e) => setZoom(e.target.value)}
                defaultValue={0}
                valueLabelDisplay="auto"
                value={zoom}
                min={-100}
                max={100}
              />
            </Box>
          </ActionItem>
          <ActionItem Icon={() => <Contrast />} title="Adjustments">
            <AdjustmentSliders />
          </ActionItem>
          <ActionItem Icon={() => <ColorLens />} title="Background">
            <ChromePicker disableAlpha={true} color={videoBgColor} onChange={(color) => setVideoBgColor(color.hex)} />
          </ActionItem>
          <ActionItem Icon={() => <VolumeUp />} title="Volume">
            <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
              <Typography gutterBottom>Volume</Typography>
              <Slider
                aria-label="Volume %"
                onChange={(e) => setAudioVolume(e.target.value)}
                defaultValue={100}
                valueLabelDisplay="auto"
                value={audioVolume}
                step={1}
                min={10}
                max={150}
              />
            </Box>
          </ActionItem>
          <ActionItem Icon={() => <VolumeOff />} title="Mute">
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={handleMute} checked={muteAudio} color="primary" />}
                label="Audio Off"
                labelPlacement="top"
              />
            </FormGroup>
          </ActionItem>
        </Stack>
        <Box sx={{ writingMode: 'tb', cursor: 'pointer' }} onClick={toggleActions}>
          <Stack direction="row" sx={{ padding: 1 }}>
            <ExpandMore
              sx={{
                transition: `all ${theme.transitions.duration.short}ms`,
                transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)',
              }}
            />
            <Typography sx={{ marginTop: 1, userSelect: 'none' }}>Actions</Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
