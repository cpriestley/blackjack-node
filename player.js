class Player {
    cards = [];
    isBusted = false;
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

    takeCard(card, playerNum = 0) {
        const receiver = playerNum !== 0 ? `Player ${playerNum}` : `The dealer`;
        let cardDisplay;
        if (this.isDealer && this.cards.length === 1)
            cardDisplay = JSON.stringify({suite: '---', face: '---'});
        else
            cardDisplay = JSON.stringify(card);
        console.log(`--- ${receiver} ${this.isDealer ? 'draws' : 'is dealt'} ${cardDisplay}`)
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

    won() {
        return this.won;
    }
}

module.exports = {Player: Player}