# JSON Tools

Format, minify or sort the keys of JSON (the selection or the whole file), and see where the error is when it is not valid.

Select some JSON, or select nothing to use the whole file. Then press **Ctrl+Alt+J** for the list, or open the Command Palette (Ctrl+Shift+P) and type **JSON:**.

- **Format:** one value per line, indented the way the file is (spaces or tabs, and how many).
- **Minify:** all on one line, with no spaces.
- **Sort the Keys:** every object's keys A to Z, at every level. Arrays keep their order.
- **Find the Error:** says whether it is valid JSON.

When the JSON is not valid, nothing is changed. The cursor goes to the error, and a message says what is wrong and where, in plain words: a missing comma, a trailing comma, single quotes, a comment, a string that is not closed, and so on.

Numbers and strings are kept exactly as you wrote them (`1.50` stays `1.50`, `é` stays `é`, big numbers are not rounded).
