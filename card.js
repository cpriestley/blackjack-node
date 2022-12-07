// https://www.sohamkamani.com/javascript/enums/ 
// immutable enum
const Suites = Object.freeze({
	Heart: Symbol('heart'),
	Diamond: Symbol('diamond'),
	Club: Symbol('club'),
	Spade: Symbol('spade')
});


class Face {
    // Create new instances of the same class as static attributes
    static 2 = new Face(2);
    static 3 = new Face(3);
    static 4 = new Face(4);
    static 5 = new Face(5);
    static 6 = new Face(6);
    static 7 = new Face(7);
    static 8 = new Face(8);
    static 9 = new Face(9);
    static 10 = new Face(10);
    static J = new Face(10);
    static K = new Face(10);
    static Q = new Face(10);
    static A = new Face(11);

    constructor(value) {
        this.value = value
    }
}

class Card {
    suite;
    face;
    constructor(suite, face) {
        this.suite = suite;
        this.face = face;
    }
}

class Deck {
    cards = []
    constructor(){
        for (const [suite] of Object.entries(Suites)) {
            for (const [face] of Object.entries(Face)) {
                // console.log(`${suite}: ${value}`);
                // console.log(`${face}: ${value}`);
                //console.log(card);
                this.cards.push(Object.freeze(
                    new Card(`${suite}`,`${face}`)
                ));
                this.cards.push(Object.freeze(
                    new Card(`${suite}`,`${face}`)
                ));
            }
        }
    }
    shuffle() {
        let currentIndex = this.cards.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [this.cards[currentIndex], this.cards[randomIndex]] = [
                this.cards[randomIndex], this.cards[currentIndex]];
        }

        return this.cards;
    }
}   

module.exports = {
    Card: Card,
    Deck: Deck,
    Face: Face
};