// Markdown Tables: line up the columns of the table the cursor is in, add a row or a column, and turn selected
// comma- or tab-separated text into a table.

// ---- reading a row: the cells between the pipes (a \| or a pipe inside `code` is part of the cell)
function splitRow(line) {
  const cells = [];
  let cell = '', code = false;
  const s = line.trim();
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\' && s[i + 1] === '|') { cell += '\\|'; i++; continue; }
    if (c === '`') code = !code;
    if (c === '|' && !code) { cells.push(cell); cell = ''; continue; }
    cell += c;
  }
  cells.push(cell);
  if (s.startsWith('|')) cells.shift();
  if (s.endsWith('|') && !s.endsWith('\\|') && cells.length) cells.pop();
  return cells.map((x) => x.trim());
}

const isSeparator = (cells) => cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
const isTableLine = (line) => line.includes('|') && line.trim() !== '';

// the lines of the table around line `at` (from 0): { start, end } (end is the last line), or null
function tableAround(lines, at) {
  if (!lines[at] || !isTableLine(lines[at])) return null;
  let start = at, end = at;
  while (start > 0 && isTableLine(lines[start - 1])) start--;
  while (end < lines.length - 1 && isTableLine(lines[end + 1])) end++;
  // a table starts with a header, then the --- line
  for (let s = start; s < end; s++) if (isSeparator(splitRow(lines[s + 1])) && s <= at) start = s;
  if (end - start < 1 || !isSeparator(splitRow(lines[start + 1]))) return null;
  return { start, end };
}

// how wide text looks: most East Asian letters and emoji take two columns, accents take none
function width(s) {
  let w = 0;
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (/\p{Mn}|\p{Me}|‍|️/u.test(ch)) continue;
    w += (c >= 0x1100 && c <= 0x115f) || (c >= 0x2e80 && c <= 0xa4cf) || (c >= 0xac00 && c <= 0xd7a3) || (c >= 0xf900 && c <= 0xfaff) || (c >= 0xfe30 && c <= 0xfe4f) || (c >= 0xff00 && c <= 0xff60) || (c >= 0xffe0 && c <= 0xffe6) || (c >= 0x1f300 && c <= 0x1faff) || (c >= 0x20000 && c <= 0x3fffd) ? 2 : 1;
  }
  return w;
}

const alignOf = (sep) => (sep.startsWith(':') && sep.endsWith(':') && sep.length > 1 ? 'center' : sep.endsWith(':') ? 'right' : sep.startsWith(':') ? 'left' : '');

// line up a table (its lines, header first): every column as wide as its widest cell
function formatTable(lines) {
  const indent = lines[0].match(/^\s*/)[0];
  const rows = lines.map(splitRow);
  const n = Math.max(...rows.map((r) => r.length));
  for (const r of rows) while (r.length < n) r.push('');
  const aligns = rows[1].map((c) => alignOf(c || '-'));
  for (let c = 0; c < n; c++) if (!rows[1][c]) rows[1][c] = '---';
  const widths = [];
  for (let c = 0; c < n; c++) widths[c] = Math.max(3, ...rows.filter((r, i) => i !== 1).map((r) => width(r[c])));
  return rows.map((r, i) => indent + '| ' + r.map((cell, c) => {
    const w = widths[c], a = aligns[c];
    if (i === 1) return a === 'center' ? ':' + '-'.repeat(w - 2) + ':' : a === 'right' ? '-'.repeat(w - 1) + ':' : a === 'left' ? ':' + '-'.repeat(w - 1) : '-'.repeat(w);
    const gap = w - width(cell);
    if (a === 'right') return ' '.repeat(gap) + cell;
    if (a === 'center') return ' '.repeat(Math.floor(gap / 2)) + cell + ' '.repeat(gap - Math.floor(gap / 2));
    return cell + ' '.repeat(gap);
  }).join(' | ') + ' |');
}

// which cell (from 0) the column (from 1) of a row is in
function cellAt(line, column) {
  const s = line.slice(0, column - 1), lead = line.match(/^\s*\|/) ? 1 : 0;
  let pipes = 0, code = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && s[i + 1] === '|') { i++; continue; }
    if (s[i] === '`') code = !code;
    if (s[i] === '|' && !code) pipes++;
  }
  return Math.max(0, pipes - lead);
}

// the column (from 1) where cell `n` of a lined-up row starts
function cellStart(line, n) {
  let pipes = 0;
  for (let i = 0; i < line.length; i++) if (line[i] === '|' && line[i - 1] !== '\\' && pipes++ === n) return i + 3;
  return line.length + 1;
}

