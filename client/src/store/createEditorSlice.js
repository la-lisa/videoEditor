import { VIDEO_FIT } from "../utils/utils";

const createEditorSlice = (set, get) => ({
    canvasFormat: null,
    setCanvasFormat: (format) => set({ canvasFormat: format }),
    canvasFormatChosen: false,
    setCanvasFormatChosen: (chosen) => set({ canvasFormatChosen: chosen }),
    resetCanvasFormat: () => set({ canvasFormat: null, canvasFormatChosen: false }),
    videoFit: VIDEO_FIT._CONTAIN,
    setVideoFit: (videoFit) => set({ videoFit: videoFit }),
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
    // TODO: implement undo/redo
    canUndo: false,
    canRedo: false,
});

export default createEditorSlice;