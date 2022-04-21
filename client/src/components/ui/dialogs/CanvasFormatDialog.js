import { FormControl, FormControlLabel, Grid, RadioGroup } from '@mui/material';
import Radio from '@mui/material/Radio';
import { CANVAS_FORMATS } from '../../../utils/utils';
import useStore from '../../../store/useStore';

export default function CanvasFormatDialog() {
  const format = useStore((state) => state.canvasFormat);
  const setFormat = useStore((state) => state.setCanvasFormat);

  const handleListItemClick = (e) => {
    setFormat(e.target.value);
  };

  return (
    <Grid container className="canvas-formats" alignItems="center" justifyContent="center">
      <FormControl>
        <RadioGroup aria-label="Canvas Formats Radio Buttons" onChange={handleListItemClick} value={format} row>
          {Object.keys(CANVAS_FORMATS).map((format) => {
            return (
              <FormControlLabel
                key={format}
                value={CANVAS_FORMATS[format]}
                control={<Radio />}
                label={CANVAS_FORMATS[format]}
                labelPlacement="top"
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
