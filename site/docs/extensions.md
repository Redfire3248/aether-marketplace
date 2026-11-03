# Extensions and the Marketplace

Extensions add things to Aether: themes, pets, tools for code, the web and writing.

## Get some

**Ctrl+Shift+X** (or **Ext** in the dock) opens Extensions. Its tabs:

- **Aether Marketplace**: extensions made for Aether, free for anyone. They sort into **Themes**, **Pets**, **Code**, **Web**, **Writing** and **Tools**. Press **Install**: an extension starts at once, with no restart.
- **VS Code themes**: colour themes from Open VSX, the open store of VS Code extensions.
- **Installed**: everything you have. Turn one off, remove it, or update it when a new version is out (**Update to v...**).
- **Yours**: extensions you are making.

You can also look through the Marketplace on this website: [the Marketplace](marketplace.html). Each theme there has a picture of Aether in that theme.

## VS Code extensions

Aether uses the **colour themes**, **snippets** and **languages** (file types, comments and brackets) of VS Code extensions. VS Code extensions that run their own code need VS Code's own engine, which Aether does not have. To add something like that, write an Aether extension: most small VS Code extensions fit in a few lines of Aether's API.

## Make your own

An Aether extension is a folder with two files: `extension.json` (its name, version and icon) and `main.js`. With the `aether` API it can add commands with shortcuts, things in the status bar, tabs of its own, languages, themes, pets and skins, and more.

[Making extensions: the API](API.md) has everything, with examples.

## Share it

Put your extension on the Marketplace: see [Share your own](https://github.com/Redfire3248/aether-marketplace#share-your-own) on the Marketplace's GitHub page.
