// Pixel Vapor: a colour theme for Aether. Square pixels, loud and pink: hot pink and cyan on indigo. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-pixel-vapor',
  name: 'Pixel Vapor',
  dark: true,
  style: 'pixel',
  ui: {
    bg: '#130f2e',
    panel: '#1a1540',
    editor: '#161138',
    elevated: '#231d52',
    hover: '#2c2563',
    border: '#443a8a',
    text: '#f4f0ff',
    muted: '#b3a9e0',
    faint: '#8a80bd',
    accent: '#ff71ce',
    accent2: '#01cdfe',
    accentText: '#2a0520',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: 'ff71ce',
    string: '05ffa1',
    number: 'fffb96',
    comment: '9288c4',
    fn: '01cdfe',
    type: 'b967ff',
    variable: 'f4f0ff',
    operator: 'a8d8ff',
    tag: 'ff8fa8',
    attr: 'b967ff',
    regexp: '05ffa1',
    constant: 'fffb96'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Pixel Vapor is there now)', () => aether.commands.run('view.theme'), { category: 'Pixel Vapor' });
