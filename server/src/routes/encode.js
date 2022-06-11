const generateThumbnail = require("../services/generateThumbnails");
const { processVideo } = require("../services/ffmpeg");
const express = require("express");
const upload = require("../config/multer");
const { nanoid } = require("nanoid");
const paths = require("../utils/utils");
const { killFFmpegProcess } = require("../services/ffmpeg");
const router = express.Router();

router.post("/killffmpeg", () => {
  killFFmpegProcess();
});

router.post("/encode", upload.single("file"), (req, res) => {
  if (req.file) {
    const video = req.file;
    const uploadPath = video.path;
    const vfOptions = req.body.vfOptions;
    const adjustOptions = req.body.adjustOptions;
    const trimTime = JSON.parse(req.body.trimTime);
    const afOptions = req.body.afOptions;
    const duration = {
      s: trimTime[1] - trimTime[0],
      ms: (trimTime[1] - trimTime[0]) * 1000,
    };
    const filename = nanoid(12);
    processVideo(req, res, uploadPath, filename, {
      afOptions: afOptions,
      vfOptions: vfOptions,
      trimTime: trimTime,
      duration: duration,
      adjustOptions: adjustOptions,
    })
      .then(() => generateThumbnail(filename))
      .then(() => {
        res.json({
          newVideoUrl: `download/video/${filename}.mp4`,
          newThumbUrl: `api/${paths.baseFolder}/${paths.thumb.folder}/${filename}.jpg`,
          fileName: `${filename}`,
        });
      })
      .catch((e) => console.error(e));
  } else {
    res.json({
      uploaded: false,
    });
  }
});

module.exports = router;
