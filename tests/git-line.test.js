const test = require('node:test');
const assert = require('node:assert');
const { load, fakeEditor, plain, settle } = require('./fake-aether');

const A = 'a'.repeat(40), B = 'b'.repeat(40), Z = '0'.repeat(40);
const NOW = Math.floor(Date.now() / 1000);
const PORCELAIN = [
  `${A} 1 1 2`, 'author Sam Lee', 'author-mail <sam@example.com>', `author-time ${NOW - 3 * 86400}`, 'author-tz +0000', 'committer Sam Lee', 'summary Add the parser', 'filename app.js', '\tconst a = 1;',
  `${A} 2 2`, '\tconst b = 2;',
  `${B} 5 3 1`, 'author Me', 'author-mail <me@example.com>', `author-time ${NOW - 7200}`, 'summary Fix the loop', 'previous ccc app.js', 'filename app.js', '\tfor (;;) {}',
  `${Z} 4 4 1`, 'author Not Committed Yet', 'author-mail <not.committed.yet>', `author-time ${NOW}`, 'summary Version of app.js from app.js', 'filename app.js', '\tnew line'
].join('\n') + '\n';

const { fn } = load('git-line');

test('reads git blame --porcelain', () => {
  const b = fn.parseBlame(PORCELAIN);
  assert.strictEqual(b.lines[1].hash, A);
  assert.strictEqual(b.lines[2].hash, A);
  assert.strictEqual(b.lines[3].author, 'Me');
  assert.strictEqual(b.lines[3].summary, 'Fix the loop');
  assert.strictEqual(b.lines[1].mail, 'sam@example.com');
  assert.strictEqual(b.lines[4].hash, Z);
});

test('says how long ago', () => {
  const now = 1_000_000_000;
  assert.strictEqual(fn.ago(now - 10, now), 'just now');
  assert.strictEqual(fn.ago(now - 60, now), '1 minute ago');
  assert.strictEqual(fn.ago(now - 5 * 3600, now), '5 hours ago');
  assert.strictEqual(fn.ago(now - 86400, now), 'yesterday');
  assert.strictEqual(fn.ago(now - 3 * 86400, now), '3 days ago');
  assert.strictEqual(fn.ago(now - 15 * 86400, now), '2 weeks ago');
  assert.strictEqual(fn.ago(now - 400 * 86400, now), '1 year ago');
});

test('says You for your own commits', () => {
  const b = fn.parseBlame(PORCELAIN);
  assert.strictEqual(fn.describe(b.lines[1], 'me@example.com', NOW), 'Sam Lee, 3 days ago');
  assert.strictEqual(fn.describe(b.lines[3], 'ME@example.com', NOW), 'You, 2 hours ago');
  assert.strictEqual(fn.describe(b.lines[4], 'me@example.com', NOW), 'Not committed yet');
});

const gitFake = (calls) => async (file, args) => {
  calls.push(args.join(' '));
  if (args[0] === 'blame') return { code: 0, stdout: PORCELAIN, stderr: '' };
  if (args[0] === 'config') return { code: 0, stdout: 'me@example.com\n', stderr: '' };
  return { code: 1, stdout: '', stderr: '' };
};

test('the status bar follows the cursor, and blames each file once', async () => {
  const calls = [];
  const text = 'const a = 1;\nconst b = 2;\nfor (;;) {}\nnew line';
  const ext = load('git-line', { exec: gitFake(calls), editor: fakeEditor(text, { path: '/repo/app.js', cursor: 0 }) });
  await ext.fn.update();
  const sb = ext.did.status[0];
  assert.strictEqual(sb.text, 'Sam Lee, 3 days ago');
  assert.strictEqual(sb.icon, 'git');
  ext.editor.goTo(3, 1);
  await ext.fn.update();
  assert.strictEqual(sb.text, 'You, 2 hours ago');
  assert.strictEqual(calls.filter((c) => c.startsWith('blame')).length, 1);
  assert.deepStrictEqual(plain(ext.did.execs[0]), { file: 'git', args: ['blame', '--porcelain', '--', 'app.js'], opts: { cwd: '/repo', timeout: 15000 } });

  // typing hides it until the file is saved, then it reads the file again
  await ext.emit('changed', { path: '/repo/app.js' });
  assert.strictEqual(sb.text, '');
  await ext.fn.update();
  assert.strictEqual(sb.text, '');
  await ext.emit('saved', { path: '/repo/app.js' });
  await ext.fn.update();
  assert.strictEqual(sb.text, 'You, 2 hours ago');
  assert.strictEqual(calls.filter((c) => c.startsWith('blame')).length, 2);
  ext.dispose();
});

test('quiet outside a git repository, and when git is missing', async () => {
  const ext = load('git-line', { editor: fakeEditor('x', { path: '/tmp/notes.txt' }) });
  await ext.fn.update();
  assert.strictEqual(ext.did.status[0].text, '');
  assert.strictEqual(ext.did.toasts.length, 0);

  const ext2 = load('git-line', { exec: async () => { throw new Error('spawn git ENOENT'); }, editor: fakeEditor('x', { path: '/a/b.txt' }) });
  await ext2.fn.update();
  assert.strictEqual(ext2.did.status[0].text, '');
});

test('a click shows the commit message', async () => {
  const calls = [];
  const exec = async (file, args) => (args[0] === 'show' ? { code: 0, stdout: 'Fix the loop\n\nIt never stopped.\n' } : gitFake(calls)(file, args));
  const ext = load('git-line', { exec, editor: fakeEditor('a\nb\nc', { path: '/repo/app.js', cursor: 4 }) });
  await ext.fn.update();
  ext.answer = (items) => items.find((i) => i.value === 'show');
  await ext.did.status[0].onClick();
  await settle();
  const pick = ext.did.picks[0];
  assert.strictEqual(pick.items[0].label, 'Fix the loop');
  assert.strictEqual(pick.items[1].label, 'It never stopped.');
  assert.deepStrictEqual(ext.did.terminal, [`git -C "/repo" show ${B}`]);
});
