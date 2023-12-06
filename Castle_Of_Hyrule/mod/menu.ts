import playerAction from './player';
// import mods from './mod'; // Import the mods handling module
// import Game from './vanilla';

// const fs = require('fs');
// const readline = require('readline');
// import vanilla from "./vanilla";

function centerText(text, totalWidth) {
  const padding = ' '.repeat((totalWidth - text.length) / 2);
  return padding + text;
}
// function loadGame(SAVE_FILE) {
//   if (fs.existsSync(SAVE_FILE)) {
//     const data = fs.readFileSync(SAVE_FILE, 'utf-8');
//     return JSON.parse(data);
//   }
//   return null;
// }
// const SAVE_FILE = '.game_save.json';
async function startNewGame() {
  console.log(`                                                                                                 
     ####    ##    ####  ##### #      ######     ####  ######    #    #  #   # #####  #    # #      ###### 
    #    #  #  #  #        #   #      #         #    # #         #    #   # #  #    # #    # #      #      
    #      #    #  ####    #   #      #####     #    # #####     ######    #   #    # #    # #      #####  
    #      ######      #   #   #      #         #    # #         #    #    #   #####  #    # #      #      
    #    # #    # #    #   #   #      #         #    # #         #    #    #   #   #  #    # #      #      
     ####  #    #  ####    #   ###### ######     ####  #         #    #    #   #    #  ####  ###### ###### `);
  console.log('');

  console.log(centerText('Welcome to the Game!', 80));
  console.log(centerText('Options:', 80));
  console.log(centerText('1. New Game', 80));
  console.log(centerText('2. Quit', 80));
  console.log(centerText('3. Continue', 80));
  console.log(centerText('4. Mod Manager', 80));

  const choice = await playerAction.input('Select an option: ');

  if (choice === '1') {
    return choice;

    // You can start the game with the chosen difficulty, player, and boss here.
  } if (choice === '2') {
    console.log('Exiting the game.');
    process.exit();
  } else if (choice === '3') {
    console.log('Continuing from the previous game...');
    console.log(
      '========================================================================================',
    );
    return choice;
  }
  return choice;
}
async function startNewGame2() {
  console.log(`                                                                                                 
     ####    ##    ####  ##### #      ######     ####  ######    #    #  #   # #####  #    # #      ###### 
    #    #  #  #  #        #   #      #         #    # #         #    #   # #  #    # #    # #      #      
    #      #    #  ####    #   #      #####     #    # #####     ######    #   #    # #    # #      #####  
    #      ######      #   #   #      #         #    # #         #    #    #   #####  #    # #      #      
    #    # #    # #    #   #   #      #         #    # #         #    #    #   #   #  #    # #      #      
     ####  #    #  ####    #   ###### ######     ####  #         #    #    #   #    #  ####  ###### ###### `);
  console.log('');

  console.log(centerText('Welcome to the Game!', 80));
  console.log(centerText('Options:', 80));
  console.log(centerText('1. New Game', 80));
  console.log(centerText('2. Quit', 80));
  console.log(centerText('3. Continue', 80));

  const choice = await playerAction.input('Select an option: ');

  if (choice === '1') {
    return choice;

    // You can start the game with the chosen difficulty, player, and boss here.
  } if (choice === '2') {
    console.log('Exiting the game.');
    process.exit();
  } else if (choice === '3') {
    console.log('Continuing from the previous game...');
    console.log(
      '========================================================================================',
    );
    return choice;
  }
  return choice;
}

async function selectDifficulty() {
  console.log('===============================================');
  console.log('Select the difficulty:');
  console.log('1. Normal');
  console.log('2. Difficult');
  console.log('3. Insane');

  const difficultyChoice = (await playerAction.input(
    'Select the difficulty: ',
  )) as string;

  switch (difficultyChoice) {
    case '1':
      return 'Normal';
    case '2':
      return 'Difficult';
    case '3':
      return 'Insane';
    default:
      console.log('Invalid difficulty. Please select a valid difficulty.');
      return selectDifficulty();
  }
  return difficultyChoice;
}
function setDifficulty(entity: any, difficulty: string) {
  if (difficulty === 'Difficult') {
    entity.hp *= 1.5;
    entity.mp *= 1.5;
    entity.str *= 1.5;
    entity.int *= 1.5;
    entity.def *= 1.5;
    entity.res *= 1.5;
    entity.spd *= 1.5;
    entity.luck *= 1.5;
    entity.race *= 1.5;
  } else if (difficulty === 'Insane') {
    entity.hp *= 2;
    entity.mp *= 2;
    entity.str *= 2;
    entity.int *= 2;
    entity.def *= 2;
    entity.res *= 2;
    entity.spd *= 2;
    entity.luck *= 2;
    entity.race *= 2;
  }
}
async function selectFights() {
  console.log('Select the number of fights:');
  console.log('1. 10 fights');
  console.log('2. 20 fights');
  console.log('3. 50 fights');
  console.log('4. 100 fights');

  const fightChoice = (await playerAction.input(
    'Select the number of fights: ',
  )) as string;

  switch (fightChoice) {
    case '1':
      return 10;
    case '2':
      return 20;
    case '3':
      return 50;
    case '4':
      return 100;
    default:
      console.log('Invalid choice. Please select a valid number of fights.');
      return selectFights();
  }
}

export default {
  selectDifficulty, startNewGame, setDifficulty, selectFights, startNewGame2,
};
