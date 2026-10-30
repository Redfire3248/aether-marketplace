// Git Line: the status bar shows who last changed the cursor's line, and when (git blame). Click it for the
// commit's message. It says nothing outside a git repository, and for files with changes that are not saved.

const ZERO = /^0+$/;
const item = aether.statusBar.add({ text: '', tooltip: '', onClick: () => details() });
const blames = new Map(); // file -> { at, result: Promise<blame or null> }
const emails = new Map(); // folder -> Promise<the user's git email>
const edited = new Set(); // files changed since they were saved
let watch = null, wait = 0, shown = null;

// `git blame --porcelain` -> { lines: [line] = commit, commits }
function parseBlame(out) {
  const commits = {}, lines = [];
  let cur = null;
  for (const raw of out.split('\n')) {
    const l = raw.replace(/\r$/, '');
    const head = l.match(/^([0-9a-f]{40,64}) \d+ (\d+)/);
    if (head) { cur = commits[head[1]] || (commits[head[1]] = { hash: head[1], author: '', mail: '', time: 0, summary: '' }); lines[Number(head[2])] = cur; continue; }
    if (!cur || l.startsWith('\t')) continue;
    const sp = l.indexOf(' '), key = sp < 0 ? l : l.slice(0, sp), val = sp < 0 ? '' : l.slice(sp + 1);
    if (key === 'author') cur.author = val;
    else if (key === 'author-mail') cur.mail = val.replace(/^<|>$/g, '');
    else if (key === 'author-time') cur.time = Number(val);
    else if (key === 'summary') cur.summary = val;
  }
  return { lines, commits };
}

// seconds since 1970 -> "3 days ago"
function ago(then, now = Date.now() / 1000) {
  const s = Math.max(0, now - then);
  if (s < 60) return 'just now';
  for (const [n, unit] of [[31536000, 'year'], [2592000, 'month'], [604800, 'week'], [86400, 'day'], [3600, 'hour'], [60, 'minute']]) {
    if (s < n) continue;
    const k = Math.floor(s / n);
    return k === 1 ? (unit === 'day' ? 'yesterday' : `1 ${unit} ago`) : `${k} ${unit}s ago`;
  }
}

function describe(c, me, now) {
  if (!c || ZERO.test(c.hash)) return 'Not committed yet';
  return `${me && c.mail && c.mail.toLowerCase() === me.toLowerCase() ? 'You' : c.author || 'Someone'}, ${ago(c.time, now)}`;
}

async function git(dir, args) {
  try { const r = await aether.shell.exec('git', args, { cwd: dir, timeout: 15000 }); return r && r.code === 0 ? r.stdout : null; } catch { return null; }
}

// a file's blame, kept for half a minute (and until it is saved again)
function blameOf(file) {
  const had = blames.get(file);
  if (had && Date.now() - had.at < 30000) return had.result;
  const dir = aether.files.dirname(file);
  const result = (async () => {
    const out = await git(dir, ['blame', '--porcelain', '--', aether.files.basename(file)]);
    if (out == null) return null;
    if (!emails.has(dir)) emails.set(dir, git(dir, ['config', 'user.email']).then((e) => (e || '').trim()));
    return { ...parseBlame(out), dir, me: await emails.get(dir) };
  })();
  blames.set(file, { at: Date.now(), result });
  return result;
}

function hide() { shown = null; item.set(''); item.setIcon(''); }

async function update() {
  const ed = aether.editor.active();
  if (!ed || !ed.path || edited.has(ed.path)) return hide();
  const b = await blameOf(ed.path);
  const now = aether.editor.active();
  if (!now || now.path !== ed.path) return; // another file came to the front while git ran
  const c = b && b.lines[now.cursor().line];
  if (!c) return hide();
  shown = { c, dir: b.dir };
  item.setIcon('git');
  item.set(describe(c, b.me));
  item.setTooltip(ZERO.test(c.hash) ? 'This line is not committed yet' : `${c.summary}\n${c.hash.slice(0, 7)} · click for the whole message`);
}
const soon = () => { clearTimeout(wait); wait = setTimeout(update, 120); };

// follow the cursor of whichever editor is in front
function follow() {
  if (watch) { watch.dispose(); watch = null; }
  const ed = aether.editor.active();
  if (ed && ed.monacoEditor) watch = ed.monacoEditor.onDidChangeCursorPosition(soon);
  soon();
}

async function details() {
  if (!shown) return;
  const { c, dir } = shown;
  if (ZERO.test(c.hash)) return aether.window.toast('This line is not committed yet');
  const msg = ((await git(dir, ['show', '-s', '--format=%B', c.hash])) || c.summary).trim();
  const [first, ...rest] = msg.split(/\r?\n/);
  const when = new Date(c.time * 1000).toLocaleString();
  const p = await aether.window.pick([
    { label: first, detail: `${c.hash.slice(0, 7)} · ${c.author} · ${when}`, value: 'message' },
    ...rest.filter((l) => l.trim()).map((l) => ({ label: l, value: 'message' })),
    { label: 'Copy the commit id', detail: c.hash, value: 'copy' },
    { label: 'Show the whole commit in the terminal', detail: `git show ${c.hash.slice(0, 7)}`, value: 'show' }
  ], `Commit ${c.hash.slice(0, 7)}`);
  const v = p && (p.value || p);
  if (v === 'copy') {
    try { await navigator.clipboard.writeText(c.hash); aether.window.toast('Copied the commit id', 'ok', 1500); } catch { aether.window.toast(c.hash); }
  } else if (v === 'show') aether.terminal.run(`git -C "${dir}" show ${c.hash}`);
}

aether.on('activeChanged', follow);
aether.on('changed', ({ path } = {}) => { if (path) { edited.add(path); const ed = aether.editor.active(); if (ed && ed.path === path) hide(); } });
aether.on('saved', ({ path } = {}) => { if (path) { edited.delete(path); blames.delete(path); } soon(); });
aether.commands.register('refresh', 'Git Line: Look Again', () => { blames.clear(); emails.clear(); update(); }, { category: 'Git Line' });
aether.commands.register('show', 'Git Line: Show the Commit for This Line', async () => { await update(); if (shown) details(); else aether.window.toast('No commit for this line here'); }, { category: 'Git Line' });
aether.onDispose(() => { clearTimeout(wait); if (watch) watch.dispose(); });
follow();
