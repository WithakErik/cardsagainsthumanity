const express = require("express");
const socket = require("socket.io");

const PORT = process.env.PORT || 4000;

const app = express();
const server = app.listen(PORT, () => {
  console.log(`[ Listening on port ] - ${PORT}`);
});

app.use(express.static("public"));

const io = socket(server);

const {
  connections,
  handleCreateRoom,
  handleDisconnect,
  handleJoinRoom,
  handleMessage,
  handleStartGame,
} = require("./handlers.js");

io.on("connection", (socket) => {
  console.log(`[ Adding connectino ] - ${socket.id}`);
  connections[socket.id] = { roomId: null, socket };
  socket.on("disconnect", (data) => handleDisconnect(io, socket, data));
  socket.on("create-room", (data) => handleCreateRoom(io, socket, data));
  socket.on("join-room", (data) => handleJoinRoom(io, socket, data));
  socket.on("message", (data) => handleMessage(io, socket, data));
  socket.on("start-game", (data) => handleStartGame(io, socket, data));
});