// add an empty row after `row` (from 0; the header and the --- line add the first row of the body)
function addRow(lines, row) {
  const n = Math.max(...lines.map((l) => splitRow(l).length));
  const at = Math.max(row, 1) + 1;
  const out = [...lines];
  out.splice(at, 0, '|' + ' |'.repeat(n));
  return { lines: formatTable(out), row: at };
}

// add an empty column after column `col` (from 0)
function addColumn(lines, col) {
  const out = lines.map((l, i) => {
    const r = splitRow(l);
    r.splice(Math.min(col + 1, r.length), 0, i === 1 ? '---' : '');
    return '| ' + r.join(' | ') + ' |';
  });
  out[0] = lines[0].match(/^\s*/)[0] + out[0];
  return { lines: formatTable(out), col: col + 1 };
}

// comma- or tab-separated text -> a table (the first line is the header); "quoted, cells" work too
function csvToTable(text) {
  const rows = [], sep = text.includes('\t') ? '\t' : ',';
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c;
    } else if (c === '"' && cell.trim() === '') { q = true; cell = ''; }
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const kept = rows.filter((r) => r.some((c) => c.trim() !== ''));
  if (!kept.length) return null;
  const n = Math.max(...kept.map((r) => r.length));
  const line = (r) => '| ' + Array.from({ length: n }, (_, i) => (r[i] || '').trim().replace(/\s*[\r\n]+\s*/g, ' ').replace(/\|/g, '\\|')).join(' | ') + ' |';
  return formatTable([line(kept[0]), '|' + ' --- |'.repeat(n), ...kept.slice(1).map(line)]);
}

// ---- in the editor
function inTable(ed) {
  const eol = ed.text().includes('\r\n') ? '\r\n' : '\n';
  const all = ed.text().split(eol), pos = ed.cursor();
  const t = tableAround(all, pos.line - 1);
  if (!t) { aether.window.toast('Put the cursor in a Markdown table first'); return null; }
  return { all, eol, pos, ...t, lines: all.slice(t.start, t.end + 1) };
}

function put(ed, t, lines, line, cell) {
  const all = [...t.all];
  all.splice(t.start, t.end - t.start + 1, ...lines);
  const out = all.join(t.eol);
  if (out !== ed.text()) ed.setText(out);
  ed.goTo(t.start + line + 1, cellStart(lines[line], cell));
}

function align() {
  const ed = aether.editor.active(); if (!ed) return aether.window.toast('Open a file first');
  const t = inTable(ed); if (!t) return;
  const row = t.pos.line - 1 - t.start;
  put(ed, t, formatTable(t.lines), row, cellAt(t.lines[row], t.pos.column));
}
function newRow() {
  const ed = aether.editor.active(); if (!ed) return aether.window.toast('Open a file first');
  const t = inTable(ed); if (!t) return;
  const r = addRow(t.lines, t.pos.line - 1 - t.start);
  put(ed, t, r.lines, r.row, 0);
}
function newColumn() {
  const ed = aether.editor.active(); if (!ed) return aether.window.toast('Open a file first');
  const t = inTable(ed); if (!t) return;
  const row = t.pos.line - 1 - t.start, r = addColumn(t.lines, cellAt(t.lines[row], t.pos.column));
  put(ed, t, r.lines, row, r.col);
}
function fromText() {
  const ed = aether.editor.active(); if (!ed) return aether.window.toast('Open a file first');
  const sel = ed.selectionText();
  const table = sel.trim() && csvToTable(sel);
  if (!table) return aether.window.toast('Select some comma- or tab-separated lines first');
  const eol = sel.includes('\r\n') ? '\r\n' : '\n';
  ed.replaceSelection(table.join(eol) + (/\r?\n$/.test(sel) ? eol : ''));
}

const ALL = {
  align: ['Table: Line Up the Columns', align],
  addRow: ['Table: Add a Row', newRow],
  addColumn: ['Table: Add a Column', newColumn],
  fromText: ['Table: Make a Table from the Selection', fromText]
};
for (const [k, [title, run]] of Object.entries(ALL)) aether.commands.register(k, title, run, { category: 'Markdown Tables' });
aether.commands.register('pick', 'Table…', async () => {
  const p = await aether.window.pick(Object.entries(ALL).map(([value, [label]]) => ({ label: label.replace('Table: ', ''), value })), 'Table…');
  if (p) ALL[p.value || p][1]();
}, { key: 'ctrl+alt+b', category: 'Markdown Tables' });
