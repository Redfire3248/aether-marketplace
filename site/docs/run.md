# Running code

## Run a file: F5

Open a file and press **F5** (**Run > Run Active File**). It runs in the terminal at the bottom, and its output shows there. **Run > Stop Running Command** stops it.

Aether runs these, once the language is on your PC: Python, JavaScript (Node.js), TypeScript, C, C++, C#, F#, Java, Kotlin, Go, Rust, Swift, Dart, Ruby, PHP, Lua, Perl, R, Julia, Elixir, Haskell, Zig, Nim, PowerShell, shell scripts and batch files.

[Aether Script](aether-script.md) needs nothing installed: a `.aes` program runs inside Aether, and can open windows of its own.

In a game folder, F5 runs the game whatever file is open. **Ctrl+F5** always runs the game.

## Live Run

**Ctrl+Alt+F5** (**Run > Live Run**) runs the file again every time you change it, so you see the result as you type. Press it again to stop. **Settings > Running code** sets how it starts and whether it clears the old output.

## Debugging

**F6** runs the file with the debugger, so it stops at your breakpoints and you can look inside. See [Debugging](debugging.md).

## The terminal

**Ctrl+`** opens the terminal panel. It is a real terminal: run any command there.

- **Terminal > Open Terminal in Folder of Active File** starts one where your file is.
- **Terminal > Clear Terminal** empties it.
- **Settings > Terminal** sets how a run shows (like a shell, or only what the program prints), whether the terminal clears before each run, colours and the font size.

## Live Server

For a website: open its `index.html` and press **Ctrl+Alt+L** (**Create > Live Server: Go Live / Stop**). It opens the page in Aether's browser and reloads it every time you save. **Live Server: Open in System Browser** opens it in your own browser.

## The web browser

**Ctrl+Shift+B** opens a browser inside Aether. The **Create** menu can search the web, GitHub, code on GitHub and the MDN docs straight from Aether.

## Make it an app

**Run > Build an App (.exe) from This File** and **Build an Android App (.apk) from This File** turn a program into an app. See [Apps](apps.md).
