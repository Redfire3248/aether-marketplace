// One extension's page (extension.html?id=..., with &shared=1 for one a person shared from publish.html): its icon,
// name and details, how to install it, its screenshots (bigger when clicked), and its README, rendered from Markdown.
(function () {
  'use strict';
  const { icon, esc, loadIndex, size, REPO, community, badge, maker } = self.AetherSite;

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

  // screenshots: a row of pictures; one clicked opens big, and the arrows go through them
  function gallery(box, shots, name) {
    if (!shots.length) return;
    box.innerHTML = `<div class="shots">${shots.map((s, i) => `<button type="button" class="shot" data-i="${i}" aria-label="Screenshot ${i + 1} of ${shots.length}, bigger"><img src="${esc(s)}" alt="${esc(name)}, screenshot ${i + 1}" loading="lazy"></button>`).join('')}</div>`;
    const lb = document.getElementById('lightbox'), img = lb.querySelector('img'), cap = lb.querySelector('.lb-n');
    let at = 0;
    const show = (i) => { at = (i + shots.length) % shots.length; img.src = shots[at]; img.alt = `${name}, screenshot ${at + 1}`; cap.textContent = `${at + 1} of ${shots.length}`; };
    const open = (i) => { show(i); lb.hidden = false; lb.querySelector('.lb-close').focus(); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; const b = box.querySelector(`[data-i="${at}"]`); if (b) b.focus(); };
    box.addEventListener('click', (e) => { const b = e.target.closest('.shot'); if (b) open(+b.dataset.i); });
    lb.querySelector('.lb-close').onclick = close;
    lb.querySelector('.lb-prev').onclick = () => show(at - 1);
    lb.querySelector('.lb-next').onclick = () => show(at + 1);
    lb.querySelector('.lb-prev').hidden = lb.querySelector('.lb-next').hidden = shots.length < 2;
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(at - 1); else if (e.key === 'ArrowRight') show(at + 1); });
  }

  const when = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };

  document.addEventListener('DOMContentLoaded', async () => {
    const head = document.getElementById('head'), readme = document.getElementById('readme'), side = document.getElementById('side'), shotsBox = document.getElementById('gallery');
    const params = new URLSearchParams(location.search), id = params.get('id') || '';
    const missing = (msg) => { head.innerHTML = ''; side.hidden = true; readme.innerHTML = `<p class="notice">${msg} <a href="marketplace.html">See all the extensions</a>.</p>`; };
    if (!/^[a-z0-9][a-z0-9-]{1,40}$/.test(id)) return missing('No extension was named.');

    // the Marketplace's own first; then the ones people shared
    let x = null, base = '';
    try { const index = await loadIndex(); base = index.base; x = index.extensions.find((e) => e.id === id) || null; } catch { /* maybe a shared one */ }
    if (!x) { try { x = await community.get(id); } catch (e) { return missing(esc(e.message)); } }
    if (!x) return missing(`There is no extension called "${esc(id)}".`);

    document.title = `${x.name} - Aether Marketplace`;
    const source = x.community ? '' : `${REPO}/tree/main/extensions/${x.id}`;
    head.innerHTML = `
      <div class="ext-head">
        <span class="badge${x.picture || x.image ? ' pic' : ''}">${badge(x, base)}</span>
        <div>
          <h1>${esc(x.name)}</h1>
          <p class="ext-by">by ${maker(x)}</p>
          <p class="ext-desc">${esc(x.description)}</p>
          <div class="tagrow"><a class="tag cat-tag" href="marketplace.html?cat=${encodeURIComponent(x.category || '')}">${esc(x.category || '')}</a>${x.community ? '<span class="tag shared-tag">Shared by a person</span>' : ''}${(x.tags || []).filter((t) => t.toLowerCase() !== String(x.category).toLowerCase()).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </div>
      </div>
      ${x.community ? `<p class="notice warn"><b>Shared by ${esc(x.author)}.</b> The Aether team did not check it. It runs inside Aether and can read and change your files, so only install it if you trust who made it.</p>` : ''}
      ${x.preview ? picture(x) : ''}`;

    side.innerHTML = `
      <div class="side-card">
        <h2>Install</h2>
        <ol class="install-steps">
          <li>Open Aether. <a href="https://redfire3248.github.io/aether-download/">Get it</a> if you don't have it.</li>
          <li>Open <b>Extensions</b> (<kbd>Ctrl+Shift+X</kbd>), then <b>Aether Marketplace</b>.</li>
          <li>Find <b>${esc(x.name)}</b> and click <b>Install</b>. It starts at once.</li>
        </ol>
      </div>
      <div class="side-card">
        <h2>Details</h2>
        <dl class="facts">
          <dt>Made by</dt><dd>${maker(x)}</dd>
          <dt>Version</dt><dd>${esc(x.version)}</dd>
          ${x.size ? `<dt>Size</dt><dd>${size(x.size)}</dd>` : ''}
          ${x.aether ? `<dt>Needs</dt><dd>Aether ${esc(x.aether.replace('>=', ''))} or newer</dd>` : ''}
          ${x.updated ? `<dt>Updated</dt><dd>${esc(when(x.updated))}</dd>` : ''}
          ${x.files ? `<dt>Files</dt><dd>${x.files.length}</dd>` : ''}
        </dl>
        ${source ? `<a class="side-link" href="${source}">${icon('code')} See its code</a>` : ''}
      </div>`;

    // screenshots: files in its folder, or the pictures shared with it
    try {
      const shots = x.community ? (await Promise.all(Array.from({ length: x.shots }, (_, i) => community.shot(x.id, i)))).filter(Boolean) : (x.screenshots || []).map((f) => `${base}extensions/${x.id}/${f}`);
      gallery(shotsBox, shots, x.name);
    } catch { /* no pictures */ }

    try {
      let md;
      if (x.community) md = await community.file(x.id, 'readme');
      else { const r = await fetch(`${base}extensions/${x.id}/README.md`, { cache: 'no-cache' }); if (!r.ok) throw new Error(); md = await r.text(); }
      // the page already shows the name and the description
      md = md.replace(/^\s*# .*\n+/, '');
      const first = md.split(/\n\s*\n/)[0];
      if (first && first.trim() === x.description.trim()) md = md.slice(md.indexOf(first) + first.length);
      readme.innerHTML = md.trim() ? self.AetherMarkdown.render(md, x.community ? { linkBase: '', imageBase: '' } : { linkBase: `${REPO}/blob/main/extensions/${x.id}/`, imageBase: `${base}extensions/${x.id}/` }) : '';
    } catch {
      readme.innerHTML = `<p class="muted">Its page could not be loaded.${source ? ` <a href="${source}">Read it on GitHub</a>.` : ''}</p>`;
    }
  });
})();
