const { v4: uuidv4 } = require("uuid");
const Room = require("./Room");

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
        players: game.players,
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

  game.addPlayer({ id: socket.id, name });
  connections[socket.id].roomId = roomId;
  // We're not using `game` here yet
  socket.emit("sucessfully-joined-room", { roomId, game });

  if (game.getPlayerCount() > 2) {
    const { name } = game.players[game.currentChooserSocketId];
    io.to(roomId).emit("waiting-for-player-to-start-game", { name });
    connections[game.currentChooserSocketId].socket.emit(
      "enable-start-game-button"
    );
  }
  io.to(roomId).emit("update-players", { players: game.players });
}
function handleMessage(io, socket, data) {
  const { roomId } = connections[socket.id];

  io.to(roomId).emit("update-message", data);
}
function handleStartGame(io, socket, data) {
  const { roomId } = connections[socket.id];
  const game = rooms[roomId];
  game.resetDeck();
  // Deal out cards
  game.dealNewCards();
  io.in(roomId).emit("begin-round", { blackCard: game.currentBlackCard });
}

module.exports = {
  connections,
  handleDisconnect,
  handleJoinRoom,
  handleCreateRoom,
  handleMessage,
  handleStartGame,
};
