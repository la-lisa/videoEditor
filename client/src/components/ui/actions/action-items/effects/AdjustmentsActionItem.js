import React from 'react';
import ActionItem from '../../ActionItem';
import { Contrast } from '@mui/icons-material';
import useStoreWithUndo from '../../../../../store/useStoreWithUndo';
import { Box, Slider, Switch, Typography } from '@mui/material';

export default function AdjustmentsActionItem() {
  return (
    <ActionItem Icon={() => <Contrast />} title="Adjustments">
      <AdjustmentSliders />
    </ActionItem>
  );
}

function AdjustmentSliders() {
  const brightness = useStoreWithUndo((state) => state.brightness);
  const setBrightness = useStoreWithUndo((state) => state.setBrightness);
  const contrast = useStoreWithUndo((state) => state.contrast);
  const setContrast = useStoreWithUndo((state) => state.setContrast);
  const blur = useStoreWithUndo((state) => state.blur);
  const setBlur = useStoreWithUndo((state) => state.setBlur);
  const hue = useStoreWithUndo((state) => state.hue);
  const setHue = useStoreWithUndo((state) => state.setHue);
  const saturation = useStoreWithUndo((state) => state.saturation);
  const setSaturation = useStoreWithUndo((state) => state.setSaturation);
  const invert = useStoreWithUndo((state) => state.invert);
  const setInvert = useStoreWithUndo((state) => state.setInvert);
  const flipHorizontal = useStoreWithUndo((state) => state.flipHorizontal);
  const setFlipHorizontal = useStoreWithUndo((state) => state.setFlipHorizontal);
  const flipVertical = useStoreWithUndo((state) => state.flipVertical);
  const setFlipVertical = useStoreWithUndo((state) => state.setFlipVertical);

  return (
    <>
      <Box sx={{ width: 200, height: 'auto', padding: 3 }}>
        <Typography gutterBottom>Brightness</Typography>
        <Slider
          aria-label="Brightness %"
          onChange={(e) => setBrightness(e.target.value)}
          defaultValue={100}
          valueLabelDisplay="auto"
          value={brightness}
          step={1}
          min={0}
          max={200}
        />
        <Typography gutterBottom>Contrast</Typography>
        <Slider
          aria-label="Contrast %"
          onChange={(e) => setContrast(e.target.value)}
          defaultValue={100}
          valueLabelDisplay="auto"
          value={contrast}
          step={1}
          min={0}
          max={200}
        />
        <Typography gutterBottom>Saturation</Typography>
        <Slider
          aria-label="Saturate %"
          onChange={(e) => setSaturation(e.target.value)}
          defaultValue={100}
          valueLabelDisplay="auto"
          value={saturation}
          step={1}
          min={0}
          max={300}
        />
        <Typography gutterBottom>Hue</Typography>
        <Slider
          aria-label="Hue %"
          onChange={(e) => setHue(e.target.value)}
          defaultValue={0}
          valueLabelDisplay="auto"
          value={hue}
          step={1}
          min={0}
          max={360}
        />
        <Typography gutterBottom>Blur</Typography>
        <Slider
          aria-label="Blur %"
          onChange={(e) => setBlur(e.target.value)}
          defaultValue={0}
          valueLabelDisplay="auto"
          value={blur}
          step={0.1}
          min={0}
          max={2}
        />
        <Typography gutterBottom>Invert</Typography>
        <Switch onChange={() => setInvert(!invert)} checked={invert} color="primary" />
        <Typography gutterBottom>Flip Horizontal</Typography>
        <Switch onChange={() => setFlipHorizontal(!flipHorizontal)} checked={flipHorizontal} color="primary" />
        <Typography gutterBottom>Flip Vertical</Typography>
        <Switch onChange={() => setFlipVertical(!flipVertical)} checked={flipVertical} color="primary" />
      </Box>
    </>
  );
}
