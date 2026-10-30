// The website's shared bits: Aether's icons, and reading the Marketplace's index.json.
(function (root) {
  'use strict';

  const REPO = 'https://github.com/Redfire3248/aether-marketplace';

  // the colour themes are in themes.js
  document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });

  // ---- Aether's own icons (the names extensions use in extension.json)
  const P = {
    puzzle: '<path d="M14 4a2 2 0 1 0-4 0v2H6a1 1 0 0 0-1 1v4h2a2 2 0 1 1 0 4H5v4a1 1 0 0 0 1 1h4v-2a2 2 0 1 1 4 0v2h4a1 1 0 0 0 1-1v-4h-2a2 2 0 1 1 0-4h2V7a1 1 0 0 0-1-1h-4z"/>',
    palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16" cy="10" r="1.2"/><path d="M12 21a3 3 0 0 1 0-6h2"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    paw: '<circle cx="7" cy="9.5" r="1.8"/><circle cx="10.8" cy="5.8" r="1.8"/><circle cx="15.4" cy="6.2" r="1.8"/><circle cx="18.6" cy="10.4" r="1.8"/><path d="M8 17.2c0-3 2.5-5.6 5-5.6s5.2 2.6 4.6 5.3c-.4 2-2.6 2.3-4.6 1.6-2 .7-5 .9-5-1.3z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    type: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v17H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H13v17h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    braces: '<path d="M8 3.5H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2.5 2 2 0 0 1 2 2.5v4a2 2 0 0 0 2 2h1M16 3.5h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2.5 2 2 0 0 0-2 2.5v4a2 2 0 0 1-2 2h-1"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
    git: '<circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 7.5v9"/><path d="M18 10.5c0 4.5-6 3.5-11 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    gamepad: '<path d="M6 8h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-2a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".6"/><circle cx="18" cy="13" r=".6"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    files: '<path d="M14.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 3v5h5"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>'
  };
  const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${P[name] || P.puzzle}</svg>`;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // ---- the index: published next to the pages, or one folder up when you open site/ from the repository
  let loading = null;
  function loadIndex() {
    if (!loading) {
      loading = (async () => {
        for (const base of location.pathname.includes('/site/') ? ['../', ''] : ['', '../']) {
          try {
            const r = await fetch(base + 'index.json', { cache: 'no-cache' });
            if (!r.ok) continue;
            const data = await r.json();
            if (data && Array.isArray(data.extensions)) return { base, extensions: data.extensions };
          } catch { /* try the next place */ }
        }
        throw new Error('The list of extensions could not be loaded.');
      })();
      loading.catch(() => { loading = null; });
    }
    return loading;
  }

  const size = (n) => (n < 1024 ? `${n} bytes` : n < 1024 * 1024 ? `${Math.round(n / 102.4) / 10} KB` : `${Math.round(n / 104857.6) / 10} MB`);

  root.AetherSite = { REPO, icon, esc, loadIndex, size };
})(self);
