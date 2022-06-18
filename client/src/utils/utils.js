export const CANVAS_FORMATS = {
  _16_BY_9: {
    id: 0,
    title: '16/9',
    x: 16,
    y: 9,
  },
  _1_BY_1: {
    id: 1,
    title: '1/1',
    x: 1,
    y: 1,
  },
  _4_BY_3: {
    id: 2,
    title: '4/3',
    x: 4,
    y: 3,
  },
  _9_BY_16: {
    id: 3,
    title: '9/16',
    x: 9,
    y: 16,
  },
};

export const VIDEO_FIT = {
  _CONTAIN: 'contain',
  _COVER: 'cover',
};

export const VIDEO_ALIGN = {
  _CENTER: 'center',
  _TOP: 'top',
  _BOTTOM: 'bottom',
  _LEFT: 'left',
  _RIGHT: 'right',
};

export const DIALOG_OK_BUTTON_TITLE = 'ok';
export const DIALOG_CANCEL_BUTTON_TITLE = 'cancel';
export const DIALOG_DOWNLOAD_BUTTON_TITLE = 'download';
export const DIALOG_BACK_TO_EDITOR_BUTTON_TITLE = 'back to editor';

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const shiftValuesBrightnessLight = (value) => {
  if (value <= 100) {
    return 1;
  }
  if (value > 100) {
    return 1.01 - (value - 100) / 200;
  }
};

export const shiftValuesBrightnessDark = (value) => {
  if (value >= 100) {
    return 1;
  }
  if (value < 100) {
    return value / 100;
  }
};

export const shiftValuesContrast = (value) => {
  if (value === 100) {
    return 1;
  }
  if (value > 100) {
    return value / 100;
  }
  if (value < 100) {
    return value / 100;
  }
};

export const shiftValuesSaturation = (value) => {
  if (value === 100) {
    return 1;
  }
  if (value > 100) {
    return (2 * (value - 100)) / 200 + 1;
  }
  if (value < 100) {
    return value / 100;
  }
};

export const getYPos = (videoAlign, videoFit) => {
  if (videoAlign === VIDEO_ALIGN._CENTER || videoAlign === VIDEO_ALIGN._LEFT || videoAlign === VIDEO_ALIGN._RIGHT) {
    return videoFit === VIDEO_FIT._COVER ? 'ih/2' : '(oh-ih)/2';
  } else if (videoAlign === VIDEO_ALIGN._BOTTOM) {
    return videoFit === VIDEO_FIT._COVER ? 'ih' : '(oh-ih)';
  } else {
    return '0';
  }
};

export const getXPos = (videoAlign, videoFit) => {
  if (videoAlign === VIDEO_ALIGN._CENTER || videoAlign === VIDEO_ALIGN._TOP || videoAlign === VIDEO_ALIGN._BOTTOM) {
    return videoFit === VIDEO_FIT._COVER ? 'iw/2' : '(ow-iw)/2';
  } else if (videoAlign === VIDEO_ALIGN._RIGHT) {
    return videoFit === VIDEO_FIT._COVER ? 'iw' : '(ow-iw)';
  } else {
    return '0';
  }
};
