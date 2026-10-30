// Pixel Paper: a colour theme for Aether. Square pixels on a light page: cream with bold ink. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-pixel-paper',
  name: 'Pixel Paper',
  dark: false,
  style: 'pixel',
  ui: {
    bg: '#f3ead8',
    panel: '#e9dec8',
    editor: '#f9f2e4',
    elevated: '#ffffff',
    hover: '#ddd0b6',
    border: '#b5a586',
    text: '#221c12',
    muted: '#5c5240',
    faint: '#7d7158',
    accent: '#a8360f',
    accent2: '#1b5e8c',
    accentText: '#ffffff',
    danger: '#a81e2a',
    warn: '#7a5200',
    ok: '#1c6e3f'
  },
  syntax: {
    keyword: 'a8360f',
    string: '2f6b1f',
    number: '96500a',
    comment: '6e6450',
    fn: '1b5e8c',
    type: '7a4b00',
    variable: '221c12',
    operator: '4d4536',
    tag: 'a3214f',
    attr: '7a4b00',
    regexp: '2f6b1f',
    constant: '96500a'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Pixel Paper is there now)', () => aether.commands.run('view.theme'), { category: 'Pixel Paper' });
