class Player {
  constructor({ name }) {
    this.score = 0;
    this.wins = 0;
    this.name = name;
    this.hand = [];
  }
  addCardToHand(card) {
    this.hand.push(card);
  }
  deleteCardFromHand(card) {
    this.hand = this.hand.filter((c) => c.text !== card.text);
  }
}

module.exports = Player;
