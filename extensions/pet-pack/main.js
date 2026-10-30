// Pet Pack: three more pets (a frog, a penguin and a bunny), each with skins. They visit like the others,
// and show in Settings > Pets, where you can call them, peek them in and pick their skins.

aether.pets.add({
  id: 'frog', name: 'Frog', speed: 30,
  says: ['Ribbit.', 'Croak?', 'Is that a fly?', 'Hop hop.'],
  skins: [['green', 'Green', '#4cc95a', '#b8f0a0', '#2c8a3a'], ['blue', 'Poison blue', '#3a8cff', '#bfe0ff', '#1d4fb0'], ['gold', 'Golden', '#e8b923', '#fff0a8', '#9a7408']],
  draw(g, pose, f) {
    const hop = pose === 'walk' ? Math.round(Math.abs(Math.sin(f.phase * Math.PI * 2)) * 4) : pose === 'happy' ? 2 : 0;
    const y = f.floor - 7 - hop, sleep = pose === 'sleep';
    f.disc(10, y + 5, 4, 2, '#2c8a3a');                     // back leg
    f.disc(20, y + 2, 10, sleep ? 4 : 5, '#4cc95a');         // body
    f.px(14, y + 4, 14, 3, '#b8f0a0');                       // belly
    f.px(26, y + 6, 4, 2, '#2c8a3a'); f.px(13, y + 6, 3, 2, '#2c8a3a'); // feet
    f.disc(24, y - 3, 3, 3, '#4cc95a'); f.disc(30, y - 3, 3, 3, '#4cc95a'); // eye bumps
    const shut = f.blink || sleep, ex = f.look;
    if (f.ko) { f.px(23, y - 4, 2, 2, f.outline); f.px(29, y - 4, 2, 2, f.outline); }
    else if (shut) { f.px(23 + ex, y - 3, 3, 1, f.outline); f.px(29 + ex, y - 3, 3, 1, f.outline); }
    else { f.px(24 + ex, y - 4, 2, 2, f.outline); f.px(30 + ex, y - 4, 2, 2, f.outline); }
    f.px(27, y + 1, 5, 1, '#2c8a3a');                        // smile
    if (pose === 'happy' || f.happy) f.px(26, y + 2, 3, 1, '#ff8fa3');
  }
});

aether.pets.add({
  id: 'penguin', name: 'Penguin', speed: 22,
  says: ['Waddle waddle.', 'Brr!', 'Fish?', 'Slide time.'],
  skins: [['classic', 'Classic', '#2b2f3a', '#f4f6fb', '#171a21'], ['emperor', 'Emperor', '#3b4250', '#fff3cc', '#22262e'], ['pink', 'Pink', '#c94b84', '#ffe1ef', '#7d2a51']],
  draw(g, pose, f) {
    const sway = pose === 'walk' ? Math.round(Math.sin(f.phase * Math.PI * 2)) : 0;
    const sleep = pose === 'sleep', squat = sleep ? 2 : 0, y = f.floor;
    const cx = 20 + sway;
    f.disc(cx, y - 10 + squat, 7, 10 - squat, '#2b2f3a');    // body and head
    f.disc(cx + 2, y - 8 + squat, 4, 7 - squat, '#f4f6fb');  // white front
    f.disc(cx - 6, y - 9 + squat + (pose === 'happy' ? -2 : 0), 2, 5, '#171a21'); // flipper
    f.px(cx + 6, y - 14 + squat, 4, 2, '#ff9f1c');           // beak
    const step = pose === 'walk' && f.phase > 0.5 ? 1 : 0;
    f.px(cx - 4 + step, y - 1, 4, 1, '#ff9f1c'); f.px(cx + 1 - step, y - 1, 4, 1, '#ff9f1c'); // feet
    const ex = cx + 3 + f.look;
    if (f.ko) { f.px(ex, y - 16 + squat, 2, 2, f.outline); }
    else if (f.blink || sleep) f.px(ex, y - 15 + squat, 2, 1, f.outline);
    else { f.px(ex, y - 16 + squat, 2, 2, '#ffffff'); f.px(ex + 1, y - 15 + squat, 1, 1, f.outline); }
    if (pose === 'happy' || f.happy) f.px(cx + 3, y - 12 + squat, 2, 1, '#ff8fa3');
  }
});

aether.pets.add({
  id: 'bunny', name: 'Bunny', speed: 40,
  says: ['*nose wiggle*', 'Carrot?', 'Boing!', 'Soft paws.'],
  skins: [['snow', 'Snow', '#ece6dc', '#ffffff', '#b8ad9d'], ['brown', 'Brown', '#a8774f', '#e9cfb4', '#6e4a2c'], ['grey', 'Grey', '#9aa0aa', '#e3e6ea', '#5f6570']],
  draw(g, pose, f) {
    const hop = pose === 'walk' ? Math.round(Math.abs(Math.sin(f.phase * Math.PI * 2)) * 5) : pose === 'happy' ? 3 : 0;
    const sleep = pose === 'sleep', y = f.floor - hop;
    f.disc(9, y - 7, 3, 3, '#ffffff');                       // tail
    f.disc(17, y - 6, 8, 6, '#ece6dc');                      // body
    f.disc(14, y - 2, 4, 2, '#b8ad9d');                      // back foot
    f.px(22, y - 2, 4, 2, '#b8ad9d');                        // front paw
    f.disc(26, y - 11, 5, 5, '#ece6dc');                     // head
    if (sleep) { f.px(18, y - 15, 8, 2, '#ece6dc'); f.px(19, y - 14, 6, 1, '#ffb3c1'); } // ears laid back
    else {
      const flop = pose === 'happy' || f.happy ? 1 : 0;
      f.px(23, y - 22 + flop, 3, 8, '#ece6dc'); f.px(24, y - 21 + flop, 1, 6, '#ffb3c1');
      f.px(27, y - 21, 3, 7, '#ece6dc'); f.px(28, y - 20, 1, 5, '#ffb3c1');
    }
    const ex = 28 + f.look;
    if (f.ko) f.px(ex, y - 13, 2, 2, f.outline);
    else if (f.blink || sleep) f.px(ex, y - 12, 2, 1, f.outline);
    else f.px(ex, y - 13, 2, 2, f.outline);
    f.px(31, y - 10, 1, 1, '#ff8fa3');                       // nose
  }
});
