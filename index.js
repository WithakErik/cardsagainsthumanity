const express = require("express");
const path = require("path");
const socket = require("socket.io");

const PORT = process.env.PORT || 4000;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`[ Listening on port ] - ${PORT}`);
});
const io = socket(server);
app.use(express.static("public"));
// app.use("/", express.static(path.join(__dirname, "public")));

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
  socket.on("error", (error) => console.error(error));
});
