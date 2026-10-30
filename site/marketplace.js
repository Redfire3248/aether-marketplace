// The Marketplace page: every extension in index.json, with search and category tabs (kept in the address, so a
// filtered list can be shared).
(function () {
  'use strict';
  const { icon, esc, loadIndex } = self.AetherSite;
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', async () => {
    const list = $('list'), q = $('q'), tagsEl = $('tags'), count = $('count');
    const params = new URLSearchParams(location.search);
    let cat = params.get('cat') || '';
    q.value = params.get('q') || '';

    let all;
    try { all = (await loadIndex()).extensions; } catch (e) {
      list.innerHTML = `<p class="notice">${esc(e.message)} Try again in a moment, or see them <a href="${self.AetherSite.REPO}/tree/main/extensions">on GitHub</a>.</p>`;
      return;
    }
    all.sort((a, b) => a.name.localeCompare(b.name));

    const CATS = ['Themes', 'Pets', 'Code', 'Web', 'Writing', 'Tools'];
    const inCat = (c) => all.filter((x) => x.category === c).length;
    if (cat && !CATS.includes(cat)) cat = '';

    const words = (s) => s.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = (x, ws) => {
      const hay = [x.name, x.description, x.author, x.id, ...(x.tags || [])].join(' ').toLowerCase();
      return ws.every((w) => hay.includes(w));
    };

    function drawTags() {
      tagsEl.innerHTML = [['', 'All', all.length], ...CATS.map((c) => [c, c, inCat(c)])]
        .map(([value, label, n]) => `<button class="cat" type="button" role="tab" data-cat="${esc(value)}" aria-selected="${cat === value}">${esc(label)} <span class="count">${n}</span></button>`).join('');
    }
    // a theme's card is painted in the theme itself, with a little code window to show its colours
    const safe = (c) => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : 'transparent');
    function themeCard(x) {
      const p = x.preview, v = Object.entries(p).map(([k, c]) => `--t-${k}:${safe(c)}`).join(';');
      return `
        <a class="card ext theme-card" style="${v}" href="extension.html?id=${encodeURIComponent(x.id)}">
          <div class="t-win" aria-hidden="true">
            <div class="t-bar"><i></i><i></i><i></i><span>main.aes</span></div>
            <pre class="t-code"><span class="c"># say hello</span>
<span class="k">func</span> <span class="f">greet</span>(name):
  <span class="k">return</span> <span class="s">"Hello"</span>

score = <span class="n">42</span></pre>
          </div>
          <h3>${esc(x.name)}</h3>
          <p>${esc(x.description)}</p>
          <div class="t-foot"><span class="t-btn">${(x.tags || []).includes('light') ? 'Light' : 'Dark'}</span><span class="by">${esc(x.author)} · v${esc(x.version)}</span></div>
        </a>`;
    }
    function draw() {
      const ws = words(q.value);
      const shown = all.filter((x) => (!cat || x.category === cat) && matches(x, ws));
      count.textContent = shown.length === all.length ? `${all.length} extensions` : `${shown.length} of ${all.length} extensions`;
      list.innerHTML = shown.length ? shown.map((x) => (x.preview ? themeCard(x) : `
        <a class="card ext" href="extension.html?id=${encodeURIComponent(x.id)}">
          <div class="head">
            <span class="badge">${icon(x.icon)}</span>
            <div><h3>${esc(x.name)}</h3><div class="by">${esc(x.author)} · v${esc(x.version)}</div></div>
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
  });
})();
