function handleEnablestartGameButton() {
  resetGlobalVariables();
  blackCard.style.display = "none";
  chosenCards.style.display = "none";
  waitingForMorePlayersText.style.display = "none";
  waitingForPlayerToStartGameText.style.display = "none";
  startGameButton.style.display = "block";
}
function handleSuccessfullyJoinedRoom({ roomId }) {
  joinDialog.style.display = "none";
  roomIdText.innerText = roomId;
}
function handleNewRound({ blackCard: blackCardData, remainingBlackCards }) {
  isCurrentChooser = false;
  currentBlackCard = blackCardData;
  selectedCards = [];
  cardsHaveBeenSubmitted = false;
  chosenCards.style.display = "none";
  startGameButton.style.display = "none";
  waitingForPlayerToStartGameText.style.display = "none";
  blackCard.style.display = "flex";
  blackCard.elevation = remainingBlackCards || 1;
  chooseCardText.style.display = "block";
  chooseCardAmount.innerText = blackCardData.pick;
  blackCard.innerText = blackCardData.text.replace(/_/g, "________");
}
function handleSetPlayerAsCurrentChooser() {
  submitCardsButton.style.display = "none";
  chooseCardText.style.display = "none";
  isCurrentChooser = true;
}
function handleUpdateHand({ hand }) {
  handContainer.innerHTML = "";
  drawPlayerHand(hand);
}
function handleUpdateMessage({ playerName, message }) {
  const container = document.createElement("div");
  const span = document.createElement("span");
  const b = document.createElement("b");
  b.innerText = `[ ${playerName} ]: `;
  span.innerText = message;
  container.appendChild(b);
  container.appendChild(span);
  chatMessagesContainer.appendChild(container);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}
function handleUpdatePlayers({ players }) {
  playersContainer.innerHTML = "";
  for (const key in players) {
    drawPlayerDetails(players[key]);
  }
}
function handlePlayerSelectedCards({ playerSelectedCards }) {
  chooseCardText.style.display = "none";
  chosenCards.style.display = "flex";
  drawPlayerSelectedCards(playerSelectedCards);
}
function handleWaitForMorePlayers() {
  resetGlobalVariables();
  blackCard.style.display = "none";
  chosenCards.style.display = "none";
  chooseCardText.style.display = "none";
  startGameButton.style.display = "none";
  waitingForMorePlayersText.style.display = "block";
  waitingForPlayerToStartGameText.style.display = "none";
}
function handleWaitingForPlayerToStartGame({ name }) {
  resetGlobalVariables();
  blackCard.style.display = "none";
  chosenCards.style.display = "none";
  chooseCardText.style.display = "none";
  startGameButton.style.display = "none";
  waitingForMorePlayersText.style.display = "none";
  waitingForPlayerNameText.innerText = name;
  waitingForPlayerToStartGameText.style.display = "block";
}
