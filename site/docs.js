// The docs page (docs.html#topic): a guide for every part of Aether, written in Markdown in docs/, plus the
// extension API from API.md. A list of guides, search through all of them, and "On this page" for the open one.
(function () {
  'use strict';
  const { esc } = self.AetherSite;

  // [id, title, group, file]; the order is the order of the list and of Next / Previous
  const TOPICS = [
    ['start', 'Welcome', 'Start', 'docs/start.md'],
    ['install', 'Install and update', 'Start', 'docs/install.md'],
    ['window', 'The window', 'Start', 'docs/window.md'],
    ['editor', 'The code editor', 'Code', 'docs/editor.md'],
    ['run', 'Running code', 'Code', 'docs/run.md'],
    ['debugging', 'Debugging', 'Code', 'docs/debugging.md'],
    ['aether-script', 'Aether Script', 'Code', 'docs/aether-script.md'],
    ['ai', 'AI', 'Code', 'docs/ai.md'],
    ['files', 'Files, search and Git', 'Code', 'docs/files.md'],
    ['games', 'The game engine', 'Make', 'docs/games.md'],
    ['art', 'Art Studio and pixel art', 'Make', 'docs/art.md'],
    ['sound', 'Sound Studio', 'Make', 'docs/sound.md'],
    ['gui', 'GUI Studio', 'Make', 'docs/gui.md'],
    ['particles', 'Particle Studio', 'Make', 'docs/particles.md'],
    ['apps', 'Apps: .exe and .apk', 'Make', 'docs/apps.md'],
    ['arduino', 'Arduino and circuits', 'Make', 'docs/arduino.md'],
    ['documents', 'PDFs and other files', 'Files', 'docs/documents.md'],
    ['pets', 'Pets', 'More', 'docs/pets.md'],
    ['themes', 'Themes and settings', 'More', 'docs/themes.md'],
    ['extensions', 'Extensions and the Marketplace', 'More', 'docs/extensions.md'],
    ['api', 'Making extensions: the API', 'More', 'API.md'],
    ['shortcuts', 'Keyboard shortcuts', 'More', 'docs/shortcuts.md']
  ];
  const byId = Object.fromEntries(TOPICS.map((t) => [t[0], t]));

  // API.md sits next to the site when published, one folder up when site/ is opened from the repository
  const url = (file) => (file === 'API.md' ? (location.pathname.includes('/site/') ? '../' : '') + file : file);
  const cache = {};
  const text = (t) => (cache[t[0]] = cache[t[0]] || fetch(url(t[3]), { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); }));

  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('toc-nav'), doc = document.getElementById('doc'), here = document.getElementById('here');
    const pager = document.getElementById('pager'), results = document.getElementById('results'), q = document.getElementById('dq');
    const topics = document.getElementById('topics');

    let group = '';
    nav.innerHTML = TOPICS.map(([id, title, g]) => `${g !== group ? `<p class="docs-group">${esc((group = g))}</p>` : ''}<a href="#${id}" data-id="${id}">${esc(title)}</a>`).join('');
    // on a phone the list folds away once a guide is picked
    const narrow = matchMedia('(max-width: 760px)');
    if (narrow.matches) topics.open = false;

    async function show(hash) {
      const [id, part] = decodeURIComponent(hash.replace(/^#/, '')).split('/');
      const t = byId[id] || TOPICS[0];
      for (const a of nav.querySelectorAll('a')) a.toggleAttribute('aria-current', a.dataset.id === t[0]);
      document.title = `${t[1]} - Aether Docs`;
      results.hidden = true;
      try {
        // a guide links to another as (other.md) or (other.md#part): those become #other or #other/part
        const html = self.AetherMarkdown.render(await text(t), { linkBase: '' })
          .replace(/href="(?:docs\/)?([a-z-]+)\.md(?:#([^"]+))?"/gi, (m, f, p) => (byId[f] ? `href="#${f}${p ? '/' + p : ''}"` : m))
          .replace(/href="API\.md(?:#([^"]+))?"/g, (m, p) => `href="#api${p ? '/' + p : ''}"`)
          .replace(/href="#([a-z0-9-]+)"/g, (m, p) => (byId[p] ? m : `href="#${t[0]}/${p}"`));
        doc.innerHTML = html;
      } catch {
        doc.innerHTML = `<p class="notice">This guide could not be loaded. Check the connection and try again.</p>`;
      }
      const heads = [...doc.querySelectorAll('h2, h3')];
      here.innerHTML = heads.map((h) => `<a class="${h.tagName === 'H3' ? 'sub' : ''}" href="#${t[0]}/${h.id}">${esc(h.textContent)}</a>`).join('');
      here.parentElement.hidden = heads.length < 2;
      const i = TOPICS.indexOf(t), prev = TOPICS[i - 1], next = TOPICS[i + 1];
      pager.innerHTML = (prev ? `<a class="prev" href="#${prev[0]}"><small>Previous</small>${esc(prev[1])}</a>` : '<span></span>') + (next ? `<a class="next" href="#${next[0]}"><small>Next</small>${esc(next[1])}</a>` : '');
      const target = part && (document.getElementById(part) || doc.querySelector(`[id^="${CSS.escape(part)}"]`));
      if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
      if (narrow.matches) topics.open = false;
    }

    addEventListener('hashchange', () => show(location.hash));
    show(location.hash);

    // search: every guide is small, so all of them are read the first time you search
    let timer = 0;
    q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(search, 120); });
    q.addEventListener('keydown', (e) => { if (e.key === 'Escape') { q.value = ''; search(); } });
    async function search() {
      const words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.length) { results.hidden = true; doc.hidden = pager.hidden = false; return; }
      const all = await Promise.all(TOPICS.map((t) => text(t).catch(() => '')));
      const hits = [];
      TOPICS.forEach((t, k) => {
        // each part of a guide (from one heading to the next) is one result
        let head = t[1], id = '';
        for (const block of all[k].split(/\n(?=#{1,3} )/)) {
          const m = /^#{1,3} (.+)/.exec(block); if (m) { head = m[1].replace(/[`*]/g, ''); id = self.AetherMarkdown.render('## ' + m[1]).match(/id="([^"]*)"/)[1]; }
          const low = (t[1] + ' ' + block).toLowerCase();
          if (!words.every((w) => low.includes(w))) continue;
          // the words as you read them: links become their text, and table lines and marks go
          const body = block.replace(/^#.*\n/, '').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/^\|?[\s|:-]+\|?$/gm, '').replace(/^>\s?/gm, '').replace(/[`*#|]/g, '').replace(/\s+/g, ' ').trim();
          const at = Math.max(0, body.toLowerCase().indexOf(words[0]) - 50); // the start when only the title matched
          hits.push({ t, head, id, score: words.filter((w) => head.toLowerCase().includes(w)).length * 3 + words.filter((w) => t[1].toLowerCase().includes(w)).length, snip: body && (at ? '…' : '') + body.slice(at, at + 160) + (body.length > at + 160 ? '…' : '') });
        }
      });
      hits.sort((a, b) => b.score - a.score);
      const mark = (s) => esc(s).replace(new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi'), '<mark>$1</mark>');
      results.innerHTML = hits.length
        ? `<p class="muted small">${hits.length} found</p>` + hits.slice(0, 40).map((h) => `<a class="docs-hit" href="#${h.t[0]}${h.id && h.head !== h.t[1] ? '/' + h.id : ''}"><b>${mark(h.head)}</b><span class="muted small">${esc(h.t[1])}</span>${h.snip ? `<p>${mark(h.snip)}</p>` : ''}</a>`).join('')
        : '<p class="empty">Nothing found. Try other words.</p>';
      results.hidden = false; doc.hidden = pager.hidden = true;
    }
    // picking a result goes there and clears the search
    results.addEventListener('click', (e) => { const a = e.target.closest('a'); if (!a) return; q.value = ''; results.hidden = true; doc.hidden = pager.hidden = false; if (a.getAttribute('href') === location.hash) show(location.hash); });
  });
})();
