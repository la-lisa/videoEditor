const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");

const upload = multer({
  storage: multer.diskStorage({
    destination: "./server/uploads/",
    filename: function (req, file, cb) {
      cb(null, `${nanoid(12)}${path.parse(file.originalname).ext}`);
    },
  }),
});

module.exports = upload;
