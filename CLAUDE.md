# Aether Marketplace

Extensions for Aether, a desktop code editor. People install them from inside Aether (Extensions > Aether Marketplace), which reads `index.json` here and downloads each extension's files from `extensions/<id>/`.

## Layout
- `extensions/<id>/`: one extension. It has `extension.json` (id, name, version, description, author, main, icon, tags, style), `main.js`, `README.md`, and any `.css`, `.png`, `.svg` or sound files it uses.
- `API.md`: the whole `aether` API an extension gets: commands, status bar, window, views, editor, files, languages, themes, pets, shell, settings, events and `onDispose`.
- `tools/build-index.js`: builds `index.json` and checks every extension. CI runs `node tools/build-index.js --check`.

## Rules for changes
- After any change to an extension, run `node tools/build-index.js` and commit `index.json`. Raise the extension's `version` so people see Update.
- No `eval`, `new Function` or `child_process`. Run programs with `aether.shell.exec`.
- Clean up everything you add yourself with `aether.onDispose` (timers, elements, editor listeners). The API cleans up its own things.
- Command ids have no dots (`'sortLines'`, not `'sort.lines'`): a dot makes the id global.
- No emoji in anything shown. Use Aether's icon names (see `icon` in the extensions here) and its CSS variables (`var(--accent)`, `var(--text)`, `var(--panel)`, `var(--border)`), so every theme works.
- Write in short, plain words. Every extension's README says what it does and how to use it.
