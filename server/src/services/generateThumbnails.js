const ffmpeg = require("fluent-ffmpeg");

/**
 *
 * @param videoPath full path to the video, including filename
 * @param filename filename of the video, excluding extension
 * @param thumbLocation location where the thumbnails should be saved, excluding filename
 * @param count how many thumbnails should be created
 * @param height
 * @returns {Promise<unknown>}
 */
const generateThumbnails = (
  videoPath,
  filename,
  thumbLocation,
  count = 1,
  height = 320
) => {
  return new Promise((resolve, reject) => {
    let thumbFilenames = [];

    ffmpeg.ffprobe(videoPath, function (err, metadata) {
      const width = Math.round(
        (metadata.streams[0].width / metadata.streams[0].height) * height
      );

      ffmpeg(videoPath)
        .screenshots({
          count: count,
          folder: thumbLocation,
          filename: `${filename}${count > 1 ? "-%0i" : ""}.jpg`,
          size: `${width}x${height}`,
        })
        .on("error", (err) => {
          reject(
            "An error occurred while generating thumbnail(s): " + err.message
          );
        })
        .on("filenames", (filenames) => {
          console.info("Generated thumbnail(s): ", filenames);
          thumbFilenames = filenames;
        })
        .on("end", () => {
          resolve({
            thumbWidth: width,
            thumbUrls: thumbFilenames.map(
              (filename) => `api/uploaded/thumbs/${filename}`
            ),
          });
        });
    });
  });
};

module.exports = generateThumbnails;
