// A tiny fake `aether` for the tests: it runs an extension's main.js the way Aether does (a strict script with
// its own `aether`) and keeps what the extension did, so a test can look. Top-level functions of main.js are on
// `ext.fn`, so their plain logic can be tested on its own.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// a code editor holding `text`; selection and cursor are offsets into it
function fakeEditor(text, { path: p = '/project/file.txt', language = 'plaintext', selection, cursor } = {}) {
  const moved = [];
  let sel = selection ? [...selection] : [cursor ?? 0, cursor ?? 0];
  const pos = (off) => { const before = text.slice(0, off).split('\n'); return { line: before.length, column: before[before.length - 1].length + 1 }; };
  const offsetOf = (line, column) => { const ls = text.split('\n'); let o = 0; for (let i = 0; i < line - 1 && i < ls.length; i++) o += ls[i].length + 1; return Math.min(text.length, o + column - 1); };
  return {
    path: p, language,
    text: () => text,
    setText(s) { text = String(s); sel = [Math.min(sel[0], text.length), Math.min(sel[0], text.length)]; },
    selectionText: () => text.slice(sel[0], sel[1]),
    replaceSelection(s) { text = text.slice(0, sel[0]) + s + text.slice(sel[1]); sel = [sel[0] + s.length, sel[0] + s.length]; },
    insert(s) { this.replaceSelection(s); },
    cursor: () => pos(sel[1]),
    goTo(line, column = 1) { const o = offsetOf(line, column); sel = [o, o]; },
    lineText: (n) => text.split('\n')[n - 1],
    lineCount: () => text.split('\n').length,
    save() {},
    // the little of Monaco the extensions use
    monacoEditor: {
      getSelection: () => { const a = pos(sel[0]), b = pos(sel[1]); return { startLineNumber: a.line, startColumn: a.column, endLineNumber: b.line, endColumn: b.column }; },
      getModel: () => ({ getOptions: () => ({ tabSize: 2, insertSpaces: true }) }),
      onDidChangeCursorPosition: (fn) => { moved.push(fn); return { dispose: () => moved.splice(moved.indexOf(fn), 1) }; },
      focus() {}
    },
    moved: () => moved.forEach((fn) => fn())
  };
}

function load(id, { editor = null, exec, settings = {}, globals = {}, monaco } = {}) {
  const file = path.join(__dirname, '..', 'extensions', id, 'main.js');
  const did = { commands: {}, toasts: [], status: [], views: {}, opened: [], themes: [], picks: [], disposers: [], listeners: {}, execs: [], terminal: [] };
  const own = (x) => ({ dispose() {}, ...x });
  const aether = {
    id, version: '1.9.23', dir: path.dirname(file), manifest: JSON.parse(fs.readFileSync(path.join(path.dirname(file), 'extension.json'), 'utf8')),
    commands: {
      register(cid, title, run, opts = {}) {
        if (cid.includes('.')) throw new Error(`command id "${cid}" has a dot`);
        did.commands[cid] = { title, run, ...opts };
        return own();
      },
      run: (cid, ...args) => did.commands[cid].run(...args)
    },
    window: {
      toast: (message, kind = 'info') => { did.toasts.push({ message: String(message), kind }); },
      ask: async () => null,
      pick: async (items, placeholder) => { did.picks.push({ items, placeholder }); return ext.answer ? ext.answer(items) : null; },
      confirm: async () => true,
      menu() {}
    },
    statusBar: {
      add(o = {}) {
        const item = { text: '', tooltip: '', icon: '', ...o, set(t) { item.text = String(t ?? ''); }, setTooltip(t) { item.tooltip = String(t); }, setIcon(n) { item.icon = n; }, dispose() { item.disposed = true; } };
        did.status.push(item); return item;
      }
    },
    views: {
      register(name, def) { did.views[name] = def; return own(); },
      open(name, props) { did.opened.push({ name, props }); }
    },
    editor: { active: () => ext.editor, open() {}, decorate: () => own() },
    files: {
      root: () => '/project', join: (...p) => path.posix.join(...p), basename: (p) => path.posix.basename(p), dirname: (p) => path.posix.dirname(p),
      read: async () => '', write: async () => {}, list: async () => [], exists: async () => true
    },
    languages: { completions: () => own(), hovers: () => own(), formatter: () => own(), snippets: () => own(), problems() {} },
    themes: { add(t) { did.themes.push(t); return own(); } },
    terminal: { run(cmd) { did.terminal.push(cmd); } },
    shell: {
      exec: async (f, args = [], opts = {}) => {
        did.execs.push({ file: f, args, opts });
        if (!exec) return { code: 1, stdout: '', stderr: 'no programs in the tests' };
        return exec(f, args, opts);
      }
    },
    settings: { get: (k, d) => (k in settings ? settings[k] : d), set: (k, v) => { settings[k] = v; } },
    on(ev, fn) { (did.listeners[ev] = did.listeners[ev] || []).push(fn); return own(); },
    log() {},
    onDispose(fn) { did.disposers.push(fn); return own(); },
    monaco
  };
  const ext = {
    aether, did, editor,
    answer: null,
    emit: (ev, data) => Promise.all((did.listeners[ev] || []).map((fn) => fn(data))),
    dispose() { for (const fn of did.disposers) fn(); },
    fn: null
  };
  const context = vm.createContext({ aether, console, setTimeout, clearTimeout, setInterval, clearInterval, ...globals });
  vm.runInContext('"use strict";\n' + fs.readFileSync(file, 'utf8'), context, { filename: file });
  ext.fn = context;
  return ext;
}

// values made inside the extension come from another realm: compare them as plain data
const plain = (v) => JSON.parse(JSON.stringify(v));
const settle = () => new Promise((r) => setTimeout(r, 0));

module.exports = { load, fakeEditor, plain, settle };
