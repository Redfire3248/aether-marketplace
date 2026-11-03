// The pet packs: Pet Pack brings the pets, the skin packs bring more looks (aether.pets.addSkins).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { load } = require('./fake-aether');

const PACKS = ['pet-pack-skins', 'cat-skins', 'dog-skins', 'fox-skins'];
const HEX = /^#[0-9a-f]{6}$/i;

test('Pet Pack brings three pets, each in one look', () => {
  const { did } = load('pet-pack');
  assert.deepStrictEqual(did.pets.map((p) => p.id), ['frog', 'penguin', 'bunny']);
  for (const p of did.pets) {
    assert.strictEqual(p.skins.length, 1, `${p.id}: its other looks are in Pet Pack Skins`);
    assert.strictEqual(typeof p.draw, 'function');
  }
});

test('each skin pack adds good skins to real pets', () => {
  const petPack = load('pet-pack').did.pets.map((p) => `pet-pack-${p.id}`);
  const kinds = ['cat', 'dog', 'fox', 'slime', 'ghost', 'chick', ...petPack];
  for (const id of PACKS) {
    const { did, aether } = load(id);
    assert.ok(did.skins.length, `${id} adds skins`);
    assert.strictEqual(aether.manifest.aether, '>=1.9.27', `${id} needs the Aether that has addSkins`);
    for (const { kind, skins } of did.skins) {
      assert.ok(kinds.includes(kind), `${id}: ${kind} is a pet`);
      assert.strictEqual(new Set(skins.map((s) => s[0])).size, skins.length, `${id}: skin ids are all different`);
      for (const [sid, name, ...colours] of skins) {
        assert.match(sid, /^[a-z][a-z-]*$/, `${id}/${sid}`);
        assert.ok(name && name.length < 20, `${id}/${sid} has a short name`);
        assert.ok(colours.length === 3 || colours.length === 4, `${id}/${sid}: main, light, dark (and eyes)`);
        for (const c of colours) assert.match(c, HEX, `${id}/${sid}`);
      }
    }
  }
});

test('a skin pack does not reuse a look the pet already has', () => {
  // the built-in skins' ids (Aether's src/renderer/pets.js) and Pet Pack's own
  const own = { cat: ['tabby', 'black', 'white', 'grey', 'cream', 'lilac'], dog: ['brown', 'golden', 'black', 'husky', 'choco'], fox: ['red', 'arctic', 'silver', 'fennec'] };
  for (const p of load('pet-pack').did.pets) own[`pet-pack-${p.id}`] = p.skins.map((s) => s[0]);
  for (const id of PACKS) for (const { kind, skins } of load(id).did.skins) for (const [sid] of skins) assert.ok(!own[kind].includes(sid), `${id}: ${kind} already has ${sid}`);
});

test('every pack says what it adds, and the skin packs say they need Aether 1.9.27', () => {
  for (const id of PACKS) {
    const readme = fs.readFileSync(path.join(__dirname, '..', 'extensions', id, 'README.md'), 'utf8');
    assert.match(readme, /Settings > Pets/);
    assert.match(readme, /1\.9\.27/);
  }
});

test('on an older Aether a skin pack says what it needs instead of failing', () => {
  for (const id of PACKS) {
    const ext = load(id);
    // again with no addSkins, like Aether 1.9.26
    const old = load(id, { before: (aether) => { delete aether.pets.addSkins; } });
    assert.ok(ext.did.skins.length);
    assert.strictEqual(old.did.skins.length, 0);
    assert.match(old.did.toasts[0].message, /needs Aether 1\.9\.27/);
  }
});
