// Glacier: a colour theme for Aether. Light and cool, crisp blues and greys. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-glacier',
  name: 'Glacier',
  dark: false,
  ui: {
    bg: '#eef3f8',
    panel: '#e4ebf2',
    editor: '#f8fbfe',
    elevated: '#ffffff',
    hover: '#d9e3ee',
    border: '#c8d5e3',
    text: '#1d2733',
    muted: '#4f5e70',
    faint: '#728195',
    accent: '#2563c9',
    accent2: '#0d6e6e',
    accentText: '#ffffff',
    danger: '#c62828',
    warn: '#8d5b00',
    ok: '#1a6e3d'
  },
  syntax: {
    keyword: '7a3fc4',
    string: '1e7b45',
    number: 'b04a09',
    comment: '627183',
    fn: '2563c9',
    type: '0d6e6e',
    variable: '1d2733',
    operator: '4a5868',
    tag: 'b42358',
    attr: '8d5b00',
    regexp: 'b04a09',
    constant: 'b42358'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Glacier is there now)', () => aether.commands.run('view.theme'), { category: 'Glacier' });
