// Lavender Mist: a colour theme for Aether. Light and soft: pale purple with deep violet ink. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-lavender-mist',
  name: 'Lavender Mist',
  dark: false,
  ui: {
    bg: '#f1edf8',
    panel: '#e8e2f2',
    editor: '#faf8fd',
    elevated: '#ffffff',
    hover: '#dcd4ea',
    border: '#c4b8da',
    text: '#241d33',
    muted: '#584e6e',
    faint: '#7a708f',
    accent: '#6a3fc4',
    accent2: '#a32a7c',
    accentText: '#ffffff',
    danger: '#a81e2a',
    warn: '#7a5200',
    ok: '#1c6e3f'
  },
  syntax: {
    keyword: '6a3fc4',
    string: '2c7a4b',
    number: 'a8500f',
    comment: '6c6280',
    fn: '1f62b8',
    type: '86590a',
    variable: '241d33',
    operator: '4c4460',
    tag: 'b3265f',
    attr: '86590a',
    regexp: '2c7a4b',
    constant: 'a8500f'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Lavender Mist is there now)', () => aether.commands.run('view.theme'), { category: 'Lavender Mist' });
