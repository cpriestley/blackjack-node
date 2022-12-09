class Player {
    cards = [];
    isBusted = false;
    hasBlackJack = false;
    isWinner = false;
    score = 0;
    money;
    currentBet = 0;
    isDealer;

    constructor(isDealer = false, money = 1000) {
        this.isDealer = isDealer;
        this.money = money;
    }

    placeBet(bet) {
        this.currentBet = bet;
    }

    takeCard(card) {
        this.cards.push(card);
    }

    hand() {
        return this.cards;
    }

    updateScore(score) {
        this.score = score;
    }

    goesBust() {
        this.isBusted = true;
    }

    updateBlackjack() {
        this.hasBlackJack = true;
    }

    handHasBlackjack() {
        return this.hasBlackJack;
    }

    hasHigh() {
        this.isWinner = true;
    }
}

const Chips = Object.freeze({
    White: 1,
    Red: 5,
    Orange: 10,
    Yellow: 20,
    Green: 25,
    Black: 100,
    Purple: 500,
    Maroon: 1000
});

module.exports = {Player: Player, Chips: Chips}