# Aether Marketplace

Extensions for [Aether](https://github.com/Redfire3248), the code editor for everything. Anyone can install them, on any computer, from inside Aether:

**Extensions page (Ctrl+Shift+X) > Aether Marketplace > Install.**

Or look through them on the website: **https://redfire3248.github.io/aether-marketplace/marketplace.html**

They install in a moment, start at once, and update with one click when a new version is here.

## What's here

| Extension | What it does |
| --- | --- |
| [Text Tools](extensions/text-tools) | Change case (camelCase, snake_case, Title Case…), sort, clean up, number or join lines. |
| [Focus Timer](extensions/focus-timer) | Focus blocks and breaks from the status bar, with a chime and a count for the day. |
| [Word Count](extensions/word-count) | Words and reading time for Markdown and text, and for any selection. |
| [Colour Swatches](extensions/colour-swatches) | A square of the colour before every colour in your code. |
| [Quick Insert](extensions/quick-insert) | Placeholder text, dates, times, unique ids, strong passwords, random numbers. |
| [Pet Pack](extensions/pet-pack) | A frog, a penguin and a bunny to visit you, with skins. |
| [JSON Tools](extensions/json-tools) | Format, minify or sort the keys of JSON, and see where the error is when it is not valid. |
| [Markdown Tables](extensions/markdown-tables) | Line up a table's columns, add a row or a column, and turn CSV or tab-separated text into a table. |
| [Git Line](extensions/git-line) | Who last changed the cursor's line and when, in the status bar. Click it for the commit message. |
| [Regex Lab](extensions/regex-lab) | A tab to try a regular expression on some text, with the matches highlighted and the groups listed. |
| [HTML Quick](extensions/html-quick) | Type `ul>li*3` or `div.card>h2+p` and press Ctrl+Alt+E to turn it into HTML. |
| [Deep Sea](extensions/theme-deep-sea) | Theme. Dark and calm, deep blues with teal. |
| [Ember](extensions/theme-ember) | Theme. Dark and warm, browns with a glowing orange. |
| [Forest Night](extensions/theme-forest-night) | Theme. Dark and quiet, deep greens with mint. |
| [Paper](extensions/theme-paper) | Theme. Light and warm, like a page in a book. |
| [Glacier](extensions/theme-glacier) | Theme. Light and cool, crisp blues and greys. |
| [Plum Dusk](extensions/theme-plum-dusk) | Theme. Dark and soft, deep purples with pink. |
| [Mint Cream](extensions/theme-mint-cream) | Theme. Light and fresh, soft greens. |
| [Neon Tide](extensions/theme-neon-tide) | Theme. Dark and bright, glowing teal and pink. |
| [Pixel Sunset](extensions/theme-pixel-sunset) | Theme. Square pixels at dusk: deep purple with orange and pink. |
| [Pixel Mint](extensions/theme-pixel-mint) | Theme. Square pixels, cool and clean: deep teal with bright mint. |
| [Pixel Cherry](extensions/theme-pixel-cherry) | Theme. Square pixels with a bite: dark red with cherry pink. |
| [Pixel Amber](extensions/theme-pixel-amber) | Theme. An old amber monitor: warm glowing orange on black. |
| [Pixel Vapor](extensions/theme-pixel-vapor) | Theme. Square pixels, loud and pink: hot pink and cyan on indigo. |
| [Pixel Paper](extensions/theme-pixel-paper) | Theme. Square pixels on a light page: cream with bold ink. |
| [Cyber Noir](extensions/theme-cyber-noir) | Theme. Black and electric yellow, straight out of the future. |
| [Blood Moon](extensions/theme-blood-moon) | Theme. Dark and dramatic: black-red with a burning crimson. |
| [Arctic Night](extensions/theme-arctic-night) | Theme. Cold and clear: midnight blue with icy light. |
| [Tokyo Rain](extensions/theme-tokyo-rain) | Theme. City lights in the rain: deep indigo with neon signs. |
| [Lavender Mist](extensions/theme-lavender-mist) | Theme. Light and soft: pale purple with deep violet ink. |
| [Matcha](extensions/theme-matcha) | Theme. Calm and light: creamy green tea with deep leaf green. |

## Share your own

1. Make it in Aether: **Extensions > Yours > New extension**. The whole API is in [API.md](API.md) (also in Aether: **Help > How to Make an Aether Extension**).
2. Fork this repository and copy your extension's folder into `extensions/<your-id>/`. It needs:
   - `extension.json` with `id` (the folder's name), `name`, `version` (like `1.0.0`), `description`, `author`, and optionally `icon` (an Aether icon name), `tags` and `style` (a CSS file);
   - `main.js` (or the file named in `main`);
   - `README.md` saying what it does and how to use it.
3. Run `node tools/build-index.js` and commit `index.json` with it.
   You can add tests too, in `tests/<your-id>.test.js` (Node's test runner, with the small fake `aether` in `tests/fake-aether.js`). Run them with `npm test`.
4. Open a pull request. The check runs on it, then the extension is read through before it goes in.

### What goes in

- It does what its README says, and nothing it doesn't say. No collecting data, no ads, no downloading and running other code.
- No `eval`, `new Function` or `child_process`: run programs with `aether.shell.exec`, where people can see them.
- It cleans up after itself: use `aether.onDispose()` for timers, elements and listeners you add yourself.
- Only `.js .json .md .css .png .svg .txt .wav .mp3 .ogg` files, 40 at most, 5 MB in all.
- Updating one: raise its `version`, so people see **Update** in Aether.

## The website

[redfire3248.github.io/aether-marketplace](https://redfire3248.github.io/aether-marketplace/) is the home page for Aether and this Marketplace. It is in `site/`: plain HTML, CSS and a little JavaScript, with no build step. Every push to `main` publishes it (`.github/workflows/pages.yml`), with `index.json` and the `extensions/` folders next to it.

To look at it on your own computer, serve the repository's folder and open `site/`:

```
python -m http.server 8000
```

Then go to http://localhost:8000/site/.

## License

Each extension is under the MIT license unless its own folder says otherwise.
