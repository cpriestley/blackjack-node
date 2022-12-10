class Suite {
    static Heart = new Suite(0x2665);
    static Diamond = new Suite(0x2666);
    static Club = new Suite(0x2663);
    static Spade = new Suite(0x2660);

    constructor(value) {
        this.value = String.fromCharCode(value);
    }
}

class Face {
    // Create new instances of the same class as static attributes
    static 2 = new Face('2',2);
    static 3 = new Face('3',3);
    static 4 = new Face('4', 4);
    static 5 = new Face('5', 5);
    static 6 = new Face('6', 6);
    static 7 = new Face('7', 7);
    static 8 = new Face('8', 8);
    static 9 = new Face('9', 9);
    static 10 = new Face('10',10);
    static J = new Face('J',10);
    static Q = new Face('Q', 10);
    static K = new Face('K', 10)
    static A = new Face('A', 11);

    constructor(faceString, value) {
        this.faceString = faceString;
        this.value = value
    }
}

class Card {
    constructor(suite, face) {
        this.suite = suite;
        this.face = face;
    }

    drawHidden() {
        return '+-----+\n' +
        '|░░░░░|\n' +
        '|░░░░░|\n' +
        '|░░░░░|\n' +
        '+-----+';
    }

    draw(hidden = false) {
        if (hidden) { return this.drawHidden(); }
        let f = this.face
        let s = this.suite;
        let template = '+-----+\n' +
            '|TT   |\n' +
            '|  X  |\n' +
            '|   BB|\n' +
            '+-----+';

        return template
            .replace('TT', f.faceString.padEnd(2))
            .replace('BB', f.faceString.padStart(2))
            .replace('X', s.value);
    }
}

class Deck {
    cards = []
    constructor(numberOfDecks) {
        let i = 0;
        while (i < numberOfDecks) {
            for (const [, suite] of Object.entries(Suite)) {
                for (const [, face] of Object.entries(Face)) {
                    this.cards.push(Object.freeze(
                        new Card(suite, face)
                    ));
                }
            }
            i++;
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