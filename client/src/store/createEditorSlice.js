import {VIDEO_ALIGN, VIDEO_FIT} from '../utils/utils';
import {undoMiddleware} from "zundo";

const createEditorSlice = undoMiddleware((set, get) => ({
  canvasFormat: null,
  setCanvasFormat: (format) => set({canvasFormat: format}),
  canvasFormatChosen: false,
  setCanvasFormatChosen: (chosen) => set({canvasFormatChosen: chosen}),
  resetCanvasFormat: () => set({canvasFormat: null, canvasFormatChosen: false}),
  videoFit: VIDEO_FIT._CONTAIN,
  setVideoFit: (videoFit) => set({videoFit: videoFit}),
  startTime: '00:00:00',
  setStartTime: (startTime) => set({startTime: startTime}),
  endTime: '00:00:04',
  setEndTime: (endTime) => set({endTime: endTime}),
  videoBgColor: '#000000',
  setVideoBgColor: (videoBgColor) => set({videoBgColor: videoBgColor}),
  muteAudio: false,
  setMuteAudio: (muteAudio) => set({muteAudio: muteAudio}),
  audioVolume: 100,
  setAudioVolume: (audioVolume) => set({audioVolume: audioVolume}),
  editorActions: [],
  duration: 0,
  setDuration: (duration) => set({duration: duration}),
  time: 0,
  setTime: (time) => set({time: time}),
  isPlaying: false,
  toggleIsPlaying: () => set({isPlaying: !get().isPlaying}),
  brightness: 100,
  setBrightness: (brightness) => set({brightness: brightness}),
  contrast: 100,
  setContrast: (contrast) => set({contrast: contrast}),
  blur: 0,
  setBlur: (blur) => set({blur: blur}),
  hue: 0,
  setHue: (hue) => set({hue: hue}),
  invert: false,
  setInvert: (invert) => set({invert: invert}),
  flipHorizontal: false,
  setFlipHorizontal: (flipHorizontal) => set({flipHorizontal: flipHorizontal}),
  flipVertical: false,
  setFlipVertical: (flipVertical) => set({flipVertical: flipVertical}),
  saturation: 100,
  setSaturation: (saturation) => set({saturation: saturation}),
  zoom: 0,
  setZoom: (zoom) => set({zoom: zoom}),
  videoAlign: VIDEO_ALIGN._CENTER,
  setVideoAlign: (align) => set({videoAlign: align}),
}), {include: ['canvasFormatChosen', 'setCanvasFormatChosen', 'resetCanvasFormat', 'isDialogShown']});

export default createEditorSlice;
