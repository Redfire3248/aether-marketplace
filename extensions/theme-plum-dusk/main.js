// Plum Dusk: a colour theme for Aether. Dark and soft, deep purples with pink. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-plum-dusk',
  name: 'Plum Dusk',
  dark: true,
  ui: {
    bg: '#171120',
    panel: '#1d1629',
    editor: '#1a1425',
    elevated: '#251c34',
    hover: '#2d233e',
    border: '#3a2d4e',
    text: '#efe6f7',
    muted: '#a999bd',
    faint: '#7c6c91',
    accent: '#d18cf0',
    accent2: '#f2a0c0',
    accentText: '#1a0f24',
    danger: '#ff7b8a',
    warn: '#f2c46b',
    ok: '#6fd8a0'
  },
  syntax: {
    keyword: 'd18cf0',
    string: 'b5e28a',
    number: 'ffae72',
    comment: '8e7da3',
    fn: '8fb8ff',
    type: 'f2c46b',
    variable: 'efe6f7',
    operator: '9adcd8',
    tag: 'ff8fa8',
    attr: 'f2c46b',
    regexp: '9adcd8',
    constant: 'ffae72'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Plum Dusk is there now)', () => aether.commands.run('view.theme'), { category: 'Plum Dusk' });
