// Light Theme Pack: 5 colour themes for Aether in one install. They are Glacier, Lavender Mist, Matcha, Mint Cream and Paper.
// They go in the Light pack in Settings > Theme and in the theme picker (Ctrl+Alt+T). Each one is also in the
// Marketplace on its own, with the same id, so having both installed shows each theme once.

const THEMES = [
  {
    id: 'theme-glacier',
    name: 'Glacier',
    dark: false,
    pack: 'Light',
    ui: {
      bg: '#eef3f8',
      panel: '#e4ebf2',
      editor: '#f8fbfe',
      elevated: '#ffffff',
      hover: '#d9e3ee',
      border: '#c8d5e3',
      text: '#1d2733',
      muted: '#4f5e70',
      faint: '#728195',
      accent: '#2563c9',
      accent2: '#0d6e6e',
      accentText: '#ffffff',
      danger: '#c62828',
      warn: '#8d5b00',
      ok: '#1a6e3d'
    },
    syntax: {
      keyword: '7a3fc4',
      string: '1e7b45',
      number: 'b04a09',
      comment: '627183',
      fn: '2563c9',
      type: '0d6e6e',
      variable: '1d2733',
      operator: '4a5868',
      tag: 'b42358',
      attr: '8d5b00',
      regexp: 'b04a09',
      constant: 'b42358'
    }
  },
  {
    id: 'theme-lavender-mist',
    name: 'Lavender Mist',
    dark: false,
    pack: 'Light',
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
  },
  {
    id: 'theme-matcha',
    name: 'Matcha',
    dark: false,
    pack: 'Light',
    ui: {
      bg: '#eef0e0',
      panel: '#e3e7d2',
      editor: '#f7f8ec',
      elevated: '#ffffff',
      hover: '#d7dcc2',
      border: '#bcc4a0',
      text: '#20261a',
      muted: '#525c44',
      faint: '#73805f',
      accent: '#44701c',
      accent2: '#8a4a1f',
      accentText: '#ffffff',
      danger: '#a81e2a',
      warn: '#7a5200',
      ok: '#1c6e3f'
    },
    syntax: {
      keyword: '5d6d1a',
      string: '2f7a3f',
      number: 'a14f12',
      comment: '667054',
      fn: '1f6a87',
      type: '7c5f05',
      variable: '20261a',
      operator: '48503a',
      tag: 'a62b52',
      attr: '7c5f05',
      regexp: '2f7a3f',
      constant: 'a14f12'
    }
  },
  {
    id: 'theme-mint-cream',
    name: 'Mint Cream',
    dark: false,
    pack: 'Light',
    ui: {
      bg: '#eef6f1',
      panel: '#e3efe8',
      editor: '#f8fcfa',
      elevated: '#ffffff',
      hover: '#d6e6dd',
      border: '#c2d6ca',
      text: '#1b2a24',
      muted: '#4f6459',
      faint: '#6b8175',
      accent: '#0c6e52',
      accent2: '#7a3fa6',
      accentText: '#ffffff',
      danger: '#b3261e',
      warn: '#855500',
      ok: '#1a7040'
    },
    syntax: {
      keyword: '7a3fa6',
      string: '1e7b45',
      number: 'a84a0c',
      comment: '5f7468',
      fn: '1f62b8',
      type: '0b6b6b',
      variable: '1b2a24',
      operator: '44584d',
      tag: 'b4235a',
      attr: '855500',
      regexp: '0a6f8f',
      constant: 'a84a0c'
    }
  },
  {
    id: 'theme-paper',
    name: 'Paper',
    dark: false,
    pack: 'Light',
    ui: {
      bg: '#f4efe6',
      panel: '#ece5d8',
      editor: '#faf6ef',
      elevated: '#ffffff',
      hover: '#e3dacb',
      border: '#d6cbb8',
      text: '#2b2722',
      muted: '#61584e',
      faint: '#8a7f71',
      accent: '#a84a22',
      accent2: '#285f7b',
      accentText: '#ffffff',
      danger: '#b3261e',
      warn: '#8a5a00',
      ok: '#256b29'
    },
    syntax: {
      keyword: 'a3366d',
      string: '45701b',
      number: 'a84a22',
      comment: '736a5e',
      fn: '1f5f99',
      type: '8a5a00',
      variable: '2b2722',
      operator: '5c5048',
      tag: '9c2f2f',
      attr: '8a5a00',
      regexp: '285f7b',
      constant: 'a84a22'
    }
  }
];

for (const theme of THEMES) aether.themes.add(theme);
aether.commands.register('pick', 'Theme: Pick a Theme (the Light Theme Pack is there now)', () => aether.commands.run('view.theme'), { category: 'Light Theme Pack' });
