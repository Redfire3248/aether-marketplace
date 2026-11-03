# Files, search and Git

## Open things

- **Ctrl+Alt+O** opens a folder; its files show in the Explorer (**Ctrl+Shift+E**).
- **Ctrl+O** opens one file. You can also drag files onto Aether.
- On Windows, right-click a file or folder in File Explorer and pick **Open with Aether**.

## The Explorer

- New file and new folder buttons at the top, or right-click a folder.
- **F2** (or double-click the name) renames.
- Drag files into other folders.
- Right-click a file to reveal it in your system's file manager, copy its path or delete it.
- Every kind of file has its own icon, and programming languages show their real logos. You can use your own icons: put PNGs named after an extension (like `py.png`) in the custom icons folder (the command **Open Custom File-Icons Folder**).

## Saving

- **Ctrl+S** saves, **Ctrl+Shift+S** saves as, **Ctrl+Alt+S** saves every file.
- **Settings > Files > Auto save** saves files one second after you stop typing.
- **File > Revert File** goes back to the saved copy.
- The status bar shows the file's encoding, line endings (LF or CRLF) and indentation; click one to change it.

## Search

- **Ctrl+Shift+F** searches every file in the folder, with **Match case** and **Regular expression**. The Replace box under it replaces in the open file.
- **Ctrl+P** finds a file by name.
- **Ctrl+F** searches the open file.

## Git

**Ctrl+Shift+G** opens Source Control:

- what changed since your last commit, file by file;
- click a file to see its changes side by side (**Git: Open Changes of Active File**);
- write a message and commit (**Git: Commit All**), or let the AI write the message (**AI > AI: Write Commit Message**);
- the branch you are on, in the status bar.

To push and pull, use the terminal (`git push`, `git pull`). Git must be installed on your PC. Get it from [git-scm.com](https://git-scm.com).
