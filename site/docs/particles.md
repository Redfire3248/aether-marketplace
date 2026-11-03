# Particle Studio

Particle Studio makes effects: fire, smoke, magic, sparks, rain and snow. Open it with the command **Open Particle Studio**, or from the game engine.

## Making an effect

- **Emitter**: the shape the particles come from, a steady flow or a burst.
- **Motion**: life, speed, gravity, drag, wind, turbulence and spin.
- **Look**: size and colour over the particle's life, fade curves, glowing blend, and spark, star or picture particles.
- A **live preview** shows every change at once. **Ctrl+Z** undoes.

Start from one of the presets: Embers, Fireflies, Fire, Smoke, Explosion, Sparkles, Rain, Snow, Magic, Dust, Confetti, Blood, Bubbles and Trail.

## In a game

Effects save as `.particles` files. Add a **Particles** node in the scene editor to place one (it plays live in the editor), or start one from a script:

```js
this.burst('Fire');          // at this node
this.game.burst('Sparkles', x, y);
```
