const test = require('node:test');
const assert = require('node:assert');
const { load, plain } = require('./fake-aether');

const { fn } = load('html-quick');
const x = (abbr, opts) => fn.expand(abbr, opts);

test('children and repeats', () => {
  assert.strictEqual(x('ul>li*3'), '<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>');
  assert.strictEqual(x('div.card>h2+p'), '<div class="card">\n  <h2></h2>\n  <p></p>\n</div>');
});

test('id, classes, attributes and text', () => {
  assert.strictEqual(x('section#main.a.b[data-x=1 title="Hi there" hidden]{Hello}'), '<section id="main" class="a b" data-x="1" title="Hi there" hidden="">Hello</section>');
  assert.strictEqual(x('a{Home}'), '<a href="">Home</a>');
  assert.strictEqual(x('a[href=/about]'), '<a href="/about"></a>');
  assert.strictEqual(x('img'), '<img src="" alt="">');
  assert.strictEqual(x('input[type=email]'), '<input type="email">');
});

test('the tag is guessed from the parent when left out', () => {
  assert.strictEqual(x('.box'), '<div class="box"></div>');
  assert.strictEqual(x('ul>.item'), '<ul>\n  <li class="item"></li>\n</ul>');
  assert.strictEqual(x('table>.row>.cell'), '<table>\n  <tr class="row">\n    <td class="cell"></td>\n  </tr>\n</table>');
  assert.strictEqual(x('p>.note'), '<p>\n  <span class="note"></span>\n</p>');
});

test('numbers with $', () => {
  assert.strictEqual(x('li.item$*2{Item $}'), '<li class="item1">Item 1</li>\n<li class="item2">Item 2</li>');
  assert.strictEqual(x('p#n$$*2'), '<p id="n01"></p>\n<p id="n02"></p>');
  assert.strictEqual(x('p{Costs \\$5}'), '<p>Costs $5</p>');
});

test('climbing up with ^ and groups', () => {
  assert.strictEqual(x('div>p^span'), '<div>\n  <p></p>\n</div>\n<span></span>');
  assert.strictEqual(x('header>nav^^main'), '<header>\n  <nav></nav>\n</header>\n<main></main>');
  assert.strictEqual(x('(dt+dd)*2'), '<dt></dt>\n<dd></dd>\n<dt></dt>\n<dd></dd>');
  assert.strictEqual(x('div>(h1+p)+footer'), '<div>\n  <h1></h1>\n  <p></p>\n  <footer></footer>\n</div>');
});

test('a whole page with !', () => {
  const page = x('!');
  assert.ok(page.startsWith('<!DOCTYPE html>\n<html lang="en">\n<head>'));
  assert.ok(page.includes('<title>Document</title>'));
  assert.ok(page.endsWith('</body>\n</html>'));
});

test('tabs, JSX and snippets', () => {
  assert.strictEqual(x('ul>li', { indent: '\t' }), '<ul>\n\t<li></li>\n</ul>');
  assert.strictEqual(x('label.l+input', { jsx: true }), '<label className="l" htmlFor=""></label>\n<input type="text" />');
  assert.strictEqual(x('a+p{$}', { snippet: true }), '<a href="${1}">${2}</a>\n<p>1</p>');
  assert.strictEqual(x('p{x\\$y}', { snippet: true }), '<p>x\\$y</p>');
});

test('says what is wrong', () => {
  assert.throws(() => x('ul>'), /Expected a tag/);
  assert.throws(() => x('div[x'), /"\]" is missing/);
  assert.throws(() => x('(a+b'), /"\)" is missing/);
  assert.throws(() => x('li*'), /number is missing/);
  assert.throws(() => x(''), /no abbreviation/);
});

test('finds the abbreviation before the cursor', () => {
  const at = (line) => plain(fn.abbrBefore(line, line.length + 1));
  assert.deepStrictEqual(at('    ul>li*3'), { start: 5, abbr: 'ul>li*3' });
  assert.deepStrictEqual(at('<p>ul>li'), { start: 4, abbr: 'ul>li' });
  assert.deepStrictEqual(at('x p{Hello there}'), { start: 3, abbr: 'p{Hello there}' });
  assert.deepStrictEqual(at('a[title="a b"]'), { start: 1, abbr: 'a[title="a b"]' });
  assert.strictEqual(fn.abbrBefore('   ', 4), null);
});

test('the command turns the abbreviation into a snippet', async () => {
  const ext = load('html-quick');
  const line = '  nav>a*2';
  let inserted = null, selected = null;
  ext.editor = {
    path: '/site/index.html', language: 'html',
    selectionText: () => '', lineText: () => line,
    monacoEditor: {
      getSelection: () => ({ startLineNumber: 1, startColumn: 10, endLineNumber: 1, endColumn: 10 }),
      getModel: () => ({ getOptions: () => ({ tabSize: 4, insertSpaces: true }) }),
      setSelection: (r) => { selected = r; },
      getContribution: () => ({ insert: (s) => { inserted = s; } }),
      focus() {}
    }
  };
  assert.deepStrictEqual(plain(ext.did.commands.expand.key), ['ctrl+alt+e', 'ctrl+alt+h']);
  await ext.aether.commands.run('expand');
  assert.deepStrictEqual(plain(selected), { startLineNumber: 1, startColumn: 3, endLineNumber: 1, endColumn: 10 });
  assert.strictEqual(inserted, '<nav>\n    <a href="${1}">${2}</a>\n    <a href="${3}">${4}</a>\n</nav>');
});
