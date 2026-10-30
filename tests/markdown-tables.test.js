const test = require('node:test');
const assert = require('node:assert');
const { load, fakeEditor, plain } = require('./fake-aether');

const { fn } = load('markdown-tables');

test('splits a row into cells, keeping escaped pipes and code', () => {
  assert.deepStrictEqual(plain(fn.splitRow('| a | b \\| c | `x|y` |')), ['a', 'b \\| c', '`x|y`']);
  assert.deepStrictEqual(plain(fn.splitRow('a|b')), ['a', 'b']);
  assert.deepStrictEqual(plain(fn.splitRow('| a | |')), ['a', '']);
});

test('lines up the columns and keeps the alignment', () => {
  const out = fn.formatTable(['|Name|Qty|Note|', '|:-|-:|:-:|', '|Apple|3|red|', '|Kiwi|12|green and small|']);
  assert.deepStrictEqual(plain(out), [
    '| Name  | Qty |      Note       |',
    '| :---- | --: | :-------------: |',
    '| Apple |   3 |       red       |',
    '| Kiwi  |  12 | green and small |'
  ]);
});

test('fills short rows and keeps the indent', () => {
  assert.deepStrictEqual(plain(fn.formatTable(['  a | b', '  --|--', '  1'])), ['  | a   | b   |', '  | --- | --- |', '  | 1   |     |']);
});

test('wide letters count as two columns', () => {
  assert.deepStrictEqual(plain(fn.formatTable(['|a|', '|-|', '|日本|'])), ['| a    |', '| ---- |', '| 日本 |']);
});

test('finds the table around a line', () => {
  const lines = ['text', '', '| a | b |', '| - | - |', '| 1 | 2 |', '', 'more'];
  assert.deepStrictEqual(plain(fn.tableAround(lines, 4)), { start: 2, end: 4 });
  assert.strictEqual(fn.tableAround(lines, 0), null);
  assert.strictEqual(fn.tableAround(['a | b', 'c | d'], 0), null);
});

test('knows which cell a column is in', () => {
  const row = '| aa | bb | cc |';
  assert.strictEqual(fn.cellAt(row, 1), 0);
  assert.strictEqual(fn.cellAt(row, 4), 0);
  assert.strictEqual(fn.cellAt(row, 7), 1);
  assert.strictEqual(fn.cellAt(row, 14), 2);
  assert.strictEqual(fn.cellStart(row, 1), 8);
});

test('adds a row and a column', () => {
  const t = ['| a | b |', '| - | - |', '| 1 | 2 |'];
  const r = fn.addRow(t, 0);
  assert.strictEqual(r.row, 2);
  assert.deepStrictEqual(plain(r.lines), ['| a   | b   |', '| --- | --- |', '|     |     |', '| 1   | 2   |']);
  const c = fn.addColumn(t, 0);
  assert.strictEqual(c.col, 1);
  assert.deepStrictEqual(plain(c.lines), ['| a   |     | b   |', '| --- | --- | --- |', '| 1   |     | 2   |']);
});

test('turns comma- and tab-separated text into a table', () => {
  assert.deepStrictEqual(plain(fn.csvToTable('name,age\n"Smith, Jo",42\nAl,7\n')), ['| name      | age |', '| --------- | --- |', '| Smith, Jo | 42  |', '| Al        | 7   |']);
  assert.deepStrictEqual(plain(fn.csvToTable('x\ty|z\n1\t2')), ['| x   | y\\|z |', '| --- | ---- |', '| 1   | 2    |']);
  assert.strictEqual(fn.csvToTable('\n\n'), null);
});

test('the commands work in the editor', async () => {
  const ext = load('markdown-tables');
  const text = '# Fruit\n\n|a|b|\n|-|-|\n|apple|1|\n';
  ext.editor = fakeEditor(text, { cursor: text.indexOf('apple') + 2, language: 'markdown' });
  await ext.aether.commands.run('align');
  assert.strictEqual(ext.editor.text(), '# Fruit\n\n| a     | b   |\n| ----- | --- |\n| apple | 1   |\n');
  assert.deepStrictEqual(plain(ext.editor.cursor()), { line: 5, column: 3 });
  await ext.aether.commands.run('addRow');
  assert.strictEqual(ext.editor.text().split('\n')[5], '|       |     |');
  assert.deepStrictEqual(plain(ext.editor.cursor()), { line: 6, column: 3 });

  ext.editor = fakeEditor('a,b\n1,2', { selection: [0, 7] });
  await ext.aether.commands.run('fromText');
  assert.strictEqual(ext.editor.text(), '| a   | b   |\n| --- | --- |\n| 1   | 2   |');

  ext.editor = fakeEditor('no table here');
  await ext.aether.commands.run('align');
  assert.match(ext.did.toasts.at(-1).message, /cursor in a Markdown table/);
});
