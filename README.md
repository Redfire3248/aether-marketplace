# Aether Marketplace

Extensions for [Aether](https://github.com/Redfire3248), the code editor for everything. Anyone can install them, on any computer, from inside Aether:

**Extensions page (Ctrl+Shift+X) > Aether Marketplace > Install.**

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

## Share your own

1. Make it in Aether: **Extensions > Yours > New extension**. The guide is in Aether under **Help > How to Make an Aether Extension**.
2. Fork this repository and copy your extension's folder into `extensions/<your-id>/`. It needs:
   - `extension.json` with `id` (the folder's name), `name`, `version` (like `1.0.0`), `description`, `author`, and optionally `icon` (an Aether icon name), `tags` and `style` (a CSS file);
   - `main.js` (or the file named in `main`);
   - `README.md` saying what it does and how to use it.
3. Run `node tools/build-index.js` and commit `index.json` with it.
4. Open a pull request. The check runs on it, then the extension is read through before it goes in.

### What goes in

- It does what its README says, and nothing it doesn't say. No collecting data, no ads, no downloading and running other code.
- No `eval`, `new Function` or `child_process`: run programs with `aether.shell.exec`, where people can see them.
- It cleans up after itself: use `aether.onDispose()` for timers, elements and listeners you add yourself.
- Only `.js .json .md .css .png .svg .txt .wav .mp3 .ogg` files, 40 at most, 5 MB in all.
- Updating one: raise its `version`, so people see **Update** in Aether.

## License

Each extension is under the MIT license unless its own folder says otherwise.
