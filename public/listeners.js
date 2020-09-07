const createRoomButton = document.getElementById("create-room-button"),
  handle = document.getElementById("handle"),
  joinDialog = document.getElementById("join-dialog"),
  joinRoomButton = document.getElementById("join-room-button"),
  message = document.getElementById("message"),
  name = document.getElementById("name"),
  hand = document.getElementById("hand"),
  output = document.getElementById("output"),
  playersContainer = document.getElementById("players-container"),
  roomIdText = document.getElementById("room-id-text"),
  roomIdInput = document.getElementById("room-id-input"),
  sendMessageButton = document.getElementById("send-message-button"),
  startGameButton = document.getElementById("start-game-button"),
  waitingForMorePlayersText = document.getElementById(
    "waiting-for-more-players"
  ),
  waitingForPlayerToStartGameText = document.getElementById(
    "waiting-for-player-to-start-game"
  ),
  waitingForPlayerNameText = document.getElementById("waiting-for-player-name");

createRoomButton.addEventListener("click", () => {
  if (!name.value) return alert("You must enter a name");
  socket.emit("create-room", { name: name.value });
});
joinRoomButton.addEventListener("click", () => {
  if (!roomIdInput.value) return alert("You must enter a room ID");
  if (!name.value) return alert("You must enter a name");
  socket.emit("join-room", { roomId: roomIdInput.value, name: name.value });
});
sendMessageButton.addEventListener("click", () =>
  socket.emit("message", { handle: handle.value, message: message.value })
);
startGameButton.addEventListener("click", () => {
  socket.emit("start-game");
});
