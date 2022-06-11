const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

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

const sio = require("./src/config/socketio.js");
sio.init(server);

const apiRouter = require("./src/routes/api");
const encodeRouter = require("./src/routes/encode");

app.use("/", apiRouter);
app.use("/ffmpeg", encodeRouter);
