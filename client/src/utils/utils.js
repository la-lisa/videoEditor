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

export const PAN_DIRECTION = {
  _LEFT_TO_RIGHT: 'Left to Right',
  _RIGHT_TO_LEFT: 'Right to Left',
  _TOP_TO_BOTTOM: 'Top to Bottom',
  _BOTTOM_TO_TOP: 'Bottom to Top',
  _LEFT_TO_CENTER: 'Left to Center',
  _RIGHT_TO_CENTER: 'Right to Center',
  _TOP_TO_CENTER: 'Top to Center',
  _BOTTOM_TO_CENTER: 'Bottom to Center',
};

export const ZOOMPAN_OPTIONS = {
  _TOP_LEFT: 'Top Left',
  _TOP_RIGHT: 'Top Right',
  _CENTER: 'Center',
  _BOTTOM_LEFT: 'Bottom Left',
  _BOTTOM_RIGHT: 'Bottom Right',
};

export const OUTPUT_FORMAT = {
  _MP4: 'mp4',
  _WEBM: 'webm',
  _MOV: 'mov',
  _AVI: 'avi',
  _MKV: 'mkv',
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
    return videoFit === VIDEO_FIT._COVER ? 'ih/2 - oh/2' : '(oh-ih)/2';
  } else if (videoAlign === VIDEO_ALIGN._BOTTOM) {
    return videoFit === VIDEO_FIT._COVER ? 'ih' : '(oh-ih)';
  } else {
    return '0';
  }
};

export const getXPos = (videoAlign, videoFit) => {
  if (videoAlign === VIDEO_ALIGN._CENTER || videoAlign === VIDEO_ALIGN._TOP || videoAlign === VIDEO_ALIGN._BOTTOM) {
    return videoFit === VIDEO_FIT._COVER ? 'iw/2 - ow/2' : '(ow-iw)/2';
  } else if (videoAlign === VIDEO_ALIGN._RIGHT) {
    return videoFit === VIDEO_FIT._COVER ? 'iw' : '(ow-iw)';
  } else {
    return '0';
  }
};

export const getPanStartY = (panDirection) => {
  if (panDirection === PAN_DIRECTION._BOTTOM_TO_TOP) {
    return 'if(on,y-1,ih-ih/pzoom)';
  } else if (
    panDirection === PAN_DIRECTION._LEFT_TO_CENTER ||
    panDirection === PAN_DIRECTION._RIGHT_TO_CENTER ||
    panDirection === PAN_DIRECTION._LEFT_TO_RIGHT ||
    panDirection === PAN_DIRECTION._RIGHT_TO_LEFT
  ) {
    return 'ih/2-(ih/pzoom/2)';
  } else if (panDirection === PAN_DIRECTION._TOP_TO_BOTTOM) {
    return 'if(on,y+1,ih-ih/pzoom)';
  } else if (panDirection === PAN_DIRECTION._BOTTOM_TO_CENTER) {
    return 'if(on,y-1,ih/2/pzoom)';
  } else if (panDirection === PAN_DIRECTION._TOP_TO_CENTER) {
    return 'if(on,y+1,ih/2/pzoom)';
  }
};

export const getPanStartX = (panDirection) => {
  if (panDirection === PAN_DIRECTION._LEFT_TO_RIGHT) {
    return 'if(on,px-1,iw-iw/pzoom)';
  } else if (
    panDirection === PAN_DIRECTION._BOTTOM_TO_TOP ||
    panDirection === PAN_DIRECTION._TOP_TO_BOTTOM ||
    panDirection === PAN_DIRECTION._BOTTOM_TO_CENTER ||
    panDirection === PAN_DIRECTION._TOP_TO_CENTER
  ) {
    return 'iw/2-(iw/pzoom/2)';
  } else if (panDirection === PAN_DIRECTION._RIGHT_TO_LEFT) {
    return 'if(on,x+1,iw-iw/pzoom)';
  } else if (panDirection === PAN_DIRECTION._LEFT_TO_CENTER) {
    return 'if(on,x-1,iw/2/pzoom)';
  } else if (panDirection === PAN_DIRECTION._RIGHT_TO_CENTER) {
    return 'if(on,x+1,iw/2/pzoom)';
  }
};

export const getZoomPanY = (zoomPanDirection) => {
  if (zoomPanDirection === ZOOMPAN_OPTIONS._CENTER) {
    return 'ih/2-(ih/pzoom/2)';
  } else if (zoomPanDirection === ZOOMPAN_OPTIONS._TOP_LEFT) {
    return 0;
  } else if (zoomPanDirection === ZOOMPAN_OPTIONS._TOP_RIGHT) {
    return 'y';
  } else if (zoomPanDirection === ZOOMPAN_OPTIONS._BOTTOM_LEFT || zoomPanDirection === ZOOMPAN_OPTIONS._BOTTOM_RIGHT) {
    return 7200;
  }
};

export const getZoomPanX = (zoomPanDirection) => {
  if (zoomPanDirection === ZOOMPAN_OPTIONS._CENTER) {
    return 'iw/2-(iw/pzoom/2)';
  } else if (zoomPanDirection === ZOOMPAN_OPTIONS._TOP_LEFT || zoomPanDirection === ZOOMPAN_OPTIONS._BOTTOM_LEFT) {
    return 0;
  } else if (zoomPanDirection === ZOOMPAN_OPTIONS._TOP_RIGHT || zoomPanDirection === ZOOMPAN_OPTIONS._BOTTOM_RIGHT) {
    return 'iw/2+iw/zoom/2';
  }
};
