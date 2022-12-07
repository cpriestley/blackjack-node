const {Deck} = require("./card");
const {Player} = require("./player");
const {Face} = require("./card");

function main() {
    console.log('Running blackjack-node\n')
    let game = new BlackJack();
    game.initialize();
    game.startGame();
}

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
        /*this.evaluateDealerHand();
        this.revealDealerHidden();
        this.scorePlayerHands();
        this.calculateWinnings();*/
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

    evaluateDealerHand() {
        let dealer = this.players[0];
        let hand = dealer.hand();
        let score = Face[hand[0].face].value + Face[hand[1].face].value;
        console.log(`Dealer's hand is ${JSON.stringify(hand)}: ${score}`);
        if (score == BLACK_JACK)
            console.log(`Blackjack for the dealer!`);
        else if (score < 17)
            while(score < 17) {
                let i = 2;
                console.log(`Dealer is drawing another card`);
                this.dealCard(dealer);
                score += Face[hand[i].face].value
            }
        else
            console.log(`The Dealer's hand stands`);
    }

    dealCards() {
        console.log('Dealer is dealing cards...')
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            //TODO: Evaluate if this is redundant
            // if (!player.isBusted)
                this.dealCard(player, i);
        }
        console.log(`There are ${this.deck.cards.length} cards remaining in the deck\n`);
    }

    evaluatePlayerHands() {
        console.log('Evaluating each hand...')
        for (let i = 1; i < this.players.length; i++) {
            let player = this.players[i];
            let hand = player.hand();
            let receiver = i !== 0 ? `Player ${i}` : `Dealer`;
            let scoreDisplay;
            switch (true) {
                case player.score === BLACK_JACK:
                    scoreDisplay = 'Blackjack!'; break;
                case player.score >= BLACK_JACK:
                    scoreDisplay = 'BUST';
                default:
                    scoreDisplay = player.score;
            }
            console.log(`--- ${receiver}'s hand ${JSON.stringify(hand)}: ${scoreDisplay}`);
        }
        console.log(``);
    }

    dealCard(player, playerNum= 0) {
        let dealtCard = this.deck.cards[0];
        let receiver = playerNum !== 0 ? `Player ${playerNum}` : `himself`;
        // let handHolder = playerNum !== 0 ? `${receiver}` : `Dealer`;
        player.takeCard(dealtCard, playerNum);
        this.deck.cards.shift();
        player.updateScore(this.getScore(player.hand()));
        if (player.score > BLACK_JACK) {
            player.goesBust();
            console.log(`    ! ${receiver} goes BUST`);
        }
        // console.log(`${handHolder} now has ${JSON.stringify(player.hand())} cards`);
    }


    revealDealerHidden() {
        console.log(`Revealing Dealer's hidden card`)
    }

    calculateWinnings() {
        console.log(`Totaling players wins or losses`)
    }

    addPlayers(num = 6) {
        for (let i = 0; i < num; i++) {
            console.log(`--- Adding Player ${i + 1}`);
            this.players.push(new Player());
        }
    }

    getScore(hand) {
        let score = 0;
        for (let i = 0; i < hand.length; i++) {
            let face = hand[i].face;
            score += Face[face].value;
        }
        return score;
    }


    theDealersPlay() {
        let dealer = this.players[0];
        console.log(`The Dealer's Play...`);
        let cardDisplay = JSON.stringify(dealer.hand()[1]);
        console.log(`--- Dealer reveals ${cardDisplay}`);
        console.log(`--- Dealer's hand ${JSON.stringify(dealer.hand())}`)
        while(dealer.score < 17) {
            this.dealCard(dealer);
        }

    }
}

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




