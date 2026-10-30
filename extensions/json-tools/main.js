// JSON Tools: format, minify or sort the keys of JSON (what is selected, or the whole file), and find the error
// when it is not valid JSON. Its own small reader keeps every number and string exactly as written.

// ---- reading: text -> a tree, or the place of the first error
class JsonError extends Error { constructor(message, at) { super(message); this.at = at; } }

function parseJson(text) {
  let i = 0;
  const fail = (msg, at = i) => { throw new JsonError(msg, at); };
  const space = () => {
    while (i < text.length && ' \t\r\n﻿'.includes(text[i])) i++;
    if (text[i] === '/' && (text[i + 1] === '/' || text[i + 1] === '*')) fail('Comments are not allowed in JSON');
  };
  const what = () => (i >= text.length ? 'the end' : `"${text[i]}"`);
  function value() {
    space();
    const c = text[i];
    if (c === '{') return object();
    if (c === '[') return array();
    if (c === '"') return { t: 's', raw: string() };
    if (c === "'") fail('Strings need double quotes (")');
    if (c === '-' || (c >= '0' && c <= '9')) return { t: 'v', raw: number() };
    for (const w of ['true', 'false', 'null']) if (text.startsWith(w, i)) { i += w.length; return { t: 'v', raw: w }; }
    if (i >= text.length) fail('The JSON ends too soon: a value is missing');
    if (c === '}' || c === ']' || c === ',') fail(`A value is missing before ${what()}`);
    if (/[A-Za-z_$]/.test(c)) { const w = text.slice(i).match(/^[\w$]+/)[0]; fail(w === 'undefined' || w === 'NaN' || w === 'Infinity' ? `${w} is not allowed in JSON` : `Unknown word "${w}": text needs double quotes`); }
    fail(`Unexpected ${what()}`);
  }
  function string() {
    const start = i++;
    while (i < text.length) {
      const c = text[i];
      if (c === '"') return text.slice(start, ++i);
      if (c === '\\') {
        const e = text[i + 1];
        if (e === 'u') { if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) fail('\\u needs four hex digits'); i += 6; continue; }
        if (!e || !'"\\/bfnrt'.includes(e)) fail(`Unknown escape \\${e || ''}`);
        i += 2; continue;
      }
      if (c === '\n' || c === '\r') fail('A string goes past the end of the line: a closing " is missing');
      if (c < ' ') fail('Control characters must be escaped in strings');
      i++;
    }
    fail('A string is not closed: a " is missing', start);
  }
  function number() {
    const m = text.slice(i).match(/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/);
    if (!m) fail('A number is not written right');
    const next = text[i + m[0].length];
    if (next && /[\d.xXeE]/.test(next)) fail('A number is not written right', i + m[0].length);
    i += m[0].length;
    return m[0];
  }
  function object() {
    const node = { t: 'o', entries: [] };
    i++; space();
    if (text[i] === '}') { i++; return node; }
    for (;;) {
      space();
      if (text[i] === '}') fail('Trailing comma: remove the last ","', i);
      if (text[i] === "'") fail('Keys need double quotes (")');
      if (text[i] !== '"') fail(i >= text.length ? 'The JSON ends too soon: a } is missing' : `Keys need double quotes (") at ${what()}`);
      const key = string();
      space();
      if (text[i] !== ':') fail(`Expected ":" after the key ${key}`);
      i++;
      node.entries.push([key, value()]);
      space();
      if (text[i] === ',') { i++; continue; }
      if (text[i] === '}') { i++; return node; }
      fail(i >= text.length ? 'The JSON ends too soon: a } is missing' : `Expected "," or "}" but found ${what()}`);
    }
  }
  function array() {
    const node = { t: 'a', items: [] };
    i++; space();
    if (text[i] === ']') { i++; return node; }
    for (;;) {
      space();
      if (text[i] === ']') fail('Trailing comma: remove the last ","', i);
      node.items.push(value());
      space();
      if (text[i] === ',') { i++; continue; }
      if (text[i] === ']') { i++; return node; }
      fail(i >= text.length ? 'The JSON ends too soon: a ] is missing' : `Expected "," or "]" but found ${what()}`);
    }
  }
  try {
    space();
    if (i >= text.length) fail('There is no JSON here');
    const tree = value();
    space();
    if (i < text.length) fail(`Unexpected ${what()} after the end of the JSON`);
    return { ok: true, tree };
  } catch (e) {
    if (!(e instanceof JsonError)) throw e;
    return { ok: false, message: e.message, ...placeOf(text, e.at) };
  }
}

