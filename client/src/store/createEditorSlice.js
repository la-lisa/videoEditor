import {VIDEO_FIT} from "../utils/utils";

const createEditorSlice = (set, get) => ({
    canvasFormat: null,
    setCanvasFormat: (format) => set({canvasFormat: format}),
    videoFit: VIDEO_FIT._CONTAIN,
    setVideoFit: (videoFit) => set({videoFit: videoFit}),
    trimTime: ['00:00:00', '00:00:04'],
    setTrimTime: (trimTime) => set({trimTime: trimTime}),
    videoBgColor: '#000000',
    setVideoBgColor: (videoBgColor) => set({videoBgColor: videoBgColor})
});

export default createEditorSlice;