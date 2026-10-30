// Pixel Sunset: a colour theme for Aether. Square pixels at dusk: deep purple with orange and pink. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-pixel-sunset',
  name: 'Pixel Sunset',
  dark: true,
  style: 'pixel',
  ui: {
    bg: '#1c1030',
    panel: '#241538',
    editor: '#20122f',
    elevated: '#2e1c46',
    hover: '#382354',
    border: '#4d3270',
    text: '#f8ecff',
    muted: '#b9a6d4',
    faint: '#8d78ad',
    accent: '#ff9d4d',
    accent2: '#ff6fa8',
    accentText: '#26120a',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: 'ff9d4d',
    string: 'ffe08a',
    number: 'ff6fa8',
    comment: '9c88bd',
    fn: '7fd4ff',
    type: 'ffd166',
    variable: 'f8ecff',
    operator: 'c9b3ff',
    tag: 'ff7f7f',
    attr: 'ffd166',
    regexp: 'ffe08a',
    constant: 'ff6fa8'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Pixel Sunset is there now)', () => aether.commands.run('view.theme'), { category: 'Pixel Sunset' });
