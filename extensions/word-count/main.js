// Word Count: words and reading time in the status bar for writing (Markdown, text), and for any selection.
// Click it for the full count: characters, sentences, paragraphs, reading and speaking time.

const PROSE = /^(markdown|plaintext|mdx|restructuredtext|latex|asciidoc)$/;
const count = (s) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
const time = (n, perMin) => { const m = n / perMin; return m < 1 ? `${Math.max(1, Math.round(m * 60))} s` : `${Math.round(m)} min`; };

const item = aether.statusBar.add({ text: '', tooltip: 'Click for the full count', onClick: () => details() });
let watch = null, wait = 0;

function update() {
  const ed = aether.editor.active();
  const sel = ed ? ed.selectionText() : '';
  const prose = ed && (PROSE.test(ed.language) || /\.(md|mdx|txt|rst|tex|adoc)$/i.test(ed.path || ''));
  if (!ed || (!prose && !sel.trim())) { item.set(''); item.setIcon(''); return; }
  const total = count(ed.text());
  item.setIcon('type');
  item.set(sel.trim() ? `${count(sel)} of ${total} words` : `${total} words · ${time(total, 230)} read`);
}
const soon = () => { clearTimeout(wait); wait = setTimeout(update, 150); };

// follow the selection of whichever editor is in front
function follow() {
  if (watch) { watch.dispose(); watch = null; }
  const ed = aether.editor.active();
  if (ed && ed.monacoEditor) watch = ed.monacoEditor.onDidChangeCursorSelection(soon);
  update();
}

function details() {
  const ed = aether.editor.active(); if (!ed) return;
  const sel = ed.selectionText(), s = sel.trim() ? sel : ed.text();
  const n = count(s);
  const chars = s.length, noSpaces = s.replace(/\s/g, '').length;
  const sentences = (s.match(/[^.!?\n]+[.!?]+/g) || []).length;
  const paragraphs = s.split(/\n\s*\n/).filter((p) => p.trim()).length;
  aether.window.toast(`${sel.trim() ? 'Selection' : 'Whole file'}: ${n} words, ${chars} characters (${noSpaces} without spaces), ${sentences} sentences, ${paragraphs} paragraphs. Reading ${time(n, 230)}, speaking ${time(n, 140)}.`, 'info', 9000);
}

aether.on('activeChanged', follow);
aether.on('changed', soon);
aether.commands.register('details', 'Word Count: Show the Full Count', details, { category: 'Word Count' });
aether.onDispose(() => { clearTimeout(wait); if (watch) watch.dispose(); });
follow();
