// Cat Skins. Three more looks for Aether's cat: Siamese, Cinnamon and Russian blue.
// Each skin is [id, name, main, light, dark] (and eyes, for a dark one): the colours that take the place of
// the pet's first skin. Pick one in Settings > Pets. They go when this extension is turned off.

const SKINS = {
  'cat': [
    ['siamese', 'Siamese', '#eadcc6', '#fffaf0', '#4e3628'],
    ['cinnamon', 'Cinnamon', '#b5653a', '#e8b48a', '#7a3a1e'],
    ['russian-blue', 'Russian blue', '#7f8ea6', '#c3cddc', '#4f5b70', '#9be37b']
  ]
};

// an older Aether has no skin packs: say so, instead of failing
if (typeof aether.pets.addSkins !== 'function') aether.window.toast('Cat Skins needs Aether 1.9.27 or newer: Help > Check for Updates.', 'warn');
else for (const [pet, skins] of Object.entries(SKINS)) aether.pets.addSkins(pet, skins);
