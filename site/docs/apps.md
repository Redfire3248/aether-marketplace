# Apps: .exe and .apk

Aether turns your work into real apps: a **Windows app (.exe)** or an **Android app (.apk)**, in one click.

## The APPS tab

Click **Apps** in the dock (or **Create > Apps: Make a Windows App or an Android App**). It makes an app from:

- an [Aether Script](aether-script.md) program (`.aes`), with the files it imports;
- an App Maker app (`.aeapp`), below;
- a web page (`index.html`);
- code in Python, C, C++, Go, Rust, C#, Java or JavaScript.

Give it a name, an icon and, for Android, portrait or landscape, then make it. From any open file, **Run > Build an App (.exe) from This File** and **Build an Android App (.apk) from This File** do the same.

## The App Maker

**Create > App Maker: New App** builds a phone app from parts, with no layout code.

### Parts

Title, Text, Button, Input (text, long text, number, password or email, with the right keyboard on phones), Checkbox, Switch, Slider, Choice, List, Picture, Drawing, Progress bar, Timer, Sound, Space, Line, and Screens with a Tabs bar to move between them.

Click a part on the phone to change it: its text, colours, size, how it lines up, and what happens **When tapped** or **When it changes**. Drag parts to put them in order; **Ctrl+Z** undoes.

Start from a blank app or one of the ready-made ones.

### Code

Write what the parts do in **JavaScript** or **Aether Script**:

```js
const list = app.get("todo");
list.items = app.store("todo") || [];      // what was kept last time

// the Add button's "When tapped"
function add() {
  const box = app.get("thing");
  if (!box.text.trim()) return;
  list.add(box.text.trim());
  box.text = "";
  app.store("todo", list.items);           // kept for next time
  app.toast("Added");
}
```

- `app.get("id")`: a part, to read or change it.
- `app.go("screen")`: show another screen.
- `app.toast(text)`, `app.ask(question)`, `app.notify(text)`: tell or ask the person.
- `app.store(key, value)`: remember something, even after the app closes; `app.store(key)` gets it back.
- `app.fetch(url)`: get something from the internet.
- `app.share(text)`, `app.copy(text)`, `app.vibrate()`.

**Try it** runs the app on the phone in Aether. Then make it an Android app or a Windows app. On Windows it opens in a phone-shaped window, in the app's own colours.

## From your own code

A program can make itself into an app:

- **Aether Script**: `Package Aether.Executable`, then `Aether.Executable.Compile()`, `.Apk()` or `.Both()`.
- **Python**: `import Aether.Executable`, then `Aether.Executable.Compile()` or `.Apk()`.
- **JavaScript** (Node): `require('aether').Executable.Compile()`.

Games export from [the game engine](games.md#share-your-game).
