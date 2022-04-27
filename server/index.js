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
    filename: function (req, file, cb) {
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
    filename: "thumb.jpg",
  },
  video: {
    folder: "videos",
    filename: "output.mp4",
  },
};
const newVideoUrl = `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}/${paths.video.filename}`;
const newThumbUrl = `${paths.basePath}/${paths.baseFolder}/${paths.thumb.folder}/${paths.thumb.filename}`;

const logProgress = (progress, _) => {
  io.sockets.in("sessionId").emit("uploadProgress", progress);
  console.log("Processing: " + (progress * 100).toFixed() + "% done");
};

const generateThumbnail = () => {
  return new Promise((resolve, reject) => {
    ffmpeg(newVideoUrl)
      .screenshots({
        count: 1,
        folder: `${paths.basePath}/${paths.baseFolder}/${paths.thumb.folder}`,
        filename: paths.thumb.filename,
        size: "200x200",
      })
      .on("error", (err) => {
        reject("An error occurred while generating thumbnail: " + err.message);
      })
      .on("end", () => {
        console.log("Thumbnail created!");
      })
      .on("filenames", (filenames) => {
        console.log("Generated thumbnails: ", filenames);
        resolve();
      });
  });
};

const processVideo = (req, res, location, params) => {
  const { afOptions, vfOptions, trimTime, duration } = params;

  return new Promise((resolve, reject) => {
    ffmpeg(location)
      .videoFilters(JSON.parse(vfOptions))
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
        } catch (err) {
          reject(err.message);
        }
        resolve();
      })
      .save(newVideoUrl);
  });
};

app.post("/encode", upload.single("file"), (req, res) => {
  if (req.file) {
    const video = req.file;
    const uploadPath = video.path;
    const vfOptions = req.body.vfOptions;
    const trimTime = JSON.parse(req.body.trimTime);
    const afOptions = req.body.afOptions;
    const duration = {
      s: trimTime[1] - trimTime[0],
      ms: (trimTime[1] - trimTime[0]) * 1000,
    };

    processVideo(req, res, uploadPath, {
      afOptions: afOptions,
      vfOptions: vfOptions,
      trimTime: trimTime,
      duration: duration,
    })
      .then(() => generateThumbnail())
      .then(() => {
        res.json({
          newVideoUrl: `${paths.baseFolder}/${paths.video.folder}/${paths.video.filename}`,
          newThumbUrl: newThumbUrl,
        });
      })
      .catch((e) => console.error(e));
  } else {
    res.json({
      uploaded: false,
    });
  }
});
