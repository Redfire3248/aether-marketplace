// Neon Theme Pack: 4 colour themes for Aether in one install. They are Neon Tide, Cyber Noir, Tokyo Rain and Plum Dusk.
// They go in the Neon pack in Settings > Theme and in the theme picker (Ctrl+Alt+T). Each one is also in the
// Marketplace on its own, with the same id, so having both installed shows each theme once.

const THEMES = [
  {
    id: 'theme-neon-tide',
    name: 'Neon Tide',
    dark: true,
    pack: 'Neon',
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
  },
  {
    id: 'theme-cyber-noir',
    name: 'Cyber Noir',
    dark: true,
    pack: 'Neon',
    ui: {
      bg: '#0a0a0c',
      panel: '#111114',
      editor: '#0e0e11',
      elevated: '#1a1a1f',
      hover: '#222228',
      border: '#34343c',
      text: '#f2f2ee',
      muted: '#a9a9a4',
      faint: '#7f7f7a',
      accent: '#f5e400',
      accent2: '#00e5ff',
      accentText: '#141400',
      danger: '#ff7a7a',
      warn: '#ffcb6b',
      ok: '#6fe0a0'
    },
    syntax: {
      keyword: 'f5e400',
      string: '7dff8a',
      number: 'ff9e4d',
      comment: '85857f',
      fn: '00e5ff',
      type: 'ffd34d',
      variable: 'f2f2ee',
      operator: 'd0d0ca',
      tag: 'ff6e8a',
      attr: 'ffd34d',
      regexp: '7dff8a',
      constant: 'ff9e4d'
    }
  },
  {
    id: 'theme-tokyo-rain',
    name: 'Tokyo Rain',
    dark: true,
    pack: 'Neon',
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
  },
  {
    id: 'theme-plum-dusk',
    name: 'Plum Dusk',
    dark: true,
    pack: 'Neon',
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
  }
];

for (const theme of THEMES) aether.themes.add(theme);
aether.commands.register('pick', 'Theme: Pick a Theme (the Neon Theme Pack is there now)', () => aether.commands.run('view.theme'), { category: 'Neon Theme Pack' });
