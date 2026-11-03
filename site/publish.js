// publish.html: sign in (Google, or an email and password), then share an extension, change one you shared, or
// remove it. Saved in Firestore (see firestore.rules): extensions/<id> holds its card, files/main and files/readme its
// code and page, shots/0..5 its screenshots. Pictures are made smaller here first, so each one fits.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { FIREBASE } from './firebase-config.js';

const app = initializeApp(FIREBASE), auth = getAuth(app), db = getFirestore(app);
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ID = /^[a-z0-9][a-z0-9-]{2,39}$/, CATS = ['Themes', 'Pets', 'Code', 'Web', 'Writing', 'Tools'], NEEDS = '>=1.9.29';
const MAX_CODE = 300000, MAX_README = 100000, MAX_ICON = 60000, MAX_SHOT = 880000;

// a line at the top of the page: what happened, or what went wrong
let msgTimer = 0;
function say(text, kind = 'ok') { const m = $('msg'); m.textContent = text; m.className = 'pub-msg ' + kind; m.hidden = !text; clearTimeout(msgTimer); if (text && kind !== 'error') msgTimer = setTimeout(() => (m.hidden = true), 6000); if (text) m.scrollIntoView({ block: 'nearest' }); }
// Firebase's errors, in plain words
const plain = (e) => {
  const c = String((e && e.code) || '');
  return ({
    'auth/invalid-credential': 'That email and password do not match an account.', 'auth/wrong-password': 'That password is not right.', 'auth/user-not-found': 'There is no account with that email.',
    'auth/email-already-in-use': 'There is already an account with that email: sign in instead.', 'auth/weak-password': 'Use a password of at least 8 letters and numbers.',
    'auth/invalid-email': 'That is not an email address.', 'auth/popup-closed-by-user': '', 'auth/cancelled-popup-request': '', 'auth/popup-blocked': 'The browser blocked the sign-in window. Allow pop-ups for this page and try again.',
    'auth/unauthorized-domain': 'Signing in is not set up for this website yet.', 'auth/too-many-requests': 'Too many tries. Wait a few minutes, then try again.', 'auth/network-request-failed': 'Could not reach the internet.',
    'permission-denied': 'That was not allowed. If the id is taken, pick another one.'
  })[c] ?? (String((e && e.message) || e).replace(/^Firebase: /, '').replace(/\s*\(.*\)\.?$/, '') || 'Something went wrong.');
};

// ---- signing in
let making = false;
const busy = (b, on, label) => { b.disabled = on; if (label) b.textContent = label; };
// someone new with Google picks the name people will see (Google's is filled in)
let naming = false;
$('google').onclick = async () => { try { const r = await signInWithPopup(auth, new GoogleAuthProvider()); if (getAdditionalUserInfo(r)?.isNewUser) askName(); } catch (e) { const t = plain(e); if (t) say(t, 'error'); } };
$('switch').onclick = () => { making = !making; $('name-row').hidden = !making; $('email-go').textContent = making ? 'Make the account' : 'Sign in'; $('switch').textContent = making ? 'I have an account' : 'Make an account instead'; $('su-pass').autocomplete = making ? 'new-password' : 'current-password'; };
$('forgot').onclick = async () => {
  const email = $('su-email').value.trim(); if (!email) { say('Type your email first, then press Forgot the password? again.', 'error'); $('su-email').focus(); return; }
  try { await sendPasswordResetEmail(auth, email); say('We sent a link to ' + email + ' to make a new password.'); } catch (e) { say(plain(e), 'error'); }
};
$('email-form').onsubmit = async (ev) => {
  ev.preventDefault();
  const email = $('su-email').value.trim(), pass = $('su-pass').value, name = $('su-name').value.trim(), go = $('email-go');
  if (!email || !pass) { say('Type your email and a password.', 'error'); return; }
  if (making && !name) { say('Type the name people will see on your extensions.', 'error'); $('su-name').focus(); return; }
  if (making && pass.length < 8) { say('Use a password of at least 8 letters and numbers.', 'error'); return; }
  busy(go, true);
  try {
    if (making) { const { user } = await createUserWithEmailAndPassword(auth, email, pass); await updateProfile(user, { displayName: name }); await sendEmailVerification(user); show(user); }
    else await signInWithEmailAndPassword(auth, email, pass);
  } catch (e) { say(plain(e), 'error'); }
  busy(go, false);
};
for (const b of document.querySelectorAll('[data-out]')) b.onclick = () => signOut(auth);
$('resend').onclick = async () => { try { await sendEmailVerification(auth.currentUser); say('Sent again. Look in spam too.'); } catch (e) { say(plain(e), 'error'); } };
$('verified').onclick = async () => { await auth.currentUser.reload(); await auth.currentUser.getIdToken(true); if (auth.currentUser.emailVerified) show(auth.currentUser); else say('Not checked yet: open the link in the email first.', 'error'); };

