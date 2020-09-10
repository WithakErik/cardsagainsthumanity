const socket = io.connect("https://goldenk.tech:4000");

socket.on("duplicate-player-name", () =>
  alert("Someone with that name is already in the room")
);
socket.on("enable-start-game-button", handleEnablestartGameButton);
socket.on("new-round", handleNewRound);
socket.on("room-not-found", () => alert("Room not found"));
socket.on("set-player-as-current-chooser", handleSetPlayerAsCurrentChooser);
socket.on("sucessfully-joined-room", handleSuccessfullyJoinedRoom);
socket.on("update-hand", handleUpdateHand);
socket.on("update-message", handleUpdateMessage);
socket.on("update-player-selected-cards", handlePlayerSelectedCards);
socket.on("update-players", handleUpdatePlayers);
socket.on(
  "waiting-for-player-to-start-game",
  handleWaitingForPlayerToStartGame
);
socket.on("wait-for-more-players", handleWaitForMorePlayers);
