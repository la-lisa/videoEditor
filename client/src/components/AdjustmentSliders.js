import {Box, Slider, Switch, Typography} from "@mui/material";
import useStore from "../store/useStore";

export default function AdjustmentSliders() {
  const brightness = useStore((state) => state.brightness);
  const setBrightness = useStore((state) => state.setBrightness);
  const contrast = useStore((state) => state.contrast);
  const setContrast = useStore((state) => state.setContrast);
  const blur = useStore((state) => state.blur);
  const setBlur = useStore((state) => state.setBlur);
  const hue = useStore((state) => state.hue);
  const setHue = useStore((state) => state.setHue);
  const saturation = useStore((state) => state.saturation);
  const setSaturation = useStore((state) => state.setSaturation);
  const invert = useStore((state) => state.invert);
  const setInvert = useStore((state) => state.setInvert);
  const flipHorizontal = useStore((state) => state.flipHorizontal);
  const setFlipHorizontal = useStore((state) => state.setFlipHorizontal)
  const flipVertical = useStore((state) => state.flipVertical);
  const setFlipVertical = useStore((state) => state.setFlipVertical)
  return (
  <>
    <Box sx={{width: 200, height: "auto", padding: 3}}>
      <Typography gutterBottom>Brightness</Typography>
      <Slider
        aria-label="Brightness %"
        onChange={(e)=>setBrightness(e.target.value)}
        defaultValue={100}
        valueLabelDisplay="auto"
        value={brightness}
        step={1}
        min={0}
        max={500}
      />
      <Typography gutterBottom>Contrast</Typography>
      <Slider
        aria-label="Contrast %"
        onChange={(e)=>setContrast(e.target.value)}
        defaultValue={100}
        valueLabelDisplay="auto"
        value={contrast}
        step={1}
        min={0}
        max={500}
      />
      <Typography gutterBottom>Saturation</Typography>
      <Slider
        aria-label="Saturate %"
        onChange={(e)=>setSaturation(e.target.value)}
        defaultValue={100}
        valueLabelDisplay="auto"
        value={saturation}
        step={1}
        min={0}
        max={500}
      />
      <Typography gutterBottom>Hue</Typography>
      <Slider
        aria-label="Hue %"
        onChange={(e)=>setHue(e.target.value)}
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
        onChange={(e)=>setBlur(e.target.value)}
        defaultValue={0}
        valueLabelDisplay="auto"
        value={blur}
        step={1}
        min={0}
        max={50}
      />
      <Typography gutterBottom>Invert</Typography>
      <Switch onChange={()=>setInvert(!invert)} checked={invert} color="primary" />
      <Typography gutterBottom>Flip Horizontal</Typography>
      <Switch onChange={()=>setFlipHorizontal(!flipHorizontal)} checked={flipHorizontal} color="primary" />
      <Typography gutterBottom>Flip Vertical</Typography>
      <Switch onChange={()=>setFlipVertical(!flipVertical)} checked={flipVertical} color="primary" />
    </Box>
  </>);
}