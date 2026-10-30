// Text Tools: change the case of what is selected, and sort, clean up or join lines.
// With nothing selected, the line tools work on the whole file.

const words = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^A-Za-z0-9]+/).filter(Boolean);
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const CASES = {
  upper: ['UPPER CASE', (s) => s.toUpperCase()],
  lower: ['lower case', (s) => s.toLowerCase()],
  title: ['Title Case', (s) => s.replace(/[A-Za-z][^\s-]*/g, cap)],
  sentence: ['Sentence case', (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase())],
  camel: ['camelCase', (s) => s.replace(/[^\r\n]+/g, (l) => words(l).map((w, i) => (i ? cap(w) : w.toLowerCase())).join(''))],
  pascal: ['PascalCase', (s) => s.replace(/[^\r\n]+/g, (l) => words(l).map(cap).join(''))],
  snake: ['snake_case', (s) => s.replace(/[^\r\n]+/g, (l) => words(l).map((w) => w.toLowerCase()).join('_'))],
  kebab: ['kebab-case', (s) => s.replace(/[^\r\n]+/g, (l) => words(l).map((w) => w.toLowerCase()).join('-'))],
  constant: ['CONSTANT_CASE', (s) => s.replace(/[^\r\n]+/g, (l) => words(l).map((w) => w.toUpperCase()).join('_'))]
};

const byText = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
const LINES = {
  sortAZ: ['Sort lines A to Z', (ls) => [...ls].sort(byText)],
  sortZA: ['Sort lines Z to A', (ls) => [...ls].sort(byText).reverse()],
  sortLength: ['Sort lines by length', (ls) => [...ls].sort((a, b) => a.length - b.length)],
  unique: ['Remove repeated lines', (ls) => ls.filter((l, i) => ls.indexOf(l) === i)],
  blank: ['Remove empty lines', (ls) => ls.filter((l) => l.trim() !== '')],
  reverse: ['Reverse the lines', (ls) => [...ls].reverse()],
  shuffle: ['Shuffle the lines', (ls) => { const a = [...ls]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }],
  trim: ['Trim spaces at line ends', (ls) => ls.map((l) => l.replace(/\s+$/, ''))],
  number: ['Number the lines', (ls) => ls.map((l, i) => `${i + 1}. ${l}`)],
  join: ['Join the lines', (ls) => [ls.map((l) => l.trim()).filter(Boolean).join(' ')]]
};

function changeCase(key) {
  const ed = aether.editor.active();
  if (!ed) return aether.window.toast('Open a file first');
  const s = ed.selectionText();
  if (!s) return aether.window.toast('Select some text first');
  ed.replaceSelection(CASES[key][1](s));
}

function changeLines(key) {
  const ed = aether.editor.active();
  if (!ed) return aether.window.toast('Open a file first');
  const sel = ed.selectionText(), all = !sel;
  const text = all ? ed.text() : sel, eol = text.includes('\r\n') ? '\r\n' : '\n';
  const end = text.endsWith(eol) ? eol : '';
  const lines = (end ? text.slice(0, -eol.length) : text).split(eol);
  const out = LINES[key][1](lines).join(eol) + end;
  if (out === text) return aether.window.toast('Nothing to change');
  if (all) ed.setText(out); else ed.replaceSelection(out);
  aether.window.toast(`${LINES[key][0]}: done`, 'ok', 1400);
}

for (const [k, [title]] of Object.entries(CASES)) aether.commands.register('case-' + k, 'Text: ' + title, () => changeCase(k), { category: 'Text Tools' });
for (const [k, [title]] of Object.entries(LINES)) aether.commands.register('lines-' + k, 'Text: ' + title, () => changeLines(k), { category: 'Text Tools' });

// one list of them all
aether.commands.register('pick', 'Text Tools…', async () => {
  const items = [
    ...Object.entries(CASES).map(([k, [t]]) => ({ label: t, detail: 'Change the case of the selection', value: ['case', k] })),
    ...Object.entries(LINES).map(([k, [t]]) => ({ label: t, detail: 'The selected lines, or the whole file', value: ['lines', k] }))
  ];
  const p = await aether.window.pick(items, 'Change the text…');
  if (!p) return;
  const [kind, key] = p.value || p;
  if (kind === 'case') changeCase(key); else changeLines(key);
}, { key: 'ctrl+alt+x', category: 'Text Tools' });
