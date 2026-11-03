// The Marketplace page: every extension in index.json, with search and category tabs (kept in the address, so a
// filtered list can be shared).
(function () {
  'use strict';
  const { esc, loadIndex, community, badge, maker } = self.AetherSite;
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', async () => {
    const list = $('list'), q = $('q'), tagsEl = $('tags'), count = $('count');
    const params = new URLSearchParams(location.search);
    let cat = params.get('cat') || '';
    q.value = params.get('q') || '';

    let all, base = '';
    try { const idx = await loadIndex(); all = idx.extensions; base = idx.base; } catch (e) {
      list.innerHTML = `<p class="notice">${esc(e.message)} Try again in a moment, or see them <a href="${self.AetherSite.REPO}/tree/main/extensions">on GitHub</a>.</p>`;
      return;
    }
    all.sort((a, b) => a.name.localeCompare(b.name));

    const CATS = ['Themes', 'Pets', 'Code', 'Web', 'Writing', 'Tools'];
    const inCat = (c) => all.filter((x) => x.category === c).length;
    const link = (x) => `extension.html?id=${encodeURIComponent(x.id)}${x.community ? '&amp;shared=1' : ''}`;
    if (cat && !CATS.includes(cat)) cat = '';

    const words = (s) => s.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = (x, ws) => {
      const hay = [x.name, x.description, x.author, x.id, ...(x.tags || [])].join(' ').toLowerCase();
      return ws.every((w) => hay.includes(w));
    };

    const tabs = () => '<i class="cat-pill"></i>' + [['', 'All', all.length], ...CATS.map((c) => [c, c, inCat(c)])]
      .map(([value, label, n]) => `<button class="cat" type="button" role="tab" data-cat="${esc(value)}">${esc(label)} <span class="count">${n}</span></button>`).join('');
    tagsEl.innerHTML = tabs();
    let pill = tagsEl.querySelector('.cat-pill');
    function drawTags() {
      for (const b of tagsEl.querySelectorAll('.cat')) {
        const on = b.dataset.cat === cat; b.setAttribute('aria-selected', on);
        if (on) { pill.style.width = b.offsetWidth + 'px'; pill.style.height = b.offsetHeight + 'px'; pill.style.transform = `translate(${b.offsetLeft}px, ${b.offsetTop}px)`; }
      }
    }
    addEventListener('resize', drawTags);
    // a theme's card is painted in the theme itself, with a little code window to show its colours
    const safe = (c) => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : 'transparent');
    function themeCard(x, i) {
      const p = x.preview, v = Object.entries(p).map(([k, c]) => `--t-${k}:${safe(c)}`).join(';');
      return `
        <a class="card ext theme-card${(x.tags || []).includes('pixel') ? ' pixel' : ''}${(x.tags || []).includes('light') ? ' light' : ''}" style="${v};--i:${i}" href="${link(x)}">
          <h3>${esc(x.name)}</h3>
          <p>${esc(x.description)}</p>
          <div class="t-foot"><span class="t-btn">${(x.tags || []).includes('pack') ? 'Pack' : (x.tags || []).includes('pixel') ? 'Pixel' : (x.tags || []).includes('light') ? 'Light' : 'Dark'}</span><span class="by">${x.community ? esc(x.author) + ' · ' : ''}v${esc(x.version)}</span></div>
        </a>`;
    }
    function draw() {
      const ws = words(q.value);
      const shown = all.filter((x) => (!cat || x.category === cat) && matches(x, ws));
      count.textContent = shown.length === all.length ? `${all.length} extensions` : `${shown.length} of ${all.length} extensions`;
      list.innerHTML = shown.length ? shown.map((x, i) => (x.preview ? themeCard(x, i) : `
        <a class="card ext${x.community ? ' shared' : ''}" style="--i:${i}" href="${link(x)}">
          <div class="head">
            <span class="badge${x.picture || x.image ? ' pic' : ''}">${badge(x, base)}</span>
            <div><h3>${esc(x.name)}</h3><div class="by">${maker(x)} · v${esc(x.version)}${x.community ? ' · <span class="shared-tag">Shared</span>' : ''}</div></div>
          </div>
          <p>${esc(x.description)}</p>
          <div class="tagrow">${(x.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </a>`)).join('') : '<p class="empty">No extensions match. Try other words, or <b>All</b>.</p>';
      const p = new URLSearchParams();
      if (q.value.trim()) p.set('q', q.value.trim());
      if (cat) p.set('cat', cat);
      history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    }

    tagsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.cat');
      if (!b) return;
      cat = b.dataset.cat;
      drawTags(); draw();
    });
    q.addEventListener('input', draw);
    drawTags(); draw();

    // the extensions people shared themselves join the list when they arrive (the Marketplace's own win on a clash)
    try {
      const mine = new Set(all.map((x) => x.id));
      const extra = (await community.list()).filter((x) => !mine.has(x.id));
      if (extra.length) {
        all = all.concat(extra).sort((a, b) => a.name.localeCompare(b.name));
        tagsEl.innerHTML = tabs(); pill = tagsEl.querySelector('.cat-pill');
        drawTags(); draw();
      }
    } catch { /* the Marketplace's own are there */ }
  });
})();
