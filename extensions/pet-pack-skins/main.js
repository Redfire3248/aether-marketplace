// Pet Pack Skins. More looks for the Pet Pack: a poison blue and a golden frog, an emperor and a pink penguin, a brown and a grey bunny.
// Each skin is [id, name, main, light, dark] (and eyes, for a dark one): the colours that take the place of
// the pet's first skin. Pick one in Settings > Pets. They go when this extension is turned off.

const SKINS = {
  'pet-pack-frog': [
    ['blue', 'Poison blue', '#3a8cff', '#bfe0ff', '#1d4fb0'],
    ['gold', 'Golden', '#e8b923', '#fff0a8', '#9a7408']
  ],
  'pet-pack-penguin': [
    ['emperor', 'Emperor', '#3b4250', '#fff3cc', '#22262e'],
    ['pink', 'Pink', '#c94b84', '#ffe1ef', '#7d2a51']
  ],
  'pet-pack-bunny': [
    ['brown', 'Brown', '#a8774f', '#e9cfb4', '#6e4a2c'],
    ['grey', 'Grey', '#9aa0aa', '#e3e6ea', '#5f6570']
  ]
};

// an older Aether has no skin packs: say so, instead of failing
if (typeof aether.pets.addSkins !== 'function') aether.window.toast('Pet Pack Skins needs Aether 1.9.27 or newer: Help > Check for Updates.', 'warn');
else for (const [pet, skins] of Object.entries(SKINS)) aether.pets.addSkins(pet, skins);
