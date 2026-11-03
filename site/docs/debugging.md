# Debugging in Aether

The debugger stops your program where you want and lets you look inside it: every variable, the calls that led there, and a console to try things while it waits. It works for **JavaScript** (Node.js) and **Python**.

## Quick start

1. Open a `.js` or `.py` file.
2. Click in the narrow margin **left of a line number** (or put the cursor on a line and press **F9**). A red dot is a **breakpoint**: the program stops just before running that line.
3. Press **F6** (or Run › Start Debugging, or **Debug this file** in the Debug panel).
4. The program runs and stops at the dot. That line is highlighted in yellow, and the **Debug** panel at the bottom shows what is going on.

**F5** still runs a file normally, without the debugger.

## While it is stopped

| Key | Button | |
|---|---|---|
| **F5** | Continue | Run on to the next breakpoint (or the end). |
| **F10** | Step over | Run this line and stop at the next one. |
| **F11** | Step into | Go into the function this line calls. |
| **Shift+F11** | Step out | Run to the end of this function and stop where it was called. |
| **Shift+F5** | Stop | End the program. |
| **Ctrl+Shift+F5** | Restart | Start it again. |
| **F6** (while running) | Pause | Stop wherever it is now. |

The Debug panel:

- **Variables**: every name the stopped code can see, grouped (Local, Closure, Global…). Click an object or a list to open it.
- **Watch**: expressions you want to keep an eye on (press **+**). They are worked out again each time it stops.
- **Call stack**: the functions that led to this line, newest first. Click one to see its line and its variables.
- **Breakpoints**: all of them. Untick one to keep it but skip it; click one to go to its line.
- **Debug console**: type an expression and press Enter. While stopped it runs right there, with the variables, so you can try `items.length` or `player.x + 10`, or even change a value (`speed = 5`). The program's own output (`console.log`, `print`) shows here too.

Hover over a name in the code while stopped to see its value.

## Breakpoints that stop only sometimes

Right-click a breakpoint › **Add a condition**, and type something that is true when it should stop, like `i == 50` or `name == "boss"`. A dot with a white ring has a condition.

## Errors

When the program throws an error nobody catches, the debugger stops on the line it came from and shows the message, with all the variables as they were. Settings: `debugAllExceptions: true` stops on every error, even ones that are caught.

## Python

The first time you debug a Python file, Aether installs **debugpy** (Microsoft's Python debugger, about 5 MB) into Aether's own folder. Your Python and its packages are not changed. Python must be installed and on PATH.

## What it does not do (yet)

- Other languages (C, C++, Go, Rust, Java…): run them with F5. An extension can add a debugger by running one in the terminal (`aether.terminal.run`).
- TypeScript directly: compile it to JavaScript (`tsc`) and debug the `.js`.
- Programs on another computer, or in a browser page (use the browser's own DevTools, F12 in the built-in browser).
