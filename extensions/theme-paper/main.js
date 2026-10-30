// Paper: a colour theme for Aether. Light and warm, like a page in a book. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-paper',
  name: 'Paper',
  dark: false,
  ui: {
    bg: '#f4efe6',
    panel: '#ece5d8',
    editor: '#faf6ef',
    elevated: '#ffffff',
    hover: '#e3dacb',
    border: '#d6cbb8',
    text: '#2b2722',
    muted: '#61584e',
    faint: '#8a7f71',
    accent: '#a84a22',
    accent2: '#285f7b',
    accentText: '#ffffff',
    danger: '#b3261e',
    warn: '#8a5a00',
    ok: '#256b29'
  },
  syntax: {
    keyword: 'a3366d',
    string: '45701b',
    number: 'a84a22',
    comment: '736a5e',
    fn: '1f5f99',
    type: '8a5a00',
    variable: '2b2722',
    operator: '5c5048',
    tag: '9c2f2f',
    attr: '8a5a00',
    regexp: '285f7b',
    constant: 'a84a22'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Paper is there now)', () => aether.commands.run('view.theme'), { category: 'Paper' });
