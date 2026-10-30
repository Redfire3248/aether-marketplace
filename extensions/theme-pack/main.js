// Theme Pack: five colour themes for Aether, three dark and two light. Pick one in the theme picker
// (Command Palette > Theme). Every colour is checked to be easy to read on the background it sits on.

const THEMES = [
  {
    id: 'theme-pack-deep-sea', name: 'Deep Sea', dark: true,
    ui: { bg: '#0b1622', panel: '#0f1d2b', editor: '#0d1a27', elevated: '#152536', hover: '#1b2f44', border: '#22384f', text: '#dce8f2', muted: '#8fa6ba', faint: '#6a8296', accent: '#3fc1c9', accent2: '#7aa2ff', accentText: '#04161a', danger: '#ff6b6b', warn: '#f5c26b', ok: '#5fd38d' },
    syntax: { keyword: 'c792ea', string: 'a5e075', number: 'f78c6c', comment: '7590a6', fn: '82aaff', type: 'ffcb6b', variable: 'dce8f2', operator: '89ddff', tag: 'f07178', attr: 'ffcb6b', regexp: '89ddff', constant: 'f78c6c' }
  },
  {
    id: 'theme-pack-ember', name: 'Ember', dark: true,
    ui: { bg: '#17110f', panel: '#1e1714', editor: '#1b1412', elevated: '#271e1a', hover: '#30251f', border: '#3d2f27', text: '#f3e6dc', muted: '#b39c8c', faint: '#86725f', accent: '#ff8a4c', accent2: '#ffc857', accentText: '#1f0d02', danger: '#ff6b5e', warn: '#ffc857', ok: '#9ccc65' },
    syntax: { keyword: 'ff8a4c', string: 'c3d977', number: 'ffb86b', comment: '978373', fn: 'ffd479', type: '7fd1c7', variable: 'f3e6dc', operator: 'e8a87c', tag: 'ff7a6b', attr: 'ffc857', regexp: '7fd1c7', constant: 'f7a1c4' }
  },
  {
    id: 'theme-pack-forest-night', name: 'Forest Night', dark: true,
    ui: { bg: '#0e1512', panel: '#121c17', editor: '#101914', elevated: '#18251f', hover: '#1e2e26', border: '#26392f', text: '#dfeee4', muted: '#97b3a2', faint: '#6b8a77', accent: '#5fd39a', accent2: '#c8e06a', accentText: '#04140c', danger: '#ff6f6f', warn: '#e8c35a', ok: '#5fd39a' },
    syntax: { keyword: '7fdbb6', string: 'd7e28a', number: 'f2a65a', comment: '76937f', fn: '9fd3ff', type: 'e8c35a', variable: 'dfeee4', operator: 'a3c9b3', tag: 'f28b82', attr: 'e8c35a', regexp: 'b8a4ff', constant: 'f2a65a' }
  },
  {
    id: 'theme-pack-paper', name: 'Paper', dark: false,
    ui: { bg: '#f4efe6', panel: '#ece5d8', editor: '#faf6ef', elevated: '#ffffff', hover: '#e3dacb', border: '#d6cbb8', text: '#2b2722', muted: '#61584e', faint: '#8a7f71', accent: '#a84a22', accent2: '#285f7b', accentText: '#ffffff', danger: '#b3261e', warn: '#8a5a00', ok: '#256b29' },
    syntax: { keyword: 'a3366d', string: '45701b', number: 'a84a22', comment: '736a5e', fn: '1f5f99', type: '8a5a00', variable: '2b2722', operator: '5c5048', tag: '9c2f2f', attr: '8a5a00', regexp: '285f7b', constant: 'a84a22' }
  },
  {
    id: 'theme-pack-glacier', name: 'Glacier', dark: false,
    ui: { bg: '#eef3f8', panel: '#e4ebf2', editor: '#f8fbfe', elevated: '#ffffff', hover: '#d9e3ee', border: '#c8d5e3', text: '#1d2733', muted: '#4f5e70', faint: '#728195', accent: '#2563c9', accent2: '#0d6e6e', accentText: '#ffffff', danger: '#c62828', warn: '#8d5b00', ok: '#1a6e3d' },
    syntax: { keyword: '7a3fc4', string: '1e7b45', number: 'b04a09', comment: '627183', fn: '2563c9', type: '0d6e6e', variable: '1d2733', operator: '4a5868', tag: 'b42358', attr: '8d5b00', regexp: 'b04a09', constant: 'b42358' }
  }
];

for (const t of THEMES) aether.themes.add(t);
aether.commands.register('pick', 'Theme Pack: Pick a Theme', () => aether.commands.run('view.theme'), { category: 'Theme Pack' });
