const paths = require("../utils/utils");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const ffmpegOnProgress = require("ffmpeg-on-progress");
const logProgress = require("../routes/socket");

const newVideoUrl = `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}`;
let videoEncoding;

const processVideo = (req, res, filename, ext, params) => {
  const {
    afOptions,
    vfOptions,
    trimTime,
    duration,
    adjustOptions,
    panOptions,
    zoomPanOptions,
    outputFormat,
  } = params;

  const location = `server/uploads/${filename}${ext}`;

  return new Promise((resolve, reject) => {
    console.log(panOptions);
    videoEncoding = ffmpeg(location)
      .videoFilters(adjustOptions)
      .videoFilters(zoomPanOptions)
      .videoFilters(panOptions)
      .videoFilters(vfOptions)
      .setStartTime(trimTime[0])
      .setDuration(duration.s)
      .audioFilter(afOptions)
      .addOptions("-pix_fmt yuv420p")
      .addOptions("-crf 30")
      .addOptions("-b:v 0")
      .on("error", (err) => {
        reject("An error occurred while processing video: " + err.message);
      })
      .on("progress", ffmpegOnProgress(logProgress, duration.ms))
      .on("end", () => {
        console.info("Processing finished!");
        resolve();
      })
      .save(`${newVideoUrl}/${filename}.${outputFormat}`);
  });
};

const killFFmpegProcess = () => {
  return new Promise((resolve, reject) => {
    try {
      videoEncoding.kill();
      console.info("Process killed!");
      resolve();
    } catch (err) {
      console.error(err.message);
      reject(err.message);
    }
  });
};

module.exports = {
  processVideo: processVideo,
  killFFmpegProcess: killFFmpegProcess,
};
