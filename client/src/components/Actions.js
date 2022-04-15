import { Box, ListItemIcon, ListItemText, MenuItem, Paper, Stack, Typography, TextField, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
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
  ZoomIn
} from "@mui/icons-material";
import styles from "./Actions.module.css";
import ActionItem from "./ActionItem";
import { CANVAS_FORMATS } from "../utils/utils";
import useStore from "../store/useStore";
import { VIDEO_FIT } from "../utils/utils";
import { ChromePicker } from "react-color";

export default function Actions() {
  const canvasFormat = useStore(state => state.canvasFormat);
  const setCanvasFormat = useStore(state => state.setCanvasFormat);
  const videoUploaded = useStore(state => state.videoUploaded);
  const setVideoFit = useStore(state => state.setVideoFit);
  const videoBgColor = useStore(state=>state.videoBgColor);
  const setVideoBgColor = useStore(state=>state.setVideoBgColor);
  const trimTime = useStore(state=>state.trimTime);
  const setTrimTime = useStore(state=>state.setTrimTime);
  const [isOpen, setIsOpen] = useState(false);

  const toggleActions = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const theme = useTheme();

  const handleColor = (color) => {
    //setVideoBgColor({videoBgColor: color.hex});
  }

  return (
    <>
      { videoUploaded && (
        <Paper elevation={1}>
          <Stack direction="row" sx={{ justifyContent: 'flex-end', height: '100%', width: '100%' }}>
            <Stack spacing={2} className={`${styles.actionsPanel} ${isOpen ? `${styles.open}` : `${styles.collapsed}`}`} sx={isOpen ? { padding: 2 } : {}}>
              <ActionItem Icon={() => <AspectRatio />} title="Aspect Ratio">
                {Object.values(CANVAS_FORMATS).map((format) => {
                  return (
                    <MenuItem key={format} onClick={() => setCanvasFormat(format)} selected={canvasFormat === format}>
                      <Stack direction="row" spacing={1}>
                        <ListItemIcon>
                          <QuestionMark fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{format}</ListItemText>
                      </Stack>
                    </MenuItem>
                  )
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
                  )
                })}
              </ActionItem>
              <ActionItem Icon={() => <AvTimer />} title="Trim">
                <TextField id="start" label="Starting Time" variant="outlined" value={trimTime[0]} />
                <TextField id="end" label="End Time" variant="outlined" value={trimTime[1]}/>
                {/*For time picking later*/}
                {/*<Slider*/}
                {/*    getAriaLabel={() => 'Trim video'}*/}
                {/*    value={[20, 37]}*/}
                {/*    //onChange={handleChange}*/}
                {/*    valueLabelDisplay="auto"*/}
                {/*   // getAriaValueText={valuetext}*/}
                {/*/>*/}
              </ActionItem>
              <ActionItem Icon={() => <AlignHorizontalCenter />} title="Alignment" />
              <ActionItem Icon={() => <ZoomIn />} title="Zoom" />
              <ActionItem Icon={() => <Contrast />} title="Adjustments" />
              <ActionItem Icon={() => <ColorLens />} title="Background">
                <ChromePicker disableAlpha={true} color={ videoBgColor } onChange={handleColor} />
              </ActionItem>
              <ActionItem Icon={() => <VolumeUp />} title="Volume" />
              <ActionItem Icon={() => <VolumeOff />} title="Mute" />
            </Stack>
            <Box sx={{ writingMode: 'tb', cursor: 'pointer' }} onClick={toggleActions}>
              <Stack direction="row" sx={{ padding: 1 }}>
                <ExpandMore sx={{ transition: `all ${theme.transitions.duration.short}ms`, transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}/>
                <Typography sx={{ marginTop: 1, userSelect: 'none' }}>
                  Actions
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      )}
    </>
  );
}