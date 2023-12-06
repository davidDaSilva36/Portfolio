function enemiAttack(player, strEnemi: number) {
  player.hp -= strEnemi;
}
function displayHp(enemie, totalHp: number) {
  const hpPlayer: number = enemie.hp;
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
function bossDisplayHp(boss, totalHp: number) {
  const hpPlayer: number = boss.hp;
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

export default { bossDisplayHp, displayHp, enemiAttack };
