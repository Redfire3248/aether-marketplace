// Pixel Mint: a colour theme for Aether. Square pixels, cool and clean: deep teal with bright mint. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-pixel-mint',
  name: 'Pixel Mint',
  dark: true,
  style: 'pixel',
  ui: {
    bg: '#0b1f1e',
    panel: '#102826',
    editor: '#0d2322',
    elevated: '#163431',
    hover: '#1c3f3b',
    border: '#2a5a54',
    text: '#e6fff8',
    muted: '#94c7bb',
    faint: '#6a9c90',
    accent: '#5cf2c0',
    accent2: '#7fd0ff',
    accentText: '#06241c',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: '5cf2c0',
    string: 'c5f277',
    number: 'ffb86b',
    comment: '739f94',
    fn: '7fd0ff',
    type: 'ffd97a',
    variable: 'e6fff8',
    operator: 'a5e8d8',
    tag: 'ff94a8',
    attr: 'ffd97a',
    regexp: 'c5f277',
    constant: 'ffb86b'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Pixel Mint is there now)', () => aether.commands.run('view.theme'), { category: 'Pixel Mint' });
