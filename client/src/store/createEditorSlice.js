import { VIDEO_ALIGN, VIDEO_FIT } from '../utils/utils';
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
  startTime: 0,
  setStartTime: (startTime) => set({ startTime: startTime }),
  endTime: 0,
  setEndTime: (endTime) => set({ endTime: endTime }),
});

export const createUndoEditorSlice = undoMiddleware(
  (set, get) => ({
    canvasFormat: null,
    setCanvasFormat: (format) => set({ canvasFormat: format }),
    videoFit: VIDEO_FIT._CONTAIN,
    setVideoFit: (videoFit) => set({ videoFit: videoFit }),
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
    setPanShot: (panShot) => set({ panShot: panShot }),
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
    ],
  }
);
