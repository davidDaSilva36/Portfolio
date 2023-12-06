
import { getRandomWord,getInput } from './lib';
// import { exit } from 'process';

function wordle(){
    let turn: number = 1;
    let nbLetter = 5;
    let nbTurns = 6;
    let secretWord: string = getRandomWord();
    let guess: string = "";
    let guessUpper: string = "";
    let secretWordLetters: string[] = secretWord.split('');
    let guessLetters: string[] = [];
    let turnLeft: number = 0;
    let regex = /^[a-zA-Z]+$/;
    console.log(secretWord);
    while( turn < nbTurns+1){
        const hint: string[] = [];
        console.log(' \x1b[0m');
        turnLeft = nbTurns + 1 - turn;
        //console.log(secretWord);
        guess = getInput("Make a guess for a word of 5 letters and in Uppercase ( " + turnLeft + " left(s) guess(es) )");
        guessUpper = guess.toUpperCase();
        guessLetters = guess.split('');
        if(guess.length === nbLetter && guess === guessUpper && regex.test(guess)){
            if(secretWord === guess){
                console.log("\x1b[102m" + " Congratulation you find the Secret word !!!! With " + turn + " turn(s)" + "\x1b[0m" );
                return;
            } 
            guessLetters.forEach(letter => {
                if(secretWord.includes(letter)){
                    if(guessLetters.indexOf(letter) === secretWordLetters.indexOf(letter)){
                        hint.push("\x1b[92m" + letter + "\x1b[0m");
                    }
                    else if(guessLetters.indexOf(letter) !== secretWordLetters.indexOf(letter)) {
                        hint.push("\x1b[93m" + letter + "\x1b[0m");
                    } 
                }
                else {
                    hint.push(letter);
                }
            });
            console.log(hint.join(''));
            if(turn === nbTurns){
                console.log("\x1b[101m" + "You have used all your tries.\n GAME OVER\n" + "The word was " + secretWord + "\x1b[0m");
            }
            turn += 1;
        }
    }
}
wordle();