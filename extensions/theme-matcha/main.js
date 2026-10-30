// Matcha: a colour theme for Aether. Calm and light: creamy green tea with deep leaf green. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-matcha',
  name: 'Matcha',
  dark: false,
  ui: {
    bg: '#eef0e0',
    panel: '#e3e7d2',
    editor: '#f7f8ec',
    elevated: '#ffffff',
    hover: '#d7dcc2',
    border: '#bcc4a0',
    text: '#20261a',
    muted: '#525c44',
    faint: '#73805f',
    accent: '#44701c',
    accent2: '#8a4a1f',
    accentText: '#ffffff',
    danger: '#a81e2a',
    warn: '#7a5200',
    ok: '#1c6e3f'
  },
  syntax: {
    keyword: '5d6d1a',
    string: '2f7a3f',
    number: 'a14f12',
    comment: '667054',
    fn: '1f6a87',
    type: '7c5f05',
    variable: '20261a',
    operator: '48503a',
    tag: 'a62b52',
    attr: '7c5f05',
    regexp: '2f7a3f',
    constant: 'a14f12'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Matcha is there now)', () => aether.commands.run('view.theme'), { category: 'Matcha' });
