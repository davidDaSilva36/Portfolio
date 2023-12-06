const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
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

function attackPlayer(enemie, strPlayer: number) {
  enemie.hp -= strPlayer;
  // enemie.hp -= 300;
}

function heal(player, totalHp: number) {
  const maxHeal = totalHp - player.hp;
  const healAmount = Math.min(totalHp / 2, maxHeal); // Calculate the amount to heal
  player.hp += healAmount;
}

function displayHp(player, totalHp: number) {
  const hpPlayer: number = player.hp;
  const hp: string[] = ['\u001b[32m'];
  for (let i: number = 0; i < hpPlayer; i += 1) {
    hp.push('I');
  }
  hp.push('\u001b[0m');
  hp.push('\u001b[31m');
  for (let i: number = 0; i < totalHp - hpPlayer; i += 1) {
    hp.push('_');
  }
  hp.push('\u001b[0m');
  console.log(`HP: ${hp.join('')} ${hpPlayer}/${totalHp}`);
}

export default {
  attackPlayer, heal, displayHp, input, waitForKeyPress,
};
