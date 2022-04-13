const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors')
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(express.static('server/public'))

var upload = multer({
  storage: multer.diskStorage({
    destination: './server/uploads/',
    filename: function(req, file, cb) {
      // user shortid.generate() alone if no extension is needed
      cb(null, Date.now() + path.parse(file.originalname).ext);
    }
  })
});

const encodedPath = "converted/output.mp4";

app.post('/encode', upload.single('file'), (req, res) => {
  if (req.file) {
    let video = req.file;
    let upload_path = video.path;
    let vfOptions = req.body.vfOptions;
    let trimTime = req.body.trimTime;

    ffmpeg(upload_path)
      .videoFilters(JSON.parse(vfOptions)
      )
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', function() {
        console.log('Processing finished !');
        fs.unlinkSync(upload_path)
        res.json({newVideoUrl: encodedPath});
      })
      .save('server/public/converted/output.mp4');
  } else {
    res.json({
      uploaded: false
    })
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});