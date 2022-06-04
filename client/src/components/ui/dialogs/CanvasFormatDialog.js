import { FormControl, FormControlLabel, Grid, RadioGroup } from '@mui/material';
import Radio from '@mui/material/Radio';
import { CANVAS_FORMATS } from '../../../utils/utils';
import useStoreWithUndo from '../../../store/useStoreWithUndo';
export default function CanvasFormatDialog() {
  const format = useStoreWithUndo((state) => state.canvasFormat);
  const setFormat = useStoreWithUndo((state) => state.setCanvasFormat);

  const handleListItemClick = (e) => {
    setFormat(e.target.value);
    useStoreWithUndo.getState().clear();
  };

  return (
    <Grid container className="canvas-formats" alignItems="center" justifyContent="center">
      <FormControl>
        <RadioGroup aria-label="Canvas Formats Radio Buttons" onChange={handleListItemClick} value={format} row>
          {Object.keys(CANVAS_FORMATS).map((key) => {
            return (
              <FormControlLabel
                key={key}
                value={key}
                control={<Radio />}
                label={CANVAS_FORMATS[key].title}
                labelPlacement="top"
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
