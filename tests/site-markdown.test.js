// The website's Markdown renderer (site/md.js), and every extension's README through it.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const md = require('../site/md.js');

const r = (s, o) => md.render(s, o);

test('headings, paragraphs and inline marks', () => {
  assert.strictEqual(r('# Hello world\n\nSome **bold**, *italic*, ~~old~~ and `a < b`.'), '<h1 id="hello-world">Hello world</h1>\n<p>Some <strong>bold</strong>, <em>italic</em>, <del>old</del> and <code>a &lt; b</code>.</p>');
  assert.strictEqual(r('one\ntwo'), '<p>one\ntwo</p>');
  assert.strictEqual(r('snake_case_name stays'), '<p>snake_case_name stays</p>');
  assert.strictEqual(r('`**not bold**`'), '<p><code>**not bold**</code></p>');
  assert.strictEqual(r('\\*not italic\\*'), '<p>*not italic*</p>');
});

test('HTML is shown as text', () => {
  assert.strictEqual(r('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
  assert.strictEqual(r('<img src=x onerror=alert(1)>'), '<p>&lt;img src=x onerror=alert(1)&gt;</p>');
});

test('links and images, safe ones only', () => {
  assert.strictEqual(r('[Git](https://git-scm.com)'), '<p><a href="https://git-scm.com" rel="noopener">Git</a></p>');
  assert.strictEqual(r('[API](API.md)', { linkBase: 'https://x.test/blob/main/' }), '<p><a href="https://x.test/blob/main/API.md" rel="noopener">API</a></p>');
  assert.strictEqual(r('[bad](javascript:alert(1))'), '<p>[bad](javascript:alert(1))</p>');
  assert.strictEqual(r('[bad](javascript:alert)'), '<p>bad</p>');
  assert.strictEqual(r('![A cat](cat.png "Cat")', { imageBase: 'extensions/pets/' }), '<p><img src="extensions/pets/cat.png" alt="A cat" title="Cat" loading="lazy"></p>');
  assert.strictEqual(r('![x](data:image/svg+xml,abc)'), '<p>x</p>');
  assert.strictEqual(r('[**Bold** link](#top)'), '<p><a href="#top"><strong>Bold</strong> link</a></p>');
});

test('lists, nested lists and ordered lists', () => {
  assert.strictEqual(r('- a\n- b **c**'), '<ul><li>a</li><li>b <strong>c</strong></li></ul>');
  assert.strictEqual(r('1. one\n2. two\n   - inner\n3. three'), '<ol><li>one</li><li>two\n<ul><li>inner</li></ul></li><li>three</li></ol>');
  assert.strictEqual(r('3. three\n4. four'), '<ol start="3"><li>three</li><li>four</li></ol>');
  assert.strictEqual(r('- a\n\n- b'), '<ul><li><p>a</p></li><li><p>b</p></li></ul>');
  assert.strictEqual(r('- a\ncarried on\n\nafter'), '<ul><li>a\ncarried on</li></ul>\n<p>after</p>');
});

test('code blocks, quotes, rules and tables', () => {
  assert.strictEqual(r('```js\nif (a < b) {}\n```'), '<pre><code class="language-js">if (a &lt; b) {}</code></pre>');
  assert.strictEqual(r('    indented\n    code'), '<pre><code>indented\ncode</code></pre>');
  assert.strictEqual(r('> **Trust.** Be careful.'), '<blockquote><p><strong>Trust.</strong> Be careful.</p></blockquote>');
  assert.strictEqual(r('---'), '<hr>');
  assert.strictEqual(r('| A | B |\n| :-- | --: |\n| `x\\|y` | 2 |'), '<div class="table"><table><thead><tr><th style="text-align:left">A</th><th style="text-align:right">B</th></tr></thead><tbody><tr><td style="text-align:left"><code>x\\|y</code></td><td style="text-align:right">2</td></tr></tbody></table></div>');
});

test('every README renders, with no raw HTML getting through', () => {
  const dir = path.join(__dirname, '..', 'extensions');
  for (const id of fs.readdirSync(dir)) {
    const html = r(fs.readFileSync(path.join(dir, id, 'README.md'), 'utf8'));
    assert.ok(html.startsWith('<h1'), id);
    assert.ok(!/<(script|iframe|style)/i.test(html), id);
  }
});
