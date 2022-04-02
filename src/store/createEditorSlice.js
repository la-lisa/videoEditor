import { VIDEO_FIT } from "../utils/utils";

const createEditorSlice = (set, get) => ({
  canvasFormat: null,
  setCanvasFormat: (format) => set({ canvasFormat: format }),
  canvasFormatChosen: false,
  setCanvasFormatChosen: (chosen) => set({ canvasFormatChosen: chosen }),
  resetCanvasFormat: () => set({ canvasFormat: null, canvasFormatChosen: false }),
  videoFit: VIDEO_FIT._CONTAIN,
  setVideoFit: (videoFit) => set({ videoFit: videoFit }),
  trimTime: ['00:00:00', '00:00:04'],
  setTrimTime: (trimTime) => set({trimTime: trimTime}),
  videoBgColor: '#000000',
  setVideoBgColor: (videoBgColor) => set({videoBgColor: videoBgColor}),
  editorActions: [],
  // TODO: implement undo/redo
  canUndo: false,
  canRedo: false,
});

export default createEditorSlice;