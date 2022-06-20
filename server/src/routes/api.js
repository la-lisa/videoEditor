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

router.post("/deleteUploadsThumbs", (req, res) => {
  const filename = req.body.filename;
  const thumbName = filename.split(".")[0];
  const videoPath = `${paths.uploadFolder}/${filename}`;
  let thumbPath = `${paths.basePath}/${paths.thumb.uploadThumb}/`;

  try {
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    for (let i = 1; i <= 20; i++) {
      let tempthumbName = thumbName + `-${i.toString().padStart(2, "0")}`;
      if (fs.existsSync(`${thumbPath}/${tempthumbName}.jpg`))
        fs.unlinkSync(`${thumbPath}/${tempthumbName}.jpg`);
    }
  } catch (e) {
    console.error(e);
    res.status(500);
  }
});

router.get("/download/video/:filename", (req, res) => {
  res.download(
    `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}/${req.params.filename}`
  );
});

module.exports = router;
