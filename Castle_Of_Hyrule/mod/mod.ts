import playerAction from './player';

const fs = require('fs');

function loadMods() {
  if (fs.existsSync('.mods.json')) {
    const data = fs.readFileSync('.mods.json', 'utf-8');
    return JSON.parse(data);
  }
  return [];
}

async function showModManager() {
  console.log('Mod Manager:');
  const modsData = loadMods();

  for (let i = 0; i < modsData.length; i += 1) {
    const mod = modsData[i];
    console.log(`${i + 1}. ${mod.name} - ${mod.enabled ? 'Enabled' : 'Disabled'}`);
  }

  const modChoice = await playerAction.input('Enter the number of the mod to select: ') as string;

  const selectedMod = parseInt(modChoice, 10);

  if (!isNaN(selectedMod) && selectedMod >= 0 && selectedMod <= modsData.length) {
    return selectedMod;
  }
}

export default { loadMods, showModManager };
