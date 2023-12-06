function enemiAttack(player, strEnemi: number){
    player.hp -= strEnemi;
}
function displayHp(enemie, totalHp: number){
    let hpPlayer: number = enemie.hp;
    let hp: string[] = ["\u001b[32m"];
    let emptyHp: string[] = [];
    for(let i: number = 0 ; i < hpPlayer; i += 1){
        hp.push("I");
    }
    hp.push("\u001b[0m");
    hp.push("\u001b[31m");
    for(let i: number = 0 ; i < totalHp - hpPlayer; i += 1){
        hp.push("_");
    }
    hp.push("\u001b[0m");
    console.log("HP: " + hp.join("") + " " + hpPlayer + "/" + totalHp);
}
function bossDisplayHp(boss, totalHp: number){
    let hpPlayer: number = boss.hp;
    let hp: string[] = ["\u001b[32m"];
    let emptyHp: string[] = [];
    for(let i: number = 0 ; i < hpPlayer; i += 1){
        hp.push("I");
    }
    hp.push("\u001b[0m");
    hp.push("\u001b[31m");
    for(let i: number = 0 ; i < totalHp - hpPlayer; i += 1){
        hp.push("_");
    }
    hp.push("\u001b[0m");
    console.log("HP: " + hp.join("") + " " + hpPlayer + "/" + totalHp);
}

export default {bossDisplayHp,displayHp,enemiAttack};