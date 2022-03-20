import { Box, ListItemIcon, ListItemText, MenuItem, Paper, Stack, Typography, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { ExpandMore, AspectRatio, QuestionMark } from "@mui/icons-material";
import styles from "./Actions.module.css";
import ActionItem from "./ActionItem";
import { CANVAS_FORMATS } from "../utils/utils";
import useStore from "../store/useStore";

export default function Actions() {
  const canvasFormat = useStore(state => state.canvasFormat);
  const setCanvasFormat = useStore(state => state.setCanvasFormat);
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