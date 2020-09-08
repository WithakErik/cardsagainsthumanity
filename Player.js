class Player {
  constructor({ name, socket }) {
    this.score = 0;
    this.wins = 0;
    this.name = name;
    this.hand = [];
    this.getPublicData = () => ({
      name: this.name,
      score: this.score,
      wins: this.wins,
    });
    this.socket = socket;
  }
  addCardToHand(card) {
    this.hand.push(card);
  }
  deleteCardFromHand(card) {
    this.hand = this.hand.filter((c) => c.text !== card.text);
  }
}

module.exports = Player;