function askName() { naming = true; show(auth.currentUser); $('nm-name').value = (auth.currentUser && auth.currentUser.displayName) || ''; $('nm-name').focus(); $('nm-name').select(); }
$('rename').onclick = askName;
$('nm-skip').onclick = () => { naming = false; show(auth.currentUser); };
$('name-form').onsubmit = async (ev) => {
  ev.preventDefault();
  const name = $('nm-name').value.trim().slice(0, 40);
  if (!name) { say('Type the name people will see.', 'error'); $('nm-name').focus(); return; }
  busy($('nm-save'), true);
  try { await updateProfile(auth.currentUser, { displayName: name }); naming = false; show(auth.currentUser); say('Your name is ' + name + ' now. Your shared extensions keep the name in their Shown as by, until you change them.'); } catch (e) { say(plain(e), 'error'); }
  busy($('nm-save'), false);
};

function show(user) {
  if (!user) naming = false;
  const ready = !!user && user.emailVerified;
  $('signin').hidden = !!user; $('verify').hidden = !user || user.emailVerified; $('naming').hidden = !ready || !naming; $('studio').hidden = !ready || naming;
  if (!user || naming) return;
  if (!user.emailVerified) { $('verify-email').textContent = user.email; return; }
  $('who').textContent = user.displayName || user.email;
  loadMine();
}
onAuthStateChanged(auth, show);

// ---- your extensions
let official = null;
const officialIds = async () => official || (official = fetch('index.json', { cache: 'no-cache' }).then((r) => r.json()).then((j) => new Set((j.extensions || []).map((x) => x.id))).catch(() => new Set()));
let mine = [];
async function loadMine() {
  const box = $('mine');
  try {
    const snap = await getDocs(query(collection(db, 'extensions'), where('ownerUid', '==', auth.currentUser.uid)));
    mine = snap.docs.map((d) => d.data()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) { box.innerHTML = `<p class="notice">${esc(plain(e))}</p>`; return; }
  box.innerHTML = mine.length ? mine.map((x) => `
    <div class="card mine-card">
      <span class="badge${x.icon ? ' pic' : ''}">${x.icon ? `<img src="${esc(x.icon)}" alt="" width="48" height="48">` : self.AetherSite.icon('puzzle')}</span>
      <div><b>${esc(x.name)}</b><span class="muted small">v${esc(x.version)} · ${esc(x.category)}</span></div>
      <div class="row"><a class="btn" href="extension.html?id=${encodeURIComponent(x.id)}&amp;shared=1">See its page</a><button class="btn" type="button" data-edit="${esc(x.id)}">Change</button><button class="btn danger" type="button" data-del="${esc(x.id)}">Remove</button></div>
    </div>`).join('') : '<p class="muted">You have not shared any yet.</p>';
  box.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => edit(mine.find((x) => x.id === b.dataset.edit))));
  box.querySelectorAll('[data-del]').forEach((b) => (b.onclick = () => remove(mine.find((x) => x.id === b.dataset.del))));
}

