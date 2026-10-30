// HTML Quick: write a short abbreviation like ul>li*3 or div.card>h2+p, press Ctrl+Alt+E, and it becomes HTML.
//   >  inside     +  next to     ^  back up one     *3  three of them     (...)  a group
//   #id  .class  [attr=value]  {text}  $ (the number, 1, 2, 3; $$ for 01, 02)  !  a whole HTML page

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
// attributes some tags get on their own, to fill in
const DEFAULT_ATTRS = { a: [['href', '']], img: [['src', ''], ['alt', '']], input: [['type', 'text']], link: [['rel', 'stylesheet'], ['href', '']], form: [['action', '']], label: [['for', '']], script: [['src', '']], iframe: [['src', '']], source: [['src', ''], ['type', '']], area: [['shape', ''], ['coords', ''], ['href', ''], ['alt', '']] };
// the tag an element gets when it has none, by its parent's tag
const IMPLICIT = { ul: 'li', ol: 'li', menu: 'li', table: 'tr', tbody: 'tr', thead: 'tr', tfoot: 'tr', tr: 'td', select: 'option', optgroup: 'option', datalist: 'option', dl: 'dt', span: 'span', a: 'span', em: 'span', strong: 'span', b: 'span', i: 'span', p: 'span', label: 'span', button: 'span' };
const PAGE = { tag: '!', count: 1, children: [] };

// ---- reading an abbreviation -> a tree of { tag, id, classes, attrs, text, count, children } and groups
function parseAbbr(src) {
  const s = String(src).trim();
  let i = 0;
  const fail = (msg) => { throw new Error(`${msg} (at "${s.slice(i, i + 12) || 'the end'}")`); };
  if (s === '!' || s === 'html:5') return [PAGE];

  function bracketed(open, close) {
    let depth = 0, out = '';
    for (; i < s.length; i++) {
      const c = s[i];
      if (c === open) { depth++; if (depth === 1) continue; }
      if (c === close && --depth === 0) { i++; return out; }
      out += c;
    }
    fail(`A "${close}" is missing`);
  }
  function attrList(text) {
    const out = [], re = /\s*([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S*)))?/g;
    let m;
    while ((m = re.exec(text)) && m[0].trim()) out.push([m[1], m[2] ?? m[3] ?? m[4] ?? '']);
    return out;
  }
  function element() {
    const el = { tag: '', id: '', classes: [], attrs: [], text: null, count: 1, children: [] };
    const name = s.slice(i).match(/^[A-Za-z][\w:-]*/);
    if (name) { el.tag = name[0]; i += name[0].length; }
    if (!parts(el) && !name) fail('Expected a tag, #id, .class or {text}');
    return el;
  }
  // #id .class [attrs] {text}; says if there were any
  function parts(el) {
    let any = false;
    for (;;) {
      const c = s[i];
      const word = () => { i++; const w = s.slice(i).match(/^[\w$@:-]+/); if (!w) fail(`A name is missing after "${c}"`); i += w[0].length; return w[0]; };
      if (c === '#') el.id = word();
      else if (c === '.') el.classes.push(word());
      else if (c === '[') el.attrs.push(...attrList(bracketed('[', ']')));
      else if (c === '{') el.text = bracketed('{', '}');
      else break;
      any = true;
    }
    return any;
  }
  function count(node) {
    if (s[i] !== '*') return;
    i++;
    const n = s.slice(i).match(/^\d+/);
    if (!n) fail('A number is missing after "*"');
    i += n[0].length;
    node.count = Math.min(1000, Number(n[0]));
  }
  // siblings, children and climbs, up to a ")" or the end
  function sequence() {
    const root = { children: [] }, parents = [root];
    for (;;) {
      let node;
      if (s[i] === '(') { i++; node = { group: sequence(), count: 1, children: [] }; if (s[i] !== ')') fail('A ")" is missing'); i++; }
      else node = element();
      count(node);
      if (!node.group) parts(node); // li*3{text} works as well as li{text}*3
      parents[parents.length - 1].children.push(node);
      const op = s[i];
      if (op === '>') { if (node.group) fail('Put the ">" inside the ( )'); i++; parents.push(node); }
      else if (op === '+') i++;
      else if (op === '^') { while (s[i] === '^') { i++; if (parents.length > 1) parents.pop(); } }
      else if (op === undefined || op === ')') return root.children;
      else fail(`Unexpected "${op}"`);
    }
  }
  if (!s) fail('There is no abbreviation');
  const tree = sequence();
  if (i < s.length) fail(`Unexpected "${s[i]}"`);
  return tree;
}

// ---- writing it out as HTML
// $ -> the number (1, 2, 3), $$ -> 01, 02, 03; \$ stays a $
const numbered = (text, n) => String(text).replace(/(\\?)(\$+)/g, (all, slash, run) => (slash ? run : String(n).padStart(run.length, '0')));

