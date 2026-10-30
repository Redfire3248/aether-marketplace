# Regex Lab

A tab of its own to try a regular expression on some text: matches highlighted, groups listed, and a replace preview.

Press **Ctrl+Alt+R**, or open the Command Palette (Ctrl+Shift+P) and type **Regex Lab**.

- Type a pattern at the top and some text under it. The matches light up as you type, in two colours so ones next to each other are easy to tell apart.
- Turn the flags on and off with the buttons: **g** all matches (off: only the first), **i** any case, **m** `^` and `$` for each line, **s** `.` matches new lines, **u** Unicode, **y** sticky.
- Under the text, each match is listed with its groups, numbered, and with their names for named groups like `(?<year>\d{4})`. A group that took no part in the match says so.
- **Replace with** shows what the text would be after a replace. Use `$1`, `$<name>` and `$&` (the whole match).
- **Copy as /pattern/flags** copies it, ready to paste into JavaScript.
- **Regex Lab: Try It on the Selection** opens the tab with the text you selected in the editor.

The pattern is JavaScript's own (the one Aether uses). A mistake in it is shown in red, in place of the matches. What you typed is kept for next time.

At most 1000 matches are shown. A pattern that takes very long on a long text (like `(a+)+$`) can make Aether wait while it runs, so try those on short text.
