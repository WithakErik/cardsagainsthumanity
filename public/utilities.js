function drawPlayerDetails(player) {
  const playerContainer = document.createElement("wired-card");
  playerContainer.className = "player-details";
  if (player.isCurrentChooser && currentBlackCard) {
    playerContainer.fill = "#8AD4ED";
  }
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
  playerContainer.appendChild(name);
  playerContainer.appendChild(scoreContainer);
  playerContainer.appendChild(winsContainer);
  playersContainer.appendChild(playerContainer);
}
function drawPlayerHand(hand) {
  for (let card of hand) {
    const cardElement = document.createElement("wired-card");
    cardElement.className = "card white-card";
    cardElement.fill = "white";
    cardElement.innerText = card;
    cardElement.addEventListener("click", function () {
      if (isCurrentChooser || cardsHaveBeenSubmitted || !currentBlackCard.text)
        return;
      if (this.className.includes("selected-card")) {
        this.className = this.className.replace(" selected-card", "");
        this.fill = "white";
        selectedCards = selectedCards.filter(
          (current) => current.text !== card
        );
        if (selectedCards.length < currentBlackCard.pick) {
          submitCardsButton.style.display = "none";
        }
        return;
      }
      if (selectedCards.length >= currentBlackCard.pick) return;
      selectedCards.push({ element: this, text: card });
      this.className += " selected-card";
      this.fill = "yellow";
      if (selectedCards.length === currentBlackCard.pick) {
        submitCardsButton.style.display = "block";
      }
    });
    handContainer.appendChild(cardElement);
  }
  for (let count = 0; count < hand.length; count++) {
    const cardSpacerElement = document.createElement("wired-card");
    cardSpacerElement.className = "card card-spacer";
    handContainer.appendChild(cardSpacerElement);
  }
}

function drawPlayerSelectedCards(playerSelectedCards) {
  chosenCards.innerHTML = "";
  for (let key in playerSelectedCards) {
    const playerSelectedPlayerContainer = document.createElement("div");
    playerSelectedPlayerContainer.className =
      "player-selected-player-container";
    const playerSelectedCardsContainer = document.createElement("div");
    playerSelectedCardsContainer.className = "player-selected-card-container";
    for (let card of playerSelectedCards[key].cards) {
      const playerSelectedCard = document.createElement("wired-card");
      playerSelectedCard.className = "card";
      playerSelectedCard.innerText = card;
      playerSelectedCardsContainer.appendChild(playerSelectedCard);
    }
    playerSelectedPlayerContainer.appendChild(playerSelectedCardsContainer);
    if (isCurrentChooser) {
      const winnerButton = document.createElement("wired-button");
      winnerButton.innerText = "Winner";
      winnerButton.addEventListener("click", () => {
        socket.emit("selected-winner", { socketId: key });
      });
      playerSelectedPlayerContainer.appendChild(winnerButton);
    }
    chosenCards.appendChild(playerSelectedPlayerContainer);
  }
}
function resetGlobalVariables() {
  cardsHaveBeenSubmitted = false;
  currentBlackCard = {};
  isCurrentChooser = false;
  selectedCards = [];
}
function sendMessage() {
  const text = message.value;
  message.value = "";
  socket.emit("message", {
    playerName: playerName,
    message: text,
  });
}
