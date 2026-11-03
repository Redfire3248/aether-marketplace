# The game engine

Aether has its own game engine, built in, with nothing to install. Make 2D and 3D games, play them right away, and export them for Windows, Android and the web.

## Start a game

Click **Engine** in the dock, or **Create > Game Engine: Choose a Game**. Pick one of your games or make a new one from a template (2D and 3D). **Ore Rush**, a mining game made with the engine, shows what it can do.

A game is a folder: a `.aether` project file, `scenes/` (the levels), `scripts/`, `assets/` (pictures and sounds) and `prefabs/` (things you place many times).

## The editor

- **The top bar**: **Play** and **Stop**, testing as a PC or a phone, and the tabs **Home**, **Model**, **Script**, **Test**, **View** and **Game**, each with its own buttons.
- **Explorer** (left): every node in the scene, in a tree. Drag a node onto another to make it its child; children move with their parent.
- **Toolbox**: things to add: sprites, blocks, text, lights, sounds, particles, UI and 3D models.
- **Properties** (right): everything about the picked node.
- **Focus layout** puts Aether's own sidebar, AI and terminal away while you build.

In the scene, drag to move things, **F2** renames, and **Ctrl+Z** undoes (even while playing).

## Nodes

Sprites (pictures and animations), blocks and tilemaps you paint with tiles, boxes, text, particles, areas (invisible zones), sounds, groups, lights, cameras, 3D models, and screen UI: frames, labels, buttons, pictures and bars, laid out in lists and grids.

- **Billboard GUI**: UI that floats over a node and follows it, like a name tag or a health bar.
- **Surface GUI**: UI drawn on a node itself, like a sign or a screen.
- **Highlights** and **gradients** on anything.

## Behaviours: no code

Give a node a behaviour in Properties:

- **Move** (4 directions), **Platformer** (run and jump), **First person** and **Third person** (3D).
- **Solid**, **Collectible** (adds to the score), **Hazard**, **Goal** (win, or go to the next level), **Door** to another scene.
- **Enemy** (walks back and forth), **Chase** (comes after the player), **Health**.
- **Shooter** and **Projectile**, **Spawner**, **Trigger** (sends an event), **Moving platform**.
- **Camera** (follows), **Spin**, **Bob**, **Score**.

## Scripts

For anything else, add a script: in **JavaScript** or [Aether Script](aether-script.md). **Add a script** starts from a template: platformer and top-down players, enemy AI, a collectible, a door, a wave spawner, multiplayer chat and more.

```js
Aether.script('player', {
  vars: { speed: 200 },          // you can change these per node in Properties
  update(dt) {
    if (this.game.input.down('right')) this.x += this.speed * dt;
  },
  onCollide(other) {
    if (other.tag === 'coin') { this.game.score++; other.destroy(); }
  }
});
```

Scripts can spawn things, play sounds and music, move the camera, shake the screen, change the light, change scene (`game.go("scenes/cave.scene", "fade")`) and talk to each other with events. The **Output** shows what they log.

## Light, sound and look

- **Lighting**: darkness, lights that flicker, glowing things, and a day and night cycle.
- **Screen effects**: Retro CRT, Film grain, Vivid, Noir, Warm dusk, Chunky, Dreamy, or your own mix.
- **Sound**: music that fades from one song to the next, and sounds that get quieter and pan with distance. Make them in [Sound Studio](sound.md).
- **Particles** from [Particle Studio](particles.md).
- **UI** designed in [GUI Studio](gui.md).

## Cutscenes

**Explorer > Cutscenes**: steps that play in order: move and zoom the camera, move a node, someone says something (in a speech box, typed out), title cards, fades, shakes, sounds, music and events. While playing, **Esc** skips a cutscene and opens the pause screen.

## 3D

- Import **.glb, .gltf, .fbx and .obj** models (Toolbox > 3D models > Import model). Their textures and animations come too.
- In the 3D view: drag to move, **Ctrl**-drag to turn, **Shift**-drag to raise, **Alt**-drag to resize, **[** and **]** to turn in steps.
- **Third person**: walk, run and jump with the model's own animations.
- **Animate**: make animation clips by posing a model's bones on a timeline.

## Multiplayer

**Host a game** shares it with phones and PCs on your Wi-Fi, and passes players' moves between them. Other players show with name tags. Scripts in `scripts/server/` run once for everyone, scripts in `scripts/client/` on each player's screen.

## Share your game

- **Export**: a web game that plays in any browser, a Windows game (.exe) that runs without Aether, or an Android app (.apk). 3D models go with it.
- **Save This Game as One File (.aethergame)**: the whole game in one file to send to someone. Opening it unpacks it and opens it in Aether.

## Other engines

Aether also makes games with Python and C++ (using raylib). Those game types load your `.apx` sprites from [Pixel Studio](art.md#pixel-studio) and reload them while the game runs.
