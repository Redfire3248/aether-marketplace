// Regex Lab: a tab of its own to try a regular expression on some text. The matches are highlighted, each
// match's groups are listed, and you can see what a replace would give.

const MAX = 1000; // matches shown at most
const FLAGS = [['g', 'All matches'], ['i', 'Any case'], ['m', '^ and $ for each line'], ['s', '. matches new lines'], ['u', 'Unicode'], ['y', 'Sticky']];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const cleanFlags = (flags) => [...new Set(String(flags).replace(/[^gimsuy]/g, ''))].join('');

// the regular expression, or the reason it is not one
function compile(pattern, flags, extra = '') {
  try { return { ok: true, re: new RegExp(pattern, cleanFlags(flags) + extra) }; } catch (e) { return { ok: false, error: e.message.replace(/^Invalid regular expression: (\/[\s\S]*\/[a-z]*: )?/, '') }; }
}

// every match: { index, end, text, groups: [{ n, name, value, start, end }] }. Without g, only the first.
function runRegex(pattern, flags, text, max = MAX) {
  if (!pattern) return { ok: true, matches: [], more: false };
  const c = compile(pattern, flags, 'd');
  if (!c.ok) return c;
  const re = c.re, all = re.global, matches = [];
  let m, more = false;
  re.lastIndex = 0;
  while ((m = re.exec(text))) {
    if (matches.length >= max) { more = true; break; }
    const names = {};
    if (m.indices.groups) for (const [name, at] of Object.entries(m.indices.groups)) if (at) names[at.join(',')] = name;
    const groups = [];
    for (let n = 1; n < m.length; n++) {
      const at = m.indices[n];
      const name = at && names[at.join(',')];
      if (name) delete names[at.join(',')];
      groups.push({ n, name: name || '', value: m[n] === undefined ? null : m[n], start: at ? at[0] : -1, end: at ? at[1] : -1 });
    }
    matches.push({ index: m.index, end: m.index + m[0].length, text: m[0], groups });
    if (!all) break;
    // an empty match: step past it, or it would match there for ever
    if (m[0] === '') re.lastIndex = m.index + ((re.unicode && text.codePointAt(m.index) > 0xffff) ? 2 : 1);
  }
  return { ok: true, matches, more };
}

// the text as HTML, with the matches marked (every other one in the second colour)
function highlight(text, matches) {
  let out = '', at = 0;
  matches.forEach((m, i) => {
    out += esc(text.slice(at, m.index));
    out += m.end === m.index ? '<span class="rxl-empty"></span>' : `<mark class="rxl-hit${i % 2 ? ' rxl-alt' : ''}">${esc(text.slice(m.index, m.end))}</mark>`;
    at = m.end;
  });
  return out + esc(text.slice(at));
}

// what text.replace would give (all matches with g, else the first)
function replaced(pattern, flags, text, replacement) {
  const c = compile(pattern, flags);
  return c.ok ? { ok: true, text: text.replace(c.re, replacement) } : c;
}

// ---- the tab
let live = null; // the open tab's controls, while it is open
let pendingText = null;
let saveWait = 0;
const state = () => ({ pattern: aether.settings.get('pattern', '(\\w+)@(?<site>\\w+)\\.com'), flags: aether.settings.get('flags', 'g'), text: aether.settings.get('text', 'Write to sam@example.com or jo@mail.com.\nNot here: nobody@.com'), replace: aether.settings.get('replace', '') });

