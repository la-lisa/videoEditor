import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  RadioGroup, Typography
} from "@mui/material";
import Radio from "@mui/material/Radio";
import { useState } from "react";
import { CANVAS_FORMATS } from "../../utils/utils";
import PropTypes from "prop-types";

export default function CanvasFormatDialog({ onBack, onClose, open }) {
  const [chosenFormat, setChosenFormat] = useState(CANVAS_FORMATS._16_BY_9);

  const handleClose = () => {
    onClose(chosenFormat);
  };

  const handleListItemClick = (e) => {
    setChosenFormat(e.target.value);
  };

  const handleBack = () => {
    onBack();
  }

  return (
    <Dialog onClose={handleClose} open={open} aria-label="Choose Canvas Format Dialog">
      <DialogTitle>
        <Typography variant="h6" component="p" align="center">Choose Canvas Format</Typography>
      </DialogTitle>
      <Grid container className="canvas-formats" alignItems="center" justifyContent="center">
        <FormControl>
          <RadioGroup
            aria-label="Canvas Formats Radio Buttons"
            onChange={handleListItemClick}
            value={chosenFormat}
            row
          >
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
      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Button onClick={handleClose} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CanvasFormatDialog.propTypes = {
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}