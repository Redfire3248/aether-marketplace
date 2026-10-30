// Arctic Night: a colour theme for Aether. Cold and clear: midnight blue with icy light. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-arctic-night',
  name: 'Arctic Night',
  dark: true,
  ui: {
    bg: '#0a111c',
    panel: '#0f1826',
    editor: '#0c1420',
    elevated: '#162234',
    hover: '#1c2c42',
    border: '#2b4160',
    text: '#eaf3ff',
    muted: '#9fb5d1',
    faint: '#7690ad',
    accent: '#7cc7ff',
    accent2: '#a5f3ff',
    accentText: '#04182a',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: '9dc4ff',
    string: 'a8ecd0',
    number: 'ffc58a',
    comment: '7d93ae',
    fn: '7cd9ff',
    type: 'c9d6ff',
    variable: 'eaf3ff',
    operator: 'b8d0ec',
    tag: 'ff9db0',
    attr: 'c9d6ff',
    regexp: 'a8ecd0',
    constant: 'ffc58a'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Arctic Night is there now)', () => aether.commands.run('view.theme'), { category: 'Arctic Night' });
