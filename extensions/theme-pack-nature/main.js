// Nature Theme Pack: 5 colour themes for Aether in one install. They are Forest Night, Deep Sea, Arctic Night, Ember and Blood Moon.
// They go in the Nature pack in Settings > Theme and in the theme picker (Ctrl+Alt+T). Each one is also in the
// Marketplace on its own, with the same id, so having both installed shows each theme once.

const THEMES = [
  {
    id: 'theme-forest-night',
    name: 'Forest Night',
    dark: true,
    pack: 'Nature',
    ui: {
      bg: '#0e1512',
      panel: '#121c17',
      editor: '#101914',
      elevated: '#18251f',
      hover: '#1e2e26',
      border: '#26392f',
      text: '#dfeee4',
      muted: '#97b3a2',
      faint: '#6b8a77',
      accent: '#5fd39a',
      accent2: '#c8e06a',
      accentText: '#04140c',
      danger: '#ff6f6f',
      warn: '#e8c35a',
      ok: '#5fd39a'
    },
    syntax: {
      keyword: '7fdbb6',
      string: 'd7e28a',
      number: 'f2a65a',
      comment: '76937f',
      fn: '9fd3ff',
      type: 'e8c35a',
      variable: 'dfeee4',
      operator: 'a3c9b3',
      tag: 'f28b82',
      attr: 'e8c35a',
      regexp: 'b8a4ff',
      constant: 'f2a65a'
    }
  },
  {
    id: 'theme-deep-sea',
    name: 'Deep Sea',
    dark: true,
    pack: 'Nature',
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
  },
  {
    id: 'theme-arctic-night',
    name: 'Arctic Night',
    dark: true,
    pack: 'Nature',
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
  },
  {
    id: 'theme-ember',
    name: 'Ember',
    dark: true,
    pack: 'Nature',
    ui: {
      bg: '#17110f',
      panel: '#1e1714',
      editor: '#1b1412',
      elevated: '#271e1a',
      hover: '#30251f',
      border: '#3d2f27',
      text: '#f3e6dc',
      muted: '#b39c8c',
      faint: '#86725f',
      accent: '#ff8a4c',
      accent2: '#ffc857',
      accentText: '#1f0d02',
      danger: '#ff6b5e',
      warn: '#ffc857',
      ok: '#9ccc65'
    },
    syntax: {
      keyword: 'ff8a4c',
      string: 'c3d977',
      number: 'ffb86b',
      comment: '978373',
      fn: 'ffd479',
      type: '7fd1c7',
      variable: 'f3e6dc',
      operator: 'e8a87c',
      tag: 'ff7a6b',
      attr: 'ffc857',
      regexp: '7fd1c7',
      constant: 'f7a1c4'
    }
  },
  {
    id: 'theme-blood-moon',
    name: 'Blood Moon',
    dark: true,
    pack: 'Nature',
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
  }
];

for (const theme of THEMES) aether.themes.add(theme);
aether.commands.register('pick', 'Theme: Pick a Theme (the Nature Theme Pack is there now)', () => aether.commands.run('view.theme'), { category: 'Nature Theme Pack' });
