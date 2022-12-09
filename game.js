const {Deck} = require("./card");
const {Player, Chips} = require("./player");
const TIMEOUT = 1000;

function main() {
    console.log('Running blackjack-node\n')
    let game = new BlackJack();
    game.initialize();
    game.startGame();
}

const DEALER = 0;
const NUMBER_OF_DECKS = 2;
const BLACK_JACK = 21;
let isBlackjackOnTable = false;

class BlackJack {
    gameOver = false;
    players = [];
    deck;

    initialize() {
        let title =
            '==============================================\n' +
            '+-----+  +-----+              +-----+  +-----+\n' +
            '|A    |  |10   |              |10   |  |A    |\n' +
            '|  ♦  |  |  ♠  |  BLACK JACK  |  ♠  |  |  ♣  |\n' +
            '|    A|  |   10|              |   10|  |    A|\n' +
            '+-----+  +-----+              +-----+  +-----+\n' +
            '==============================================';
        console.log(`${title}\n`); sleep(TIMEOUT)
        console.log('Initializing...'); sleep(TIMEOUT)
        console.log('--- Adding the Dealer...'); sleep(TIMEOUT)
        this.players.push(new Player(true));
        this.addPlayers();
        console.log('');
    }

	startGame() {
        while(!this.gameOver) {
			this.playRound();
            this.gameOver = false;
		}
	}

    addPlayers(num = 6) {
        for (let i = 0; i < num; i++) {
            console.log(`--- Adding Player ${i + 1}`); sleep(TIMEOUT);
            this.players.push(new Player());
        }
    }

    playRound() {
        console.log('Starting a new round...'); sleep(TIMEOUT);
        console.log('--- Dealer gets a new deck of cards...'); sleep(TIMEOUT);
        this.deck = new Deck(NUMBER_OF_DECKS);
        console.log(`--- There are ${this.deck.cards.length} cards in the deck to start`); sleep(TIMEOUT);
        console.log('--- Dealer shuffles the deck...\n');sleep(TIMEOUT);
        this.deck.shuffle();

        this.placeBets(); sleep(TIMEOUT);
        this.naturals(); sleep(TIMEOUT);// the first 2 cards
        this.thePlay();sleep(TIMEOUT);// the first 2 cards
        this.theDealersPlay(); sleep(TIMEOUT);// the first 2 cards
        this.checkForWinner(); sleep(TIMEOUT);// the first 2 cards
        this.calculateWinnings(); sleep(TIMEOUT);// the first 2 cards
        console.log('\n--------------------------------------------------------------\n');
    }

    placeBets() {
        console.log('Players are placing bets...')
        for (let i = 1; i < this.players.length; i++) {
            let bet = getRandomBet(); sleep(TIMEOUT);
            console.log(`--- Player ${i} wagers $${bet}`)
            this.players[i].placeBet(bet)
        }
        console.log('');
    }

    naturals() {
        this.dealCards()
        this.dealCards();
        this.evaluatePlayerHands();
        console.log('Checking player hands for naturals...');
        // Show Naturals
        let playersWith21 = this.players
            .filter(player => player.handHasBlackjack());

        playersWith21
            .forEach(player => {
                let i = this.players.indexOf(player);
                console.log(`--- ${player.isDealer ? 'Dealer': 'Player ' + i}:`);
                this.drawCard(player.hand());
            });

        playersWith21.forEach(player => player.hasHigh());

        isBlackjackOnTable =  playersWith21.length > 0;

        // If a player has a natural and the dealer does not
        // then player wins 1.5x's their bet
        console.log('');
    }

    checkForWinner() {
        let dealer = this.players[DEALER];
        let dealerScoreDisplay;
        console.log(`Checking for winners...`);
        if (dealer.hasBlackJack)
            dealerScoreDisplay = 'BLACKJACK';
        else if (dealer.isBusted)
            dealerScoreDisplay = 'BUST'
        else
            dealerScoreDisplay = dealer.score
        console.log(`--- Dealer's hand is ${dealerScoreDisplay}`);
        let highestHand;
        if (isBlackjackOnTable) {
            highestHand = BLACK_JACK;
        } else {
         highestHand = this.players
            .filter(player => !player.isBusted && !player.isDealer)
            .reduce((accumulator, player) => {
                return accumulator > player.score ? accumulator : player.score
            });
        }
        console.log(`--- Highest valid hand is ${highestHand === BLACK_JACK ? 'BLACKJACK' : highestHand}`);

        this.players
            .filter(player => !player.isDealer && player.score === highestHand)
            .forEach(player => {
                if ((player.score > dealer.score && !dealer.isBusted) || (dealer.isBusted))
                    player.hasHigh()
            })

        console.log('');
    }

