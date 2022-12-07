const {Deck} = require("./card");
const {Player} = require("./player");
const {Face} = require("./card");

function main() {
    console.log('Running blackjack-node\n')
    let game = new BlackJack();
    game.initialize();
    game.startGame();
}

const DEALER = 0;
const BLACK_JACK = 21;

class BlackJack {
    gameOver = false;
    players = [];
    deck;

    initialize() {
        console.log('Initializing...');
        console.log('--- Adding the Dealer...');
        this.players.push(new Player(true));
        this.addPlayers();
        console.log('');
    }

	startGame() {
        while(!this.gameOver) {
			this.playRound();
            this.gameOver = true;
		}
	}

    addPlayers(num = 6) {
        for (let i = 0; i < num; i++) {
            console.log(`--- Adding Player ${i + 1}`);
            this.players.push(new Player());
        }
    }

    playRound() {
        console.log('Starting a new round...');
        console.log('--- Dealer gets a new deck of cards...');
        this.deck = new Deck();
        console.log(`--- There are ${this.deck.cards.length} cards in the deck to start`);
        console.log('--- Dealer shuffles the deck...\n');
        this.deck.shuffle();

        this.placeBets();
        this.naturals(); // the first 2 cards
        this.thePlay();
        this.theDealersPlay();
        this.calculateWinnings();
	}

    placeBets() {
        console.log('Players are placing bets...')
        for (let i = 1; i < this.players.length; i++) {
            let bet = getRandomBet();
            console.log(`--- Player ${i} wagers $${bet}`)
            this.players[i].placeBet(bet)
        }
        console.log('');
    }

    naturals() {
        this.dealCards()
        this.dealCards();
        this.evaluatePlayerHands();
        // Show Naturals
        this.players
            .filter(player => player.score === BLACK_JACK)
            .map(player => {
                return {Dealer: player.isDealer,
                        Index: this.players.indexOf(player),
                        Hand: player.hand()};
            })
            .forEach(natural => {
                const {Dealer, Index, Hand} = natural;
                console.log(`${Dealer ? 'Dealer': 'Player ' + Index} Natural: ${JSON.stringify(Hand)}`)
            });
            // If a player has a natural and the dealer does not
            // then player wins 1.5x's their bet
    }

    thePlay() {
        console.log('The Play...');
        for (let i = 1; i < this.players.length; i++) {
            let player = this.players[i];
            while(player.score < 16) {
                process.stdout.write(`--- Player ${i} says 'Hit':  `);
                this.dealCard(player, i);
            }
            console.log(`--- Player ${i} says 'Hold'`);
        }
        console.log('');
        this.evaluatePlayerHands();
    }

    theDealersPlay() {
        let dealer = this.players[DEALER];
        console.log(`The Dealer's Play...`);
        this.revealDealerHidden(dealer);
        while(dealer.score < 16) {
            this.dealCard(dealer);
        }
        console.log('');
        this.evaluateDealerHand();
    }

    revealDealerHidden(dealer) {
        let cardDisplay = JSON.stringify(dealer.hand()[1]);
        console.log(`--- Dealer reveals ${cardDisplay}`);
    }

    dealCards() {
        console.log('Dealer is dealing cards...')
        for (let i = 0; i < this.players.length; i++) {
            this.dealCard(this.players[i], i);
        }
        console.log(`There are ${this.deck.cards.length} cards remaining in the deck\n`);
    }

    evaluatePlayerHands() {
        console.log('Evaluating each hand...')
        for (let i = 1; i < this.players.length; i++) {
            let player = this.players[i];
            let hand = player.hand();
            let receiver = i !== DEALER ? `Player ${i}` : `Dealer`;
            let scoreDisplay = this.getDisplayScore(player);
            console.log(`--- ${receiver}'s hand ${JSON.stringify(hand)}: ${scoreDisplay}`);
        }
        console.log(``);
    }

    evaluateDealerHand() {
        console.log('Evaluating dealer hand...')
        let dealer = this.players[DEALER];
        let hand = dealer.hand();
        let scoreDisplay = this.getDisplayScore(dealer);
        console.log(`--- Dealer's hand is ${JSON.stringify(hand)}: ${scoreDisplay}\n`);
    }

    getDisplayScore(player) {
        switch (true) {
            case player.score === BLACK_JACK:
                return 'BLACKJACK!';
            case player.score >= BLACK_JACK:
                return 'BUST';
            default:
                return player.score;
        }
    }

    dealCard(player, playerNum= DEALER) {
        let dealtCard = this.deck.cards[0];
        let receiver = playerNum !== DEALER ? `Player ${playerNum}` : `Dealer`;
        player.takeCard(dealtCard, playerNum);
        this.deck.cards.shift();
        player.updateScore(this.getScore(player.hand()));
        if (player.score > BLACK_JACK) {
            player.goesBust();
            console.log(`    ! ${receiver} goes BUST`);
        }
    }

    calculateWinnings() {
        console.log(`Totaling player winnings and losses`);
        this.players
            .filter(player => !player.isDealer)
            .forEach((player, index) => {
                switch (true) {
                    case player.isWinner:
                        console.log(`Player ${index + 1} wins $${player.currentBet.toFixed(2)}`);
                        break;
                    case player.isBusted:
                    default:
                        console.log(`Player ${index + 1} loses $${player.currentBet.toFixed(2)}`);
                }
        })
    }

    getScore(hand) {
        let score = 0;
        for (let i = 0; i < hand.length; i++) {
            let face = hand[i].face;
            score += Face[face].value;
        }
        return score;
    }

}

//Helper Functions
function getRandomBet() {
    const keys = Object.keys(Chips);
    let key = keys[Math.floor(Math.random() * keys.length)];
    return Chips[key];
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

main();




