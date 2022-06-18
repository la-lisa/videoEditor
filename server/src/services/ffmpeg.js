const paths = require("../utils/utils");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const ffmpegOnProgress = require("ffmpeg-on-progress");
const fs = require("fs");
const logProgress = require("../routes/socket");

const newVideoUrl = `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}`;
let videoEncoding;

const processVideo = (req, res, location, filename, params) => {
  const {
    afOptions,
    vfOptions,
    trimTime,
    duration,
    adjustOptions,
    panOptions,
    outputFormat,
  } = params;

  return new Promise((resolve, reject) => {
    videoEncoding = ffmpeg(location)
      .videoFilters(JSON.parse(adjustOptions))
      .videoFilters(JSON.parse(vfOptions))
      .setStartTime(trimTime[0])
      .setDuration(duration.s)
      .audioFilter(JSON.parse(afOptions))
      .addOptions("-pix_fmt yuv420p")
      .addOptions("-crf 30")
      .addOptions("-b:v 0")
      .on("error", (err) => {
        reject("An error occurred while processing video: " + err.message);
      })
      .on("progress", ffmpegOnProgress(logProgress, duration.ms))
      .on("end", () => {
        console.log("Processing finished!");
        try {
          fs.unlinkSync(location);
          //file removed
          resolve();
        } catch (err) {
          reject(err.message);
        }
      })
      .save(`${newVideoUrl}/${filename}.${outputFormat}`);
  });
};

const killFFmpegProcess = () => {
  videoEncoding.kill();
  console.log("Process killed!");
  try {
    fs.unlinkSync(videoEncoding._currentInput.source);
    fs.unlinkSync(videoEncoding._outputs.target);
    //file removed
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  processVideo: processVideo,
  killFFmpegProcess: killFFmpegProcess,
};
