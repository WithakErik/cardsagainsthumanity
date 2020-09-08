const { v4: uuidv4 } = require("uuid");
const Game = require("./Game");

const connections = {};
const rooms = {};

function handleCreateRoom(io, socket, data) {
  const roomId = uuidv4().slice(0, 6);
  data.roomId = roomId;
  rooms[roomId] = new Game();
  rooms[roomId].setCurrentChooserSocketId(socket.id);
  handleJoinRoom(io, socket, data);
}
function handleDisconnect(io, socket, data) {
  const { roomId } = connections[socket.id];
  if (roomId) {
    const game = rooms[roomId];
    game.deletePlayer(socket.id);
    if (game.getPlayerCount() === 0) {
      delete rooms[roomId];
    } else {
      if (socket.id === game.currentChooserSocketId)
        game.setNextChooserSocketId();
      io.to(roomId).emit("update-players", {
        players: game.getPublicPlayerData(),
      });
      if (game.getPlayerCount() < 3)
        io.to(roomId).emit("wait-for-more-players");
    }
  }
  delete connections[socket.id];
}
function handleJoinRoom(io, socket, data) {
  const { name, roomId } = data;
  const game = rooms[roomId];
  if (!rooms.hasOwnProperty(roomId)) return socket.emit("room-not-found");
  socket.join(roomId);

  game.addPlayer({ name, socket });
  connections[socket.id].roomId = roomId;
  // We're not using `game` here yet
  socket.emit("sucessfully-joined-room", { roomId });

  if (game.getPlayerCount() > 2) {
    const { name } = game.players[game.currentChooserSocketId];
    io.to(roomId).emit("waiting-for-player-to-start-game", { name });
    connections[game.currentChooserSocketId].socket.emit(
      "enable-start-game-button"
    );
  }
  io.to(roomId).emit("update-players", { players: game.getPublicPlayerData() });
}
function handleMessage(io, socket, data) {
  const { roomId } = connections[socket.id];

  io.to(roomId).emit("update-message", data);
}
function handlePlayerSelectedCard(io, socket, data) {
  console.log(data);
}
function handleStartGame(io, socket) {
  const { roomId } = connections[socket.id];
  const game = rooms[roomId];
  game.resetDeck();
  // Deal out cards
  game.startNewRound();
  io.in(roomId).emit("new-round", { blackCard: game.currentBlackCard });
  connections[game.currentChooserSocketId].socket.emit(
    "set-player-as-current-chooser"
  );
}

module.exports = {
  connections,
  handleDisconnect,
  handleJoinRoom,
  handleCreateRoom,
  handleMessage,
  handlePlayerSelectedCard,
  handleStartGame,
};
