import playerAction from './player';
import mods from './mod';
import enemiAction from './enemie';
import menu from './menu';
import Game from './vanilla';
// import enemie from './enemie';

const fs = require('fs');
// const readline = require('readline');

function readJSONFile(filename: string) {
  try {
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${filename}: ${error.message}`);
    process.exit(1);
  }
}
function getRandomEntity(arrayEntity: any[]) {
  const randomNumber: number = Math.floor(Math.random() * 100);
  let rarityChoose: number = 0;
  const entityChooseByRarity: any[] = [];
  while (true) {
    if (randomNumber >= 0 && randomNumber < 50) {
      rarityChoose = 1;
    } else if (randomNumber >= 50 && randomNumber < 80) {
      rarityChoose = 2;
    } else if (randomNumber >= 80 && randomNumber < 95) {
      rarityChoose = 3;
    } else if (randomNumber >= 95 && randomNumber < 99) {
      rarityChoose = 4;
    } else if (randomNumber >= 99 && randomNumber < 100) {
      rarityChoose = 5;
    }
    for (let i: number = 0; i < arrayEntity.length; i += 1) {
      if (rarityChoose === arrayEntity[i].rarity) {
        entityChooseByRarity.push(arrayEntity[i]);
      }
    }
    const randomChoose: number = Math.floor(Math.random() * entityChooseByRarity.length);
    return entityChooseByRarity[randomChoose];
  }
}
function findRoom(etages: number) {
  const chance = Math.random() * 100; // Generate a random number between 0 and 100
  if (etages % 10 === 0 || chance <= 35) {
    return true; // 100% chance before every boss fight, 35% chance after each fight
  }
  return false;
}
function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const SAVE_FILE = '.game_save.json';
// Function to save the game data to a hidden file
function saveGame(player: any, coins: number, etages: number, difficulty:number) {
  const gameData = {
    player,
    coins,
    etages,
    difficulty,

  };
  fs.writeFileSync(SAVE_FILE, JSON.stringify(gameData));
  console.log('Game saved.');
}
// Function to load the game data from the hidden file
function loadGame() {
  if (fs.existsSync(SAVE_FILE)) {
    const data = fs.readFileSync(SAVE_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return null;
}
async function Loading() {
  const start = await menu.startNewGame();
  let selectedMod;
  if (start === '4') {
  // Mod Manager
    selectedMod = await mods.showModManager();
    if (selectedMod === 1) {
      Game();
    } else if (selectedMod === 2) {
      const start = await menu.startNewGame2();
      MainGame(start);
    }
  }
}
Loading();
async function MainGame(start) {
  let playerChoix = '';
  const players = readJSONFile('players.json');
  const enemies = readJSONFile('enemies.json');
  const bosses = readJSONFile('bosses.json');
  let player = getRandomEntity(players);
  const totalHp: number = player.hp;

  let coins: number = 12;

  let etages: number = 1;
  let difficulty;
  let etagesTotal;

  /**
     * Saving data
     *
     * */
  if (start === '4') {
    console.clear();
  }
  if (start === '1') {
    difficulty = await menu.selectDifficulty();
    const fightChoice = await menu.selectFights();
    etagesTotal = fightChoice;
  }
  if (start === '3') { // Continue from a saved file
    const playerData = loadGame();
    if (playerData) {
      player = playerData.player;
      coins = playerData.coins;
      etages = playerData.etages;
      difficulty = playerData.difficulty;
      etagesTotal = playerData.nbEtagesTotal;
    }
  }
  if (start === '2') {
    process.exit(1);
  }

  console.clear();
  while (/* etages < 10 */ true) {
    if (findRoom(etages)) {
      const roomType = Math.random() < 0.5 ? 'Trap Room' : 'Treasure Room';
      console.log(`You found a ${roomType}!`);
      // Offer a "Leave" option to the player
      console.log('You can choose to "Leave" and proceed to the next fight.');
      let leaveChoice = await playerAction.input('Choose (Leave): ') as string;
      while (leaveChoice.toLowerCase() !== 'leave') {
        leaveChoice = await playerAction.input('Choose (Leave): ') as string;
      }
      if (leaveChoice.toLowerCase() === 'leave') {
        console.log(`You decided to leave the ${roomType}.`);
        if (roomType === 'Trap Room') {
          // Handle Trap Room
          console.log('The room was a Trap Room. The player has the chance to meet the requirements or choose to "Leave".');
          const meetsRequirements = Math.random() < 0.5;
          if (!meetsRequirements) {
            const hpLossPercentage = randomInRange(5, 15);
            const hpLoss = Math.floor((hpLossPercentage / 100) * totalHp);
            console.log(`You didn't meet the requirements. You lose ${hpLossPercentage}% of your HP (${hpLoss} HP).`);
            player.hp -= hpLoss;
          } else {
            console.log('You meet the requirements and can leave without losing HP. You earn \u001b[33m 1 coin. \u001b[0m');
            coins += 1;
          }
        } else if (roomType === 'Treasure Room') {
          // Handle Treasure Room
          console.log('The room was a Treasure Room. You found a random amount of \u001b[33m coin. \u001b[0m');
          const treasureCoins = randomInRange(3, 5);
          console.log(`You found \u001b[33m ${treasureCoins} coins \u001b[0m in the Treasure Room.`);
          coins += treasureCoins;
        }
      }
    }
    if (etages % 10 === 0) {
      console.log(`\u001b[33m coin: ${coins}\u001b[0m`);
      console.log(`\u001b[35m \u001b[37m ============ FLOOR ${etages} ============ \u001b[0m`);
      // const boss = getRandomEntity(bosses);
      const boss = getRandomEntity(bosses);
      menu.setDifficulty(boss, difficulty);
      const bosstotalhp: number = boss.hp;
      console.log(`You encounter ${boss.name} with ${boss.hp} HP and ${boss.str} STR.`);
      while (player.hp > 0 && boss.hp > 0) {
        let goodChoice: boolean = false;
        console.log(`\x1b[34m${player.name}\x1b[0m`);
        playerAction.displayHp(player, totalHp);
        console.log(`\x1b[31m${boss.name}\x1b[0m`);
        enemiAction.bossDisplayHp(boss, bosstotalhp);
        playerChoix = await playerAction.input('Options : (Attack/Heal): ') as string;
        while (goodChoice === false) {
          if ((playerChoix.length === 6 && playerChoix.toLowerCase() === 'attack') || (playerChoix.length === 4 && playerChoix.toLowerCase() === 'heal')) {
            goodChoice = true;
          } else {
            playerChoix = await playerAction.input("This option doesn't exist choose again Attack/Heal: ") as string;
          }
        }
        if (playerChoix.toLowerCase() === 'attack') {
          playerAction.attackPlayer(boss, player.str);
          console.log(`${player.name} attacks with ${player.str} damage.`);
        } else if (playerChoix.toLowerCase() === 'heal') {
          playerAction.heal(player, totalHp);
          console.log(`Healed to: ${player.hp}`);
        } else {
          console.log("Choose 'Attack' or 'Heal'.");
        }
        if (boss.hp > 0) {
          // FAUT AJOUTER LA FOCNTION BOSS ATTACK()
          const bossDamage = boss.str;
          player.hp -= bossDamage;
          console.log(`${boss.name} attacks for ${bossDamage} damage.`);
        }
      }
      if (player.hp <= 0) {
        console.log(' \u001b[35m \u001b[37m ============================== \u001b[0m');
        console.log('\u001b[31m Game over! \u001b[0m');
        break;
      }
      if (etages === etagesTotal) {
        console.log('\u001b[32m Congratulations! you completed the game! \x1b[0m');
        process.exit();
      } else {
        console.log(`You defeated ${boss.name} of the floor ${etages} and proceed to the next floor.`);
        await playerAction.waitForKeyPress();
        coins += 1;
        etages += 1;
        boss.hp = bosstotalhp;
      }
    } else {
      console.log(`\u001b[33m coin: ${coins}\u001b[0m`);
      console.log(`============ FLOOR ${etages} ============`);
      const enemy = getRandomEntity(enemies);
      menu.setDifficulty(enemy, difficulty);
      const enemytotalHp: number = enemy.hp;
      while (player.hp > 0 && enemy.hp > 0) {
        let goodChoice: boolean = false;
        console.log(`\x1b[34m${player.name} \x1b[0m`);
        playerAction.displayHp(player, totalHp);
        console.log(`\x1b[31m${enemy.name} \x1b[0m`);
        enemiAction.displayHp(enemy, enemytotalHp);
        playerChoix = await playerAction.input('Options : (Attack/Heal): ') as string;
        while (goodChoice === false) {
          if ((playerChoix.length === 6 && playerChoix.toLowerCase() === 'attack') || (playerChoix.length === 4 && playerChoix.toLowerCase() === 'heal')) {
            goodChoice = true;
          } else {
            playerChoix = await playerAction.input("This option doesn't exist choose again Attack/Heal: ") as string;
          }
        }
        if (playerChoix.toLowerCase() === 'attack') {
          playerAction.attackPlayer(enemy, player.str);
          console.log(`\x1b[31m' ${player.name} attacked and  dealt ${player.str} damage. \x1b[0m`);
        } else if (playerChoix.toLowerCase() === 'heal') {
          playerAction.heal(player, totalHp);
          console.log(`\x1b[32mhealed ${player.hp}\x1b[0m`);
        } else {
          console.log("choose 'Attack' or 'Heal'.");
        }
        if (enemy.hp > 0) {
          const enemyDamage = enemy.str;
          // player.hp -= enemyDamage;
          enemiAction.enemiAttack(player, enemyDamage);
          console.log(`${enemy.name} attacked and dealt ${enemyDamage} damage.`);
          console.log('\n');
        }
      }
      if (player.hp <= 0) {
        console.log('==============================');
        console.log('Game over!');
        break;
      }
      console.log(`You defeated ${enemy.name} and proceed to the next floor.`);
      await playerAction.waitForKeyPress();
      coins += 1;
      etages += 1;
      enemy.hp = enemytotalHp;
    }
    console.log('You can choose to "Save" your progress.');
    const saveChoice = await playerAction.input('Choose (Save): ') as string;
    if (saveChoice.toLowerCase() === 'save') {
      saveGame(player, coins, etages, difficulty);
    }
  }
  // rl.close();
}
