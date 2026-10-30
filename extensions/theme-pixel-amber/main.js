// Pixel Amber: a colour theme for Aether. An old amber monitor: warm glowing orange on black. Pick it in the theme picker (Ctrl+Alt+T).
// Every colour is checked to be easy to read on the background it sits on.

const THEME = {
  id: 'theme-pixel-amber',
  name: 'Pixel Amber',
  dark: true,
  style: 'pixel',
  ui: {
    bg: '#120c02',
    panel: '#1a1205',
    editor: '#150f03',
    elevated: '#241a08',
    hover: '#2e220c',
    border: '#4a3814',
    text: '#ffe6b0',
    muted: '#c9a86b',
    faint: '#9a7d48',
    accent: '#ffb000',
    accent2: '#ffd466',
    accentText: '#1f1400',
    danger: '#ff7a7a',
    warn: '#ffcb6b',
    ok: '#6fe0a0'
  },
  syntax: {
    keyword: 'ffb000',
    string: 'ffd98a',
    number: 'ffc94d',
    comment: 'a58a58',
    fn: 'ffe0a0',
    type: 'f5c25c',
    variable: 'ffe6b0',
    operator: 'e6c88a',
    tag: 'ff9f4d',
    attr: 'f5c25c',
    regexp: 'ffd98a',
    constant: 'ffc94d'
  }
};

aether.themes.add(THEME);
aether.commands.register('pick', 'Theme: Pick a Theme (Pixel Amber is there now)', () => aether.commands.run('view.theme'), { category: 'Pixel Amber' });
