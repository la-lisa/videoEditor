const createVideoSlice = (set, get) => ({
  video: null,
  setVideo: (video) => set({ video: video }),
  resultVideoURL: null,
  setResultVideoURL: (url) => set({ resultVideoURL: url }),
  resultVideoProgress: {},
  setResultVideoProgress: (progress) => set({ resultVideoProgress: progress }),
});

export default createVideoSlice;
