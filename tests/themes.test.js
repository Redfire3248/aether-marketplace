const test = require('node:test');
const assert = require('node:assert');
const { load } = require('./fake-aether');

const fs = require('fs');
const path = require('path');

// every theme is an extension of its own, extensions/theme-<name>
const ids = fs.readdirSync(path.join(__dirname, '..', 'extensions')).filter((d) => d.startsWith('theme-'));
const themes = ids.flatMap((id) => load(id).did.themes);

// WCAG contrast between two colours (#abc, #aabbcc or aabbcc)
function lum(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const UI = ['bg', 'panel', 'editor', 'elevated', 'hover', 'border', 'text', 'muted', 'faint', 'accent', 'accent2', 'accentText', 'danger', 'warn', 'ok'];
const SYNTAX = ['keyword', 'string', 'number', 'comment', 'fn', 'type', 'variable', 'operator', 'tag', 'attr', 'regexp', 'constant'];

test('each theme is one extension, dark and light ones, with ids of their own', () => {
  assert.strictEqual(themes.length, ids.length);
  assert.ok(themes.some((t) => t.dark) && themes.some((t) => !t.dark));
  assert.strictEqual(new Set(themes.map((t) => t.id)).size, ids.length);
  for (const t of themes) assert.ok(ids.includes(t.id), t.id);
});

test('every colour is given, written the way Aether wants', () => {
  for (const t of themes) {
    for (const k of UI) assert.match(t.ui[k] || '', /^#[0-9a-f]{6}$/, `${t.name} ui.${k}`);
    for (const k of SYNTAX) assert.match(t.syntax[k] || '', /^[0-9a-f]{6}$/, `${t.name} syntax.${k}`);
  }
});

test('the text is easy to read', () => {
  for (const t of themes) {
    const u = t.ui;
    for (const where of ['bg', 'panel', 'editor', 'elevated', 'hover']) assert.ok(contrast(u.text, u[where]) >= 7, `${t.name}: text on ${where}`);
    for (const where of ['panel', 'editor', 'elevated']) assert.ok(contrast(u.muted, u[where]) >= 4.5, `${t.name}: muted on ${where} is ${contrast(u.muted, u[where]).toFixed(2)}`);
    assert.ok(contrast(u.faint, u.panel) >= 3, `${t.name}: faint on panel is ${contrast(u.faint, u.panel).toFixed(2)}`);
    assert.ok(contrast(u.accentText, u.accent) >= 4.5, `${t.name}: accentText on accent is ${contrast(u.accentText, u.accent).toFixed(2)}`);
    for (const k of ['accent', 'accent2', 'danger', 'warn', 'ok']) assert.ok(contrast(u[k], u.panel) >= 4.5, `${t.name}: ${k} on panel is ${contrast(u[k], u.panel).toFixed(2)}`);
  }
});

test('the code colours are easy to read on the editor', () => {
  for (const t of themes) {
    for (const k of SYNTAX) {
      const c = contrast('#' + t.syntax[k], t.ui.editor);
      assert.ok(c >= 4.5, `${t.name}: ${k} is ${c.toFixed(2)}`);
    }
    // and the code colours are not all the same
    assert.ok(new Set(Object.values(t.syntax)).size >= 8, t.name);
  }
});
