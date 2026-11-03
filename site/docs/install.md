# Install and update

Aether is free, with no account.

## Windows

1. On [Aether's page](https://redfire3248.github.io/aether-download/), press **Download for Windows**. You get `Aether-Setup.exe`.
2. Open it. Aether is new and not code-signed yet, so Windows may warn you. Press **More info**, then **Run anyway**.
3. Pick where to install it and finish.

Aether is then on your Start menu and desktop. Right-click a file or a folder in File Explorer and pick **Open with Aether** to open it straight away.

Windows 10 and 11 are supported.

## macOS

Each release has two `.dmg` files: one for Apple silicon (`arm64`) and one for Intel Macs (`x64`). Find them under **All versions** on [Aether's page](https://redfire3248.github.io/aether-download/).

Open the `.dmg` and drag Aether into Applications. The app is not signed yet. If macOS says it can't check it, open **System Settings > Privacy & Security** and press **Open Anyway**.

## Linux

Each release has an **AppImage** and a **.deb** for 64-bit PCs, under **All versions**.

- **AppImage**: make it runnable (right-click > Properties > Allow running, or `chmod +x Aether-*.AppImage`), then open it.
- **.deb** (Debian, Ubuntu, Mint): `sudo apt install ./Aether-*.deb`. Aether is then in your apps, and text and code files can open with it.

## Updates

**Help > Check for Updates** asks if there is a newer Aether. If there is, it shows what is new and opens the download page. Install the new version over the old one: your settings, themes, extensions and projects stay.

Every change is in the changelog: **Help > What's New in Aether**.

## Keep your settings

**Settings > Backup** saves all your settings to a file, and loads them again on another PC. API keys, tokens and passwords are never put in that file.

## Make it lighter

On an older PC, the command **Toggle Lite Mode** (Ctrl+Shift+P, then type it) turns off animations, glow, background effects, the minimap, AI autocomplete, language servers and live previews in one go. Switch it off and they all come back. See [Themes and settings](themes.md#performance).
