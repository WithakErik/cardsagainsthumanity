const Player = require("./Player");
const cards = require("./cards.json");

class Game {
  constructor() {
    this.currentChooserSocketId;
    this.currentDeck;
    this.DECK = cards;
    this.players = {};
    this.currentBlackCard = {};
    this.currentSelectedWhiteCards = {};
    this.getCurrentSelectedWhiteCardsCound = () =>
      Object.keys(this.currentSelectedWhiteCards).length;
    this.getPlayerList = () => Object.keys(this.players);
    this.getPlayerCount = () => Object.keys(this.players).length;
    this.getRemainingCardCount = (color) => this.currentDeck[color].length;
  }
  addCurrentSelectedWhiteCards({ socketId, cards }) {
    this.currentSelectedWhiteCards[socketId] = { cards };
  }
  addPlayer({ socket, name }) {
    this.players[socket.id] = new Player({ name, socket });
  }
  clearCurrentSelectedWhiteCards() {
    this.currentSelectedWhiteCards = {};
  }
  clearPlayerSelectedCardsFromHand() {
    for (let socketId of Object.keys(this.players)) {
      if (socketId === this.currentChooserSocketId) continue;
      const cards = this.currentSelectedWhiteCards[socketId].cards;
      this.players[socketId].deleteCardsFromHand(cards);
    }
  }
  clearPlayerScores() {
    for (let socketId of Object.keys(this.players)) {
      this.players[socketId].clearScore();
    }
  }
  dealNewCards() {
    for (const socketId of Object.keys(this.players)) {
      const currentPlayer = this.players[socketId];
      const cardsNeeded = 7 - currentPlayer.hand.length;
      for (let count = 0; count < cardsNeeded; count++) {
        currentPlayer.addCardToHand(this.getRandomCard("white"));
      }
      this.players[socketId].socket.emit("update-hand", {
        hand: currentPlayer.hand,
      });
    }
  }
  deletePlayer(socketId) {
    delete this.players[socketId];
  }
  determineWinners() {
    const winners = Object.keys(this.players).reduce((best, socketId) => {
      const player = this.players[socketId];
      if ((best.length && player.score > best[0].score) || !best.length)
        best = [player];
      else if (player.score === best[0].score) best.push(player);
      return best;
    }, []);
    winners.map((player) => player.addPointToWins());
  }
  getPublicPlayerData() {
    const publicPlayerData = [];
    for (const socketId of Object.keys(this.players)) {
      publicPlayerData.push(
        this.players[socketId].getPublicData(this.currentChooserSocketId)
      );
    }
    return publicPlayerData;
  }
  getRandomCard(color) {
    const remainingCards = this.getRemainingCardCount(color);
    if (remainingCards === 0) {
      return;
    }
    const randomCardIndex = Math.floor(Math.random() * remainingCards);
    return this.currentDeck[color].splice(randomCardIndex, 1)[0];
  }
  startNewRound({ isFirstRound }) {
    this.setNewBlackCard();
    this.dealNewCards();
    !isFirstRound && this.setNextChooserSocketId();
    this.currentSelectedWhiteCards = {};
  }
  resetDeck() {
    this.currentDeck = JSON.parse(JSON.stringify(this.DECK));
  }
  resetPlayerHands() {
    for (let socketId of Object.keys(this.players)) {
      this.players[socketId].resetHand();
    }
  }
  setCurrentChooserSocketId(socketId) {
    this.currentChooserSocketId = socketId;
  }
  setNewBlackCard() {
    this.currentBlackCard = this.getRandomCard("black");
  }
  setNextChooserSocketId() {
    const playerSocketIds = Object.keys(this.players);
    const currentChooserIndex = playerSocketIds.indexOf(
      this.currentChooserSocketId
    );
    this.setCurrentChooserSocketId(
      playerSocketIds[
        ((currentChooserIndex >= 0 ? currentChooserIndex : 0) + 1) %
          playerSocketIds.length
      ]
    );
  }
}

module.exports = Game;