    thePlay() {
        console.log('The Play...');
        this.players
            .filter(player => !player.isDealer)
            .forEach((player) => {
                simulateHits(player, this.players.indexOf(player), this);
            });
        this.evaluatePlayerHands();
    }

    theDealersPlay() {
        let dealer = this.players[DEALER];
        console.log(`The Dealer's Play...`);
        this.revealDealerHidden(dealer);
        while(dealer.score < 16) {
            this.dealCard(dealer);
        }
        this.evaluateDealerHand();
    }

    revealDealerHidden(dealer) {
        //let cardDisplay = JSON.stringify(dealer.hand()[1]);
        console.log(`--- Dealer reveals hidden card...`);
        this.drawCard(dealer.hand());
        console.log('');
    }

    dealCards() {
        console.log('Dealer is dealing cards...'); sleep(TIMEOUT);
        for (let i = 1; i < this.players.length; i++) {
            this.dealCard(this.players[i], i);
        }
        this.dealCard(this.players[DEALER]);
    }

    evaluatePlayerHands() {
        console.log('Evaluating each hand...')
        for (let i = 1; i < this.players.length; i++) {
            let player = this.players[i];
            let hand = player.hand();
            let receiver = i !== DEALER ? `Player ${i}` : `Dealer`;
            if (player.score === BLACK_JACK)
                player.updateBlackjack()
            console.log(`--- ${receiver}'s hand...`);
            this.drawCard(hand); sleep(TIMEOUT);
            console.log('');
        }
    }

    evaluateDealerHand() {
        console.log('Evaluating dealer hand...')
        let dealer = this.players[DEALER];
        let scoreDisplay = this.getDisplayScore(dealer);
        if (dealer.score === BLACK_JACK)
            dealer.updateBlackjack();
        console.log(`--- Dealer's hand: ${scoreDisplay}`);
        this.drawCard(dealer.hand()); sleep(TIMEOUT);
        console.log('');
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
        player.takeCard(dealtCard);
        process.stdout.write(`--- ${receiver} ${player.isDealer ? 'draws' : 'is dealt'}...\n`);
        this.drawCard(
            [player.hand()[player.hand().length - 1]],
            playerNum === DEALER && player.hand().length === 2
        );
        sleep(TIMEOUT);
        this.deck.cards.shift();
        player.updateScore(this.getScore(player.hand()));
        if (player.score > BLACK_JACK) {
            player.goesBust();
            console.log(`--- ${receiver} goes BUST`);
            console.log('');
            sleep(TIMEOUT);
        } else if (player.score === BLACK_JACK) {
            player.handHasBlackjack();
            isBlackjackOnTable = true;
            console.log(`--- ${receiver} has BLACKJACK`);
            console.log('');
            sleep(TIMEOUT);
        }
    }

    calculateWinnings() {
        console.log(`Totaling player winnings and losses`);
        this.players
            .filter(player => !player.isDealer)
            .forEach((player, index) => {
                switch (true) {
                    case player.isWinner:
                        console.log(`Player ${index + 1} wins $${(player.currentBet * 1.5).toFixed(2)}`);
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
            score += face.value;
        }
        return score;
    }

    drawCard(hand, hidden= false) {
        this.buffer = [];
        let s = '';
        for (let i = 0; i < hand.length; i++) {
            this.buffer.push( hand[i].draw(hidden).split('\n'));
        }

        for (let c = 0; c < this.buffer[0].length; c++) {
            for (let r = 0; r < this.buffer.length; r++) {
                s += this.buffer[r][c].padEnd(9);
            }
            s += c < this.buffer[0].length - 1 ? '\n' : '';
        }

        console.log(s);
    }

}

//Helper Functions
function getRandomBet() {
    const keys = Object.keys(Chips);
    let key = keys[Math.floor(Math.random() * keys.length)];
    return Chips[key];
}

function simulateHits(player, i, game) {
    while((player.score < 16 && !player.handHasBlackjack() || isBlackjackOnTable) && !player.isBusted) {
        process.stdout.write(`--- Player ${i} says 'Hit':  `); sleep(TIMEOUT)
        game.dealCard(player, i);
    }
    if (!player.isBusted) {
        console.log(`--- Player ${i} says 'Hold'`); sleep(TIMEOUT);
        console.log('');
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

main();