// an offset -> { offset, line, column } (from 1)
function placeOf(text, offset) {
  const before = text.slice(0, offset).split(/\r\n|\r|\n/);
  return { offset, line: before.length, column: before[before.length - 1].length + 1 };
}

// ---- writing: a tree -> text
function printJson(node, indent = '  ', depth = 0) {
  if (node.t === 's' || node.t === 'v') return node.raw;
  const items = node.t === 'o' ? node.entries.map(([k, v]) => [k + (indent ? ': ' : ':'), v]) : node.items.map((v) => ['', v]);
  const [open, close] = node.t === 'o' ? ['{', '}'] : ['[', ']'];
  if (!items.length) return open + close;
  if (!indent) return open + items.map(([k, v]) => k + printJson(v, '', 0)).join(',') + close;
  const pad = indent.repeat(depth + 1);
  return open + '\n' + items.map(([k, v]) => pad + k + printJson(v, indent, depth + 1)).join(',\n') + '\n' + indent.repeat(depth) + close;
}

function sortTree(node) {
  if (node.t === 'a') return { t: 'a', items: node.items.map(sortTree) };
  if (node.t !== 'o') return node;
  const key = ([k]) => JSON.parse(k);
  const entries = node.entries.map(([k, v]) => [k, sortTree(v)]);
  entries.sort((a, b) => { const x = key(a), y = key(b); return x < y ? -1 : x > y ? 1 : 0; });
  return { t: 'o', entries };
}

// the three changes; each returns { ok, text } or the error from parseJson
function formatJson(text, indent = '  ') { const r = parseJson(text); return r.ok ? { ok: true, text: printJson(r.tree, indent) } : r; }
function minifyJson(text) { const r = parseJson(text); return r.ok ? { ok: true, text: printJson(r.tree, '') } : r; }
// sorted JSON stays on one line if it was on one line
function sortJsonKeys(text, indent = '  ') { const r = parseJson(text); return r.ok ? { ok: true, text: printJson(sortTree(r.tree), text.trim().includes('\n') ? indent : '') } : r; }

// ---- in the editor
function indentOf(ed) {
  try { const o = ed.monacoEditor.getModel().getOptions(); return o.insertSpaces ? ' '.repeat(o.tabSize) : '\t'; } catch { return '  '; }
}

// what to work on: the selection, or the whole file; and the line it starts on
function target(ed) {
  const sel = ed.selectionText();
  if (sel.trim()) {
    let line = 1, column = 1;
    try { const s = ed.monacoEditor.getSelection(); line = s.startLineNumber; column = s.startColumn; } catch { /* from the top */ }
    return { text: sel, whole: false, line, column };
  }
  return { text: ed.text(), whole: true, line: 1, column: 1 };
}

function showError(ed, t, r) {
  const line = t.line + r.line - 1, column = r.line === 1 ? t.column + r.column - 1 : r.column;
  ed.goTo(line, column);
  aether.window.toast(`Not valid JSON: ${r.message} (line ${line}, column ${column})`, 'error', 7000);
}

function run(kind) {
  const ed = aether.editor.active();
  if (!ed) return aether.window.toast('Open a file first');
  const t = target(ed), indent = indentOf(ed);
  const r = kind === 'check' ? parseJson(t.text) : kind === 'minify' ? minifyJson(t.text) : kind === 'sort' ? sortJsonKeys(t.text, indent) : formatJson(t.text, indent);
  if (!r.ok) return showError(ed, t, r);
  if (kind === 'check') return aether.window.toast(t.whole ? 'The file is valid JSON' : 'The selection is valid JSON', 'ok', 2000);
  const eol = t.text.includes('\r\n') ? '\r\n' : '\n';
  let out = r.text.replace(/\n/g, eol);
  if (t.whole && /\r?\n$/.test(t.text)) out += eol;
  if (out === t.text) return aether.window.toast('Nothing to change', 'info', 1500);
  if (t.whole) ed.setText(out); else ed.replaceSelection(out);
}

const KINDS = {
  format: 'JSON: Format',
  minify: 'JSON: Minify',
  sort: 'JSON: Sort the Keys',
  check: 'JSON: Find the Error'
};
for (const [k, title] of Object.entries(KINDS)) aether.commands.register(k, title, () => run(k), { category: 'JSON Tools' });
aether.commands.register('pick', 'JSON Tools…', async () => {
  const p = await aether.window.pick(Object.entries(KINDS).map(([value, label]) => ({ label: label.replace('JSON: ', ''), detail: 'The selection, or the whole file', value })), 'JSON…');
  if (p) run(p.value || p);
}, { key: 'ctrl+alt+j', category: 'JSON Tools' });
