import { OUTPUT_FORMAT, PAN_DIRECTION, VIDEO_ALIGN, VIDEO_FIT, ZOOMPAN_OPTIONS } from '../utils/utils';
import { undoMiddleware } from 'zundo';

export const createEditorSlice = (set, get) => ({
  time: 0,
  setTime: (time) => set({ time: time }),
  isPlaying: false,
  toggleIsPlaying: () => set({ isPlaying: !get().isPlaying }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  canvasFormatChosen: false,
  setCanvasFormatChosen: (chosen) => set({ canvasFormatChosen: chosen }),
  duration: 0,
  setDuration: (duration) => set({ duration: duration }),
  startTime: null,
  setStartTime: (startTime) => set({ startTime: startTime }),
  endTime: null,
  setEndTime: (endTime) => set({ endTime: endTime }),
});

export const createUndoEditorSlice = undoMiddleware(
  (set, get) => ({
    canvasFormat: null,
    setCanvasFormat: (format) => set({ canvasFormat: format }),
    videoFit: VIDEO_FIT._CONTAIN,
    // panShot/zoomPan only works with `videoFit` set to `VIDEO_FIT._COVER`
    setVideoFit: (videoFit) =>
      set({
        videoFit: videoFit,
        ...(get().panShot && videoFit === VIDEO_FIT._COVER
          ? { panShot: false }
          : get().zoomPan && videoFit === VIDEO_FIT._COVER
          ? { zoomPan: false }
          : {}),
      }),
    videoBgColor: '#000000',
    setVideoBgColor: (videoBgColor) => set({ videoBgColor: videoBgColor }),
    muteAudio: false,
    setMuteAudio: (muteAudio) => set({ muteAudio: muteAudio }),
    audioVolume: 100,
    setAudioVolume: (audioVolume) => set({ audioVolume: audioVolume }),
    brightness: 100,
    setBrightness: (brightness) => set({ brightness: brightness }),
    contrast: 100,
    setContrast: (contrast) => set({ contrast: contrast }),
    blur: 0,
    setBlur: (blur) => set({ blur: blur }),
    hue: 0,
    setHue: (hue) => set({ hue: hue }),
    invert: false,
    setInvert: (invert) => set({ invert: invert }),
    flipHorizontal: false,
    setFlipHorizontal: (flipHorizontal) => set({ flipHorizontal: flipHorizontal }),
    flipVertical: false,
    setFlipVertical: (flipVertical) => set({ flipVertical: flipVertical }),
    saturation: 100,
    setSaturation: (saturation) => set({ saturation: saturation }),
    zoom: 0,
    setZoom: (zoom) => set({ zoom: zoom }),
    videoAlign: VIDEO_ALIGN._CENTER,
    setVideoAlign: (align) => set({ videoAlign: align }),
    panShot: false,
    // alter `videoFit` when the panShot feature is en-/disabled and disable zoomPan on panShot enable
    setPanShot: (panShot) =>
      set({
        panShot: panShot,
        videoFit: panShot ? VIDEO_FIT._COVER : VIDEO_FIT._CONTAIN,
        ...(get().zoomPan ? { zoomPan: false } : {}),
      }),
    panDirection: PAN_DIRECTION._LEFT_TO_RIGHT,
    setPanDirection: (panDirection) => set({ panDirection: panDirection }),
    zoomPan: false,
    // disable panShot on zoomPan enable
    setZoomPan: (zoomPan) => set({ zoomPan: zoomPan, ...(get().panShot ? { panShot: false } : {}) }),
    zoomPanDirection: ZOOMPAN_OPTIONS._CENTER,
    setZoomPanDirection: (zoomPanDirection) => set({ zoomPanDirection: zoomPanDirection }),
    outputFormat: OUTPUT_FORMAT._MP4,
    setOutputFormat: (outputFormat) => set({ outputFormat: outputFormat }),
  }),
  {
    include: [
      'canvasFormat',
      'videoFit',
      'startTime',
      'endTime',
      'videoBgColor',
      'muteAudio',
      'audioVolume',
      'duration',
      'brightness',
      'contrast',
      'blur',
      'hue',
      'invert',
      'flipHorizontal',
      'flipVertical',
      'saturation',
      'zoom',
      'videoAlign',
      'panShot',
      'panDirection',
      'zoomPan',
      'zoomPanDirection',
      'outputFormat',
    ],
  }
);
