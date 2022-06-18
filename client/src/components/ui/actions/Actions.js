import { Box, Paper, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import TabPanel from './TabPanel';
import AspectRatioActionItem from './action-items/general/AspectRatioActionItem';
import VideoFitActionItem from './action-items/general/VideoFitActionItem';
import AlignmentActionItem from './action-items/general/AlignmentActionItem';
import AdjustmentsActionItem from './action-items/effects/AdjustmentsActionItem';
import BackgroundActionItem from './action-items/effects/BackgroundActionItem';
import VolumeActionItem from './action-items/audio/VolumeActionItem';
import MuteActionItem from './action-items/audio/MuteActionItem';
import ResetAllActionItem from './action-items/ResetAllActionItem';
import FlipActionItem from './action-items/effects/FlipActionItem';
import PanShotActionItem from './action-items/effects/PanShotActionItem';

function tabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    sx: { alignItems: 'baseline' },
  };
}

export default function Actions() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTabIdx, setCurrentTabIdx] = useState(0);

  const handleTabChange = (_, newValue) => {
    setCurrentTabIdx(newValue);
  };

  const toggleActions = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const theme = useTheme();

  return (
    <Paper elevation={1}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', height: '100%', width: '100%' }}>
        <Box
          display="flex"
          sx={{
            overflow: 'hidden',
          }}
        >
          {isOpen && (
            <Stack direction="row">
              <TabPanel index={0} value={currentTabIdx}>
                <ResetAllActionItem />
                <AspectRatioActionItem />
                <VideoFitActionItem />
                <AlignmentActionItem />
              </TabPanel>
              <TabPanel index={1} value={currentTabIdx}>
                <ResetAllActionItem />
                <AdjustmentsActionItem />
                <FlipActionItem />
                <BackgroundActionItem />
                <PanShotActionItem />
              </TabPanel>
              <TabPanel index={2} value={currentTabIdx}>
                <ResetAllActionItem />
                <VolumeActionItem />
                <MuteActionItem />
              </TabPanel>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={currentTabIdx}
                onChange={handleTabChange}
                aria-label="Editor Actions"
                sx={{
                  borderLeft: 1,
                  borderColor: 'divider',
                }}
                TabIndicatorProps={{ style: { left: 0 } }}
              >
                <Tab label="general" {...tabProps(0)} />
                <Tab label="effects" {...tabProps(1)} />
                <Tab label="audio" {...tabProps(2)} />
              </Tabs>
            </Stack>
          )}
        </Box>
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
