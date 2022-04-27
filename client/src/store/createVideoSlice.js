const createVideoSlice = (set, get) => ({
  video: null,
  setVideo: (video) => set({ video: video }),
  resultVideoUrl: null,
  setResultVideoUrl: (url) => set({ resultVideoUrl: url, resultVideoProgress: {} }),
  resultThumbUrl: null,
  setResultThumbUrl: (url) => set({ resultThumbUrl: url }),
  resultVideoProgress: {},
  setResultVideoProgress: (progress) => set({ resultVideoProgress: progress }),
});

export default createVideoSlice;
