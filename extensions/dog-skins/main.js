// Dog Skins. Three more looks for Aether's dog: Dalmatian, Corgi and Silver grey.
// Each skin is [id, name, main, light, dark] (and eyes, for a dark one): the colours that take the place of
// the pet's first skin. Pick one in Settings > Pets. They go when this extension is turned off.

const SKINS = {
  'dog': [
    ['dalmatian', 'Dalmatian', '#f5f3ef', '#ffffff', '#2a2a30'],
    ['corgi', 'Corgi', '#e38a3d', '#fff4e6', '#a65a1f'],
    ['silver', 'Silver grey', '#a09d97', '#dad7d0', '#6a6762']
  ]
};

// an older Aether has no skin packs: say so, instead of failing
if (typeof aether.pets.addSkins !== 'function') aether.window.toast('Dog Skins needs Aether 1.9.27 or newer: Help > Check for Updates.', 'warn');
else for (const [pet, skins] of Object.entries(SKINS)) aether.pets.addSkins(pet, skins);