function expand(abbr, { indent = '  ', jsx = false, snippet = false } = {}) {
  const tree = parseAbbr(abbr);
  let stop = 0;
  const lit = (t) => (snippet ? String(t).replace(/[$}\\]/g, '\\$&') : String(t));
  const hole = (fill = '') => (snippet ? `\${${++stop}${fill ? ':' + lit(fill) : ''}}` : fill);
  const lines = [];

  function render(nodes, depth, parentTag, n) {
    for (const node of nodes) {
      for (let k = 1; k <= node.count; k++) {
        const num = node.count > 1 ? k : n;
        if (node.group) { render(node.group, depth, parentTag, num); continue; }
        if (node === PAGE) { page(depth); continue; }
        element(node, depth, parentTag, num);
      }
    }
  }
  function element(el, depth, parentTag, n) {
    const pad = indent.repeat(depth);
    const textOnly = !el.tag && !el.id && !el.classes.length && !el.attrs.length && el.text != null;
    if (textOnly) { lines.push(pad + lit(numbered(el.text, n))); return; }
    const tag = el.tag || IMPLICIT[parentTag] || 'div';
    const attrs = [];
    if (el.id) attrs.push(['id', numbered(el.id, n)]);
    if (el.classes.length) attrs.push([jsx ? 'className' : 'class', el.classes.map((c) => numbered(c, n)).join(' ')]);
    for (const [k, v] of [...(DEFAULT_ATTRS[tag] || []).filter(([k]) => !el.attrs.some(([a]) => a === k)), ...el.attrs]) attrs.push([jsx && k === 'for' ? 'htmlFor' : k, numbered(v, n)]);
    const open = `<${tag}${attrs.map(([k, v]) => ` ${k}="${v === '' ? hole() : lit(v)}"`).join('')}`;
    if (VOID.has(tag)) { lines.push(pad + open + (jsx ? ' />' : '>')); return; }
    const text = el.text != null ? lit(numbered(el.text, n)) : '';
    if (!el.children.length) { lines.push(`${pad}${open}>${text || hole()}</${tag}>`); return; }
    lines.push(`${pad}${open}>${text}`);
    render(el.children, depth + 1, tag, n);
    lines.push(`${pad}</${tag}>`);
  }
  function page(depth) {
    const p = indent.repeat(depth), q = p + indent;
    lines.push(`${p}<!DOCTYPE html>`, `${p}<html lang="en">`, `${p}<head>`, `${q}<meta charset="UTF-8">`, `${q}<meta name="viewport" content="width=device-width, initial-scale=1.0">`, `${q}<title>${hole('Document')}</title>`, `${p}</head>`, `${p}<body>`, `${q}${hole()}`, `${p}</body>`, `${p}</html>`);
  }
  render(tree, 0, '', 1);
  return lines.join('\n');
}

// the abbreviation that ends at `column` (from 1) of a line: { start (from 1), abbr }, or null
function abbrBefore(line, column) {
  const s = line.slice(0, column - 1);
  let i = s.length, curly = 0, square = 0, quote = '';
  while (i > 0) {
    const c = s[i - 1];
    if (quote) { if (c === quote) quote = ''; i--; continue; }
    if (square && (c === '"' || c === "'")) { quote = c; i--; continue; }
    if (c === '}') curly++;
    else if (c === '{') { if (!curly) break; curly--; }
    else if (c === ']' && !curly) square++;
    else if (c === '[' && !curly) { if (!square) break; square--; }
    else if (!curly && !square) {
      if (/\s/.test(c) || c === '<' || c === '"' || c === "'" || c === '`' || c === ';' || c === ',' || c === '=') break;
      // the end of a tag before it (<p>ul>li): stop there
      if (c === '>' && /<[A-Za-z!/][^<>]*$/.test(s.slice(0, i - 1))) break;
    }
    i--;
  }
  let abbr = s.slice(i);
  const lead = abbr.match(/^[^A-Za-z.#[{(!]*/)[0];
  abbr = abbr.slice(lead.length);
  return abbr ? { start: i + lead.length + 1, abbr } : null;
}

// ---- in the editor
function indentOf(ed) {
  try { const o = ed.monacoEditor.getModel().getOptions(); return o.insertSpaces ? ' '.repeat(o.tabSize) : '\t'; } catch { return '  '; }
}

function run() {
  const ed = aether.editor.active();
  if (!ed) return aether.window.toast('Open a file first');
  const m = ed.monacoEditor, sel = m.getSelection();
  const jsx = /react$/.test(ed.language || '') || /\.[jt]sx$/i.test(ed.path || '');
  let range, abbr;
  if (ed.selectionText().trim()) { range = sel; abbr = ed.selectionText().trim(); }
  else {
    const line = sel.endLineNumber, at = abbrBefore(ed.lineText(line), sel.endColumn);
    if (!at) return aether.window.toast('Type an abbreviation first, like ul>li*3');
    range = { startLineNumber: line, startColumn: at.start, endLineNumber: line, endColumn: sel.endColumn };
    abbr = at.abbr;
  }
  let snippet;
  try { snippet = expand(abbr, { indent: indentOf(ed), jsx, snippet: true }); } catch (e) { return aether.window.toast(`Could not expand "${abbr}": ${e.message}`, 'error', 5000); }
  // a snippet, so Tab goes from one empty place to the next; Monaco lines it up with the line's indent
  m.setSelection(range);
  try {
    m.getContribution('snippetController2').insert(snippet);
  } catch {
    const pad = ed.lineText(range.startLineNumber).match(/^\s*/)[0];
    m.executeEdits('html-quick', [{ range, text: expand(abbr, { indent: indentOf(ed), jsx }).replace(/\n/g, '\n' + pad) }]);
  }
  m.focus();
}

aether.commands.register('expand', 'HTML: Expand the Abbreviation', run, { key: ['ctrl+alt+e', 'ctrl+alt+h'], category: 'HTML Quick' });
aether.commands.register('wrap', 'HTML: Wrap the Selection in an Abbreviation', async () => {
  const ed = aether.editor.active();
  if (!ed || !ed.selectionText()) return aether.window.toast('Select some text first');
  const abbr = await aether.window.ask('Wrap in (like div.box or ul>li)', 'div');
  if (!abbr) return;
  const inner = ed.selectionText();
  let html;
  try { html = expand(`${abbr}{\u0000}`, { indent: indentOf(ed), jsx: /react$/.test(ed.language || '') }); } catch (e) { return aether.window.toast(`Could not expand "${abbr}": ${e.message}`, 'error', 5000); }
  ed.replaceSelection(html.split('\u0000').join(inner));
}, { category: 'HTML Quick' });
