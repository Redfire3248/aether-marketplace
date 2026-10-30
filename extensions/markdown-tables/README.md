# Markdown Tables

Line up the columns of the table the cursor is in, add a row or a column, and turn comma- or tab-separated text into a table.

Put the cursor in a table, then press **Ctrl+Alt+B** for the list, or open the Command Palette (Ctrl+Shift+P) and type **Table:**.

- **Line Up the Columns:** every column as wide as its widest cell. The `:---`, `:---:` and `---:` alignments are kept, and cells are padded to match. Short rows get empty cells.
- **Add a Row:** an empty row under the cursor's row (under the header, it is the first row), with the cursor in it.
- **Add a Column:** an empty column right of the cursor's column.
- **Make a Table from the Selection:** select lines of comma-separated (CSV) or tab-separated text, such as cells copied from a spreadsheet. The first line becomes the header. `"Quoted, cells"` work, and `|` in a cell is escaped.

A table is lines with `|` in them, with a `---` line under the header:

```
| Name  | Qty |
| :---- | --: |
| Apple |   3 |
```

Pipes inside `code` and escaped pipes (`\|`) stay in their cell. Chinese, Japanese and Korean letters count as two columns wide, so the columns still line up.
