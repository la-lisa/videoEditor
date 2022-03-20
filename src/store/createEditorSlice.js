const createEditorSlice = (set, get) => ({
  canvasFormat: null,
  setCanvasFormat: (format) => set({ canvasFormat: format }),
});

export default createEditorSlice;