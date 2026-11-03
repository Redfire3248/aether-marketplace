# Art Studio and pixel art

## Art Studio

Click **Art** in the dock. A new artwork starts as **Pixel Art** (crisp pixels, one at a time, for sprites and tiles) or **Paint** (soft brushes with pen pressure, for smooth art).

- **Layers**, with their own visibility and order.
- **Brushes** that steady your line, so it comes out smooth even with a mouse.
- The numbers in the tool bar change with the **mouse wheel**, or by dragging their name.
- **Cut tools** (**K**): split a one-piece picture into parts on their own layers, ready to animate.
- A picture with a grey-and-white checker painted into it (from an image maker) gets a really see-through background when you bring it in.

### Bones and animation

- **Make a skeleton**: bones from round joints, coloured by side (left blue, right orange, middle gold, face pink).
- **Bind layers to bones**: each part moves with its bone. A layer named like a bone is bound to it. Tick **Bend with the bones** on a part to make it bend.
- **Item slots**: a layer that holds a sword, an axe or a hat on a bone, and can be swapped.
- **Look**: a crosshair the eyes follow, with the head turning a little with it.
- A **timeline** for animations. Drag its edge to make it bigger.

Your art and its animations go straight into [the game engine](games.md).

## Pixel Studio

Pixel art is made in Art Studio now, but Pixel Studio is still there: **Create > Open Pixel Studio**, or **New Sprite** (**Ctrl+Alt+P**). Settings > Tabs & dock can put its button back on the dock.

- Several animations in one sprite (Idle, Walk, Jump...), layer groups and onion skin.
- Export as GIF or a sprite sheet. Sprites save as `.apx` files that games load straight away, and reload while the game runs.
- AI repaint, and its own shortcuts (see **Keyboard Shortcuts**, Pixel Studio).

## Picture tools

Open a picture and its toolbar opens it in Art Studio or Pixel Studio. **More** has the rest:

- **Pixel Import** (**Create > Pixel Import**): turn a picture, a GIF or a sheet into pixel art. **Turn Clipboard Image into Pixel Art** does it from a copied picture.
- **Sprite Sheet Slicer** (**Create > Import a Sprite Sheet**): split a sheet into frames.
- **Remove Image Background**: takes out a plain background at once, or uses AI (rembg) for anything else.
- **Floating references**: pin a picture over everything while you draw (**Create > Pin Image as Floating Reference**, or paste one).
- **AI Image Studio**: make pictures with AI on your own graphics card. See [AI](ai.md#pictures).