aether.views.register('lab', {
  title: 'Regex Lab', icon: 'search',
  render(el) {
    const s = state();
    if (pendingText != null) { s.text = pendingText; pendingText = null; }
    el.innerHTML = `<div class="rxl">
      <div class="rxl-field"><span class="rxl-slash">/</span><input class="rxl-pattern" spellcheck="false" placeholder="A regular expression, like (\\w+)@(\\w+)"><span class="rxl-slash">/<span class="rxl-flagtext"></span></span></div>
      <div class="rxl-flags">${FLAGS.map(([f, t]) => `<button class="btn mini rxl-flag" data-flag="${f}" title="${esc(t)}"><b>${f}</b> ${esc(t)}</button>`).join('')}</div>
      <div class="rxl-error" hidden></div>
      <div class="rxl-label">Text to try it on</div>
      <textarea class="rxl-text" spellcheck="false"></textarea>
      <div class="rxl-label"><span class="rxl-count"></span></div>
      <pre class="rxl-out"></pre>
      <div class="rxl-label">Replace with <span class="muted small">($1, $&lt;name&gt;, $&amp; for the match)</span></div>
      <input class="rxl-replace" spellcheck="false" placeholder="Leave empty to skip">
      <pre class="rxl-replaced" hidden></pre>
      <div class="rxl-label">Matches and groups</div>
      <div class="rxl-list"></div>
      <div class="rxl-actions"><button class="btn mini rxl-copy">Copy as /pattern/flags</button></div>
    </div>`;
    const $ = (q) => el.querySelector(q);
    const pattern = $('.rxl-pattern'), text = $('.rxl-text'), repl = $('.rxl-replace');
    let flags = cleanFlags(s.flags), wait = 0;
    pattern.value = s.pattern; text.value = s.text; repl.value = s.replace;

    function draw() {
      $('.rxl-flagtext').textContent = flags;
      for (const b of el.querySelectorAll('.rxl-flag')) b.classList.toggle('rxl-on', flags.includes(b.dataset.flag));
      const r = runRegex(pattern.value, flags, text.value);
      $('.rxl-error').hidden = r.ok;
      $('.rxl-error').textContent = r.ok ? '' : r.error;
      pattern.classList.toggle('rxl-bad', !r.ok);
      const ms = r.ok ? r.matches : [];
      $('.rxl-count').textContent = !pattern.value ? 'Type a pattern above' : !r.ok ? 'Not a valid pattern' : ms.length ? `${ms.length}${r.more ? '+' : ''} match${ms.length === 1 ? '' : 'es'}` : 'No matches';
      $('.rxl-out').innerHTML = highlight(text.value, ms) + '\n';
      $('.rxl-list').innerHTML = ms.length ? ms.map((m, i) => `<div class="rxl-match"><div class="rxl-head"><b>${i + 1}</b> <code>${esc(m.text) || '<span class="muted">(empty)</span>'}</code> <span class="muted small">at ${m.index}–${m.end}</span></div>${m.groups.map((g) => `<div class="rxl-group"><span class="rxl-gname">${g.n}${g.name ? ' ' + esc(g.name) : ''}</span> ${g.value == null ? '<span class="muted">(not matched)</span>' : `<code>${esc(g.value)}</code>`}</div>`).join('')}</div>`).join('') : '<div class="muted small">Nothing yet.</div>';
      const rp = repl.value && r.ok ? replaced(pattern.value, flags, text.value, repl.value) : null;
      $('.rxl-replaced').hidden = !rp;
      if (rp) $('.rxl-replaced').textContent = rp.text;
      clearTimeout(saveWait);
      saveWait = setTimeout(() => { aether.settings.set('pattern', pattern.value); aether.settings.set('flags', flags); aether.settings.set('text', text.value.slice(0, 20000)); aether.settings.set('replace', repl.value); }, 800);
    }
    // wait for a pause in typing, so a slow pattern does not hold up each key
    const soon = () => { clearTimeout(wait); wait = setTimeout(draw, 150); };
    pattern.oninput = soon; text.oninput = soon; repl.oninput = soon;
    for (const b of el.querySelectorAll('.rxl-flag')) b.onclick = () => { const f = b.dataset.flag; flags = cleanFlags(flags.includes(f) ? flags.replace(f, '') : flags + f); draw(); };
    $('.rxl-copy').onclick = async () => {
      const lit = `/${pattern.value.replace(/(^|[^\\])\//g, '$1\\/')}/${flags}`;
      try { await navigator.clipboard.writeText(lit); aether.window.toast(`Copied ${lit}`, 'ok', 1500); } catch { aether.window.toast(lit); }
    };
    live = { el, setText(t) { text.value = t; draw(); } };
    draw();
    pattern.focus();
  }
});

aether.commands.register('open', 'Regex Lab: Open', () => aether.views.open('lab'), { key: 'ctrl+alt+r', category: 'Regex Lab' });
aether.commands.register('trySelection', 'Regex Lab: Try It on the Selection', () => {
  const ed = aether.editor.active(), sel = ed ? ed.selectionText() : '';
  if (!sel) return aether.window.toast('Select some text first');
  if (live && live.el.isConnected) live.setText(sel); else pendingText = sel;
  aether.views.open('lab');
}, { category: 'Regex Lab' });
aether.onDispose(() => { clearTimeout(saveWait); live = null; });
