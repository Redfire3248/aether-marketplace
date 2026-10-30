// Quick Insert: put placeholder text, today's date, the time, a unique id, a strong password or a random
// number where the cursor is (each cursor, if you have more than one).

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.split(' ');
const rnd = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
function lorem(paragraphs) {
  const out = [];
  for (let p = 0; p < paragraphs; p++) {
    const len = 40 + rnd(30), start = p ? rnd(LOREM.length) : 0, w = [];
    for (let i = 0; i < len; i++) w.push(LOREM[(start + i) % LOREM.length]);
    let s = w.join(' ').replace(/[.,]$/, '');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    out.push(s + '.');
  }
  return out.join('\n\n');
}
function password(n = 18) {
  const sets = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '!@#$%^&*-_=+?'];
  const all = sets.join(''), chars = sets.map((s) => s[rnd(s.length)]);
  while (chars.length < n) chars.push(all[rnd(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) { const j = rnd(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
  return chars.join('');
}
const two = (n) => String(n).padStart(2, '0');

const MAKE = {
  lorem1: ['A paragraph of placeholder text', () => lorem(1)],
  lorem3: ['Three paragraphs of placeholder text', () => lorem(3)],
  date: ['Today (2026-10-30)', () => { const d = new Date(); return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`; }],
  dateLong: ['Today, written out', () => new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
  time: ['The time now', () => { const d = new Date(); return `${two(d.getHours())}:${two(d.getMinutes())}`; }],
  iso: ['Date and time (ISO 8601)', () => new Date().toISOString()],
  uuid: ['A unique id (UUID)', () => crypto.randomUUID()],
  password: ['A strong password', () => password()],
  number: ['A random number from 1 to 100', () => String(1 + rnd(100))]
};

function insert(key) {
  const ed = aether.editor.active();
  if (!ed) return aether.window.toast('Open a file first');
  const m = ed.monacoEditor;
  // a fresh value for each cursor
  m.executeEdits('quick-insert', m.getSelections().map((r) => ({ range: r, text: MAKE[key][1](), forceMoveMarkers: true })));
  m.focus();
}

for (const [k, [title]] of Object.entries(MAKE)) aether.commands.register(k, 'Insert: ' + title, () => insert(k), { category: 'Quick Insert' });
aether.commands.register('pick', 'Quick Insert…', async () => {
  const p = await aether.window.pick(Object.entries(MAKE).map(([k, [label, make]]) => ({ label, detail: k === 'password' || k.startsWith('lorem') ? '' : make(), value: k })), 'Insert…');
  if (p) insert(p.value || p);
}, { key: 'ctrl+alt+i', category: 'Quick Insert' });
