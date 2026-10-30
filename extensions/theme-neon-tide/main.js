// Neon Tide: a colour theme for Aether. Dark and bright, glowing teal and pink. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-neon-tide',
  name: 'Neon Tide',
  dark: true,
  ui: {
    bg: '#07101c',
    panel: '#0b1626',
    editor: '#091320',
    elevated: '#102036',
    hover: '#162a44',
    border: '#1f3857',
    text: '#e6f4ff',
    muted: '#8fb0c9',
    faint: '#648aa6',
    accent: '#22e0d0',
    accent2: '#ff5fb0',
    accentText: '#03201e',
    danger: '#ff6b7d',
    warn: '#ffd166',
    ok: '#4ff0a0'
  },
  syntax: {
    keyword: 'ff5fb0',
    string: '7dffb2',
    number: 'ffb454',
    comment: '6f93ad',
    fn: '5cc8ff',
    type: 'ffd166',
    variable: 'e6f4ff',
    operator: '22e0d0',
    tag: 'ff7a90',
    attr: 'ffd166',
    regexp: '7dd3fc',
    constant: 'ffb454'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Neon Tide is there now)', () => aether.commands.run('view.theme'), { category: 'Neon Tide' });
