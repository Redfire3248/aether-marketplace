# Aether Script

Aether Script is Aether's own language. It reads like Python and is made for two things:

- **Programs**: a `.aes` file you run on its own with **F5**. Its lines run from top to bottom,
  `print()` writes to the Output, and `Window()` opens windows of your own.
- **Game scripts**: a `.aes` file attached to a node in a Scene. It has `on` blocks (`on update(dt):`)
  that the game engine calls.

Aether tells them apart by what is in the file: lines at the top that do something make a program,
`on` blocks with only `var`, `const` and `func` around them make a game script.

Help > Aether Script Guide opens this page. Every example here runs as it is.

## Contents

1. [Your first program](#your-first-program)
2. [Values and names](#values-and-names)
3. [Text](#text)
4. [f-strings and formats](#f-strings-and-formats)
5. [Numbers and math](#numbers-and-math)
6. [Random](#random)
7. [Lists](#lists)
8. [Dictionaries](#dictionaries)
9. [Working with lists: sorted, min, max, enumerate, zip, map, filter, any, all](#working-with-lists)
10. [Slices](#slices)
11. [If, else and match](#if-else-and-match)
12. [Loops](#loops)
13. [Funcs](#funcs)
14. [Lambdas and list building](#lambdas-and-list-building)
15. [Classes](#classes)
16. [Errors: try, except, raise](#errors)
17. [Time: now, date, timer, sleep, every, after](#time)
18. [Files](#files)
19. [JSON](#json)
20. [Windows](#windows)
21. [Packages and your own files](#packages-and-your-own-files)
22. [Game scripts](#game-scripts)
23. [When something goes wrong](#when-something-goes-wrong)
24. [Everything at a glance](#everything-at-a-glance)

## Your first program

Make a file called `hello.aes`, write this in it, and press **F5**:

```aes
name = "Aether"
print("Hello,", name)
print("2 + 3 is", 2 + 3)
```

`print` writes its values on one line, with spaces between them. Lines that start with `#` are notes
for people; Aether skips them.

## Values and names

A name gets a value with `=`. Names are made of letters, numbers and `_`, and start with a letter.

```aes
score = 10            # a whole number
speed = 2.5           # a number with a point
title = "Space Dash"  # text, in "double" or 'single' quotes
ready = True          # True or False (true and false work too)
nothing = None        # no value (none works too)
score += 5            # the same as score = score + 5 (also -=, *=, /=, %=, **=)
print(score, speed, title, ready, nothing)
```

`const` gives a name a value that never changes. Every func sees it.

```aes
const MAX_LIVES = 3
const COLOURS = {"red": "#f44", "blue": "#48f"}
print(MAX_LIVES, COLOURS["blue"])
```

Change a value into another kind with `int`, `float`, `str` and `bool`:

```aes
print(int("42") + 1, float("2.5") * 2, str(7) + "!", bool(0))
print(str([1, 2, 3]), str(None))
```

## Text

Text is joined with `+`, repeated with `*`, and measured with `len`.

```aes
word = "hello"
print(word + " world", word * 2, len(word), word[0], word[-1])
print("ell" in word, "z" not in word)
```

Text has these methods:

| Method | What it gives |
| --- | --- |
| `t.split()` / `t.split(",")` | a list of the parts (with no argument: split at spaces) |
| `sep.join(items)` | the items glued together with `sep` between them |
| `t.replace(old, new)` | every `old` changed to `new` |
| `t.strip()`, `t.lstrip()`, `t.rstrip()` | without the spaces (or the letters you give) at the ends |
| `t.startswith(a)`, `t.endswith(a)` | True or False |
| `t.find(a)` | where `a` starts, or -1 when it is not there |
| `t.index(a)` | where `a` starts (an error when it is not there) |
| `t.count(a)` | how many times `a` is in it |
| `t.upper()`, `t.lower()`, `t.title()`, `t.capitalize()` | in other capitals |
| `t.isdigit()`, `t.isalpha()`, `t.isspace()` | True or False |
| `t.zfill(n)`, `t.center(n)`, `t.ljust(n)`, `t.rjust(n)` | padded to `n` letters |

```aes
line = "  apples, pears ,plums  "
fruit = [f.strip() for f in line.split(",")]
print(fruit)
print(" + ".join(fruit))
print("a-b-c".split("-", 1))
print("banana".replace("a", "o"), "xxhixx".strip("x"))
print("photo.png".endswith(".png"), "Hello".startswith("He"))
print("hello".find("l"), "hello".find("z"), "banana".count("a"))
print("aether script".title(), "SHOUT".lower(), "7".zfill(3))
```

## f-strings and formats

Put `f` before the quotes and `{name}` inside: the value goes in its place. After a `:` comes a format.

```aes
name = "Ada"
price = 3.14159
print(f"Hello {name}, you have {2 + 3} new messages")
print(f"{price:.2f}")      # 2 decimals: 3.14
print(f"[{name:>8}]")      # right, 8 wide: [     Ada]
print(f"[{name:<8}]")      # left, 8 wide
print(f"[{name:^8}]")      # in the middle, 8 wide
print(f"[{name:*^9}]")     # with * around it
print(f"{7:03d}")          # 007
print(f"{0.256:.1%}")      # 25.6%
print(f"{1234567:,}")      # 1,234,567
print(f"{255:x} {5:b}")    # ff 101
print(f"{{name}}")         # {{ and }} are the brackets themselves
```

The format is `[fill][align][sign][0][width][,][.decimals][type]`: align is `<`, `>` or `^`; sign `+`
shows a + on numbers above 0; type is `f` (decimals), `d` (whole), `%`, `e`, `x` (hex), `o` or `b`.

## Numbers and math

`+ - * /` and `%` (what is left over), `**` (to the power). For whole-number division use `floor(a / b)`.

```aes
print(7 + 2, 7 - 2, 7 * 2, 7 / 2, 7 % 2, 2 ** 10, floor(7 / 2))
print(abs(-4), round(2.567, 1), round(2.5), min(3, 8), max(3, 8))
print(pi, sqrt(16), floor(2.7), ceil(2.1))
print(sin(pi / 2), cos(0), tan(0), atan2(1, 1))
print(degrees(pi), radians(180))
print(pow(2, 8), hypot(3, 4), exp(1))
print(log10(1000), log2(8), math.log(100, 10))
print(clamp(15, 0, 10), clamp(-3, 0, 10), lerp(0, 100, 0.25))
```

`clamp(value, low, high)` keeps a value between two others; `lerp(a, b, t)` is the point `t` of the
way from `a` to `b` (0 is `a`, 1 is `b`). Everything is also under `math.`: `math.sqrt`, `math.pi`,
`math.e`, `math.tau`, `math.inf`, `math.log(x, base)` and the rest. (`log()` on its own writes a line,
like `print`.)

## Random

```aes
print(random())          # a number from 0 to 1
print(random(10))        # from 0 to 10
print(random(5, 10))     # from 5 to 10
print(uniform(5, 10))    # the same
print(randint(1, 6))     # a whole number from 1 to 6
print(choice(["rock", "paper", "scissors"]))
cards = [1, 2, 3, 4, 5]
shuffle(cards)           # mixes the list up
print(cards)
print(sample(cards, 2))  # 2 different ones
```

## Lists

A list holds values in order, in `[ ]`. The first is number 0; -1 is the last.

```aes
items = ["sword", "shield"]
items.append("potion")       # add at the end
items.insert(0, "map")       # add at a place
items.extend(["key", "gem"]) # add many
print(items, len(items), items[0], items[-1])
items.remove("shield")       # take the first "shield" out
last = items.pop()           # take the last out and give it back
first = items.pop(0)         # or the one at a place
print(last, first, items)
print(items.index("potion"), items.count("key"), "key" in items)
nums = [5, 3, 9, 1]
nums.sort()                  # sorts the list itself
print(nums)
nums.sort(reverse=True)
print(nums)
nums.reverse()
print(nums, nums.copy())
nums.clear()
print(nums)
```

## Dictionaries

A dictionary holds values under names (keys), in `{ }`.

```aes
player = {"name": "Kai", "level": 3}
player["coins"] = 10
print(player["name"], player.get("level"), player.get("gems", 0))
print("coins" in player, len(player))
print(player.keys(), player.values(), player.items())
player.update({"level": 4, "hat": "red"})
hat = player.pop("hat")
print(hat, player)
print(player.setdefault("lives", 3), player["lives"])
for key, value in player.items():
  print(key, "=", value)
```

`d.get(key, default)` gives the default (or None) instead of an error when the key is not there.

## Working with lists

```aes
nums = [5, 3, 9, 1]
words = ["pear", "fig", "banana"]
print(sorted(nums), sorted(nums, reverse=True), sorted(words, key=len))
print(min(nums), max(nums), min(words, key=len), max([], default=0))
print(sum(nums), len(nums), list(reversed(nums)))
for i, word in enumerate(words):
  print(i, word)
for i, word in enumerate(words, 1):
  print(i, word)
for word, n in zip(words, [1, 2, 3]):
  print(word, n)
print(map(lambda n: n * 10, nums))
print(filter(lambda n: n > 2, nums))
print(any([n > 8 for n in nums]), all([n > 0 for n in nums]))
people = [{"name": "Ana", "age": 31}, {"name": "Bo", "age": 25}]
youngest = min(people, key=lambda p: p["age"])
print(youngest["name"], [p["name"] for p in sorted(people, key=lambda p: p["age"], reverse=True)])
```

`key=` is a func that gives what to compare; `reverse=True` turns the order around.

## Slices

`things[start:stop]` is a part of a list or text: from `start`, up to (not with) `stop`. Leave one out
for "from the start" or "to the end". A third number is the step.

```aes
nums = [0, 1, 2, 3, 4, 5, 6, 7]
print(nums[2:5], nums[:3], nums[5:], nums[-2:])
print(nums[::2])     # every second one: [0, 2, 4, 6]
print(nums[1::2])    # [1, 3, 5, 7]
print(nums[::-1])    # backwards
print("abcdef"[1:5:2], "racecar"[::-1])
```

## If, else and match

```aes
score = 72
if score >= 90:
  print("A")
elif score >= 70:
  print("B")
else:
  print("C")
if score > 50 and not score > 100:
  print("passed")
label = "big" if score > 50 else "small"
print(label)
```

`else if` works the same as `elif`. Compare with `==`, `!=`, `<`, `<=`, `>`, `>=`, `is` and `is not`;
join with `and`, `or` and `not`.

`match` picks the first `case` that fits; `|` is "or", `_` is anything, and `if` adds a test:

```aes
command = "go"
match command:
  case "go" | "run":
    print("moving")
  case "stop":
    print("stopping")
  case _:
    print("what?")
```

## Loops

```aes
for i in range(3):
  print("i is", i)
for n in range(10, 0, -3):   # from 10, down by 3
  print(n)
for letter in "abc":
  print(letter)
count = 0
while count < 3:
  count += 1
repeat 2:
  print("twice")
for n in range(10):
  if n == 2:
    continue                 # skip the rest, go on with the next n
  if n == 4:
    break                    # stop the loop
  print(n)
```

`for a, b in things` takes each item apart: pairs from `enumerate`, `zip` and `items()`, a dictionary's
keys and values, and a list's number and item.

## Funcs

`func` (or `def`) makes your own func. `return` gives a value back.

```aes
func greet(name, greeting="Hello"):
  return f"{greeting}, {name}!"

print(greet("Mia"))
print(greet("Mia", "Hi"))
print(greet(greeting="Hey", name="Leo"))   # name=value works for every func

func total(*numbers):
  return sum(numbers)

print(total(1, 2, 3))
```

Names given a value at the top of a program are the program's own: every func sees them and can
change them.

```aes
lives = 3
func lose_one():
  lives -= 1
lose_one()
print(lives)
```

## Lambdas and list building

A `lambda` is a small func in one line. `[... for ... in ...]` builds a list (and `{k: v for ...}` a
dictionary).

```aes
double = lambda n: n * 2
print(double(4))
squares = [n * n for n in range(6)]
evens = [n for n in range(10) if n % 2 == 0]
lengths = {w: len(w) for w in ["a", "bb", "ccc"]}
print(squares, evens, lengths)
```

## Classes

A class is a kind of thing. `init` (or `__init__`) runs when one is made; `self` is the one at hand.

```aes
class Pet:
  sound = "..."
  func init(self, name):
    self.name = name
  func speak(self):
    return f"{self.name} says {self.sound}"

class Dog(Pet):
  sound = "woof"

rex = Dog("Rex")
print(rex.speak(), isinstance(rex, Pet))
```

## Errors

`try` runs its block; when something goes wrong, `except` runs instead. `raise` makes your own error.

```aes
func half(n):
  if n % 2:
    raise "odd numbers do not halve evenly"
  return n / 2

try:
  print(half(8))
  print(half(7))
except e:
  print("problem:", e)
finally:
  print("done")
```

## Time

`now()` is the time in seconds since 1970; `date()` gives today in pieces; `timer()` is a stopwatch.

```aes
d = date()
print(d["year"], d["month"], d["day"], d["weekday"], d["text"])
t = timer()
total = 0
for i in range(100000):
  total += i
print(f"that took {t.elapsed():.3f} seconds")
t.reset()
print(now() > 0, time())    # time(): seconds since the program started
```

`sleep(seconds)` waits. The windows of your program keep working while it waits.

```aes
for n in [3, 2, 1]:
  print(n)
  sleep(1)
print("Go!")
```

`every(seconds, func)` calls a func again and again, and `after(seconds, func)` once, later. Both give
back something with `stop()`. `stop()` on its own ends the program; `clear()` empties the Output.

```aes
ticks = 0
func tick():
  ticks += 1
  print("tick", ticks)
  if ticks == 3:
    clock.stop()
clock = every(0.5, tick)
func later():
  print("a second later")
after(1, later)
```

A func that calls `sleep` (or `read_file`, `write_file`, `list_files`) waits too, and so does any func
that calls it. Call such funcs on lines of their own (not inside a lambda or a `[... for ...]`).

## Files

A program you run in Aether can read and write files. A name on its own is a file next to the program.

```aes
write_file("notes.txt", "milk\neggs\n")
text = read_file("notes.txt")
print(text.split())
print(list_files("."))      # the files next to the program (folders end with /)
```

## JSON

`json.text(value)` turns lists and dictionaries into JSON text; `json.parse(text)` turns it back.

```aes
save = {"name": "Kai", "items": ["map", "key"], "level": 3}
text = json.text(save)
print(text)
print(json.text(save, 2))   # spread over lines, 2 spaces in
back = json.parse(text)
print(back["items"][1])
```

Files and JSON together keep things between runs:

```aes
func load_best():
  try:
    return json.parse(read_file("best.json"))["best"]
  except:
    return 0

best = load_best()
score = randint(1, 100)
print("score", score, "best", best)
if score > best:
  write_file("best.json", json.text({"best": score}))
  print("a new best!")
```

## Windows

`Window(title, width, height)` opens a window. Put things in it, top to bottom:

```aes
win = Window("Counter", 300, 200)
win.title_text("Counter")
shown = win.label("0")
count = 0
func add():
  count += 1
  shown.text = str(count)
row = win.row()
row.button("Add one", add)
row.button("Close", win.close)
name = win.input("Your name")
func named(text):
  win.title = f"Hi {text}"
name.on_enter(named)
volume = win.slider(0, 100, 50)
loud = win.checkbox("Loud", False)
```

What a window and a row (or `win.column()`) can hold: `label(text)`, `title_text(text)`,
`button(text, func)`, `input(hint, func)` (`.value`, `.on_enter(func)`), `slider(min, max, value, func)`,
`checkbox(text, value, func)`, `canvas(width, height)`, `row()`, `column()`, `space()` and `clear()`.
A window also has `title`, `move(x, y)`, `size(w, h)`, `background(colour)`, `on_frame(func)`,
`on_key(func)`, `key(name)`, `on_close(func)` and `close()`.

A canvas draws: `g.clear(colour)`, `g.rect(x, y, w, h, colour)`, `g.circle(x, y, r, colour)`,
`g.line(x1, y1, x2, y2, colour, width)`, `g.text(text, x, y, colour, size)`, and every drawing command
of a web canvas in snake_case (`g.fill_rect`, `g.fill_style`...). `g.width`, `g.height`, `g.mouse_x`,
`g.mouse_y`, `g.on_click(func)` and `g.on_move(func)` tell you where things are.

```aes
win = Window("Ball", 400, 300)
g = win.canvas()
x = 50
func frame(dt):
  x = (x + 120 * dt) % g.width
  g.clear("#101420")
  g.circle(x, g.height / 2, 20, "#5cf")
win.on_frame(frame)
```

## Packages and your own files

`Package Aether.Name` (or `import Aether.Name`) at the top brings in more:

- `Aether.Executable`: make your program into an app. `Aether.Executable.Compile()` makes a Windows app
  (.exe), `Apk()` an Android app, `Both()` both. Give them a file and options:
  `{"name": "My App", "icon": "icon.png", "orientation": "portrait"}`.
- `Aether.NeuralGraph`: neural networks you can see learn: `NeuralGraph([2, 4, 1], options)`, then
  `net.train(data, epochs, func)`, `net.predict(inputs)`.
- `Aether.Window`: windows (always there, no Package line needed).

```aes
Package Aether.NeuralGraph
net = NeuralGraph([2, 3, 1], {"title": "OR"})
data = [[[0, 0], [0]], [[0, 1], [1]], [[1, 0], [1]], [[1, 1], [1]]]
func done(loss):
  print("learned, loss", round(loss, 4))
net.train(data, 500, done)
```

`import mylib` brings in `mylib.aes` from the same folder: its names are then `mylib.name`.

## Game scripts

A game script is attached to a node in a Scene (Inspector > Scripts). It has `var`s (they show in the
Properties panel), `on` blocks the engine calls, and funcs of its own. The node's own things need no
`me.`: `x`, `y`, `vx`, `vy`, `scale`, `rotation`, `visible`, `tag`, `anim`, `flip_x`, `on_floor`...

```aes
var speed = 220
var jump = 620

on ready:
  say("Go!")

on update(dt):
  if key("arrow_right") or key("d"):
    x += speed * dt
  elif key("arrow_left") or key("a"):
    x -= speed * dt
  if pressed("jump") and on_floor:
    vy = -jump

on collide(other):
  if other.tag == "coin":
    other.destroy()
    game.score += 1
    say(f"Coins: {game.score}")
```

Events: `on ready`, `on update(dt)`, `on collide(other)`, `on event(name, data, sender)`,
`on draw(g, view)`. A game script has the game's own words too: `key`, `pressed`, `released`, `axis`,
`say`, `sound`, `music`, `find`, `find_all`, `spawn`, `destroy`, `burst`, `move`, `every`, `after`,
`touching`, `distance_to`, `win`, `lose`, `restart` and `goto`. Every text, math, list, dictionary,
json and time helper on this page works in game scripts as well; `sleep` and the files are for
programs (in a game, use `after(seconds, func)`).

## When something goes wrong

Aether names the line and says what to do, both when it reads your program and while it runs. Click
an error in the Output to go to its line.

| You see | What to do |
| --- | --- |
| `line 4: there is no "scroe" here` | Give it a value first, or check the spelling. |
| `line 9: this is none, so it has no "name"` | The value before the dot is None: check it was given one. |
| `line 3: remove: 7 is not in the list` | Check with `if 7 in items:` first. |
| `line 2: int: "abc" is not a number` | Check the text before turning it into a number. |
| `line 6: sleep() waits, so it can not be used inside a lambda` | Call it on a line of its own. |
| `line 5: the line after ":" must be indented more` | Indent the block under `if`, `for`, `func`... |
| `line 7: a func calls itself again and again without end` | Give the func a case where it stops. |

## Everything at a glance

- Text: `split`, `join`, `replace`, `strip`, `lstrip`, `rstrip`, `startswith`, `endswith`, `find`,
  `index`, `count`, `upper`, `lower`, `title`, `capitalize`, `isdigit`, `isalpha`, `isspace`, `zfill`,
  `center`, `ljust`, `rjust`, f-strings with formats.
- Math: `pi`, `abs`, `round`, `min`, `max`, `sqrt`, `floor`, `ceil`, `pow`, `exp`, `log10`, `log2`,
  `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `hypot`, `degrees`, `radians`, `clamp`, `lerp`,
  `sign`, and `math.` with all of them plus `math.log`, `math.e`, `math.tau`, `math.inf`.
- Random: `random`, `uniform`, `randint`, `choice`, `shuffle`, `sample`.
- Lists: `append`, `extend`, `insert`, `remove`, `pop`, `index`, `count`, `sort`, `reverse`, `copy`,
  `clear`, slices with a step; `len`, `sum`, `sorted`, `reversed`, `enumerate`, `zip`, `map`, `filter`,
  `any`, `all`, `range`, `list`.
- Dictionaries: `items`, `keys`, `values`, `get`, `pop`, `update`, `setdefault`, `copy`, `clear`.
- Time: `now`, `date`, `timer`, `time`, `sleep`, `every`, `after`, `stop`, `clear`.
- Files: `read_file`, `write_file`, `list_files`.
- JSON: `json.parse`, `json.text`.
