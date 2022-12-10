#! /usr/bin/env node
const { program } = require('commander');
const { game } = require('./blackjack/game');

program
    .name("blackjack")
    .description("simulates a casino banking game of Blackjack")
    .action(game)