// Colour Swatches: a little square of the colour before every colour in your code (#ff5fa2, rgb(...), hsl(...)),
// in CSS, HTML, JavaScript, TypeScript, JSON, YAML and Aether's own files.

const LANGS = new Set(['css', 'scss', 'less', 'sass', 'stylus', 'html', 'javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'json', 'jsonc', 'svelte', 'vue', 'xml', 'yaml', 'toml', 'aetherscript', 'markdown']);
const FIND = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|\b(?:rgba?|hsla?)\(\s*[\d.%\s,/+-]+\)/g;

const sheet = document.createElement('style');
document.head.appendChild(sheet);
const known = new Map(); // colour -> class name
const collections = new Map(); // editor -> its swatches
let wait = 0;

function classFor(colour) {
  if (known.has(colour)) return known.get(colour);
  if (!CSS.supports('color', colour)) { known.set(colour, null); return null; }
  const cls = 'aexs-' + known.size;
  sheet.textContent += `.${cls}{background:linear-gradient(${colour},${colour}),repeating-conic-gradient(#bbb 0 25%,#fff 0 50%) 0 0/6px 6px}\n`;
  known.set(colour, cls); return cls;
}

// every code editor on screen (both sides of a split too); hidden ones are painted when they show
function paint() {
  const all = aether.monaco.editor.getEditors();
  for (const m of [...collections.keys()]) if (!all.includes(m)) collections.delete(m);
  for (const m of all) { const n = m.getContainerDomNode(); if (n && n.offsetParent) paintOne(m); }
}
function paintOne(m) {
  const model = m.getModel();
  const want = model && (LANGS.has(model.getLanguageId()) || /\.(css|scss|less|html?|svg|json|ya?ml|gui|scene|aeapp|art|aes)$/i.test(model.uri.path));
  let col = collections.get(m);
  if (!col) { col = m.createDecorationsCollection([]); collections.set(m, col); }
  if (!want || !model || model.getValueLength() > 400000) { col.clear(); return; }
  const out = [], text = model.getValue();
  for (const hit of text.matchAll(FIND)) {
    const cls = classFor(hit[0].replace(/\s+/g, ' '));
    if (!cls) continue;
    const at = model.getPositionAt(hit.index);
    out.push({ range: { startLineNumber: at.lineNumber, startColumn: at.column, endLineNumber: at.lineNumber, endColumn: at.column }, options: { before: { content: ' ', inlineClassName: 'aexs ' + cls } } });
    if (out.length > 2000) break;
  }
  col.set(out);
}
const soon = () => { clearTimeout(wait); wait = setTimeout(paint, 200); };

aether.on('activeChanged', soon);
aether.on('changed', soon);
aether.commands.register('refresh', 'Colour Swatches: Show Them Again', paint, { category: 'Colour Swatches' });
aether.onDispose(() => { clearTimeout(wait); for (const c of collections.values()) c.clear(); collections.clear(); sheet.remove(); });
paint();
