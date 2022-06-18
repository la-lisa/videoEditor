const createVideoSlice = (set, get) => ({
  video: null,
  setVideo: (video) => set({ video: video }),
  filename: null,
  setFilename: (filename) => set({ filename: filename }),
  thumbUrls: null,
  setThumbUrls: (urls) => set({ thumbUrls: urls }),
  thumbWidth: null,
  setThumbWidth: (width) => set({ thumbWidth: width }),
  resultVideoUrl: null,
  setResultVideoUrl: (url) => set({ resultVideoUrl: url, resultVideoProgress: {} }),
  resultThumbUrl: null,
  setResultThumbUrl: (url) => set({ resultThumbUrl: url }),
  resultVideoProgress: {},
  setResultVideoProgress: (progress) => set({ resultVideoProgress: progress }),
});

export default createVideoSlice;
