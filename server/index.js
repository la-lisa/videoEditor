const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffmpegOnProgress = require('ffmpeg-on-progress')
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

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log('CONNECTED');
    socket.join('sessionId');
})

const upload = multer({
  storage: multer.diskStorage({
    destination: './server/uploads/',
    filename: function(req, file, cb) {
      // user shortid.generate() alone if no extension is needed
      cb(null, Date.now() + path.parse(file.originalname).ext);
    }
  })
});

const encodedPath = "converted/output.mp4";

app.post('/encode', upload.single('file'), async (req, res) => {
  if (req.file) {
    const video = req.file;
    const upload_path = video.path;
    const vfOptions = req.body.vfOptions;
    const trimTime = JSON.parse(req.body.trimTime);
    const afOptions = req.body.afOptions;
    const duration = { s: trimTime[1] - trimTime[0], ms: (trimTime[1] - trimTime[0]) * 1000, };

    const logProgress = (progress, _) => {
      io.sockets.in('sessionId').emit('uploadProgress', progress)
      console.log('Processing: ' + (progress * 100).toFixed() + '% done');
    }

    ffmpeg(upload_path)
      .videoFilters(JSON.parse(vfOptions))
      .setStartTime(trimTime[0])
      .setDuration(duration.s)
      .audioFilter(JSON.parse(afOptions))
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
      })
      .on('progress', ffmpegOnProgress(logProgress, duration.ms))
      .on('end', () => {
        console.log('Processing finished !');
        try {
          fs.unlinkSync(upload_path)
          //file removed
        } catch(err) {
          console.error(err)
        }
        res.json({newVideoUrl: encodedPath});
      })
      .save('server/public/converted/output.mp4');
  } else {
    res.json({
      uploaded: false
    })
  }
});

