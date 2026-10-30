# Making Aether extensions

An Aether extension is a folder with two files. It runs inside Aether and can add commands with shortcuts, things in the status bar, tabs of its own, languages (colours, completions, hovers, formatting, snippets, problems), themes, and more.

- **Get some:** Extensions (the puzzle icon, Ctrl+Shift+X) › **Aether Marketplace** › **Install**. They come from [the Aether Marketplace](https://github.com/Redfire3248/aether-marketplace), free for anyone, and update with one click.
- **Make one in a minute:** Extensions › **Yours** › **New extension**. Aether makes a small working example and opens its `main.js`.
- **Change it:** edit `main.js`, save, then **Reload all** on the same page. Everything the extension added is taken away and it runs again, so you see your change at once.
- **Where they live:** `%APPDATA%\Aether\aether-extensions\<id>\` (Yours › **Open the folder**).
- **Share it with everyone:** put it on the Aether Marketplace with a pull request. Its README says how (Extensions › Aether Marketplace › **Share yours** opens it).

> **Trust.** An extension can do what Aether can: read and change your files and run programs. Aether asks before it runs an extension the first time. Only run extensions you trust. Extensions you make with **New extension** are trusted, since they are yours.

---

## The two files

**`extension.json`**

```json
{
  "id": "word-count",
  "name": "Word Count",
  "version": "1.0.0",
  "description": "Shows the words in the open file.",
  "author": "You",
  "main": "main.js",
  "style": "style.css"
}
```

| Field | |
|---|---|
| `id` | Letters, numbers, dots and dashes. It is also the folder's name. |
| `name`, `version`, `description`, `author` | Shown on the Extensions page. |
| `main` | The script that runs (default `main.js`). |
| `style` | Optional CSS added to Aether while the extension runs (for your own tabs, or to restyle Aether). |

**`main.js`** runs once when the extension loads, with an `aether` object: the whole API, below.

```js
aether.commands.register('count', 'Count the words', () => {
  const ed = aether.editor.active();
  if (!ed) return aether.window.toast('Open a file first');
  const words = ed.text().split(/\s+/).filter(Boolean).length;
  aether.window.toast(`${words} words`);
}, { key: 'ctrl+alt+w' });
```

Errors are caught: they show as a message, and on the Extensions page under the extension, so one broken extension does not break Aether.

---

## The API

Everything an extension adds (commands, status bar items, tabs, languages, listeners) is removed when it is reloaded or turned off. Functions that add something return an object with `dispose()` if you want to remove it yourself earlier.

### `aether.commands`

| | |
|---|---|
| `register(id, title, run, { key, category })` | A command in the Command Palette (Ctrl+Shift+P), with an optional shortcut (`'ctrl+alt+h'`, `'f8'`, `'ctrl+k ctrl+u'`). Its full id is `<extension id>.<id>`. Users can change the shortcut in Keyboard Shortcuts. |
| `run(id, ...args)` | Runs a command: yours (`'count'`) or Aether's (`'file.save'`, `'view.theme'`, `'run.file'`, `'debug.start'`…). |

### `aether.window`

| | |
|---|---|
| `toast(message, kind?, ms?)` | A message. `kind` is `'info'`, `'ok'` or `'error'`. |
| `ask(prompt, value?)` | A box to type into. Resolves to the text, or `null` if cancelled. |
| `pick(items, placeholder?)` | A searchable list. Items are text, or `{ label, detail, value }`. Resolves to the picked one, or `null`. |
| `confirm(message, detail?)` | OK / Cancel. Resolves to `true` or `false`. |
| `menu(x, y, items)` | A menu at a point on the screen: `[{ label, icon, run }, '-', …]`. |

### `aether.statusBar`

```js
const item = aether.statusBar.add({ text: '0 words', icon: 'type', tooltip: 'Words', onClick: () => aether.commands.run('count') });
item.set('12 words');
```

`set(text)`, `setTooltip(text)`, `setIcon(name)`, `dispose()`. Icon names are Aether's own (`play`, `sparkle`, `music`, `bone`, `puzzle`, `check`, `warning`…).

### `aether.views`: tabs of your own

```js
aether.views.register('stats', {
  title: 'Project stats', icon: 'chart',
  render(el, view) {
    el.innerHTML = '<h2>Hello</h2><button>Count files</button>';
    el.querySelector('button').onclick = async () => {
      const files = await aether.files.list(aether.files.root());
      view.setTitle(`Stats (${files.length})`);
    };
  }
});
aether.commands.register('openStats', 'Show project stats', () => aether.views.open('stats'));
```

`el` is the tab's page: put any HTML in it. Aether's CSS variables work in it (`var(--accent)`, `var(--text)`, `var(--panel)`, `var(--border)`…), and so do Aether's classes like `btn`, `btn primary`, `btn mini`, `muted`, `small`.

### `aether.editor`

`aether.editor.active()` is the code editor you are typing in (or `null`):

| | |
|---|---|
| `path`, `language` | The file and its language id. |
| `text()`, `setText(text)` | All of it. `setText` can be undone with Ctrl+Z. |
| `selectionText()`, `replaceSelection(text)`, `insert(text)` | What is selected. |
| `cursor()` → `{ line, column }`, `goTo(line, column?)` | Where the cursor is. |
| `lineText(n)`, `lineCount()` | Lines (from 1). |
| `save()` | Saves it. |
| `model`, `monacoEditor` | The editor underneath (Monaco), for anything else. |

Also `aether.editor.open(path, line?)` opens a file, and `aether.editor.decorate(path, [{ line, column?, endLine?, endColumn?, className?, message? }])` highlights lines or parts of lines (with a hover message).

### `aether.files`

`root()` (the open folder), `join(...)`, `basename(p)`, `dirname(p)`, `read(path)` → text, `write(path, text)`, `list(dir)` → `[{ name, path, isDir }]`, `exists(path)`, `pick(filters?)` → paths, `reveal(path)` (shows it in Explorer).

### `aether.languages`

**A new language** (file type, colours, comments and brackets). The grammar is a [Monarch](https://microsoft.github.io/monaco-editor/monarch.html) grammar:

```js
aether.languages.register({
  id: 'mylang', extensions: ['.my'], aliases: ['My Lang'],
  comments: { line: '//', block: ['/*', '*/'] },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  grammar: {
    keywords: ['let', 'fn', 'if', 'else', 'return'],
    tokenizer: { root: [
      [/[a-z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
      [/\d+/, 'number'], [/".*?"/, 'string'], [/\/\/.*$/, 'comment']
    ] }
  }
});
```

**Completions, hovers, formatting, snippets, problems** (for any language, yours or one Aether knows):

```js
aether.languages.completions('mylang', ({ word, lineText }) => [
  { label: 'print', insert: 'print(${1:text})', snippet: true, detail: 'print something', kind: 'function' },
  'return'
], ['.']);

aether.languages.hovers('mylang', ({ word }) => (word === 'print' ? '**print(text)**: shows text' : null));

aether.languages.formatter('mylang', (text, { tabSize }) => text.replace(/[ \t]+$/gm, ''));

aether.languages.snippets('javascript', { log: { body: 'console.log(${1});', description: 'console.log' } });

aether.on('saved', async ({ path }) => {
  if (!path.endsWith('.my')) return;
  const text = await aether.files.read(path);
  aether.languages.problems(path, text.includes('TODO') ? [{ line: 1, message: 'Something is left to do', severity: 'warning' }] : []);
});
```

`kind` is one of Monaco's completion kinds in lower case: `function`, `method`, `variable`, `class`, `keyword`, `snippet`, `property`, `field`, `module`, `text`… `severity` is `error`, `warning`, `info` or `hint`.

### `aether.themes`

```js
aether.themes.add({
  id: 'my-sunset', name: 'My Sunset', dark: true,
  ui: { bg: '#1a0f1f', panel: '#211427', editor: '#1d1123', accent: '#ff7a59', accent2: '#ffd166', text: '#f6e7ff' },
  syntax: { keyword: 'ff7a59', string: 'ffd166', comment: '7a5f86', fn: '9ad1ff' }
});
```

It shows in the theme picker. Any colour you leave out comes from Aether Night (or Daylight for `dark: false`). The `ui` keys: `bg`, `panel`, `editor`, `elevated`, `hover`, `border`, `text`, `muted`, `faint`, `accent`, `accent2`, `accentText`, `danger`, `warn`, `ok`. The `syntax` keys: `keyword`, `string`, `number`, `comment`, `fn`, `type`, `variable`, `operator`, `tag`, `attr`, `regexp`, `constant` (hex without `#`).

### `aether.pets`: pets of your own

Add a pet and it behaves like the built-in ones. It visits, walks, sits, naps and peeks. You can pet it, carry it and throw it. It shows in Settings > Pets with Call and Peek buttons and its skins. Draw it in code, or give a sprite sheet.

**Drawn in code.** `draw(g, pose, f)` paints one frame on the pet's own small canvas: 40 × 30 pixels, with its feet on row `f.floor` (28). Aether scales it up crisply, adds the outline, and keeps each frame so it is drawn only once.

```js
const frog = aether.pets.add({
  id: 'frog', name: 'Frog',
  speed: 30,                       // pixels a second when it walks
  says: ['Ribbit.', 'Croak?'],     // what it says when you pet it
  floats: false,                   // true: it floats above the floor, like the ghost
  // the first skin is how draw() paints it; the others swap those three colours (main, light, dark)
  skins: [['green', 'Green', '#4cc95a', '#b8f0a0', '#2c8a3a'], ['blue', 'Poison blue', '#3a8cff', '#bfe0ff', '#1d4fb0']],
  draw(g, pose, f) {
    const hop = pose === 'walk' ? Math.round(Math.abs(Math.sin(f.phase * Math.PI * 2)) * 3) : 0, y = f.floor - 9 - hop;
    f.disc(20, y + 5, 9, 5, '#4cc95a');            // body
    f.px(13, y + 6, 14, 3, '#b8f0a0');             // belly
    f.px(13, y - 1, 4, 4, '#4cc95a'); f.px(23, y - 1, 4, 4, '#4cc95a');   // eye bumps
    const shut = f.blink || pose === 'sleep';
    f.px(14 + f.look, y + (shut ? 1 : 0), 2, shut ? 1 : 2, f.outline);
    f.px(24 + f.look, y + (shut ? 1 : 0), 2, shut ? 1 : 2, f.outline);
  }
});
frog.call();   // it comes now (frog.peek() has it peek in)
```

`pose` is one of `walk`, `sit`, `idle`, `sleep`, `happy`, `held` (being carried, legs going), `peek` (its face over the edge of the window, paws on the bottom row; Aether turns it for the side and top edges) and `dangle` (held up by the scruff). Draw the ones you like. A pose you don't draw can look like another; switch on `pose` as you need.

`f` has:

| | |
|---|---|
| `f.px(x, y, w, h, colour)` | a block of pixels |
| `f.disc(cx, cy, rx, ry, colour)` | a filled oval |
| `f.t` | seconds, for anything that moves on its own (a tail, a wobble) |
| `f.phase` | 0 to 1 through a step while it walks |
| `f.blink`, `f.look` | eyes shut for a blink; where it looks (-1, 0 or 1 pixels sideways) |
| `f.happy`, `f.wave`, `f.ko` | it was just petted; it waves while peeking; it fainted (draw X eyes) |
| `f.width`, `f.height`, `f.floor`, `f.outline` | 40, 30, 28 and the dark outline colour |

**From a sprite sheet.** Frames of one size, in rows, left to right. `poses` gives each pose its frame numbers (counted from 0). A pose you leave out uses `idle`, then `walk`. Frames bigger than 40 × 30 are scaled down to fit. Pixel art with a see-through background looks best.

```js
aether.pets.add({
  id: 'robot', name: 'Robot',
  sprite: {
    image: 'data:image/png;base64,...',   // or a file next to your extension, read with aether.files
    frameWidth: 32, frameHeight: 28, fps: 6,
    poses: { walk: [0, 1, 2, 3], idle: [4], sit: [5], sleep: [6, 7], happy: [8], peek: [9], dangle: [10] }
  }
});
```

`aether.pets.add()` returns `{ id, call(), peek(), dispose() }`. When your extension is turned off, its pets leave and are removed. `aether.pets.call(kind)`, `aether.pets.peek(kind)` and `aether.pets.kinds()` work with any pet, built in or not (`cat`, `dog`, `fox`, `slime`, `ghost`, `chick`).

### Running things

| | |
|---|---|
| `aether.terminal.run(command)` | Runs a command in Aether's terminal, where the user sees it. |
| `aether.shell.exec(file, args, { cwd, timeout })` | Runs a program quietly. Resolves to `{ code, stdout, stderr }`. `cwd` is the open folder by default. |

```js
const r = await aether.shell.exec('git', ['log', '--oneline', '-5']);
aether.log(r.stdout);
```

### Settings, events, logging

| | |
|---|---|
| `aether.settings.get(key, default)`, `set(key, value)` | Your extension's own settings, kept between runs. |
| `aether.on(event, fn)` | `'saved'` `{ path }`, `'activeChanged'` `{ path }` (another tab), `'changed'` `{ path }` (typing, a quarter of a second after), `'reloaded'`. |
| `aether.log(...)` | Writes to the terminal (and the developer console) with your extension's id. |
| `aether.onDispose(fn)` | Runs `fn` when your extension is turned off, updated, reloaded or removed. Use it to undo what you added yourself: timers, elements, listeners on the editor. |

### Underneath

- `aether.monaco` is the editor library itself ([Monaco](https://microsoft.github.io/monaco-editor/docs.html)), for anything the API above does not cover.
- `aether.engine` is Aether Engine (`AetherEngine`): its node types, behaviours, gradients and the rest.
- `aether.id`, `aether.version` (Aether's version), `aether.dir` (your extension's folder), `aether.manifest`.

---

## Examples

**Run the open file's tests with a key**

```js
aether.commands.register('test', 'Run the tests', () => aether.terminal.run('npm test'), { key: 'ctrl+alt+t' });
```

**A TODO counter in the status bar**

```js
const sb = aether.statusBar.add({ icon: 'checklist', tooltip: 'TODOs in this file' });
const count = () => { const ed = aether.editor.active(); const n = ed ? (ed.text().match(/TODO/g) || []).length : 0; sb.set(n ? `${n} TODO` : ''); };
aether.on('changed', count); aether.on('activeChanged', count); count();
```

**Wrap the selection in a tag**

```js
aether.commands.register('wrap', 'Wrap in a tag', async () => {
  const ed = aether.editor.active(); if (!ed) return;
  const tag = await aether.window.ask('Tag', 'div'); if (!tag) return;
  ed.replaceSelection(`<${tag}>${ed.selectionText()}</${tag}>`);
});
```

---

## Extensions from VS Code

The Extensions page also installs VS Code extensions from Open VSX. Aether uses their **colour themes**, **snippets** and **languages** (file types, comments and brackets). VS Code extensions that run their own code need VS Code's own engine, which Aether does not have, so to add behaviour to Aether, write an Aether extension: most things a small VS Code extension does fit in a few lines of the API above.
