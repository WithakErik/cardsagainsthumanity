const blackCard = document.getElementById("black-card"),
  chosenCards = document.getElementById("chosen-cards"),
  chooseCardAmount = document.getElementById("choose-card-amount"),
  chooseCardText = document.getElementById("choose-card-text"),
  createRoomButton = document.getElementById("create-room-button"),
  handContainer = document.getElementById("hand-container"),
  joinDialog = document.getElementById("join-dialog"),
  joinRoomButton = document.getElementById("join-room-button"),
  message = document.getElementById("message"),
  name = document.getElementById("name"),
  output = document.getElementById("output"),
  playersContainer = document.getElementById("players-container"),
  roomIdInput = document.getElementById("room-id-input"),
  roomIdText = document.getElementById("room-id-text"),
  sendMessageButton = document.getElementById("send-message-button"),
  startGameButton = document.getElementById("start-game-button"),
  waitingForMorePlayersText = document.getElementById(
    "waiting-for-more-players"
  ),
  waitingForPlayerNameText = document.getElementById("waiting-for-player-name"),
  waitingForPlayerToStartGameText = document.getElementById(
    "waiting-for-player-to-start-game"
  );

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
