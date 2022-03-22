import { VIDEO_FIT } from "../utils/utils";

const createEditorSlice = (set, get) => ({
  canvasFormat: null,
  setCanvasFormat: (format) => set({ canvasFormat: format }),
  canvasFormatChosen: false,
  setCanvasFormatChosen: (chosen) => set({ canvasFormatChosen: chosen }),
  resetCanvasFormat: () => set({ canvasFormat: null, canvasFormatChosen: false }),
  videoFit: VIDEO_FIT._CONTAIN,
  setVideoFit: (videoFit) => set({ videoFit: videoFit }),
});

export default createEditorSlice;