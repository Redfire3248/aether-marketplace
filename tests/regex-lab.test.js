const test = require('node:test');
const assert = require('node:assert');
const { load, fakeEditor, plain } = require('./fake-aether');

const { fn } = load('regex-lab');

test('finds every match, with numbered and named groups', () => {
  const r = fn.runRegex('(\\w+)@(?<site>\\w+)\\.com', 'g', 'sam@example.com, jo@mail.com');
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(plain(r.matches), [
    { index: 0, end: 15, text: 'sam@example.com', groups: [{ n: 1, name: '', value: 'sam', start: 0, end: 3 }, { n: 2, name: 'site', value: 'example', start: 4, end: 11 }] },
    { index: 17, end: 28, text: 'jo@mail.com', groups: [{ n: 1, name: '', value: 'jo', start: 17, end: 19 }, { n: 2, name: 'site', value: 'mail', start: 20, end: 24 }] }
  ]);
});

test('without g, only the first match', () => {
  assert.strictEqual(fn.runRegex('a', '', 'a a a').matches.length, 1);
  assert.strictEqual(fn.runRegex('A', 'gi', 'a a a').matches.length, 3);
});

test('a group that took no part is null', () => {
  const g = fn.runRegex('(x)|(y)', 'g', 'y').matches[0].groups;
  assert.strictEqual(g[0].value, null);
  assert.strictEqual(g[1].value, 'y');
});

test('empty matches do not loop for ever', () => {
  const r = fn.runRegex('x*', 'g', 'abc');
  assert.strictEqual(r.matches.length, 4);
  assert.ok(r.matches.every((m) => m.text === ''));
  assert.strictEqual(fn.runRegex('', 'gu', '\u{1F600}\u{1F600}').matches.length, 0); // an empty pattern means nothing to show
  assert.strictEqual(fn.runRegex('(?:)', 'gu', '\u{1F600}\u{1F600}').matches.length, 3);
});

test('stops at the most it shows', () => {
  const r = fn.runRegex('.', 'g', 'abcdef', 3);
  assert.strictEqual(r.matches.length, 3);
  assert.strictEqual(r.more, true);
});

test('says what is wrong with a pattern', () => {
  const r = fn.runRegex('(a', 'g', 'aaa');
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.error, 'Unterminated group');
});

test('highlights matches and escapes the rest', () => {
  const t = '<b>a</b> & a';
  const html = fn.highlight(t, fn.runRegex('a', 'g', t).matches);
  assert.strictEqual(html, '&lt;b&gt;<mark class="rxl-hit">a</mark>&lt;/b&gt; &amp; <mark class="rxl-hit rxl-alt">a</mark>');
  assert.strictEqual(fn.highlight('ab', fn.runRegex('(?=b)', 'g', 'ab').matches), 'a<span class="rxl-empty"></span>b');
});

test('previews a replace', () => {
  assert.strictEqual(fn.replaced('(\\w+)@(?<site>\\w+)', 'g', 'sam@a jo@b', '$<site>:$1').text, 'a:sam b:jo');
  assert.strictEqual(fn.replaced('o', '', 'foo', '0').text, 'f0o');
});

test('the tab and its commands', async () => {
  const ext = load('regex-lab');
  assert.ok(ext.did.views.lab);
  assert.strictEqual(ext.did.commands.open.key, 'ctrl+alt+r');
  await ext.aether.commands.run('open');
  assert.strictEqual(ext.did.opened[0].name, 'lab');
  ext.editor = fakeEditor('');
  await ext.aether.commands.run('trySelection');
  assert.match(ext.did.toasts.at(-1).message, /Select some text/);
});