// a question in the page's own box: resolves true for Remove
function ask(text) {
  return new Promise((done) => {
    const back = $('ask'); $('ask-text').textContent = text; back.hidden = false; $('ask-no').focus();
    const end = (v) => { back.hidden = true; removeEventListener('keydown', key); done(v); };
    const key = (e) => { if (e.key === 'Escape') end(false); };
    addEventListener('keydown', key);
    $('ask-yes').onclick = () => end(true); $('ask-no').onclick = () => end(false); back.onclick = (e) => { if (e.target === back) end(false); };
  });
}
async function remove(x) {
  if (!(await ask(`Remove "${x.name}" from the Marketplace? People who installed it keep it, but nobody new can.`))) return;
  try {
    for (let i = 0; i < 6; i++) await deleteDoc(doc(db, 'extensions', x.id, 'shots', String(i)));
    for (const f of ['main', 'readme']) await deleteDoc(doc(db, 'extensions', x.id, 'files', f));
    await deleteDoc(doc(db, 'extensions', x.id));
    say(`Removed ${x.name}.`); loadMine();
  } catch (e) { say(plain(e), 'error'); }
}

// ---- the form
const F = { editing: null, code: '', codeName: '', icon: '', shots: [] };
const form = $('form');
function openForm(title) { form.hidden = false; $('form-title').textContent = title; form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function resetForm() {
  Object.assign(F, { editing: null, code: '', codeName: '', icon: '', shots: [] });
  for (const k of ['f-name', 'f-id', 'f-desc', 'f-tags', 'f-readme']) $(k).value = '';
  $('f-ver').value = '1.0.0'; $('f-cat').value = 'Tools'; $('f-by').value = (auth.currentUser && auth.currentUser.displayName) || '';
  $('f-id').disabled = false; drawIcon(); drawShots(); drawCode(); tab('write');
}
$('new').onclick = () => { resetForm(); openForm('Share a new extension'); $('f-name').focus(); };
$('cancel').onclick = () => { form.hidden = true; };
// the id follows the name until you change it yourself
let idTouched = false;
$('f-id').oninput = () => { idTouched = true; };
$('f-name').oninput = () => { if (!F.editing && !idTouched) $('f-id').value = $('f-name').value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40); };

async function edit(x) {
  resetForm(); F.editing = x; idTouched = true;
  $('f-name').value = x.name; $('f-id').value = x.id; $('f-id').disabled = true; $('f-desc').value = x.description; $('f-cat').value = x.category;
  $('f-ver').value = x.version; $('f-by').value = x.author; $('f-tags').value = (x.tags || []).join(', '); F.icon = x.icon || '';
  openForm('Change ' + x.name);
  try {
    const [m, r] = await Promise.all(['main', 'readme'].map((f) => getDoc(doc(db, 'extensions', x.id, 'files', f))));
    F.code = (m.exists() && m.data().text) || ''; F.codeName = 'main.js (shared now)'; $('f-readme').value = (r.exists() && r.data().text) || '';
    F.shots = (await Promise.all(Array.from({ length: x.shots || 0 }, (_, i) => getDoc(doc(db, 'extensions', x.id, 'shots', String(i)))))).map((s) => (s.exists() ? s.data().data : '')).filter(Boolean);
  } catch (e) { say(plain(e), 'error'); }
  drawIcon(); drawShots(); drawCode();
}

