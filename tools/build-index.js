// Builds index.json from the extensions/ folders and checks each one. Run: node tools/build-index.js
// (the check alone: node tools/build-index.js --check, which CI runs on every pull request)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXT = path.join(ROOT, 'extensions');
const FILE_OK = /^(?!.*\.\.)[\w-]+(\.[\w-]+)*(\/[\w-]+(\.[\w-]+)*)*\.(js|json|md|css|png|svg|txt|wav|mp3|ogg)$/i;
const ID_OK = /^[a-z0-9][a-z0-9-]{1,40}$/;
const problems = [];
const out = [];

const filesOf = (dir, base = '') => fs.readdirSync(path.join(dir, base), { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? filesOf(dir, path.posix.join(base, d.name)) : [path.posix.join(base, d.name)]));

for (const id of fs.readdirSync(EXT).sort()) {
  const dir = path.join(EXT, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  const bad = (m) => problems.push(`${id}: ${m}`);
  if (!ID_OK.test(id)) bad('the folder name must be lower-case letters, numbers and dashes');
  let man;
  try { man = JSON.parse(fs.readFileSync(path.join(dir, 'extension.json'), 'utf8')); } catch (e) { bad('extension.json is missing or not JSON: ' + e.message); continue; }
  if (man.id !== id) bad(`extension.json "id" must be "${id}"`);
  for (const k of ['name', 'version', 'description', 'author']) if (!man[k] || typeof man[k] !== 'string') bad(`extension.json needs "${k}"`);
  if (man.version && !/^\d+\.\d+\.\d+$/.test(man.version)) bad('"version" is like 1.0.0');
  const files = filesOf(dir).sort();
  for (const f of files) if (!FILE_OK.test(f)) bad(`${f}: only .js .json .md .css .png .svg .txt .wav .mp3 .ogg files`);
  if (!files.includes(man.main || 'main.js')) bad(`its main file (${man.main || 'main.js'}) is missing`);
  if (!files.includes('README.md')) bad('README.md is missing');
  if (files.length > 40) bad('more than 40 files');
  const size = files.reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
  if (size > 5 * 1024 * 1024) bad('bigger than 5 MB');
  for (const f of files.filter((x) => x.endsWith('.js'))) {
    const code = fs.readFileSync(path.join(dir, f), 'utf8');
    try { new Function(code); } catch (e) { bad(`${f}: ${e.message}`); }
    if (/\beval\s*\(|new Function\s*\(|require\s*\(\s*['"]child_process/.test(code)) bad(`${f}: eval, new Function and child_process are not allowed (use aether.shell.exec)`);
  }
  out.push({ id, name: man.name, version: man.version, author: man.author, description: man.description, icon: man.icon || 'puzzle', tags: man.tags || [], aether: man.aether || '', files, size });
}

if (problems.length) { console.error('Problems:\n- ' + problems.join('\n- ')); process.exit(1); }
const index = JSON.stringify({ version: 1, extensions: out }, null, 2) + '\n';
const file = path.join(ROOT, 'index.json');
if (process.argv.includes('--check')) {
  const now = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (now !== index) { console.error('index.json is out of date: run node tools/build-index.js and commit it'); process.exit(1); }
  console.log(`All ${out.length} extensions are fine.`);
} else { fs.writeFileSync(file, index); console.log(`index.json: ${out.length} extensions`); }
