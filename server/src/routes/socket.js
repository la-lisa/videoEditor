const io = require("../config/socketio.js").getIO();

io.on("connection", (socket) => {
  console.log("CONNECTED");
  socket.join("sessionId");
});

const logProgress = (progress, _) => {
  io.sockets.in("sessionId").emit("uploadProgress", progress);
  console.log("Processing: " + (progress * 100).toFixed() + "% done");
};

module.exports = logProgress;
