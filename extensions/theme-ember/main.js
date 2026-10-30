// Ember: a colour theme for Aether. Dark and warm, browns with a glowing orange. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-ember',
  name: 'Ember',
  dark: true,
  ui: {
    bg: '#17110f',
    panel: '#1e1714',
    editor: '#1b1412',
    elevated: '#271e1a',
    hover: '#30251f',
    border: '#3d2f27',
    text: '#f3e6dc',
    muted: '#b39c8c',
    faint: '#86725f',
    accent: '#ff8a4c',
    accent2: '#ffc857',
    accentText: '#1f0d02',
    danger: '#ff6b5e',
    warn: '#ffc857',
    ok: '#9ccc65'
  },
  syntax: {
    keyword: 'ff8a4c',
    string: 'c3d977',
    number: 'ffb86b',
    comment: '978373',
    fn: 'ffd479',
    type: '7fd1c7',
    variable: 'f3e6dc',
    operator: 'e8a87c',
    tag: 'ff7a6b',
    attr: 'ffc857',
    regexp: '7fd1c7',
    constant: 'f7a1c4'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Ember is there now)', () => aether.commands.run('view.theme'), { category: 'Ember' });
