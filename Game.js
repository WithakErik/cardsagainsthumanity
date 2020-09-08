const Player = require("./Player");
const cards = require("./cards.json");

class Game {
  constructor() {
    this.currentChooserSocketId;
    this.currentDeck;
    this.DECK = cards;
    this.players = {};
    this.currentBlackCard = {};
    // currentSelectedWhiteCards will be an array of objects
    // Should handle for multiple cards (up to 3)
    // {
    //   socketId: string,
    //   cards: [
    //     {
    //       text: string
    //     },
    //     {
    //       text: string
    //     }
    //   ]
    // }
    // This variable will be sent to everyone in the room with 'update-selected-cards'
    this.currentSelectedWhiteCards = [];
    this.getPlayerList = () => Object.keys(this.players);
    this.getPlayerCount = () => Object.keys(this.players).length;
    this.getRemainingCardCount = (color) => this.currentDeck[color].length;
  }
  addPlayer({ socket, name }) {
    this.players[socket.id] = new Player({ name, socket });
  }
  deletePlayer(socketId) {
    delete this.players[socketId];
    console.dir(this.players);
  }
  getPublicPlayerData() {
    const publicPlayerData = [];
    for (const socketId of this.getPlayerList()) {
      publicPlayerData.push(this.players[socketId].getPublicData());
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
  dealNewCards() {
    for (const socketId of this.getPlayerList()) {
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
  startNewRound() {
    this.setNewBlackCard();
    this.dealNewCards();
  }
  resetDeck() {
    this.currentDeck = JSON.parse(JSON.stringify(this.DECK));
  }
  setNewBlackCard() {
    this.currentBlackCard = this.getRandomCard("black");
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
