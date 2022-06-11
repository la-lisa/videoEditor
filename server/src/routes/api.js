const fs = require("fs");
const paths = require("../utils/utils");

const express = require("express");
const router = express.Router();

router.delete("/deleteConverted", (req) => {
  const filename = req.body.filename;
  try {
    fs.unlinkSync(
      `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}/${filename}.mp4`
    );
    fs.unlinkSync(
      `${paths.basePath}/${paths.baseFolder}/${paths.thumb.folder}/${filename}.jpg`
    );
    //file removed
  } catch (err) {
    console.log(err);
  }
});

router.get("/download/video/:filename", (req, res) => {
  res.download(
    `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}/${req.params.filename}`
  );
});

module.exports = router;
