const test = require('node:test');
const assert = require('node:assert');
const { load, fakeEditor } = require('./fake-aether');

const { fn } = load('json-tools');

test('formats with the indent it is given', () => {
  assert.strictEqual(fn.formatJson('{"a":1,"b":[true,null,{}],"c":{"d":"x"}}').text, '{\n  "a": 1,\n  "b": [\n    true,\n    null,\n    {}\n  ],\n  "c": {\n    "d": "x"\n  }\n}');
  assert.strictEqual(fn.formatJson('[1,2]', '\t').text, '[\n\t1,\n\t2\n]');
  assert.strictEqual(fn.formatJson('  []  ').text, '[]');
});

test('minifies', () => {
  assert.strictEqual(fn.minifyJson('{\n  "a": [ 1, 2 ],\n  "b": "x y"\n}').text, '{"a":[1,2],"b":"x y"}');
});

test('keeps numbers and strings exactly as written', () => {
  assert.strictEqual(fn.minifyJson('[1.50, 12345678901234567890, 1e5, "\\u00e9\\n"]').text, '[1.50,12345678901234567890,1e5,"\\u00e9\\n"]');
});

test('sorts the keys at every level, and keeps one line on one line', () => {
  assert.strictEqual(fn.sortJsonKeys('{"b":1,"a":{"z":1,"y":[{"d":1,"c":2}]}}').text, '{"a":{"y":[{"c":2,"d":1}],"z":1},"b":1}');
  assert.strictEqual(fn.sortJsonKeys('{\n "b": 1,\n "a": 2\n}').text, '{\n  "a": 2,\n  "b": 1\n}');
});

test('says where the error is', () => {
  const cases = [
    ['{"a": 1,}', 'Trailing comma', 1, 9],
    ['{"a": 1\n "b": 2}', 'Expected "," or "}"', 2, 2],
    ["{'a': 1}", 'double quotes', 1, 2],
    ['[1, 2', 'ends too soon', 1, 6],
    ['{"a": "x}', 'not closed', 1, 7],
    ['// hi\n{}', 'Comments', 1, 1],
    ['{"a": undefined}', 'undefined is not allowed', 1, 7],
    ['[01]', 'number', 1, 3],
    ['{} {}', 'after the end', 1, 4],
    ['', 'no JSON', 1, 1]
  ];
  for (const [text, message, line, column] of cases) {
    const r = fn.parseJson(text);
    assert.strictEqual(r.ok, false, text);
    assert.ok(r.message.includes(message), `${text}: ${r.message}`);
    assert.deepStrictEqual([r.line, r.column], [line, column], text);
  }
});

test('the commands change the selection, or the whole file', async () => {
  const ext = load('json-tools');
  ext.editor = fakeEditor('{"b":1,"a":2}\n', { language: 'json' });
  await ext.aether.commands.run('format');
  assert.strictEqual(ext.editor.text(), '{\n  "b": 1,\n  "a": 2\n}\n');
  await ext.aether.commands.run('sort');
  assert.strictEqual(ext.editor.text(), '{\n  "a": 2,\n  "b": 1\n}\n');

  ext.editor = fakeEditor('x = [1, 2];', { selection: [4, 10] });
  await ext.aether.commands.run('minify');
  assert.strictEqual(ext.editor.text(), 'x = [1,2];');
});

test('an error moves the cursor there and changes nothing', async () => {
  const ext = load('json-tools');
  ext.editor = fakeEditor('{\n  "a": 1,\n}');
  await ext.aether.commands.run('format');
  assert.strictEqual(ext.editor.text(), '{\n  "a": 1,\n}');
  assert.deepStrictEqual({ ...ext.editor.cursor() }, { line: 3, column: 1 });
  assert.match(ext.did.toasts.at(-1).message, /line 3, column 1/);
  assert.strictEqual(ext.did.toasts.at(-1).kind, 'error');
});
