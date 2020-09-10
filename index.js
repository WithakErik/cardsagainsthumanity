const express = require("express");
const socket = require("socket.io");
const path = require("path");

const PORT = process.env.PORT || 4000;

const app = express();
const https = require("https").Server(app);
const server = https.listen(PORT, () => {
  console.log(`[ Listening on port ] - ${PORT}`);
});

app.use("/", express.static(path.join(__dirname, "public")));

const io = socket(server);

const {
  connections,
  handleCreateRoom,
  handleDisconnect,
  handleJoinRoom,
  handleMessage,
  handleSelectedWinner,
  handleStartGame,
  handleSubmitCards,
} = require("./handlers.js");

io.on("connection", (socket) => {
  console.log(`[ Adding connection ] - ${socket.id}`);
  connections[socket.id] = { roomId: null, socket };
  socket.on("disconnect", (data) => handleDisconnect(io, socket, data));
  socket.on("create-room", (data) => handleCreateRoom(io, socket, data));
  socket.on("join-room", (data) => handleJoinRoom(io, socket, data));
  socket.on("message", (data) => handleMessage(io, socket, data));
  socket.on("start-game", (data) => handleStartGame(io, socket, data));
  socket.on("selected-winner", (data) =>
    handleSelectedWinner(io, socket, data)
  );
  socket.on("submit-cards", (data) => handleSubmitCards(io, socket, data));
});
