import playerAction from './player';
import enemiAction from './enemie';
const fs = require("fs");
const readline = require("readline");

function readJSONFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${filename}: ${error.message}`);
    process.exit(1);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function input(option: string) {
  return new Promise((resolve) => {
      rl.question(option, (choice) => {
      resolve(choice);
      });
  });
}
async function waitForKeyPress() {
  return new Promise((resolve) => {
    rl.question('Press any key to continue...', (choice) => {
      resolve(choice);
    });
  });
}



/*function selectEntity(entities) {
  const rarityPercentages = [0, 50, 30, 15, 4, 1];
  
  // Générer un nombre aléatoire entre 0 et 100 (pourcentage total)
  const randomPercentage = Math.random() * 100;
  
  let currentPercentage = 0;
  for (let rarity = 0; rarity < 6; rarity++) {
    currentPercentage += rarityPercentages[rarity];
    
    // Si le nombre aléatoire est inférieur au pourcentage actuel,
    // sélectionnez une entité de ce niveau de rareté
    if (randomPercentage < currentPercentage) {
      const entitiesOfRarity = entities.filter(entity => entity.rarity === rarity);
      
      // Sélectionnez une entité aléatoire parmi celles du même niveau de rareté
      const randomIndex = Math.floor(Math.random() * entitiesOfRarity.length);
      return entitiesOfRarity[randomIndex];
    }
  }
  
  // Par défaut, retournez null (aucune entité trouvée)
  return null;
}*/
function selectEntity(entities) {
  while (true) {
    
    const randomNumber = Math.floor(Math.random() * 101);

    let cumulativePercentage = 0;

    for (const entity of entities) {
      cumulativePercentage += entity.rarity;

      if (randomNumber < cumulativePercentage) {
        return entity; 
      }
    }
  }
}
/*
function randomChoosePlayer(entity){
  let randomNumber: number = Math.floor(Math.random() * 100) ;
  let rare: number = 0;
  let entityChooseByRarity: any[] = [];
 
  if(randomNumber >= 0 && randomNumber < 50){
    rare = 1;
  } else if (randomNumber >= 50 && randomNumber < 80){
    rare = 2;
  } else if (randomNumber >= 80 && randomNumber < 95){
    rare = 3;
  } else if (randomNumber >= 95 && randomNumber < 99){
    rare = 4;
  } else if (randomNumber >= 99 && randomNumber < 100){
    rare = 5;
  }
  for(let i: number = 0; i < entity.length; i += 1){
    if(rare === entity.rarity){
      entityChooseByRarity.push(entity);
    }
}
let randomChoose: number = Math.floor(Math.random() * entityChooseByRarity.length);
return entityChooseByRarity[randomChoose];
}*/
function getRandomEntity(arrayEntity: any[]){

  let randomNumber: number = Math.floor(Math.random() * 100) ;
  let rarityChoose: number = 0;
  let entityChooseByRarity: any[] = [];
  while(true)
  {
      if(randomNumber >= 0 && randomNumber < 50){
        rarityChoose = 1;
    } else if (randomNumber >= 50 && randomNumber < 80){
        rarityChoose = 2;
    } else if (randomNumber >= 80 && randomNumber < 95){
        rarityChoose = 3;
    } else if (randomNumber >= 95 && randomNumber < 99){
        rarityChoose = 4;
    } else if (randomNumber >= 99 && randomNumber < 100){
        rarityChoose = 5;
    }
    for(let i: number = 0; i < arrayEntity.length; i += 1){
        if(rarityChoose === arrayEntity[i].rarity){
            entityChooseByRarity.push(arrayEntity[i])
        }
    }
    let randomChoose: number = Math.floor(Math.random() * entityChooseByRarity.length);
    return entityChooseByRarity[randomChoose];
  }
  
}


  
async function Game() {
    let etages : number =  0
    let playerChoix = ""; 
    
    const players = readJSONFile('players.json');
    const enemies = readJSONFile('enemies.json');
    const bosses = readJSONFile('bosses.json');
    
    /*const player = players.find((player) => player.name === "Link");
    const enemy = enemies.find((enemie)=> enemie.name === "Bokoblin");
    const boss = bosses.find((boss) => boss.name === "Ganon");*/
    const player = getRandomEntity(players);
    //const enemy = getRandomEntity(enemies);
    const boss = getRandomEntity(bosses);
    const totalHp: number = player.hp;
    
    const bosstotalhp: number = boss.hp;
    //console.log(`tu as ${player.hp} HP et ${player.str} STR.`);

    while (etages < 10) {

      if (etages === 9) {
        console.log( " \u001b[35m" + "\u001b[37m" + `============ FLOOR ${etages+1} ============` + "\u001b[0m");
        //const boss = getRandomEntity(bosses);
        console.log(`You encounter ${boss.name} with ${boss.hp} HP and ${boss.str} STR.`);
        while (player.hp > 0 && boss.hp > 0) {
          let goodChoice: boolean = false;
          console.log("\x1b[34m" + player.name + "\x1b[0m");
          playerAction.displayHp(player,totalHp);
          console.log("\x1b[31m" + boss.name + "\x1b[0m");
          enemiAction.bossDisplayHp(boss,bosstotalhp);
          playerChoix = await input("Options : (Attack/Heal): ") as string;
          while(goodChoice === false){
            if((playerChoix.length === 6 && playerChoix.toLowerCase() === "attack") || (playerChoix.length === 4 && playerChoix.toLowerCase() === "heal")){
              goodChoice = true;
            } else {
              playerChoix = await input("This option doesn't exist choose again Attack/Heal: ") as string;
            }
          }
          if (playerChoix.toLowerCase() === "attack") {
            playerAction.attackPlayer(boss, player.str);
            console.log(`${player.name} attacks with ${player.str} damage.`);
          } else if (playerChoix.toLowerCase() === "heal") {
            playerAction.heal(player, totalHp);
            console.log(`Healed to: ${player.hp}`);
          } else {
            console.log("Choose 'Attack' or 'Heal'.");
          }
  
          if (boss.hp > 0) {
            //FAUT AJOUTER LA FOCNTION BOSS ATTACK()
            const bossDamage = boss.str;
            player.hp -= bossDamage;
            console.log(`${boss.name} attacks for ${bossDamage} damage.`);
          }
        }
  
        if (player.hp <= 0) {
          console.log(" \u001b[35m"  + "\u001b[37m"  + "==============================" + "\u001b[0m")
          console.log("\u001b[31m" + "Game over!" + "\u001b[0m");
          break;
        }
  
        console.log("\u001b[32m " + `Congratulations! you completed the game!` +  "\x1b[0m");
        process.exit();
      }else {
        console.log(`============ FLOOR ${etages+1} ============`);
        const enemy = getRandomEntity(enemies);
        const enemytotalHp: number = enemy.hp;
        while (player.hp > 0 && enemy.hp > 0) {
          
          let goodChoice: boolean = false;
          console.log("\x1b[34m" + player.name +" "+ player.rarity + "\x1b[0m");
          playerAction.displayHp(player,totalHp);
          console.log("\x1b[31m" + enemy.name + " "+enemy.rarity + "\x1b[0m");
          enemiAction.displayHp(enemy,enemytotalHp);
          playerChoix = await input("Options : (Attack/Heal): ") as string;
          while(goodChoice === false){
            if((playerChoix.length === 6 && playerChoix.toLowerCase() === "attack") || (playerChoix.length === 4 && playerChoix.toLowerCase() === "heal")){
              goodChoice = true;
            } else {
              playerChoix = await input("This option doesn't exist choose again Attack/Heal: ") as string;
            }
          }
    
          if (playerChoix.toLowerCase() === "attack") {
              playerAction.attackPlayer(enemy,player.str);
              console.log("\x1b[31m" + `${player.name} attacked and  dealt ${player.str} damage.` + "\x1b[0m");
              
          } else if (playerChoix.toLowerCase() === "heal") {
            
                playerAction.heal(player,totalHp);
                
                console.log("\x1b[32mhealed " + player.hp + "\x1b[0m");

          } else {
            console.log("choose 'Attack' or 'Heal'.");
          }
    
          
        if (enemy.hp > 0) {
          const enemyDamage = enemy.str;
          // player.hp -= enemyDamage;
          enemiAction.enemiAttack(player,enemyDamage);
          console.log(`${enemy.name} attacked and dealt ${enemyDamage} damage.`);
          console.log("\n");
        }
        }
    
        if (player.hp <= 0) {
          console.log("==============================")
          console.log("Game over!");
          break;
        }
    
        if (etages === 9) {
          break;
        }
    
        console.log(`You defeated ${enemy.name} and proceed to the next floor.`);
        
        await waitForKeyPress();
        etages++;
        enemy.hp = enemytotalHp; 
      }
    }
    
      rl.close();
    }
    
    Game();