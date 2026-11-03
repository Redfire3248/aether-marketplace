// A small Markdown renderer for the extension pages: headings, paragraphs, lists (nested too), code blocks,
// quotes, tables, rules, links, images, **bold**, *italic*, ~~struck~~ and `code`. HTML in the Markdown is shown
// as text, and links only go to http(s), mailto, # or relative places.
(function (root) {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

  // a link or image address that is safe, made absolute against `base` when it is relative
  function safeUrl(url, base) {
    const u = url.trim();
    if (/^(https?:|mailto:)/i.test(u) || u.startsWith('#')) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith('//')) return null; // javascript:, data: and the like
    return (base || '') + u.replace(/^\.\//, '');
  }

  // ---- colours for code blocks: notes, words in quotes, numbers, keywords and the names of functions
  const WORDS = {
    aes: 'func class return if elif else for in while break continue import from as const let var true false none null and or not try except finally raise throw match case new self super this pass async await with yield is extends lambda',
    js: 'function class return if else for of in while do break continue import export from as const let var true false null undefined new this super try catch finally throw switch case default typeof instanceof async await yield delete void extends static get set',
    py: 'def class return if elif else for in while break continue import from as True False None and or not try except finally raise with yield lambda pass global nonlocal is async await self',
    c: 'void int long short char float double bool unsigned signed const static struct enum class public private protected return if else for while do break continue switch case default new delete true false nullptr NULL include define using namespace auto byte boolean String setup loop HIGH LOW OUTPUT INPUT',
    sh: 'if then else elif fi for in do done while case esac function return export local echo cd set'
  };
  const LANG = { aes: 'aes', aether: 'aes', aetherscript: 'aes', js: 'js', javascript: 'js', ts: 'js', typescript: 'js', mjs: 'js', json: 'json', py: 'py', python: 'py', c: 'c', cpp: 'c', 'c++': 'c', ino: 'c', arduino: 'c', java: 'c', cs: 'c', sh: 'sh', bash: 'sh', shell: 'sh', powershell: 'sh', ps1: 'sh', bat: 'sh', cmd: 'sh' };
  const sets = {};
  function colour(code, lang) {
    const L = LANG[String(lang || '').toLowerCase()];
    if (!L) return esc(code);
    const keys = sets[L] || (sets[L] = new Set((WORDS[L] || '').split(' ')));
    const note = (L === 'aes' || L === 'py' || L === 'sh' ? /#[^\n]*/ : L === 'json' ? /(?!)/ : /\/\/[^\n]*|\/\*[\s\S]*?\*\//).source;
    const str = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/.source + (L === 'js' ? '|' + /`(?:\\.|[^`\\])*`/.source : '');
    const num = /\b(?:0x[\da-f]+|\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?)\b/.source;
    const re = new RegExp(`(${note})|(${str})|(${num})|([A-Za-z_$][\\w$]*)|([\\s\\S])`, 'gi');
    let out = '', m;
    while ((m = re.exec(code))) {
      const [all, c, s, n, w] = m, rest = code.slice(re.lastIndex);
      if (c) out += `<span class="c">${esc(c)}</span>`;
      else if (s) out += `<span class="${L === 'json' && /^\s*:/.test(rest) ? 'f' : 's'}">${esc(s)}</span>`;
      else if (n) out += `<span class="n">${esc(n)}</span>`;
      else if (w) out += keys.has(w) ? `<span class="k">${esc(w)}</span>` : /^\s*\(/.test(rest) ? `<span class="f">${esc(w)}</span>` : /^[A-Z][a-z]/.test(w) && L !== 'sh' ? `<span class="t">${esc(w)}</span>` : esc(w);
      else out += esc(all);
    }
    return out;
  }
  root.AetherMarkdownColour = colour;

  // ---- inside a line
  function inline(text, opts) {
    const keep = [];
    const hold = (html) => `\u0000${keep.push(html) - 1}\u0000`;
    let s = text
      .replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (m, t, code) => hold(`<code>${esc(code.replace(/^ (.*) $/, '$1'))}</code>`))
      .replace(/\\([\\`*_{}[\]()#+\-.!|<>~])/g, (m, c) => hold(esc(c)));
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^()\s]+)(?:\s+&quot;(.*?)&quot;)?\)/g, (m, alt, url, title) => {
      const u = safeUrl(url.replace(/&amp;/g, '&'), opts.imageBase);
      return u == null ? alt : hold(`<img src="${esc(u)}" alt="${alt}"${title ? ` title="${title}"` : ''} loading="lazy">`);
    });
    s = s.replace(/\[([^\]]+)\]\(([^()\s]+)(?:\s+&quot;(.*?)&quot;)?\)/g, (m, label, url, title) => {
      const u = safeUrl(url.replace(/&amp;/g, '&'), opts.linkBase);
      if (u == null) return label;
      const outside = /^https?:/i.test(u);
      return hold(`<a href="${esc(u)}"${title ? ` title="${title}"` : ''}${outside ? ' rel="noopener"' : ''}>`) + label + hold('</a>');
    });
    s = s.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, (m, url) => hold(`<a href="${url}" rel="noopener">${url}</a>`));
    s = s
      .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^\w])__(?=\S)([\s\S]*?\S)__(?!\w)/g, '$1<strong>$2</strong>')
      .replace(/\*(?=\S)([\s\S]*?\S)\*/g, '<em>$1</em>')
      .replace(/(^|[^\w])_(?=\S)([\s\S]*?\S)_(?!\w)/g, '$1<em>$2</em>')
      .replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<del>$1</del>')
      .replace(/( {2,}|\\)\n/g, '<br>\n');
    return s.replace(/\u0000(\d+)\u0000/g, (m, n) => keep[n]).replace(/\u0000(\d+)\u0000/g, (m, n) => keep[n]);
  }

  // ---- tables
  function cells(line) {
    const out = [];
    let cell = '', code = false;
    const s = line.trim();
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '\\' && s[i + 1] === '|') { cell += '\\|'; i++; continue; }
      if (c === '`') code = !code;
      if (c === '|' && !code) { out.push(cell); cell = ''; continue; }
      cell += c;
    }
    out.push(cell);
    if (s.startsWith('|')) out.shift();
    if (s.endsWith('|') && !s.endsWith('\\|')) out.pop();
    return out.map((x) => x.trim());
  }
  const SEP = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

  // ---- blocks
  const FENCE = /^ {0,3}(`{3,}|~{3,})\s*([\w+#.-]*)/;
  const HEADING = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
  const RULE = /^ {0,3}([-*_])( *\1){2,} *$/;
  const ITEM = /^( *)([-*+]|\d{1,9}[.)])( +|$)/;
  const QUOTE = /^ {0,3}> ?/;
  const startsBlock = (l, next) => FENCE.test(l) || HEADING.test(l) || RULE.test(l) || QUOTE.test(l) || ITEM.test(l) || (l.includes('|') && next != null && SEP.test(next) && next.includes('-'));

  function blocks(lines, opts) {
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      let m;
      if ((m = l.match(FENCE))) {
        const close = new RegExp(`^ {0,3}${m[1][0] === '`' ? '`' : '~'}{${m[1].length},}\\s*$`), body = [];
        for (i++; i < lines.length && !close.test(lines[i]); i++) body.push(lines[i]);
        i++;
        out.push(`<pre><code${m[2] ? ` class="language-${esc(m[2])}"` : ''}>${colour(body.join('\n'), m[2])}</code></pre>`);
      } else if (/^( {4}|\t)/.test(l)) {
        const body = [];
        while (i < lines.length && (/^( {4}|\t)/.test(lines[i]) || !lines[i].trim())) body.push(lines[i++].replace(/^( {4}|\t)/, ''));
        while (body.length && !body[body.length - 1].trim()) body.pop();
        out.push(`<pre><code>${esc(body.join('\n'))}</code></pre>`);
      } else if ((m = l.match(HEADING))) {
        const n = m[1].length, html = inline(m[2], opts);
        out.push(`<h${n} id="${slug(html)}">${html}</h${n}>`);
        i++;
      } else if (RULE.test(l)) {
        out.push('<hr>'); i++;
      } else if (QUOTE.test(l)) {
        const body = [];
        while (i < lines.length && lines[i].trim() && (QUOTE.test(lines[i]) || !startsBlock(lines[i], lines[i + 1]))) body.push(lines[i++].replace(QUOTE, ''));
        out.push(`<blockquote>${blocks(body, opts)}</blockquote>`);
      } else if (l.includes('|') && i + 1 < lines.length && SEP.test(lines[i + 1]) && lines[i + 1].includes('-')) {
        const head = cells(l), aligns = cells(lines[i + 1]).map((c) => (c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : c.startsWith(':') ? 'left' : ''));
        const td = (tag, c, k) => `<${tag}${aligns[k] ? ` style="text-align:${aligns[k]}"` : ''}>${inline(c, opts)}</${tag}>`;
        const rows = [];
        for (i += 2; i < lines.length && lines[i].trim() && lines[i].includes('|'); i++) rows.push(cells(lines[i]));
        out.push(`<div class="table"><table><thead><tr>${head.map((c, k) => td('th', c, k)).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${head.map((x, k) => td('td', r[k] || '', k)).join('')}</tr>`).join('')}</tbody></table></div>`);
      } else if ((m = l.match(ITEM))) {
        i = list(lines, i, out, opts);
      } else {
        const body = [l];
        for (i++; i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i + 1]); i++) body.push(lines[i]);
        out.push(`<p>${inline(body.map((x) => x.replace(/^ +/, '')).join('\n'), opts)}</p>`);
      }
    }
    return out.join('\n');
  }

  // a list starting at line i; returns the line after it
  function list(lines, i, out, opts) {
    const first = lines[i].match(ITEM), indent = first[1].length, ordered = /\d/.test(first[2]);
    const items = [];
    let loose = false, cur = null;
    while (i < lines.length) {
      const l = lines[i], m = l.match(ITEM);
      if (m && m[1].length === indent && /\d/.test(m[2]) === ordered) {
        cur = { lines: [l.slice(m[0].length)], pad: m[0].length || indent + 2 };
        items.push(cur); i++; continue;
      }
      if (!l.trim()) {
        let j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        const next = lines[j];
        if (next == null) break;
        const nm = next.match(ITEM), nIndent = next.match(/^ */)[0].length;
        if (nIndent >= cur.pad || (nm && nm[1].length === indent && /\d/.test(nm[2]) === ordered)) { loose = loose || !(nIndent >= cur.pad && nm); cur.lines.push(''); i++; continue; }
        break;
      }
      const lead = l.match(/^ */)[0].length;
      if (lead >= cur.pad || (lead > indent && m)) { cur.lines.push(l.slice(Math.min(lead, cur.pad))); i++; continue; }
      if (lead <= indent && (m || startsBlock(l, lines[i + 1]))) break;
      cur.lines.push(l.trim()); i++; // a line that carries on the item
    }
    const start = ordered && parseInt(first[2], 10) !== 1 ? ` start="${parseInt(first[2], 10)}"` : '';
    out.push(`<${ordered ? 'ol' : 'ul'}${start}>${items.map((it) => {
      const html = blocks(it.lines, opts);
      return `<li>${loose ? html : html.replace(/^<p>([\s\S]*?)<\/p>/, '$1')}</li>`;
    }).join('')}</${ordered ? 'ol' : 'ul'}>`);
    return i;
  }

  function render(markdown, opts = {}) {
    return blocks(String(markdown).replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n'), opts);
  }

  const api = { render, inline: (s, o = {}) => inline(s, o), safeUrl, esc };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AetherMarkdown = api;
})(typeof self !== 'undefined' ? self : this);
