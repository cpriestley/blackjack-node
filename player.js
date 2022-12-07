class Player {
    cards = [];
    isBusted = false;
    score = 0;
    money;
    currentBet;
    isDealer;

    constructor(isDealer = false) {
        this.isDealer = isDealer;
    }

    placeBet(bet) {
        this.currentBet = bet;
    }

    takeCard(card, playerNum = 0) {
        const receiver = playerNum !== 0 ? `Player ${playerNum}` : `The dealer`;
        let cardDisplay;
        if (this.isDealer && this.cards.length === 1)
            cardDisplay = JSON.stringify({suite: '---', face: '---'});
        else
            cardDisplay = JSON.stringify(card);
        console.log(`--- ${receiver} is dealt ${cardDisplay}`)
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
}

module.exports = {Player: Player}