class Player {
  constructor({ name, socket }) {
    this.score = 0;
    this.wins = 0;
    this.name = name;
    this.hand = [];
    this.getPublicData = (currentChooserSocketId) => ({
      name: this.name,
      score: this.score,
      wins: this.wins,
      isCurrentChooser: currentChooserSocketId === this.socket.id,
    });
    this.socket = socket;
  }
  addCardToHand(card) {
    this.hand.push(card);
  }
  addPointToWins() {
    this.wins++;
  }
  addPointToScore() {
    this.score++;
  }
  clearScore() {
    this.score = 0;
  }
  deleteCardsFromHand(cards) {
    for (let card of cards) {
      this.hand = this.hand.filter((c) => c !== card);
    }
  }
  resetHand() {
    this.hand = [];
  }
}

module.exports = Player;
