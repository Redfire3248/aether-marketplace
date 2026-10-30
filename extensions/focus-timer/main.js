// Focus Timer: work in focused blocks with breaks between (the Pomodoro way), from the status bar.
// Click it to start; it counts down there, chimes at the end, and counts your focus blocks for the day.

let timer = null, endsAt = 0, kind = '', pausedLeft = 0;
const today = () => new Date().toDateString();
const mins = (k, d) => Math.max(1, Math.min(180, Number(aether.settings.get(k, d)) || d));
const doneToday = () => { const d = aether.settings.get('done', { day: '', n: 0 }); return d.day === today() ? d.n : 0; };

const item = aether.statusBar.add({ icon: 'clock', text: '', tooltip: 'Focus timer: click to start', onClick: () => menu() });
const idle = () => { const n = doneToday(); item.set(n ? `${n} today` : 'Focus'); item.setTooltip('Focus timer: click to start'); };
idle();

const two = (n) => String(n).padStart(2, '0');
function draw() {
  const left = Math.max(0, pausedLeft || endsAt - Date.now()), s = Math.ceil(left / 1000);
  item.set(`${kind} ${two(Math.floor(s / 60))}:${two(s % 60)}${pausedLeft ? ' (paused)' : ''}`);
  item.setTooltip(pausedLeft ? 'Paused: click to go on or stop' : 'Click to pause or stop');
  if (!pausedLeft && left <= 0) finish();
}
function start(label, minutes) {
  kind = label; pausedLeft = 0; endsAt = Date.now() + minutes * 60000;
  clearInterval(timer); timer = setInterval(draw, 1000); draw();
}
function stop() { clearInterval(timer); timer = null; kind = ''; pausedLeft = 0; idle(); }
function finish() {
  const was = kind; stop(); chime();
  if (was === 'Focus') {
    const n = doneToday() + 1; aether.settings.set('done', { day: today(), n }); idle();
    aether.window.toast(`Focus block done (${n} today). Time for a break.`, 'ok', 6000);
  } else aether.window.toast('Break over. Ready to focus?', 'info', 6000);
}

// a soft two-note chime
function chime() {
  try {
    const ac = new AudioContext(), t = ac.currentTime;
    for (const [f, at] of [[659.25, 0], [880, 0.18]]) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.0001, t + at); g.gain.exponentialRampToValueAtTime(0.25, t + at + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.9);
      o.start(t + at); o.stop(t + at + 1);
    }
    setTimeout(() => ac.close(), 1500);
  } catch { /* no sound here */ }
}

async function menu() {
  const f = mins('focus', 25), b = mins('break', 5), l = mins('long', 15);
  const items = timer || pausedLeft
    ? [{ label: pausedLeft ? 'Go on' : 'Pause', value: 'pause' }, { label: 'Stop', value: 'stop' }, { label: `Start again (${kind})`, value: 'again' }]
    : [{ label: `Focus for ${f} minutes`, value: 'focus' }, { label: `Short break, ${b} minutes`, value: 'break' }, { label: `Long break, ${l} minutes`, value: 'long' }, { label: 'Change the minutes…', value: 'set' }];
  const p = await aether.window.pick(items, 'Focus timer');
  const v = p && (p.value || p);
  if (v === 'focus') start('Focus', f);
  else if (v === 'break') start('Break', b);
  else if (v === 'long') start('Break', l);
  else if (v === 'stop') stop();
  else if (v === 'again') start(kind, kind === 'Focus' ? f : b);
  else if (v === 'pause') { if (pausedLeft) { endsAt = Date.now() + pausedLeft; pausedLeft = 0; timer = setInterval(draw, 1000); } else { pausedLeft = endsAt - Date.now(); clearInterval(timer); timer = null; } draw(); }
  else if (v === 'set') setMinutes();
}
async function setMinutes() {
  const a = await aether.window.ask('Minutes of focus, short break, long break', `${mins('focus', 25)} ${mins('break', 5)} ${mins('long', 15)}`);
  if (a == null) return;
  const [x, y, z] = String(a).split(/[^\d]+/).filter(Boolean).map(Number);
  if (x) aether.settings.set('focus', x); if (y) aether.settings.set('break', y); if (z) aether.settings.set('long', z);
  aether.window.toast(`Focus ${mins('focus', 25)}, break ${mins('break', 5)}, long break ${mins('long', 15)} minutes`, 'ok');
}

aether.commands.register('start', 'Focus Timer: Start Focusing', () => start('Focus', mins('focus', 25)), { category: 'Focus Timer' });
aether.commands.register('break', 'Focus Timer: Take a Break', () => start('Break', mins('break', 5)), { category: 'Focus Timer' });
aether.commands.register('stop', 'Focus Timer: Stop', stop, { category: 'Focus Timer' });
aether.commands.register('menu', 'Focus Timer…', menu, { category: 'Focus Timer' });
aether.onDispose(() => clearInterval(timer));
