const path = require("path");
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const paths = require("../utils/utils");
const generateThumbnails = require("../services/generateThumbnails");
const { processVideo } = require("../services/ffmpeg");
const { killFFmpegProcess } = require("../services/ffmpeg");

router.post("/killffmpeg", (req, res) => {
  killFFmpegProcess()
    .then(() => res.json({ success: true }))
    .catch((e) => {
      res.status(500);
      res.json({ success: false, message: e.message });
    });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (req.file) {
    const video = req.file;
    const uploadPath = video.path;
    const filename = video.filename;
    const thumbLocation = `${paths.basePath}/uploaded/${paths.thumb.folder}`;

    const thumbs = await generateThumbnails(
      uploadPath,
      path.parse(filename).name,
      thumbLocation,
      20,
      50
    );

    res.json({
      filename: filename,
      thumbs: thumbs,
    });
  } else {
    res.json({
      uploaded: false,
    });
  }
});

router.post("/encode", (req, res) => {
  if (req.body.filename) {
    const filename = path.parse(req.body.filename).name;
    const ext = path.parse(req.body.filename).ext;
    const vfOptions = req.body.vfOptions;
    const adjustOptions = req.body.adjustOptions;
    const trimTime = req.body.trimTime;
    const afOptions = req.body.afOptions;
    const panOptions = req.body.panOptions;
    const outputFormat = req.body.outputFormat;
    const duration = {
      s: trimTime[1] - trimTime[0],
      ms: (trimTime[1] - trimTime[0]) * 1000,
    };
    const resultVideoPath = `server/public/converted/videos/${filename}.${outputFormat}`;
    const resultThumbPath = `server/public/converted/thumbs/`;

    processVideo(req, res, filename, ext, {
      afOptions: afOptions,
      vfOptions: vfOptions,
      trimTime: trimTime,
      duration: duration,
      adjustOptions: adjustOptions,
      panOptions: panOptions,
      outputFormat: outputFormat,
    })
      .then(() =>
        generateThumbnails(resultVideoPath, filename, resultThumbPath, 1, 320)
      )
      .then(() => {
        res.json({
          newVideoUrl: `download/video/${filename}.${outputFormat}`,
          newThumbUrl: `api/${paths.baseFolder}/${paths.thumb.folder}/${filename}.jpg`,
        });
      })
      .catch((e) => {
        console.error(e);
        res.status(500);
        res.json({ success: false });
      });
  } else {
    res.json({
      success: false,
    });
  }
});

module.exports = router;