// pictures: drawn smaller on a canvas, as WebP, until they fit
const readAs = (file, how) => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => no(r.error); r[how](file); });
const loadImg = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('That picture could not be opened.')); i.src = src; });
async function shrink(file, w, h, max, square) {
  const img = await loadImg(await readAs(file, 'readAsDataURL'));
  for (let scale = 1, q = 0.86; scale > 0.2; scale *= 0.85, q = Math.max(0.6, q - 0.06)) {
    let cw, ch, sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (square) { const s = Math.min(img.width, img.height); sx = (img.width - s) / 2; sy = (img.height - s) / 2; sw = sh = s; cw = ch = Math.round(w * scale); }
    else { const k = Math.min(1, (w * scale) / img.width, (h * scale) / img.height); cw = Math.round(img.width * k); ch = Math.round(img.height * k); }
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    let url = c.toDataURL('image/webp', q);
    if (!url.startsWith('data:image/webp')) url = c.toDataURL('image/jpeg', q); // a browser with no WebP
    if (url.length <= max) return url;
  }
  throw new Error('That picture is too big even when made smaller.');
}
function drawIcon() { $('icon-view').innerHTML = F.icon ? `<img src="${esc(F.icon)}" alt="Its icon" width="64" height="64">` : self.AetherSite.icon('puzzle'); $('icon-clear').hidden = !F.icon; }
function drawShots() {
  $('shots-view').innerHTML = F.shots.map((s, i) => `<figure class="shot-item"><img src="${esc(s)}" alt="Screenshot ${i + 1}"><button type="button" class="shot-x" data-x="${i}" aria-label="Take out screenshot ${i + 1}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></figure>`).join('') || '<p class="muted small">No screenshots yet.</p>';
  $('shots-view').querySelectorAll('[data-x]').forEach((b) => (b.onclick = () => { F.shots.splice(+b.dataset.x, 1); drawShots(); }));
  $('shots-btn').disabled = F.shots.length >= 6;
}
function drawCode() { $('code-name').textContent = F.code ? `${F.codeName} · ${Math.ceil(F.code.length / 1024)} KB` : 'No file yet'; }
$('icon-btn').onclick = () => $('icon').click();
$('icon-clear').onclick = () => { F.icon = ''; drawIcon(); };
$('icon').onchange = async () => { const f = $('icon').files[0]; $('icon').value = ''; if (!f) return; try { F.icon = await shrink(f, 128, 128, MAX_ICON, true); drawIcon(); } catch (e) { say(e.message, 'error'); } };
$('shots-btn').onclick = () => $('shots').click();
$('shots').onchange = async () => { await addShots([...$('shots').files]); $('shots').value = ''; };
async function addShots(files) { for (const f of files.slice(0, 6 - F.shots.length)) { try { F.shots.push(await shrink(f, 1600, 1000, MAX_SHOT)); } catch (e) { say(e.message, 'error'); } } drawShots(); }
$('code-btn').onclick = () => $('code').click();
$('code').onchange = async () => { const f = $('code').files[0]; $('code').value = ''; if (f) await takeCode(f); };
async function takeCode(f) { const text = await readAs(f, 'readAsText'); if (text.length > MAX_CODE) { say('main.js is too big: it can be up to 300 KB.', 'error'); return; } F.code = text; F.codeName = f.name; drawCode(); }

// a whole folder: extension.json, main.js, README.md, icon.png and screenshots/
$('folder-btn').onclick = () => $('folder').click();
$('folder').onchange = async () => {
  const files = [...$('folder').files]; $('folder').value = '';
  const at = (name) => files.find((f) => f.webkitRelativePath.split('/').slice(1).join('/').toLowerCase() === name);
  try {
    const man = at('extension.json') ? JSON.parse(await readAs(at('extension.json'), 'readAsText')) : {};
    if (man.name) $('f-name').value = String(man.name).slice(0, 40);
    if (man.id && !F.editing) { $('f-id').value = String(man.id).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40); idTouched = true; }
    if (man.description) $('f-desc').value = String(man.description).slice(0, 200);
    if (man.version) $('f-ver').value = String(man.version);
    if (CATS.includes(man.category)) $('f-cat').value = man.category;
    if (Array.isArray(man.tags)) $('f-tags').value = man.tags.join(', ');
    const main = at(String(man.main || 'main.js').toLowerCase()); if (main) await takeCode(main);
    const readme = at('readme.md'); if (readme) $('f-readme').value = (await readAs(readme, 'readAsText')).slice(0, MAX_README);
    const ic = at('icon.png') || at('icon.jpg') || at('icon.webp'); if (ic) { F.icon = await shrink(ic, 128, 128, MAX_ICON, true); drawIcon(); }
    const shots = files.filter((f) => /^[^/]+\/screenshots\/[^/]+\.(png|jpe?g|webp)$/i.test(f.webkitRelativePath)).sort((a, b) => a.name.localeCompare(b.name));
    if (shots.length) { F.shots = []; await addShots(shots); }
    say(`Filled in from ${files[0] ? files[0].webkitRelativePath.split('/')[0] : 'the folder'}. Check it, then press Share it.`);
  } catch (e) { say('That folder could not be read: ' + e.message, 'error'); }
};

