// The Marketplace page: every extension in index.json, with search and tag filters (kept in the address, so a
// filtered list can be shared).
(function () {
  'use strict';
  const { icon, esc, loadIndex } = self.AetherSite;
  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', async () => {
    const list = $('list'), q = $('q'), tagsEl = $('tags'), count = $('count');
    const params = new URLSearchParams(location.search);
    let tag = params.get('tag') || '';
    q.value = params.get('q') || '';

    let all;
    try { all = (await loadIndex()).extensions; } catch (e) {
      list.innerHTML = `<p class="notice">${esc(e.message)} Try again in a moment, or see them <a href="${self.AetherSite.REPO}/tree/main/extensions">on GitHub</a>.</p>`;
      return;
    }
    all.sort((a, b) => a.name.localeCompare(b.name));

    const tagCount = new Map();
    for (const x of all) for (const t of x.tags || []) tagCount.set(t, (tagCount.get(t) || 0) + 1);
    const tags = [...tagCount.keys()].sort();
    if (tag && !tagCount.has(tag)) tag = '';

    const words = (s) => s.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = (x, ws) => {
      const hay = [x.name, x.description, x.author, x.id, ...(x.tags || [])].join(' ').toLowerCase();
      return ws.every((w) => hay.includes(w));
    };

    function drawTags() {
      tagsEl.innerHTML = [['', 'All', all.length], ...tags.map((t) => [t, t, tagCount.get(t)])]
        .map(([value, label, n]) => `<button class="chip" type="button" data-tag="${esc(value)}" aria-pressed="${tag === value}">${esc(label)} <span class="count">${n}</span></button>`).join('');
    }
    function draw() {
      const ws = words(q.value);
      const shown = all.filter((x) => (!tag || (x.tags || []).includes(tag)) && matches(x, ws));
      count.textContent = shown.length === all.length ? `${all.length} extensions` : `${shown.length} of ${all.length} extensions`;
      list.innerHTML = shown.length ? shown.map((x) => `
        <a class="card ext" href="extension.html?id=${encodeURIComponent(x.id)}">
          <div class="head">
            <span class="badge">${icon(x.icon)}</span>
            <div><h3>${esc(x.name)}</h3><div class="by">${esc(x.author)} · v${esc(x.version)}</div></div>
          </div>
          <p>${esc(x.description)}</p>
          <div class="tagrow">${(x.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </a>`).join('') : '<p class="empty">No extensions match. Try other words, or <b>All</b>.</p>';
      const p = new URLSearchParams();
      if (q.value.trim()) p.set('q', q.value.trim());
      if (tag) p.set('tag', tag);
      history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    }

    tagsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      tag = tag === b.dataset.tag ? '' : b.dataset.tag;
      drawTags(); draw();
    });
    q.addEventListener('input', draw);
    drawTags(); draw();
  });
})();
