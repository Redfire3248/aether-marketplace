// Deep Sea: a colour theme for Aether. Dark and calm, deep blues with teal. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-deep-sea',
  name: 'Deep Sea',
  dark: true,
  ui: {
    bg: '#0b1622',
    panel: '#0f1d2b',
    editor: '#0d1a27',
    elevated: '#152536',
    hover: '#1b2f44',
    border: '#22384f',
    text: '#dce8f2',
    muted: '#8fa6ba',
    faint: '#6a8296',
    accent: '#3fc1c9',
    accent2: '#7aa2ff',
    accentText: '#04161a',
    danger: '#ff6b6b',
    warn: '#f5c26b',
    ok: '#5fd38d'
  },
  syntax: {
    keyword: 'c792ea',
    string: 'a5e075',
    number: 'f78c6c',
    comment: '7590a6',
    fn: '82aaff',
    type: 'ffcb6b',
    variable: 'dce8f2',
    operator: '89ddff',
    tag: 'f07178',
    attr: 'ffcb6b',
    regexp: '89ddff',
    constant: 'f78c6c'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Deep Sea is there now)', () => aether.commands.run('view.theme'), { category: 'Deep Sea' });
