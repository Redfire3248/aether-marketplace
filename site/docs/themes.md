# Themes and settings

## Themes

**Ctrl+Alt+T** (**View > Color Theme**) picks a theme. As you move through the list, the window changes, so you see each one before you pick it. **System** follows your computer's dark or light mode.

Aether has **51 themes**, dark and light, and every one meets the WCAG AA contrast guidelines, so text is easy to read. Some restyle the whole window, not just its colours:

- **Pixel** (12 themes, like Pixel Arcade, Pixel Game Boy, Pixel NES and Pixel PICO-8): square corners, hard shadows, a pixel font and pixel-art icons.
- **CRT**, **Neon**, **Glass**, **Blueprint**, **Brutal** and **Sketch**.

### Your own themes

- **Settings > Theme > New theme from this one** copies the theme you have, to make it your own. Rename it, **Save as a file** to share it, and **Load a theme file** to bring one in.
- **Settings > Colours** changes any theme's colours (accent, background, panels, editor, text, borders) and the colour of each kind of word in code. They are kept for that theme.
- More themes are in the [Marketplace](extensions.md), and colour themes made for VS Code install from **Extensions > VS Code themes**.

## Settings

**Ctrl+,** (or **Settings** in the dock) opens Settings. Its pages:

- **Theme**, **Colours**, **Fonts & size** (the interface size and the editor's font), **Look & motion** (animations, glow, **Reduce motion**).
- **Editor** and **Editor display**: line numbers, the cursor, word wrap, the minimap, sticky scroll.
- **Formatting**: your code style. **Files**: auto save. **Terminal** and **Running code**: how runs show and start.
- **Tabs & dock**: tab colours and limits, the dock's buttons and labels, the status bar's items.
- **AI**: models and your keys (see [AI](ai.md)). **Pets** (see [Pets](pets.md)).
- **Game tools**, **Arduino**, **Debugging**, **Extensions**, **File icons**, **Productivity**, **Web** and **Fun**.
- **Backup**: save your settings to a file, and load them again. Keys and passwords are never in it.
- **About**: your version.

## Performance

On a slower PC, the command **Toggle Lite Mode** turns off animations, glow, theme background effects, the minimap, AI autocomplete, language servers, live previews and the start-screen game in one switch, and brings them back when you switch it off. **Performance Settings** turns each one on or off on its own. Aether suggests Lite mode when your PC looks modest.

Big tools (the game engine, Art, Pixel, GUI, Arduino, Sound and Particle studios) load the first time you open them, so Aether starts fast.

## Keyboard and screen readers

Every button has a name for screen readers and a focus outline. The dock, tabs and file tree work with the arrow keys, and **Ctrl+F6** moves between the parts of the window. **Reduce motion** stops animations and makes the pets sit still.

## File icons

Every kind of file has its own icon, and code files show their language's logo (pixelated in pixel themes). To use your own, drop PNGs named after an extension (`py.png`, `folder.png`) into the folder that the command **Open Custom File-Icons Folder** opens, then run **Reload File Icons**.
