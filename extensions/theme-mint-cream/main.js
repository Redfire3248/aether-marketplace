// Mint Cream: a colour theme for Aether. Light and fresh, soft greens. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-mint-cream',
  name: 'Mint Cream',
  dark: false,
  ui: {
    bg: '#eef6f1',
    panel: '#e3efe8',
    editor: '#f8fcfa',
    elevated: '#ffffff',
    hover: '#d6e6dd',
    border: '#c2d6ca',
    text: '#1b2a24',
    muted: '#4f6459',
    faint: '#6b8175',
    accent: '#0c6e52',
    accent2: '#7a3fa6',
    accentText: '#ffffff',
    danger: '#b3261e',
    warn: '#855500',
    ok: '#1a7040'
  },
  syntax: {
    keyword: '7a3fa6',
    string: '1e7b45',
    number: 'a84a0c',
    comment: '5f7468',
    fn: '1f62b8',
    type: '0b6b6b',
    variable: '1b2a24',
    operator: '44584d',
    tag: 'b4235a',
    attr: '855500',
    regexp: '0a6f8f',
    constant: 'a84a0c'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Mint Cream is there now)', () => aether.commands.run('view.theme'), { category: 'Mint Cream' });
