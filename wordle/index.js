"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
// import { exit } from 'process';
function wordle() {
    var turn = 1;
    var nbLetter = 5;
    var nbTurns = 6;
    var secretWord = (0, lib_1.getRandomWord)();
    var guess = "";
    var guessUpper = "";
    var secretWordLetters = secretWord.split('');
    var guessLetters = [];
    var turnLeft = 0;
    var regex = /^[a-zA-Z]+$/;
    console.log(secretWord);
    var _loop_1 = function () {
        var hint = [];
        console.log(' \x1b[0m');
        turnLeft = nbTurns + 1 - turn;
        //console.log(secretWord);
        guess = (0, lib_1.getInput)("Make a guess for a word of 5 letters and in Uppercase ( " + turnLeft + " left(s) guess(es) )");
        guessUpper = guess.toUpperCase();
        guessLetters = guess.split('');
        if (guess.length === nbLetter && guess === guessUpper && regex.test(guess)) {
            if (secretWord === guess) {
                console.log("\x1b[102m" + " Congratulation you find the Secret word !!!! With " + turn + " turn(s)" + "\x1b[0m");
                return { value: void 0 };
            }
            guessLetters.forEach(function (letter) {
                if (secretWord.includes(letter)) {
                    if (guessLetters.indexOf(letter) === secretWordLetters.indexOf(letter)) {
                        hint.push("\x1b[92m" + letter + "\x1b[0m");
                    }
                    else if (guessLetters.indexOf(letter) !== secretWordLetters.indexOf(letter)) {
                        hint.push("\x1b[93m" + letter + "\x1b[0m");
                    }
                }
                else {
                    hint.push(letter);
                }
            });
            console.log(hint.join(''));
            if (turn === nbTurns) {
                console.log("\x1b[101m" + "You have used all your tries.\n GAME OVER\n" + "The word was " + secretWord + "\x1b[0m");
            }
            turn += 1;
        }
    };
    while (turn < nbTurns + 1) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
wordle();
