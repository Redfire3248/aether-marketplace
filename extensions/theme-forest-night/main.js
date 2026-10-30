// Forest Night: a colour theme for Aether. Dark and quiet, deep greens with mint. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-forest-night',
  name: 'Forest Night',
  dark: true,
  ui: {
    bg: '#0e1512',
    panel: '#121c17',
    editor: '#101914',
    elevated: '#18251f',
    hover: '#1e2e26',
    border: '#26392f',
    text: '#dfeee4',
    muted: '#97b3a2',
    faint: '#6b8a77',
    accent: '#5fd39a',
    accent2: '#c8e06a',
    accentText: '#04140c',
    danger: '#ff6f6f',
    warn: '#e8c35a',
    ok: '#5fd39a'
  },
  syntax: {
    keyword: '7fdbb6',
    string: 'd7e28a',
    number: 'f2a65a',
    comment: '76937f',
    fn: '9fd3ff',
    type: 'e8c35a',
    variable: 'dfeee4',
    operator: 'a3c9b3',
    tag: 'f28b82',
    attr: 'e8c35a',
    regexp: 'b8a4ff',
    constant: 'f2a65a'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Forest Night is there now)', () => aether.commands.run('view.theme'), { category: 'Forest Night' });
