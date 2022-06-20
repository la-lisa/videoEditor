const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const paths = require("../utils/utils");

router.delete("/deleteConverted", (req, res) => {
  const filename = path.parse(req.body.filename).name;
  const format = req.body.format;
  const videoPath = `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}/${filename}.${format}`;
  const thumbPath = `${paths.basePath}/${paths.baseFolder}/${paths.thumb.folder}/${filename}.jpg`;

  try {
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500);
    res.json({ success: false, message: e.message });
  }
});

router.get("/download/video/:filename", (req, res) => {
  res.download(
    `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}/${req.params.filename}`
  );
});

module.exports = router;
