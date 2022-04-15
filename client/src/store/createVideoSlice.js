const createVideoSlice = (set, get) => ({
  videoUploaded: false,
  setVideoUploaded: (uploaded) => set({ videoUploaded: uploaded }),
  resultVideoURL: null,
  setResultVideoURL: (url) => set({ resultVideoURL: url }),
  resultVideoProgress: {},
  setResultVideoProgress: (progress) => set({ resultVideoProgress: progress }),
});

export default createVideoSlice;