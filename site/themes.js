// The site's colour themes: the same five as Aether's download page (aether-download/script.js). Both sites live on
// redfire3248.github.io, so they share the saved choice: a theme picked on one is on when the other opens.
// This file loads in <head> without defer, so the colours are on before anything is drawn.
(function () {
  'use strict';
  // name, pixel, dark, background, panel, line, text, muted, accent, accent 2, pink, text on the accent
  const LIST = [
    ['Aether Night', 0, 1, '#0b0e1a', '#0e1222', '#1d2440', '#d7dcf0', '#7d86a8', '#7859f7', '#3ff3c8', '#ff7eb6', '#ffffff'],
    ['Nebula', 0, 1, '#120b22', '#170f2b', '#2c1f4d', '#ebe1ff', '#a08cc8', '#ff5cc8', '#8f7bff', '#ff7ad9', '#120b22'],
    ['Paper', 0, 0, '#f2f2f0', '#f7f7f5', '#e0e0db', '#222222', '#6b6b66', '#2f6fed', '#e8590c', '#c2255c', '#ffffff'],
    ['Pixel Arcade', 1, 1, '#14152a', '#1a1c2c', '#566c86', '#f4f4f4', '#94b0c2', '#ef7d57', '#a7f070', '#c46c7c', '#1a1c2c'],
    ['Pixel Game Boy', 1, 1, '#0f380f', '#183f18', '#4f7f1f', '#c4e36a', '#c5d687', '#9bbc0f', '#c4e36a', '#9bbc0f', '#0f380f'],
  ];
  const KEY = 'aether-site-theme', root = document.documentElement;
  const mix = (a, b, p) => `color-mix(in srgb, ${a} ${p}%, ${b})`;

  function apply(i) {
    const [, px, dark, bg, panel, line, text, muted, accent, accent2, , on] = LIST[i];
    const vars = { bg, panel, elevated: mix(text, panel, 5), hover: mix(text, panel, 9), border: line, text, muted, accent, accent2, 'accent-text': on, 'code-bg': mix(bg, panel, 50), glow: mix(accent, 'transparent', 22) };
    for (const [k, v] of Object.entries(vars)) root.style.setProperty('--' + k, v);
    root.dataset.theme = dark ? 'dark' : 'light';
    if (px) root.dataset.style = 'pixel'; else delete root.dataset.style;
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = bg;
  }

  // the saved theme; someone who only ever picked the old light look gets Paper
  let current = 0;
  try {
    const name = localStorage.getItem(KEY) || (localStorage.getItem('aether-theme') === 'light' ? 'Paper' : '');
    current = Math.max(0, LIST.findIndex((t) => t[0] === name));
  } catch { /* the first theme */ }
  apply(current);

  // the menu at the top of every page
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-btn'), menu = document.getElementById('theme-menu');
    if (!btn || !menu) return;
    const dot = btn.querySelector('.theme-dot');
    const row = ([name, px, , bg, , , tx, , ac, ac2, pk], i) => `<button type="button" class="tm-row${px ? ' px' : ''}" data-i="${i}" aria-pressed="false"><span class="tm-sw" style="background:${bg}"><i style="background:${ac}"></i><i style="background:${ac2}"></i><i style="background:${pk}"></i></span><span style="--tx:${tx}">${name}</span></button>`;
    const group = (title, px) => `<p class="tm-h">${title}</p><div class="tm-list">${LIST.map((t, i) => (!!t[1] === px ? row(t, i) : '')).join('')}</div>`;
    menu.innerHTML = group('Smooth', false) + group('Pixel', true);
    const rows = [...menu.querySelectorAll('.tm-row')];
    const mark = () => { rows.forEach((r) => r.setAttribute('aria-pressed', +r.dataset.i === current)); dot.style.background = LIST[current][8]; btn.title = 'Theme: ' + LIST[current][0]; };
    const open = (on) => { menu.hidden = !on; btn.setAttribute('aria-expanded', on); if (on) (rows.find((r) => r.getAttribute('aria-pressed') === 'true') || rows[0]).focus({ preventScroll: true }); };
    btn.addEventListener('click', () => open(menu.hidden));
    menu.addEventListener('click', (e) => {
      const r = e.target.closest('.tm-row'); if (!r) return;
      current = +r.dataset.i; apply(current); mark();
      try { localStorage.setItem(KEY, LIST[current][0]); } catch { /* the choice lasts for this visit */ }
    });
    menu.addEventListener('keydown', (e) => { const k = rows.indexOf(document.activeElement), step = { ArrowDown: 1, ArrowUp: -1 }[e.key]; if (step) { e.preventDefault(); rows[(k + step + rows.length) % rows.length].focus(); } });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { open(false); btn.focus(); } });
    addEventListener('pointerdown', (e) => { if (!menu.hidden && !e.target.closest('.theme-pick')) open(false); });
    // a theme picked in another tab (or on the download page) shows here too
    addEventListener('storage', (e) => { if (e.key !== KEY) return; const i = LIST.findIndex((t) => t[0] === e.newValue); if (i >= 0) { current = i; apply(i); mark(); } });
    mark();
  });
})();
