# The code editor

Aether's editor is the same one VS Code is built on (Monaco), with Aether's own extras.

## Languages

More than 100 languages have colours with nothing to install: Python, JavaScript, TypeScript, C, C++, C#, Java, Go, Rust, Lua, Luau, PHP, Ruby, Zig, Nim, GDScript, GLSL, Haskell, Fortran, COBOL, TOML and many more. Aether picks the language from the file. **Ctrl+Alt+M** changes it.

## Suggestions and errors

As you type, Aether suggests names, functions and words of the language, and shows what goes in a function's brackets.

- **Python** gets full help out of the box (Pyright comes with Aether): suggestions for every installed package, docs on hover, go to definition, rename, auto-imports and live errors.
- **Lua, Rust, C and C++, Go, C#, PHP, Bash, YAML and Ruby** get the same with one click: the command **Manage Language Servers** installs the server for you. Java, Kotlin and Swift servers are found if you have them, and GDScript talks to the Godot editor.
- Without a server, 14 languages still get word lists.
- **Packages**: Aether suggests package names in imports, `requirements.txt` (with versions from PyPI) and `package.json` (searching npm). An import that is missing gets an **Install package** fix.

Errors and warnings are underlined in the code and listed in **Problems** (**Ctrl+Shift+M**).

## Moving around

- **Ctrl+G**: go to a line. **Ctrl+Shift+O**: go to a function or class in this file.
- **F12** or Ctrl+click: go to where something is made. Right-click > **Peek** shows it without leaving.
- **F2**: rename something everywhere it is used (and rename files in the Explorer).
- **Sticky scroll** keeps the function you are in at the top. The **minimap** shows the whole file at the side. **View > Toggle Minimap** and the command **Toggle Sticky Scroll** switch them.

## Editing

- **Ctrl+F** finds, **Ctrl+H** replaces. **Ctrl+Shift+F** searches every file.
- **Alt+click** adds a cursor; the command **Add Cursor Above**; **Ctrl+D** picks the next match too.
- **Ctrl+/** comments a line out. **Edit** also sorts lines, changes case and trims spaces at line ends.
- **Alt+Z** turns word wrap on or off.

## Formatting

**Shift+Alt+F** tidies the whole file; the command **Format Selection** tidies part of it.

Prettier comes with Aether (JavaScript, TypeScript, JSON, CSS, HTML, Markdown, YAML). When they are installed, Aether also uses Ruff or Black (Python), gofmt, rustfmt, clang-format, StyLua and shfmt. The command **Toggle Auto-Format** formats when you save, paste or stop typing. The command **Formatting Settings** sets your style, with presets and a live preview, or follows the project's own config files.

## New files and templates

- **Ctrl+N** opens the New File box with 24 templates (a web page, a Python script, a game and more). **Create > Edit New-File Templates** makes them your own.
- **Ctrl+Alt+N** opens a scratch file that is never saved unless you want it.
- **Edit > Insert Code Template** puts in a ready-made piece of code; **Save Selection as Template** keeps your own.
- **Edit My Snippets** (a command): short words that turn into code as you type.

## Seeing it live

**Ctrl+Shift+V** shows a live preview of Markdown and HTML beside the code. For a whole website, use Live Server (see [Running code](run.md#live-server)).

## Staying organised

- **TODOs**: every `TODO` and `FIXME` in your project, in the sidebar (the command **Show TODOs and FIXMEs**).
- **Focus timer**: work in blocks with breaks between (the command **Start Focus Timer**).
- **Code stats**: how many lines you have written in this folder.
- **Your progress**: a level and a streak for the days you code.
