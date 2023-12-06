const readline = require('readline-sync');



function attackPlayer(enemie, strPlayer: number){
    enemie.hp -= strPlayer;
}

function heal(player, totalHp: number){
    const maxHeal = totalHp - player.hp;
    const healAmount = Math.min(totalHp / 2, maxHeal); // Calculate the amount to heal
    player.hp += healAmount;
}

function displayHp(player, totalHp: number){
    let hpPlayer: number = player.hp;
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

export default {attackPlayer,heal,displayHp};