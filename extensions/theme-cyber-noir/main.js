// Cyber Noir: a colour theme for Aether. Black and electric yellow, straight out of the future. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-cyber-noir',
  name: 'Cyber Noir',
  dark: true,
  ui: {
    bg: '#0a0a0c',
    panel: '#111114',
    editor: '#0e0e11',
    elevated: '#1a1a1f',
    hover: '#222228',
    border: '#34343c',
    text: '#f2f2ee',
    muted: '#a9a9a4',
    faint: '#7f7f7a',
    accent: '#f5e400',
    accent2: '#00e5ff',
    accentText: '#141400',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: 'f5e400',
    string: '7dff8a',
    number: 'ff9e4d',
    comment: '85857f',
    fn: '00e5ff',
    type: 'ffd34d',
    variable: 'f2f2ee',
    operator: 'd0d0ca',
    tag: 'ff6e8a',
    attr: 'ffd34d',
    regexp: '7dff8a',
    constant: 'ff9e4d'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Cyber Noir is there now)', () => aether.commands.run('view.theme'), { category: 'Cyber Noir' });
