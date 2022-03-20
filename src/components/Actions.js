import { Box, ListItemIcon, ListItemText, MenuItem, Paper, Stack, Typography, Slider, TextField, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { ExpandMore, AspectRatio, QuestionMark, FitScreen, AvTimer, ColorLens } from "@mui/icons-material";
import styles from "./Actions.module.css";
import ActionItem from "./ActionItem";
import { CANVAS_FORMATS } from "../utils/utils";
import { VIDEO_FIT } from "../utils/utils";
import {ChromePicker} from "react-color";

export default function Actions() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleActions = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const theme = useTheme();

  return (
    <Paper elevation={1}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', height: '100%', width: '100%' }}>
        <Stack spacing={2} className={`${styles.actionsPanel} ${isOpen ? `${styles.open}` : `${styles.collapsed}`}`} sx={isOpen ? { padding: 3 } : {}}>
          <ActionItem Icon={() => <AspectRatio />} title="Canvas Size">
            {Object.values(CANVAS_FORMATS).map((format) => {
              return (
                  <MenuItem key={format} onClick={() => {}}>
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
            {Object.values(VIDEO_FIT).map((format) => {
              return (
                  <MenuItem key={format} onClick={() => {}}>
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

          <ActionItem Icon={() => <AvTimer />} title="Trim Video">
            <TextField id="start" label="Starting Time" variant="outlined" />
            <TextField id="end" label="End Time" variant="outlined" />
            {/*For time picking later*/}
            {/*<Slider*/}
            {/*    getAriaLabel={() => 'Trim video'}*/}
            {/*    value={[20, 37]}*/}
            {/*    //onChange={handleChange}*/}
            {/*    valueLabelDisplay="auto"*/}
            {/*   // getAriaValueText={valuetext}*/}
            {/*/>*/}
          </ActionItem>

          <ActionItem Icon={() => <ColorLens />} title="Video Background Color">
            <ChromePicker disableAlpha={true} />
          </ActionItem>

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
  );
}