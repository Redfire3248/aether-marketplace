# HTML Quick

Type a short abbreviation like `ul>li*3` or `div.card>h2+p` and press **Ctrl+Alt+E** to turn it into HTML.

Type the abbreviation where the HTML should go, with the cursor at its end, then press **Ctrl+Alt+E** (or **Ctrl+Alt+H**). You can also select an abbreviation and press it. Press **Tab** to go from one empty place (an `href`, a tag's inside) to the next.

| You type | You get |
| --- | --- |
| `ul>li*3` | a list with three items |
| `div.card>h2+p` | a div with the class `card`, with an h2 and a p in it |
| `nav>a*2` | a nav with two links, `href` ready to fill |
| `li.item$*3{Item $}` | `item1`, `item2`, `item3` with the text Item 1, Item 2, Item 3 |
| `form>label+input[type=email]` | a form with a label and an email box |
| `div>p^footer` | a p in a div, then a footer after the div |
| `(dt+dd)*2` | a group, twice |
| `!` | a whole HTML page |

The parts:

- `>` inside, `+` next to, `^` back up one level
- `*3` three of them, `( )` a group
- `#id`, `.class` (as many as you like), `[name=value other="with spaces"]`
- `{text}` text inside
- `$` the number when repeated (1, 2, 3), `$$` for 01, 02, 03; `\$` is a real `$`
- No tag guesses one from where it is: `li` in a list, `tr` in a table, `td` in a row, `span` in a `p`, else `div`

In React files (`.jsx`, `.tsx`) it writes `className` and `htmlFor`, and closes tags like `<img />`.

**HTML: Wrap the Selection in an Abbreviation** puts the selected text inside new HTML, like `div.box` or `ul>li`.

**Ctrl+Alt+E** is also the shortcut of Aether AI's **Edit Selection**. If that one opens, use **Ctrl+Alt+H**, or change either in Keyboard Shortcuts.