// the page: write it, or see how it will look
function tab(which) {
  document.querySelectorAll('.md-tabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === which));
  $('f-readme').hidden = which !== 'write'; $('readme-look').hidden = which !== 'look';
  if (which === 'look') $('readme-look').innerHTML = $('f-readme').value.trim() ? self.AetherMarkdown.render($('f-readme').value, { linkBase: '', imageBase: '' }) : '<p class="muted">Nothing written yet.</p>';
}
document.querySelectorAll('.md-tabs [data-tab]').forEach((b) => (b.onclick = () => tab(b.dataset.tab)));

// ---- sharing it
form.onsubmit = async (ev) => {
  ev.preventDefault();
  const v = (k) => $(k).value.trim();
  const x = { id: v('f-id'), name: v('f-name'), description: v('f-desc'), category: $('f-cat').value, version: v('f-ver'), author: v('f-by'), tags: v('f-tags').split(',').map((t) => t.trim().toLowerCase().slice(0, 20)).filter(Boolean).slice(0, 8) };
  const wrong = !x.name ? ['f-name', 'Give it a name.'] : !ID.test(x.id) ? ['f-id', 'The id is 3 to 40 small letters, numbers and dashes, starting with a letter or number.'] : !x.description ? ['f-desc', 'Say in one line what it does.']
    : !/^\d+\.\d+\.\d+$/.test(x.version) ? ['f-ver', 'The version is like 1.0.0.'] : !x.author ? ['f-by', 'Say who made it.'] : !F.code ? ['code-btn', 'Pick its main.js.'] : null;
  if (wrong) { say(wrong[1], 'error'); $(wrong[0]).focus(); return; }
  try { new Function(F.code); } catch (e) { say('main.js has a mistake: ' + e.message, 'error'); return; }
  if (/\beval\s*\(|new Function\s*\(|require\s*\(\s*['"]child_process/.test(F.code)) { say('main.js may not use eval, new Function or child_process: use aether.shell.exec to run programs.', 'error'); return; }
  if (!F.editing && (await officialIds()).has(x.id)) { say('There is already an extension with that id in the Marketplace. Pick another id.', 'error'); $('f-id').focus(); return; }
  if (F.editing && x.version === F.editing.version) { if (!(await ask(`The version is still ${x.version}, so Aether will not offer it as an update. Share it anyway?`).then((y) => y))) return; }
  const readme = $('f-readme').value.slice(0, MAX_README), save = $('save');
  busy(save, true, 'Sharing...');
  try {
    const ref = doc(db, 'extensions', x.id), size = F.code.length + readme.length + F.icon.length + F.shots.reduce((s, p) => s + p.length, 0);
    const card = { ...x, ownerUid: auth.currentUser.uid, icon: F.icon, shots: F.shots.length, aether: NEEDS, size, updatedAt: serverTimestamp() };
    if (F.editing) await setDoc(ref, card, { merge: true });
    else {
      if ((await getDoc(ref)).exists()) throw Object.assign(new Error('Someone already shared an extension with that id. Pick another id.'), { code: 'taken' });
      await setDoc(ref, { ...card, createdAt: serverTimestamp() });
    }
    await setDoc(doc(db, 'extensions', x.id, 'files', 'main'), { text: F.code });
    await setDoc(doc(db, 'extensions', x.id, 'files', 'readme'), { text: readme });
    for (let i = 0; i < 6; i++) {
      const s = doc(db, 'extensions', x.id, 'shots', String(i));
      if (F.shots[i]) await setDoc(s, { data: F.shots[i] }); else if (F.editing && i < (F.editing.shots || 0)) await deleteDoc(s);
    }
    form.hidden = true;
    say(`${F.editing ? 'Changed' : 'Shared'} ${x.name}. It is in the Marketplace now.`);
    loadMine();
  } catch (e) { say(e.code === 'taken' ? e.message : plain(e), 'error'); }
  busy(save, false, 'Share it');
};
