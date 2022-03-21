import { VIDEO_FIT } from "../utils/utils";

const createEditorSlice = (set, get) => ({
  canvasFormat: null,
  setCanvasFormat: (format) => set({ canvasFormat: format }),
  videoFit: VIDEO_FIT._CONTAIN,
  setVideoFit: (videoFit) => set({ videoFit: videoFit }),
});

export default createEditorSlice;