// Pixel Cherry: a colour theme for Aether. Square pixels with a bite: dark red with cherry pink. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-pixel-cherry',
  name: 'Pixel Cherry',
  dark: true,
  style: 'pixel',
  ui: {
    bg: '#1d0b12',
    panel: '#27101a',
    editor: '#220d16',
    elevated: '#341624',
    hover: '#3f1c2c',
    border: '#5a2a3f',
    text: '#ffeaf0',
    muted: '#cda0b0',
    faint: '#a07686',
    accent: '#ff5c8a',
    accent2: '#ffb44d',
    accentText: '#2a0612',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: 'ff5c8a',
    string: 'ffd479',
    number: 'ffa45c',
    comment: 'a97f90',
    fn: 'ff9ecb',
    type: 'ffcf70',
    variable: 'ffeaf0',
    operator: 'f0b6c8',
    tag: 'ff8a8a',
    attr: 'ffcf70',
    regexp: 'ffd479',
    constant: 'ffa45c'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Pixel Cherry is there now)', () => aether.commands.run('view.theme'), { category: 'Pixel Cherry' });
