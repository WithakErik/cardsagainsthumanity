const express = require("express");
const socket = require("socket.io");

const fs = require("fs");
const https = require("https");
const privateKey = fs.readFileSync("./server.key", "utf8");
const certificate = fs.readFileSync("./server.cert", "utf8");

const credentials = { key: privateKey, cert: certificate };

const PORT = process.env.PORT || 4000;
const app = express();
// const server = app.listen(PORT, () => {
//   console.log(`[ Listening on port ] - ${PORT}`);
// });

https
  .createServer(credentials, app)
  .listen(PORT, () => console.log(`[ Listening On Port ] - ${PORT}`));
const io = socket(server);
app.use(express.static("public"));

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
  socket.on("test", () => console.log("WE CONNECTED FORM THE CLIENT SIDE"));
});
