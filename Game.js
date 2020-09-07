const Player = require("./Player");
const cards = require("./cards.json");

class Game {
  constructor() {
    this.currentChooserSocketId;
    this.currentDeck;
    this.DECK = cards;
    this.players = {};
    this.currentBlackCard = {};
    this.currentWhiteCards = [];
    this.getPlayerList = () => Object.keys(this.players);
    this.getPlayerCount = () => Object.keys(this.players).length;
    this.getRemainingCardCount = () => this.currentDeck[color].length;
  }
  addPlayer({ id, name }) {
    this.players[id] = new Player({ name });
  }
  deletePlayer(socketId) {
    delete this.players[socketId];
    console.dir(this.players);
  }
  getRandomCard(color) {
    const remainingCards = this.getRemainingCardCount(color);
    if (remainingCards === 0) {
      return;
    }
    const randomCardIndex = Math.floor(Math.random() * remainingCards);
    return this.currentDeck[color].splice(randomCardIndex, 1);
  }
  dealNewCards() {
    console.log()
    for (const socketId of this.playerList()) {
      const cardsNeeded = 7 - this.player[socketId].hand.length;
      for (let count = 0; count <= cardsNeeded; count++) {
        this.players[socketId].addCardToHand(this.getRandomCard("white"));
        connections[socketId].emit("update-hand", this.players[socketId].hand);
      }
    }
  }
  resetDeck() {
    this.currentDeck = JSON.parse(JSON.stringify(this.DECK));
  }
  setCurrentChooserSocketId(socketId) {
    this.currentChooserSocketId = socketId;
  }
  setNextChooserSocketId() {
    const currentChooserIndex = this.getPlayerList().indexOf(
      this.currentChooserSocketId
    );
    this.setCurrentChooserSocketId(
      this.getPlayerList()[
        (currentChooserIndex + 1) % this.getPlayerList().length
      ]
    );
  }
}

module.exports = Game;
