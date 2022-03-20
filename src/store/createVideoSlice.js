const createVideoSlice = (set, get) => ({
  videoUploaded: false,
  setVideoUploaded: (uploaded) => set({ videoUploaded: uploaded }),
});

export default createVideoSlice;