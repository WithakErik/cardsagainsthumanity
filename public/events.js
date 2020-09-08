const socket = io.connect("http://localhost:4000");

let currentBlackCard,
  isCurrentChooser = false,
  selectedCards = [];

socket.on("enable-start-game-button", handleEnableStartGameButton);
socket.on("room-not-found", () => {
  alert("Room not found");
});
socket.on("sucessfully-joined-room", handleSuccessfullyJoinedRoom);
socket.on("update-hand", handleUpdateHand);
socket.on("new-round", handleNewRound);
socket.on("set-player-as-current-chooser", handleSetPlayerAsCurrentChooser);
socket.on("update-message", handleUpdateMessage);
socket.on("update-players", handleUpdatePlayers);
socket.on(
  "waiting-for-player-to-start-game",
  handleWaitingForPlayerToStartGame
);
socket.on("wait-for-more-players", handleWaitForMorePlayers);

//////////////////////////////////////////////////////////
function handleEnableStartGameButton() {
  waitingForMorePlayersText.style.display = "none";
  waitingForPlayerToStartGameText.style.display = "none";
  startGameButton.style.display = "block";
}
function handleSuccessfullyJoinedRoom({ roomId }) {
  joinDialog.style.display = "none";
  roomIdText.innerText = roomId;
}
function handleNewRound({ blackCard: blackCardData }) {
  isCurrentChooser = false;
  currentBlackCard = blackCardData;
  selectedCards = [];
  startGameButton.style.display = "none";
  waitingForPlayerToStartGameText.style.display = "none";
  blackCard.innerText = blackCardData.text.replace("_", "________");
  blackCard.style.display = "flex";
  chooseCardAmount.innerText = blackCardData.pick;
  chooseCardText.style.display = "block";
}
function handleSetPlayerAsCurrentChooser() {
  console.log("setting current user");
  isCurrentChooser = true;
}
function handleUpdateHand({ hand }) {
  handContainer.innerHtml = "";
  for (let card of hand) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = card;
    div.addEventListener("click", function () {
      if (isCurrentChooser) return;
      if (this.className.includes("selected-card")) {
        this.className = this.className.replace(" selected-card", "");
        selectedCards = selectedCards.filter(
          (current) => current.text !== card
        );
        return;
      }
      if (selectedCards.length >= currentBlackCard.pick) return;
      selectedCards.push({ element: this, text: card });
      this.className += " selected-card";
    });
    handContainer.appendChild(div);
  }
  for (let count = 0; count < hand.length; count++) {
    const div = document.createElement("div");
    div.className = "card-spacer";
    handContainer.appendChild(div);
  }
}

function handleUpdateMessage({ handle, message }) {
  console.log(`[ Data ]:`);
  const div = document.createElement("div");
  div.innerText = `[ ${handle} ]: ${message}`;
  output.appendChild(div);
}
function handleUpdatePlayers({ players }) {
  console.log(`[ Updating players ]`);
  console.dir(players);
  playersContainer.innerHTML = "";
  for (const key in players) {
    drawPlayerDetails(players[key]);
  }
}
function handleWaitForMorePlayers() {
  console.log("WAIT FOR MORE PLAYERS");
  startGameButton.style.display = "none";
  waitingForPlayerToStartGameText.style.display = "none";
  waitingForMorePlayersText.style.display = "block";
}
function handleWaitingForPlayerToStartGame({ name }) {
  waitingForMorePlayersText.style.display = "none";
  startGameButton.style.display = "none";
  waitingForPlayerToStartGameText.style.display = "block";
  waitingForPlayerNameText.innerText = name;
}

///////////////////////////////////////////

function drawPlayerDetails(player) {
  const container = document.createElement("div");
  container.className = "player-details";
  const scoreContainer = document.createElement("div");
  const winsContainer = document.createElement("div");
  const scoreLabel = document.createElement("div");
  const winsLabel = document.createElement("div");
  const name = document.createElement("b");
  const score = document.createElement("b");
  const wins = document.createElement("b");
  name.innerText = player.name;
  scoreLabel.innerText = "Score:";
  winsLabel.innerText = "Wins:";
  score.innerText = player.score;
  wins.innerText = player.wins;

  scoreContainer.appendChild(scoreLabel);
  scoreContainer.appendChild(score);
  winsContainer.appendChild(winsLabel);
  winsContainer.appendChild(wins);

  container.appendChild(name);
  container.appendChild(scoreContainer);
  container.appendChild(winsContainer);
  playersContainer.appendChild(container);
}
