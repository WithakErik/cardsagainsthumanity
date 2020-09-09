const { v4: uuidv4 } = require("uuid");
const Game = require("./Game");

const connections = {};
const rooms = {};

function handleCreateRoom(io, socket, data) {
  const roomId = uuidv4().slice(0, 6);
  if (data.hasOwnProperty(roomId)) handleCreateRoom(io, socket, data);
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
  if (!rooms.hasOwnProperty(roomId)) return socket.emit("room-not-found");
  const game = rooms[roomId];
  if (
    Object.keys(game.players).filter(
      (socketId) => game.players[socketId].name === name
    ).length
  )
    return socket.emit("duplicate-player-name");
  socket.join(roomId);
  game.addPlayer({ name, socket });
  connections[socket.id].roomId = roomId;
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
  if (data.message === "\n" || data.message === "\r") return;
  const { roomId } = connections[socket.id];
  io.to(roomId).emit("update-message", data);
}
function handleSelectedWinner(io, socket, { socketId }) {
  const { roomId } = connections[socket.id];
  const game = rooms[roomId];
  game.players[socketId].addPointToScore();
  if (game.getRemainingCardCount("black") === 0) {
    game.determineWinners();
    game.clearPlayerScores();
    const { name } = game.players[game.currentChooserSocketId];
    io.to(roomId).emit("waiting-for-player-to-start-game", { name });
    connections[game.currentChooserSocketId].socket.emit(
      "enable-start-game-button"
    );
  } else {
    game.startNewRound({ isFirstRound: false });
    io.in(roomId).emit("new-round", {
      blackCard: game.currentBlackCard,
      remainingBlackCards: game.getRemainingCardCount("black"),
    });
    connections[game.currentChooserSocketId].socket.emit(
      "set-player-as-current-chooser"
    );
  }
  io.in(roomId).emit("update-players", { players: game.getPublicPlayerData() });
}
function handleStartGame(io, socket) {
  const { roomId } = connections[socket.id];
  const game = rooms[roomId];
  game.resetDeck();
  game.startNewRound({ isFirstRound: true });
  io.in(roomId).emit("new-round", {
    blackCard: game.currentBlackCard,
    remainingBlackCards: game.getRemainingCardCount("black"),
  });
  connections[game.currentChooserSocketId].socket.emit(
    "set-player-as-current-chooser"
  );
  io.in(roomId).emit("update-players", { players: game.getPublicPlayerData() });
}
function handleSubmitCards(io, socket, { selectedCards }) {
  const { roomId } = connections[socket.id];
  const game = rooms[roomId];
  game.players[socket.id].deleteCardsFromHand(selectedCards);
  game.addCurrentSelectedWhiteCards({
    socketId: socket.id,
    cards: selectedCards,
  });
  if (game.getCurrentSelectedWhiteCardsCound() >= game.getPlayerCount() - 1) {
    game.clearPlayerSelectedCardsFromHand();
    io.to(roomId).emit("update-player-selected-cards", {
      playerSelectedCards: game.currentSelectedWhiteCards,
    });
    io.to(roomId).emit("update-players", {
      players: game.getPublicPlayerData(),
    });
  }
}

module.exports = {
  connections,
  handleDisconnect,
  handleJoinRoom,
  handleCreateRoom,
  handleMessage,
  handleSelectedWinner,
  handleStartGame,
  handleSubmitCards,
};
