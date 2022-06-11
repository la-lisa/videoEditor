const ffmpeg = require("fluent-ffmpeg");
const paths = require("../utils/utils");
const newVideoUrl = `${paths.basePath}/${paths.baseFolder}/${paths.video.folder}`;

const generateThumbnail = (filename) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(`${newVideoUrl}/${filename}.mp4`, function (err, metadata) {
      ffmpeg(`${newVideoUrl}/${filename}.mp4`)
        .screenshots({
          count: 1,
          folder: `${paths.basePath}/${paths.baseFolder}/${paths.thumb.folder}`,
          filename: `${filename}.jpg`,
          size:
            Math.round(
              (metadata.streams[0].width / metadata.streams[0].height) * 320
            ) + "x320",
        })
        .on("error", (err) => {
          reject(
            "An error occurred while generating thumbnail: " + err.message
          );
        })
        .on("filenames", (filenames) => {
          console.log("Generated thumbnails: ", filenames);
        })
        .on("end", resolve);
    });
  });
};

module.exports = generateThumbnail;
