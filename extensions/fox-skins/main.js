// Fox Skins. Three more looks for Aether's fox: Cross fox, Shadow and Spirit.
// Each skin is [id, name, main, light, dark] (and eyes, for a dark one): the colours that take the place of
// the pet's first skin. Pick one in Settings > Pets. They go when this extension is turned off.

const SKINS = {
  'fox': [
    ['cross', 'Cross fox', '#c9692f', '#f2dcc5', '#3b2a24'],
    ['shadow', 'Shadow', '#36323f', '#8b8597', '#1e1b25', '#ffcc4d'],
    ['spirit', 'Spirit', '#5aa8ff', '#e4f1ff', '#2a62c6']
  ]
};

// an older Aether has no skin packs: say so, instead of failing
if (typeof aether.pets.addSkins !== 'function') aether.window.toast('Fox Skins needs Aether 1.9.28 or newer: Help > Check for Updates.', 'warn');
else for (const [pet, skins] of Object.entries(SKINS)) aether.pets.addSkins(pet, skins);
