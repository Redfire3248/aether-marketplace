// Tokyo Rain: a colour theme for Aether. City lights in the rain: deep indigo with neon signs. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-tokyo-rain',
  name: 'Tokyo Rain',
  dark: true,
  ui: {
    bg: '#10111f',
    panel: '#15172a',
    editor: '#121425',
    elevated: '#1d2038',
    hover: '#252945',
    border: '#383e64',
    text: '#e8eaff',
    muted: '#a6abd2',
    faint: '#7f84ad',
    accent: '#7aa2ff',
    accent2: '#ff7edb',
    accentText: '#0b1030',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: 'bb9af7',
    string: '9ece6a',
    number: 'ff9e64',
    comment: '868bb5',
    fn: '7aa2ff',
    type: 'e0af68',
    variable: 'e8eaff',
    operator: '89ddff',
    tag: 'f7768e',
    attr: 'e0af68',
    regexp: '9ece6a',
    constant: 'ff9e64'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Tokyo Rain is there now)', () => aether.commands.run('view.theme'), { category: 'Tokyo Rain' });
