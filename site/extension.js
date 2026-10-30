// One extension's page (extension.html?id=...): its name, version and tags from index.json, how to install it,
// and its README, rendered from Markdown.
(function () {
  'use strict';
  const { icon, esc, loadIndex, size, REPO } = self.AetherSite;

  // a theme's picture: Aether's window drawn in the theme's own colours
  const picture = (x) => {
    const p = x.preview, px = (x.tags || []).includes('pixel');
    const vars = Object.entries(p).map(([k, c]) => (/^#[0-9a-f]{3,8}$/i.test(c) ? `--t-${k}:${c}` : '')).join(';');
    const code = [
      ['c', '# move the player, and win at the edge'],
      [['k', 'def '], ['f', 'update'], ['', '(player, dt):']],
      [['', '    speed = '], ['n', '120']],
      [['', '    player.x += speed * dt']],
      [['k', '    if '], ['', 'player.x > '], ['n', '640'], ['', ':']],
      [['f', '        print'], ['', '('], ['s', '"You win!"'], ['', ')']]
    ].map((l, i) => `<span class="ln">${i + 1}</span>${(typeof l[0] === 'string' ? [l] : l).map(([c, t]) => (c ? `<span class="${c}">${esc(t)}</span>` : esc(t))).join('')}`).join('\n');
    return `
      <figure class="preview${px ? ' pixel' : ''}" style="${vars}">
        <div class="pv-win" aria-hidden="true">
          <div class="pv-title"><img src="${px ? 'logo-pixel.png' : 'logo.png'}" alt="" width="16" height="16"><b>Aether</b><span class="pv-search">Search files, commands</span><i></i><i></i><i></i></div>
          <div class="pv-body">
            <div class="pv-act"><i class="on"></i><i></i><i></i><i></i><i></i></div>
            <div class="pv-side"><b>Files</b><span>assets</span><span>scenes</span><span class="on">main.py</span><span>README.md</span></div>
            <div class="pv-main">
              <div class="pv-tabs"><span class="on">main.py</span><span>game.aes</span></div>
              <pre class="pv-code">${code}</pre>
            </div>
          </div>
          <div class="pv-status"><span>Python</span><span>UTF-8</span><span>Ln 4, Col 12</span><span>${esc(x.name)}</span></div>
        </div>
        <figcaption>How Aether looks with ${esc(x.name)}.</figcaption>
      </figure>`;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const head = document.getElementById('head'), readme = document.getElementById('readme');
    const id = new URLSearchParams(location.search).get('id') || '';
    const missing = (msg) => { head.innerHTML = ''; readme.innerHTML = `<p class="notice">${msg} <a href="marketplace.html">See all the extensions</a>.</p>`; };
    if (!/^[a-z0-9][a-z0-9-]{1,40}$/.test(id)) return missing('No extension was named.');

    let index;
    try { index = await loadIndex(); } catch (e) { return missing(esc(e.message)); }
    const x = index.extensions.find((e) => e.id === id);
    if (!x) return missing(`There is no extension called "${esc(id)}".`);

    document.title = `${x.name} - Aether Marketplace`;
    const source = `${REPO}/tree/main/extensions/${x.id}`;
    head.innerHTML = `
      <div class="ext-head">
        <span class="badge">${icon(x.icon)}</span>
        <div>
          <h1>${esc(x.name)}</h1>
          <div class="meta"><span>by ${esc(x.author)}</span><span>version ${esc(x.version)}</span><span>${size(x.size)}</span>${x.aether ? `<span>Aether ${esc(x.aether.replace('>=', ''))} or newer</span>` : ''}</div>
          <div class="tagrow" style="margin-top:10px"><a class="tag" href="marketplace.html?cat=${encodeURIComponent(x.category || '')}">${esc(x.category || '')}</a></div>
        </div>
      </div>
      ${x.preview ? picture(x) : ''}
      <p class="notice install"><b>To install:</b> in Aether, open <b>Extensions</b> (<kbd>Ctrl+Shift+X</kbd>) &gt; <b>Aether Marketplace</b>, find <b>${esc(x.name)}</b> and click <b>Install</b>. <a href="${source}">See its code</a>.</p>`;

    try {
      const r = await fetch(`${index.base}extensions/${x.id}/README.md`, { cache: 'no-cache' });
      if (!r.ok) throw new Error();
      let md = await r.text();
      // the page already shows the name and the description
      md = md.replace(/^\s*# .*\n+/, '');
      const first = md.split(/\n\s*\n/)[0];
      if (first && first.trim() === x.description.trim()) md = md.slice(md.indexOf(first) + first.length);
      readme.innerHTML = self.AetherMarkdown.render(md, { linkBase: `${REPO}/blob/main/extensions/${x.id}/`, imageBase: `${index.base}extensions/${x.id}/` });
    } catch {
      readme.innerHTML = `<p>${esc(x.description)}</p><p class="muted">Its README could not be loaded. <a href="${source}">Read it on GitHub</a>.</p>`;
    }
  });
})();
