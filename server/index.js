const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const ffmpeg = require('@ffmpeg-installer/ffmpeg');



app.get("/api", (req, res) => {
  res.json({ message:ffmpeg.path + ", " + ffmpeg.version
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});