// Blood Moon: a colour theme for Aether. Dark and dramatic: black-red with a burning crimson. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-blood-moon',
  name: 'Blood Moon',
  dark: true,
  ui: {
    bg: '#120809',
    panel: '#1a0c0e',
    editor: '#160a0c',
    elevated: '#241114',
    hover: '#2e1619',
    border: '#4a2226',
    text: '#fbeaea',
    muted: '#c99fa2',
    faint: '#a07679',
    accent: '#ff4d5e',
    accent2: '#ffb35c',
    accentText: '#2a0407',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: 'ff6b78',
    string: 'ffd08a',
    number: 'ffa35c',
    comment: 'a88083',
    fn: 'ff9fa8',
    type: 'f5c45c',
    variable: 'fbeaea',
    operator: 'e8b6ba',
    tag: 'ff8466',
    attr: 'f5c45c',
    regexp: 'ffd08a',
    constant: 'ffa35c'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Blood Moon is there now)', () => aether.commands.run('view.theme'), { category: 'Blood Moon' });
