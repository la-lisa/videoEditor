const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
const ffmpegOnProgress = require("ffmpeg-on-progress");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {nanoid} = require("nanoid");
let videoEncoding;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.static("server/public"));

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("CONNECTED");
  socket.join("sessionId");
});

const upload = multer({
  storage: multer.diskStorage({
    destination: "./server/uploads/",
    filename: function(req, file, cb) {
      // user shortid.generate() alone if no extension is needed
      cb(null, Date.now() + path.parse(file.originalname).ext);
    },
  }),
});

const paths = {
  basePath: "server/public",
  baseFolder: "converted",
  thumb: {
    folder: "thumbs",
  },
  video: {
    folder: "videos",
  },
};
const newVideoUrl = `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}`;

const logProgress = (progress, _) => {
  io.sockets.in("sessionId").emit("uploadProgress", progress);
  console.log("Processing: " + (progress * 100).toFixed() + "% done");
};

const generateThumbnail = (filename) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(`${newVideoUrl}/${filename}.mp4`, function(err, metadata) {
      ffmpeg(`${newVideoUrl}/${filename}.mp4`)
        .screenshots({
          count: 1,
          folder: `${paths.basePath}/${paths.baseFolder}/${paths.thumb.folder}`,
          filename: `${filename}.jpg`,
          size: Math.round(metadata.streams[0].width/metadata.streams[0].height*320) + "x320",
        })
        .on("error", (err) => {
          reject("An error occurred while generating thumbnail: " + err.message);
        })
        .on("filenames", (filenames) => {
          console.log("Generated thumbnails: ", filenames);
        })
        .on("end", resolve);
    });
  });
};

app.post("/killffmpeg", () => {
  if(videoEncoding){
    videoEncoding.kill();
  }

});

const processVideo = (req, res, location, filename, params) => {
  const {afOptions, vfOptions, trimTime, duration, adjustOptions} = params;

  console.log(adjustOptions);
  return new Promise((resolve, reject) => {
    videoEncoding = ffmpeg(location)
      .videoFilters(JSON.parse(vfOptions))
      .videoFilters(JSON.parse(adjustOptions))
      .setStartTime(trimTime[0])
      .setDuration(duration.s)
      .audioFilter(JSON.parse(afOptions))
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
      .save(`${newVideoUrl}/${filename}.mp4`);
  });
};

app.get("/download/video/:filename", (req, res) => {
  res.download(
    `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}/${req.params.filename}`
  );
});

app.post("/encode", upload.single("file"), (req, res) => {
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
          newThumbUrl: `${paths.baseFolder}/${paths.thumb.folder}/${filename}.jpg`,
        });
      })
      .catch((e) => console.error(e));
  } else {
    res.json({
      uploaded: false,
    });
  }
});
